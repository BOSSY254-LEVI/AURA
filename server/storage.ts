import {
  users,
  threats,
  evidenceItems,
  emergencyContacts,
  communityReports,
  learningProgress,
  companionChats,
  safetyInsights,
  type User,
  type UpsertUser,
  type Threat,
  type InsertThreat,
  type EvidenceItem,
  type InsertEvidenceItem,
  type EmergencyContact,
  type InsertEmergencyContact,
  type CommunityReport,
  type InsertCommunityReport,
  type LearningProgress,
  type InsertLearningProgress,
  type CompanionChat,
  type InsertCompanionChat,
  type SafetyInsight,
  type InsertSafetyInsight,
} from "server/shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: UpsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Threat operations
  getThreats(userId: string): Promise<Threat[]>;
  createThreat(threat: InsertThreat): Promise<Threat>;
  updateThreat(id: string, data: Partial<Threat>): Promise<Threat | undefined>;
  
  // Evidence operations
  getEvidenceItems(userId: string): Promise<EvidenceItem[]>;
  createEvidenceItem(item: InsertEvidenceItem): Promise<EvidenceItem>;
  deleteEvidenceItem(id: string): Promise<void>;
  
  // Emergency contact operations
  getEmergencyContacts(userId: string): Promise<EmergencyContact[]>;
  createEmergencyContact(contact: InsertEmergencyContact): Promise<EmergencyContact>;
  deleteEmergencyContact(id: string): Promise<void>;
  
  // Community report operations
  getCommunityReports(): Promise<CommunityReport[]>;
  createCommunityReport(report: InsertCommunityReport): Promise<CommunityReport>;
  
  // Learning progress operations
  getLearningProgress(userId: string): Promise<LearningProgress[]>;
  upsertLearningProgress(progress: InsertLearningProgress): Promise<LearningProgress>;
  
  // Companion chat operations
  getCompanionChat(userId: string): Promise<CompanionChat | undefined>;
  upsertCompanionChat(chat: InsertCompanionChat): Promise<CompanionChat>;
  
  // Safety insights operations
  getSafetyInsights(userId: string): Promise<SafetyInsight[]>;
  createSafetyInsight(insight: InsertSafetyInsight): Promise<SafetyInsight>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Threat operations
  async getThreats(userId: string): Promise<Threat[]> {
    return db.select()
      .from(threats)
      .where(eq(threats.userId, userId))
      .orderBy(desc(threats.createdAt));
  }

  async createThreat(threat: InsertThreat): Promise<Threat> {
    const [newThreat] = await db.insert(threats).values(threat).returning();
    return newThreat;
  }

  async updateThreat(id: string, data: Partial<Threat>): Promise<Threat | undefined> {
    const [updated] = await db
      .update(threats)
      .set(data)
      .where(eq(threats.id, id))
      .returning();
    return updated;
  }

  // Evidence operations
  async getEvidenceItems(userId: string): Promise<EvidenceItem[]> {
    return db.select()
      .from(evidenceItems)
      .where(eq(evidenceItems.userId, userId))
      .orderBy(desc(evidenceItems.createdAt));
  }

  async createEvidenceItem(item: InsertEvidenceItem): Promise<EvidenceItem> {
    const [newItem] = await db.insert(evidenceItems).values(item).returning();
    return newItem;
  }

  async deleteEvidenceItem(id: string): Promise<void> {
    await db.delete(evidenceItems).where(eq(evidenceItems.id, id));
  }

  // Emergency contact operations
  async getEmergencyContacts(userId: string): Promise<EmergencyContact[]> {
    return db.select()
      .from(emergencyContacts)
      .where(eq(emergencyContacts.userId, userId))
      .orderBy(desc(emergencyContacts.isPrimary));
  }

  async createEmergencyContact(contact: InsertEmergencyContact): Promise<EmergencyContact> {
    const [newContact] = await db.insert(emergencyContacts).values(contact).returning();
    return newContact;
  }

  async deleteEmergencyContact(id: string): Promise<void> {
    await db.delete(emergencyContacts).where(eq(emergencyContacts.id, id));
  }

  // Community report operations
  async getCommunityReports(): Promise<CommunityReport[]> {
    return db.select()
      .from(communityReports)
      .orderBy(desc(communityReports.createdAt));
  }

  async createCommunityReport(report: InsertCommunityReport): Promise<CommunityReport> {
    const [newReport] = await db.insert(communityReports).values(report).returning();
    return newReport;
  }

  // Learning progress operations
  async getLearningProgress(userId: string): Promise<LearningProgress[]> {
    return db.select()
      .from(learningProgress)
      .where(eq(learningProgress.userId, userId));
  }

  async upsertLearningProgress(progress: InsertLearningProgress): Promise<LearningProgress> {
    const existing = await db.select()
      .from(learningProgress)
      .where(
        and(
          eq(learningProgress.userId, progress.userId),
          eq(learningProgress.moduleId, progress.moduleId),
          eq(learningProgress.lessonId, progress.lessonId)
        )
      );
    
    if (existing.length > 0) {
      const [updated] = await db
        .update(learningProgress)
        .set({ ...progress, completedAt: new Date() })
        .where(eq(learningProgress.id, existing[0].id))
        .returning();
      return updated;
    }
    
    const [newProgress] = await db.insert(learningProgress).values(progress).returning();
    return newProgress;
  }

  // Companion chat operations
  async getCompanionChat(userId: string): Promise<CompanionChat | undefined> {
    const [chat] = await db.select()
      .from(companionChats)
      .where(eq(companionChats.userId, userId))
      .orderBy(desc(companionChats.updatedAt))
      .limit(1);
    return chat;
  }

  async upsertCompanionChat(chat: InsertCompanionChat): Promise<CompanionChat> {
    const existing = await this.getCompanionChat(chat.userId);
    
    if (existing) {
      const [updated] = await db
        .update(companionChats)
        .set({ ...chat, updatedAt: new Date() })
        .where(eq(companionChats.id, existing.id))
        .returning();
      return updated;
    }
    
    const [newChat] = await db.insert(companionChats).values(chat).returning();
    return newChat;
  }

  // Safety insights operations
  async getSafetyInsights(userId: string): Promise<SafetyInsight[]> {
    return db.select()
      .from(safetyInsights)
      .where(eq(safetyInsights.userId, userId))
      .orderBy(desc(safetyInsights.date));
  }

  async createSafetyInsight(insight: InsertSafetyInsight): Promise<SafetyInsight> {
    const [newInsight] = await db.insert(safetyInsights).values(insight).returning();
    return newInsight;
  }
}

export const storage = new DatabaseStorage();
