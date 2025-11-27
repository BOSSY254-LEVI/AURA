import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  real,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  preferredLanguage: varchar("preferred_language").default("en"),
  safetyScore: integer("safety_score").default(85),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Threats detected by AI analysis
export const threats = pgTable("threats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type").notNull(), // harassment, hate_speech, threat, manipulation, grooming
  severity: varchar("severity").notNull(), // low, medium, high, critical
  content: text("content").notNull(),
  analysis: text("analysis"),
  source: varchar("source"), // chat, social_media, email, etc.
  isResolved: boolean("is_resolved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Evidence Vault items
export const evidenceItems = pgTable("evidence_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type").notNull(), // screenshot, chat_log, note, audio, image
  title: varchar("title").notNull(),
  description: text("description"),
  encryptedContent: text("encrypted_content"),
  metadata: jsonb("metadata"), // timestamps, location, etc.
  hash: varchar("hash"), // for integrity verification
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Emergency contacts
export const emergencyContacts = pgTable("emergency_contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  phone: varchar("phone"),
  email: varchar("email"),
  relationship: varchar("relationship"),
  isPrimary: boolean("is_primary").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Community reports (anonymous)
export const communityReports = pgTable("community_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reporterHash: varchar("reporter_hash"), // anonymous identifier
  platform: varchar("platform").notNull(), // twitter, facebook, instagram, etc.
  accountIdentifier: varchar("account_identifier"), // username or profile ID
  incidentType: varchar("incident_type").notNull(),
  description: text("description"),
  evidenceLinks: text("evidence_links").array(),
  region: varchar("region"),
  status: varchar("status").default("pending"), // pending, verified, dismissed
  createdAt: timestamp("created_at").defaultNow(),
});

// Learning progress
export const learningProgress = pgTable("learning_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  moduleId: varchar("module_id").notNull(),
  lessonId: varchar("lesson_id").notNull(),
  completed: boolean("completed").default(false),
  score: integer("score"),
  completedAt: timestamp("completed_at"),
});

// AI Companion conversations
export const companionChats = pgTable("companion_chats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  messages: jsonb("messages").notNull().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Safety insights/analytics
export const safetyInsights = pgTable("safety_insights", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull(),
  threatCount: integer("threat_count").default(0),
  resolvedCount: integer("resolved_count").default(0),
  categories: jsonb("categories").default({}),
  safetyScore: integer("safety_score"),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  threats: many(threats),
  evidenceItems: many(evidenceItems),
  emergencyContacts: many(emergencyContacts),
  learningProgress: many(learningProgress),
  companionChats: many(companionChats),
  safetyInsights: many(safetyInsights),
}));

export const threatsRelations = relations(threats, ({ one }) => ({
  user: one(users, {
    fields: [threats.userId],
    references: [users.id],
  }),
}));

export const evidenceItemsRelations = relations(evidenceItems, ({ one }) => ({
  user: one(users, {
    fields: [evidenceItems.userId],
    references: [users.id],
  }),
}));

export const emergencyContactsRelations = relations(emergencyContacts, ({ one }) => ({
  user: one(users, {
    fields: [emergencyContacts.userId],
    references: [users.id],
  }),
}));

export const learningProgressRelations = relations(learningProgress, ({ one }) => ({
  user: one(users, {
    fields: [learningProgress.userId],
    references: [users.id],
  }),
}));

export const companionChatsRelations = relations(companionChats, ({ one }) => ({
  user: one(users, {
    fields: [companionChats.userId],
    references: [users.id],
  }),
}));

export const safetyInsightsRelations = relations(safetyInsights, ({ one }) => ({
  user: one(users, {
    fields: [safetyInsights.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const insertThreatSchema = createInsertSchema(threats).omit({ id: true, createdAt: true });
export const insertEvidenceItemSchema = createInsertSchema(evidenceItems).omit({ id: true, createdAt: true, updatedAt: true });
export const insertEmergencyContactSchema = createInsertSchema(emergencyContacts).omit({ id: true, createdAt: true });
export const insertCommunityReportSchema = createInsertSchema(communityReports).omit({ id: true, createdAt: true });
export const insertLearningProgressSchema = createInsertSchema(learningProgress).omit({ id: true });
export const insertCompanionChatSchema = createInsertSchema(companionChats).omit({ id: true, createdAt: true, updatedAt: true });
export const insertSafetyInsightSchema = createInsertSchema(safetyInsights).omit({ id: true });

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Threat = typeof threats.$inferSelect;
export type InsertThreat = z.infer<typeof insertThreatSchema>;

export type EvidenceItem = typeof evidenceItems.$inferSelect;
export type InsertEvidenceItem = z.infer<typeof insertEvidenceItemSchema>;

export type EmergencyContact = typeof emergencyContacts.$inferSelect;
export type InsertEmergencyContact = z.infer<typeof insertEmergencyContactSchema>;

export type CommunityReport = typeof communityReports.$inferSelect;
export type InsertCommunityReport = z.infer<typeof insertCommunityReportSchema>;

export type LearningProgress = typeof learningProgress.$inferSelect;
export type InsertLearningProgress = z.infer<typeof insertLearningProgressSchema>;

export type CompanionChat = typeof companionChats.$inferSelect;
export type InsertCompanionChat = z.infer<typeof insertCompanionChatSchema>;

export type SafetyInsight = typeof safetyInsights.$inferSelect;
export type InsertSafetyInsight = z.infer<typeof insertSafetyInsightSchema>;
