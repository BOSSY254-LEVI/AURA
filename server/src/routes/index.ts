 import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import crypto from "crypto";
import bcrypt from "bcrypt";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Try to import optional modules, but provide fallbacks
  let storage: any = null;
  let authMiddleware: any = null;
  let openai: any = null;
  let schema: any = null;

  try {
    // Dynamic imports for optional modules
    storage = await import("../utils/storage").then(m => m.storage).catch(() => null);
    authMiddleware = await import("../middleware/auth").catch(() => null);
    openai = await import("../config/openai").catch(() => null);
    schema = await import("../database/schema").catch(() => null);
  } catch (error) {
    console.warn("Some modules failed to load, providing fallback routes", error);
  }

  // Helper function for authentication
  const isAuthenticated = authMiddleware?.isAuthenticated || ((req: any, res: any, next: any) => {
    // Fallback auth - always pass in dev mode
    if (process.env.NODE_ENV === 'development') {
      req.user = { claims: { sub: 'dev-user-id' } };
      return next();
    }
    return res.status(401).json({ message: "Authentication required" });
  });

  const hashPassword = authMiddleware?.hashPassword || (async (password: string) => bcrypt.hash(password, 10));
  
  const generateToken = authMiddleware?.generateToken || (() => {
    return 'dev-token-' + Date.now();
  });

  // Setup auth if available
  if (authMiddleware?.setupAuth) {
    await authMiddleware.setupAuth(app);
  }

  // Basic test routes that don't require storage
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  });

  app.get('/api/test', (_req, res) => {
    res.json({
      message: 'Server is working!',
      timestamp: new Date().toISOString()
    });
  });

  // If storage is not available, provide minimal routes
  if (!storage) {
    console.log('Storage module not available, using minimal routes');
    
    app.post('/api/auth/register', async (req, res) => {
      res.status(501).json({ 
        message: "Registration not available in current setup",
        suggestion: "Install required dependencies and configure storage"
      });
    });

    app.post('/api/auth/login', async (_req, res) => {
      res.status(501).json({
        message: "Login not available in current setup",
        suggestion: "Install required dependencies and configure storage"
      });
    });

    app.get('/api/auth/user', isAuthenticated, async (_req, res) => {
      res.json({
        id: 'dev-user-id',
        email: 'dev@example.com',
        name: 'Development User',
        isDev: true
      });
    });

    // Return early since we don't have storage
    console.log('Routes registered (minimal mode)');
    return httpServer;
  }

  // Full routes with storage available
  console.log('Routes registered (full mode)');

  // Auth routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({ message: "Email, password, and name are required" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const passwordHash = await hashPassword(password);

      // Create user
      const user = await storage.createUser({
        email,
        passwordHash,
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' ') || '',
        preferredLanguage: 'en',
        safetyScore: 85,
      });

      // Generate token
      const token = generateToken({ 
        id: user.id, 
        email: user.email, 
        name: `${user.firstName} ${user.lastName}`.trim() 
      });

      // Return user without password hash
      const { passwordHash: _, ...userWithoutPassword } = user;
      
      res.json({ 
        user: userWithoutPassword, 
        token 
      });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user || !user.passwordHash) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = generateToken({ 
        id: user.id, 
        email: user.email, 
        name: `${user.firstName} ${user.lastName}`.trim() 
      });

      // Return user without password hash
      const { passwordHash: _, ...userWithoutPassword } = user;

      res.json({ 
        user: userWithoutPassword, 
        token 
      });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Failed to login" });
    }
  });

  app.get('/api/auth/user', isAuthenticated, async (_req, res) => {
    try {
      const userId = _req.user!.claims.sub;
      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Return user without password hash
      const { passwordHash, ...userWithoutPassword } = user;

      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Threat routes
  app.get("/api/threats", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.claims.sub;
      const threats = await storage.getThreats(userId);
      res.json(threats);
    } catch (error) {
      console.error("Error fetching threats:", error);
      res.status(500).json({ message: "Failed to fetch threats" });
    }
  });

  app.post("/api/threats/analyze", isAuthenticated, async (_req, res) => {
    try {
      const userId = _req.user!.claims.sub;
      const { message, source } = _req.body;

      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      const analyzeMessageForThreats = openai?.analyzeMessageForThreats ||
        (async (_msg: string) => ({
          isThreat: false,
          type: 'none',
          severity: 'low',
          analysis: 'No threat detection available in current setup',
          suggestions: ['Setup OpenAI integration for threat analysis']
        }));

      const analysis = await analyzeMessageForThreats(message);

      if (analysis.isThreat) {
        const threat = await storage.createThreat({
          userId,
          type: analysis.type,
          severity: analysis.severity,
          content: message,
          analysis: analysis.analysis,
          source: source || "manual",
          isResolved: false,
        });

        res.json({ ...analysis, threat });
      } else {
        res.json(analysis);
      }
    } catch (error) {
      console.error("Error analyzing message:", error);
      res.status(500).json({ message: "Failed to analyze message" });
    }
  });

  app.patch("/api/threats/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const threat = await storage.updateThreat(id, req.body);
      res.json(threat);
    } catch (error) {
      console.error("Error updating threat:", error);
      res.status(500).json({ message: "Failed to update threat" });
    }
  });

  // Evidence vault routes
  app.get("/api/evidence", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.claims.sub;
      const items = await storage.getEvidenceItems(userId);
      res.json(items);
    } catch (error) {
      console.error("Error fetching evidence:", error);
      res.status(500).json({ message: "Failed to fetch evidence" });
    }
  });

  app.post("/api/evidence", isAuthenticated, async (_req, res) => {
    try {
      const userId = _req.user!.claims.sub;

      // Use schema if available, otherwise validate manually
      let validatedData = _req.body;
      if (schema?.insertEvidenceItemSchema) {
        validatedData = schema.insertEvidenceItemSchema.parse({
          ..._req.body,
          userId,
        });
      }

      // Generate hash for integrity verification
      const hash = crypto.createHash('sha256').update(JSON.stringify(validatedData)).digest('hex');

      const item = await storage.createEvidenceItem({
        ...validatedData,
        hash,
        metadata: {
          ...((validatedData.metadata as object) || {}),
          timestamp: new Date().toISOString(),
        },
      });

      res.json(item);
    } catch (error) {
      console.error("Error creating evidence:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create evidence" });
    }
  });

  app.delete("/api/evidence/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteEvidenceItem(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting evidence:", error);
      res.status(500).json({ message: "Failed to delete evidence" });
    }
  });

  // Emergency contact routes
  app.get("/api/emergency-contacts", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.claims.sub;
      const contacts = await storage.getEmergencyContacts(userId);
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });

  app.post("/api/emergency-contacts", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.claims.sub;
      
      let validatedData = req.body;
      if (schema?.insertEmergencyContactSchema) {
        validatedData = schema.insertEmergencyContactSchema.parse({
          ...req.body,
          userId,
        });
      }
      
      const contact = await storage.createEmergencyContact(validatedData);
      res.json(contact);
    } catch (error) {
      console.error("Error creating contact:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create contact" });
    }
  });

  app.delete("/api/emergency-contacts/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteEmergencyContact(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting contact:", error);
      res.status(500).json({ message: "Failed to delete contact" });
    }
  });

  // Community reports routes
  app.get("/api/community/reports", isAuthenticated, async (req, res) => {
    try {
      const reports = await storage.getCommunityReports();
      res.json(reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  app.post("/api/community/reports", isAuthenticated, async (req, res) => {
    try {
      // Generate anonymous reporter hash
      const userId = req.user!.claims.sub;
      const reporterHash = crypto.createHash('sha256').update(userId + Date.now()).digest('hex').slice(0, 16);
      
      let validatedData = req.body;
      if (schema?.insertCommunityReportSchema) {
        validatedData = schema.insertCommunityReportSchema.parse({
          ...req.body,
          reporterHash,
          status: "pending",
        });
      } else {
        validatedData = {
          ...req.body,
          reporterHash,
          status: "pending",
        };
      }
      
      const report = await storage.createCommunityReport(validatedData);
      res.json(report);
    } catch (error) {
      console.error("Error creating report:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create report" });
    }
  });

  // Learning progress routes
  app.get("/api/learning/progress", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.claims.sub;
      const progress = await storage.getLearningProgress(userId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  app.post("/api/learning/complete", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.claims.sub;
      const { moduleId, lessonId } = req.body;
      
      if (!moduleId || !lessonId) {
        return res.status(400).json({ message: "moduleId and lessonId are required" });
      }
      
      const progress = await storage.upsertLearningProgress({
        userId,
        moduleId,
        lessonId,
        completed: true,
        completedAt: new Date(),
      });
      
      res.json(progress);
    } catch (error) {
      console.error("Error updating progress:", error);
      res.status(500).json({ message: "Failed to update progress" });
    }
  });

  // Safe Twin companion chat routes
  app.get("/api/companion/chat", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.claims.sub;
      const chat = await storage.getCompanionChat(userId);
      res.json(chat || { messages: [] });
    } catch (error) {
      console.error("Error fetching chat:", error);
      res.status(500).json({ message: "Failed to fetch chat" });
    }
  });

  app.post("/api/companion/chat", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.claims.sub;
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      // Get existing chat history
      const existingChat = await storage.getCompanionChat(userId);
      const messages = (existingChat?.messages as { role: string; content: string; timestamp: string }[]) || [];
      
      // Add user message
      const userMessage = {
        role: "user" as const,
        content: message,
        timestamp: new Date().toISOString(),
      };
      messages.push(userMessage);

      // Get AI response if available
      const getChatResponse = openai?.getChatResponse || 
        (async () => "I'm your Safe Twin companion. I'm here to help you with safety concerns. In the current setup, AI features are limited.");

      const aiResponse = await getChatResponse(
        messages.map(m => ({ role: m.role as "user" | "assistant", content: m.content }))
      );

      // Add AI response
      const assistantMessage = {
        role: "assistant" as const,
        content: aiResponse,
        timestamp: new Date().toISOString(),
      };
      messages.push(assistantMessage);

      // Save updated chat
      await storage.upsertCompanionChat({
        userId,
        messages,
      });

      res.json({ response: aiResponse, messages });
    } catch (error) {
      console.error("Error in chat:", error);
      res.status(500).json({ message: "Failed to process chat" });
    }
  });

  // Safety insights routes
  app.get("/api/insights", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.claims.sub;
      const insights = await storage.getSafetyInsights(userId);
      res.json(insights);
    } catch (error) {
      console.error("Error fetching insights:", error);
      res.status(500).json({ message: "Failed to fetch insights" });
    }
  });

  return httpServer;
}

