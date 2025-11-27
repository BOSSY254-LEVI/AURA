import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { analyzeMessageForThreats, getChatResponse } from "./openai";
import { 
  insertThreatSchema, 
  insertEvidenceItemSchema, 
  insertEmergencyContactSchema,
  insertCommunityReportSchema,
  insertLearningProgressSchema,
} from "@shared/schema";
import { z } from "zod";
import crypto from "crypto";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Threat routes
  app.get("/api/threats", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const threats = await storage.getThreats(userId);
      res.json(threats);
    } catch (error) {
      console.error("Error fetching threats:", error);
      res.status(500).json({ message: "Failed to fetch threats" });
    }
  });

  app.post("/api/threats/analyze", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { message, source } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

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

  app.patch("/api/threats/:id", isAuthenticated, async (req: any, res) => {
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
  app.get("/api/evidence", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const items = await storage.getEvidenceItems(userId);
      res.json(items);
    } catch (error) {
      console.error("Error fetching evidence:", error);
      res.status(500).json({ message: "Failed to fetch evidence" });
    }
  });

  app.post("/api/evidence", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertEvidenceItemSchema.parse({
        ...req.body,
        userId,
      });
      
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

  app.delete("/api/evidence/:id", isAuthenticated, async (req: any, res) => {
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
  app.get("/api/emergency-contacts", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const contacts = await storage.getEmergencyContacts(userId);
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });

  app.post("/api/emergency-contacts", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertEmergencyContactSchema.parse({
        ...req.body,
        userId,
      });
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

  app.delete("/api/emergency-contacts/:id", isAuthenticated, async (req: any, res) => {
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
  app.get("/api/community/reports", isAuthenticated, async (req: any, res) => {
    try {
      const reports = await storage.getCommunityReports();
      res.json(reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  app.post("/api/community/reports", isAuthenticated, async (req: any, res) => {
    try {
      // Generate anonymous reporter hash
      const userId = req.user.claims.sub;
      const reporterHash = crypto.createHash('sha256').update(userId + Date.now()).digest('hex').slice(0, 16);
      
      const validatedData = insertCommunityReportSchema.parse({
        ...req.body,
        reporterHash,
        status: "pending",
      });
      
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
  app.get("/api/learning/progress", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progress = await storage.getLearningProgress(userId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  app.post("/api/learning/complete", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
  app.get("/api/companion/chat", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const chat = await storage.getCompanionChat(userId);
      res.json(chat || { messages: [] });
    } catch (error) {
      console.error("Error fetching chat:", error);
      res.status(500).json({ message: "Failed to fetch chat" });
    }
  });

  app.post("/api/companion/chat", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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

      // Get AI response
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
  app.get("/api/insights", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const insights = await storage.getSafetyInsights(userId);
      res.json(insights);
    } catch (error) {
      console.error("Error fetching insights:", error);
      res.status(500).json({ message: "Failed to fetch insights" });
    }
  });

  return httpServer;
}
