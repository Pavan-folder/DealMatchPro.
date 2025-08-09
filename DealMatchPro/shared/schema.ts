import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  uuid,
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

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  userType: varchar("user_type", { enum: ["seller", "buyer"] }),
  onboardingCompleted: boolean("onboarding_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Business profiles for sellers
export const businesses = pgTable("businesses", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  ownerId: varchar("owner_id").references(() => users.id).notNull(),
  name: varchar("name").notNull(),
  industry: varchar("industry").notNull(),
  description: text("description"),
  annualRevenue: varchar("annual_revenue"),
  yearsInBusiness: integer("years_in_business"),
  location: varchar("location"),
  sellingReason: varchar("selling_reason"),
  timeline: varchar("timeline"),
  askingPrice: decimal("asking_price", { precision: 12, scale: 2 }),
  employees: integer("employees"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Buyer profiles
export const buyerProfiles = pgTable("buyer_profiles", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  budgetRange: varchar("budget_range").notNull(),
  preferredIndustries: text("preferred_industries").array(),
  experience: varchar("experience"),
  investmentFocus: text("investment_focus"),
  timeline: varchar("timeline"),
  location: varchar("location"),
  acquisitionStructure: text("acquisition_structure").array(),
  hasFinancing: boolean("has_financing").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Matches between buyers and sellers
export const matches = pgTable("matches", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  businessId: uuid("business_id").references(() => businesses.id).notNull(),
  buyerId: uuid("buyer_id").references(() => buyerProfiles.id).notNull(),
  sellerId: varchar("seller_id").references(() => users.id).notNull(),
  status: varchar("status", { enum: ["pending", "accepted", "rejected", "expired"] }).default("pending"),
  aiCompatibilityScore: decimal("ai_compatibility_score", { precision: 5, scale: 2 }),
  sellerAction: varchar("seller_action", { enum: ["accept", "reject", "pending"] }).default("pending"),
  buyerAction: varchar("buyer_action", { enum: ["accept", "reject", "pending"] }).default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Deal progression tracking
export const deals = pgTable("deals", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  matchId: uuid("match_id").references(() => matches.id).notNull(),
  currentStage: varchar("current_stage", { 
    enum: ["initial_discussion", "nda_signed", "financial_review", "due_diligence", "negotiation", "closing", "completed", "cancelled"] 
  }).default("initial_discussion"),
  stageProgress: integer("stage_progress").default(0), // 0-100
  estimatedValue: decimal("estimated_value", { precision: 12, scale: 2 }),
  notes: text("notes"),
  nextMilestone: text("next_milestone"),
  milestoneDueDate: timestamp("milestone_due_date"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Document storage and AI analysis
export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  dealId: uuid("deal_id").references(() => deals.id),
  businessId: uuid("business_id").references(() => businesses.id),
  uploaderId: varchar("uploader_id").references(() => users.id).notNull(),
  fileName: varchar("file_name").notNull(),
  fileType: varchar("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  filePath: varchar("file_path").notNull(),
  documentType: varchar("document_type", { 
    enum: ["financial_statement", "tax_return", "legal_document", "operational_doc", "other"] 
  }).notNull(),
  aiAnalysisStatus: varchar("ai_analysis_status", { 
    enum: ["pending", "processing", "completed", "failed"] 
  }).default("pending"),
  aiAnalysisResults: jsonb("ai_analysis_results"),
  riskFlags: text("risk_flags").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Messages between matched parties
export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  dealId: uuid("deal_id").references(() => deals.id),
  senderId: varchar("sender_id").references(() => users.id).notNull(),
  receiverId: varchar("receiver_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  messageType: varchar("message_type", { enum: ["text", "document", "system"] }).default("text"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// AI insights and recommendations
export const aiInsights = pgTable("ai_insights", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  entityType: varchar("entity_type", { enum: ["business", "buyer", "match", "deal"] }).notNull(),
  entityId: uuid("entity_id").notNull(),
  insightType: varchar("insight_type", { 
    enum: ["valuation", "risk_assessment", "market_analysis", "recommendation", "compatibility"] 
  }).notNull(),
  insights: jsonb("insights").notNull(),
  confidence: decimal("confidence", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  business: one(businesses, {
    fields: [users.id],
    references: [businesses.ownerId],
  }),
  buyerProfile: one(buyerProfiles, {
    fields: [users.id],
    references: [buyerProfiles.userId],
  }),
  sentMessages: many(messages, { relationName: "sender" }),
  receivedMessages: many(messages, { relationName: "receiver" }),
  uploadedDocuments: many(documents),
}));

export const businessesRelations = relations(businesses, ({ one, many }) => ({
  owner: one(users, {
    fields: [businesses.ownerId],
    references: [users.id],
  }),
  matches: many(matches),
  documents: many(documents),
}));

export const buyerProfilesRelations = relations(buyerProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [buyerProfiles.userId],
    references: [users.id],
  }),
  matches: many(matches),
}));

export const matchesRelations = relations(matches, ({ one, many }) => ({
  business: one(businesses, {
    fields: [matches.businessId],
    references: [businesses.id],
  }),
  buyer: one(buyerProfiles, {
    fields: [matches.buyerId],
    references: [buyerProfiles.id],
  }),
  seller: one(users, {
    fields: [matches.sellerId],
    references: [users.id],
  }),
  deal: one(deals),
}));

export const dealsRelations = relations(deals, ({ one, many }) => ({
  match: one(matches, {
    fields: [deals.matchId],
    references: [matches.id],
  }),
  documents: many(documents),
  messages: many(messages),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  deal: one(deals, {
    fields: [documents.dealId],
    references: [deals.id],
  }),
  business: one(businesses, {
    fields: [documents.businessId],
    references: [businesses.id],
  }),
  uploader: one(users, {
    fields: [documents.uploaderId],
    references: [users.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  deal: one(deals, {
    fields: [messages.dealId],
    references: [deals.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "sender",
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: "receiver",
  }),
}));

// Insert schemas
export const upsertUserSchema = createInsertSchema(users);
export const insertBusinessSchema = createInsertSchema(businesses).omit({ id: true, createdAt: true, updatedAt: true });
export const insertBuyerProfileSchema = createInsertSchema(buyerProfiles).omit({ id: true, createdAt: true, updatedAt: true });
export const insertMatchSchema = createInsertSchema(matches).omit({ id: true, createdAt: true, updatedAt: true });
export const insertDealSchema = createInsertSchema(deals).omit({ id: true, createdAt: true, updatedAt: true });
export const insertDocumentSchema = createInsertSchema(documents).omit({ id: true, createdAt: true, updatedAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });
export const insertAiInsightSchema = createInsertSchema(aiInsights).omit({ id: true, createdAt: true });

// Types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertBusiness = z.infer<typeof insertBusinessSchema>;
export type Business = typeof businesses.$inferSelect;
export type InsertBuyerProfile = z.infer<typeof insertBuyerProfileSchema>;
export type BuyerProfile = typeof buyerProfiles.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type Match = typeof matches.$inferSelect;
export type InsertDeal = z.infer<typeof insertDealSchema>;
export type Deal = typeof deals.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertAiInsight = z.infer<typeof insertAiInsightSchema>;
export type AiInsight = typeof aiInsights.$inferSelect;
