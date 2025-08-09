import {
  users,
  businesses,
  buyerProfiles,
  matches,
  deals,
  documents,
  messages,
  aiInsights,
  type User,
  type UpsertUser,
  type InsertBusiness,
  type Business,
  type InsertBuyerProfile,
  type BuyerProfile,
  type InsertMatch,
  type Match,
  type InsertDeal,
  type Deal,
  type InsertDocument,
  type Document,
  type InsertMessage,
  type Message,
  type InsertAiInsight,
  type AiInsight,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql, inArray } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Business operations
  createBusiness(business: InsertBusiness): Promise<Business>;
  getBusinessByOwnerId(ownerId: string): Promise<Business | undefined>;
  updateBusiness(id: string, updates: Partial<InsertBusiness>): Promise<Business>;
  getBusinessesByIndustry(industry: string): Promise<Business[]>;

  // Buyer profile operations
  createBuyerProfile(profile: InsertBuyerProfile): Promise<BuyerProfile>;
  getBuyerProfileByUserId(userId: string): Promise<BuyerProfile | undefined>;
  updateBuyerProfile(id: string, updates: Partial<InsertBuyerProfile>): Promise<BuyerProfile>;
  getActiveBuyerProfiles(): Promise<BuyerProfile[]>;

  // Match operations
  createMatch(match: InsertMatch): Promise<Match>;
  getMatchesForSeller(sellerId: string): Promise<Match[]>;
  getMatchesForBuyer(buyerId: string): Promise<Match[]>;
  updateMatchStatus(id: string, status: string, action?: string): Promise<Match>;
  getMatchById(id: string): Promise<Match | undefined>;

  // Deal operations
  createDeal(deal: InsertDeal): Promise<Deal>;
  getDealsByUserId(userId: string): Promise<Deal[]>;
  updateDealStage(id: string, stage: string, progress?: number): Promise<Deal>;
  getDealById(id: string): Promise<Deal | undefined>;

  // Document operations
  createDocument(document: InsertDocument): Promise<Document>;
  getDocumentsByDealId(dealId: string): Promise<Document[]>;
  updateDocumentAnalysis(id: string, analysis: any, riskFlags?: string[]): Promise<Document>;

  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesByDealId(dealId: string): Promise<Message[]>;
  markMessagesAsRead(dealId: string, userId: string): Promise<void>;

  // AI Insights operations
  createAiInsight(insight: InsertAiInsight): Promise<AiInsight>;
  getAiInsightsByEntity(entityType: string, entityId: string): Promise<AiInsight[]>;
}

// In-memory storage for free tier
export class MemoryStorage implements IStorage {
  private users = new Map<string, User>();
  private businesses = new Map<string, Business>();
  private buyerProfiles = new Map<string, BuyerProfile>();
  private matches = new Map<string, Match>();
  private deals = new Map<string, Deal>();
  private documents = new Map<string, Document>();
  private messages = new Map<string, Message>();
  private aiInsights = new Map<string, AiInsight>();

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(user: UpsertUser): Promise<User> {
    const existingUser = this.users.get(user.id);
    const newUser: User = {
      ...existingUser,
      ...user,
      createdAt: existingUser?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, newUser);
    return newUser;
  }

  async createBusiness(business: InsertBusiness): Promise<Business> {
    const id = Math.random().toString(36).substring(2, 15);
    const newBusiness: Business = {
      ...business,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.businesses.set(id, newBusiness);
    return newBusiness;
  }

  async getBusinessByOwnerId(ownerId: string): Promise<Business | undefined> {
    for (const business of this.businesses.values()) {
      if (business.ownerId === ownerId) {
        return business;
      }
    }
    return undefined;
  }

  async updateBusiness(id: string, updates: Partial<InsertBusiness>): Promise<Business> {
    const existing = this.businesses.get(id);
    if (!existing) throw new Error("Business not found");
    
    const updated: Business = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.businesses.set(id, updated);
    return updated;
  }

  async getBusinessesByIndustry(industry: string): Promise<Business[]> {
    return Array.from(this.businesses.values()).filter(b => b.industry === industry);
  }

  async createBuyerProfile(profile: InsertBuyerProfile): Promise<BuyerProfile> {
    const id = Math.random().toString(36).substring(2, 15);
    const newProfile: BuyerProfile = {
      ...profile,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.buyerProfiles.set(id, newProfile);
    return newProfile;
  }

  async getBuyerProfileByUserId(userId: string): Promise<BuyerProfile | undefined> {
    for (const profile of this.buyerProfiles.values()) {
      if (profile.userId === userId) {
        return profile;
      }
    }
    return undefined;
  }

  async updateBuyerProfile(id: string, updates: Partial<InsertBuyerProfile>): Promise<BuyerProfile> {
    const existing = this.buyerProfiles.get(id);
    if (!existing) throw new Error("Buyer profile not found");
    
    const updated: BuyerProfile = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.buyerProfiles.set(id, updated);
    return updated;
  }

  async getActiveBuyerProfiles(): Promise<BuyerProfile[]> {
    return Array.from(this.buyerProfiles.values());
  }

  async createMatch(match: InsertMatch): Promise<Match> {
    const id = Math.random().toString(36).substring(2, 15);
    const newMatch: Match = {
      ...match,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.matches.set(id, newMatch);
    return newMatch;
  }

  async getMatchesForSeller(sellerId: string): Promise<Match[]> {
    return Array.from(this.matches.values()).filter(m => m.sellerId === sellerId);
  }

  async getMatchesForBuyer(buyerId: string): Promise<Match[]> {
    return Array.from(this.matches.values()).filter(m => m.buyerId === buyerId);
  }

  async updateMatchStatus(id: string, status: string, action?: string): Promise<Match> {
    const existing = this.matches.get(id);
    if (!existing) throw new Error("Match not found");
    
    const updated: Match = {
      ...existing,
      status,
      lastAction: action || existing.lastAction,
      updatedAt: new Date(),
    };
    this.matches.set(id, updated);
    return updated;
  }

  async getMatchById(id: string): Promise<Match | undefined> {
    return this.matches.get(id);
  }

  async createDeal(deal: InsertDeal): Promise<Deal> {
    const id = Math.random().toString(36).substring(2, 15);
    const newDeal: Deal = {
      ...deal,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.deals.set(id, newDeal);
    return newDeal;
  }

  async getDealsByUserId(userId: string): Promise<Deal[]> {
    return Array.from(this.deals.values()).filter(d => d.sellerId === userId || d.buyerId === userId);
  }

  async updateDealStage(id: string, stage: string, progress?: number): Promise<Deal> {
    const existing = this.deals.get(id);
    if (!existing) throw new Error("Deal not found");
    
    const updated: Deal = {
      ...existing,
      currentStage: stage,
      progressPercentage: progress || existing.progressPercentage,
      updatedAt: new Date(),
    };
    this.deals.set(id, updated);
    return updated;
  }

  async getDealById(id: string): Promise<Deal | undefined> {
    return this.deals.get(id);
  }

  async createDocument(document: InsertDocument): Promise<Document> {
    const id = Math.random().toString(36).substring(2, 15);
    const newDocument: Document = {
      ...document,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.documents.set(id, newDocument);
    return newDocument;
  }

  async getDocumentsByDealId(dealId: string): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(d => d.dealId === dealId);
  }

  async updateDocumentAnalysis(id: string, analysis: any, riskFlags?: string[]): Promise<Document> {
    const existing = this.documents.get(id);
    if (!existing) throw new Error("Document not found");
    
    const updated: Document = {
      ...existing,
      aiAnalysisResults: analysis,
      riskFlags: riskFlags || existing.riskFlags,
      aiAnalysisStatus: "completed",
      updatedAt: new Date(),
    };
    this.documents.set(id, updated);
    return updated;
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const id = Math.random().toString(36).substring(2, 15);
    const newMessage: Message = {
      ...message,
      id,
      createdAt: new Date(),
    };
    this.messages.set(id, newMessage);
    return newMessage;
  }

  async getMessagesByDealId(dealId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(m => m.dealId === dealId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async markMessagesAsRead(dealId: string, userId: string): Promise<void> {
    for (const [id, message] of this.messages.entries()) {
      if (message.dealId === dealId && message.receiverId === userId) {
        this.messages.set(id, { ...message, isRead: true });
      }
    }
  }

  async createAiInsight(insight: InsertAiInsight): Promise<AiInsight> {
    const id = Math.random().toString(36).substring(2, 15);
    const newInsight: AiInsight = {
      ...insight,
      id,
      createdAt: new Date(),
    };
    this.aiInsights.set(id, newInsight);
    return newInsight;
  }

  async getAiInsightsByEntity(entityType: string, entityId: string): Promise<AiInsight[]> {
    return Array.from(this.aiInsights.values())
      .filter(i => i.entityType === entityType && i.entityId === entityId);
  }
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
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

  // Business operations
  async createBusiness(business: InsertBusiness): Promise<Business> {
    const [newBusiness] = await db
      .insert(businesses)
      .values(business)
      .returning();
    return newBusiness;
  }

  async getBusinessByOwnerId(ownerId: string): Promise<Business | undefined> {
    const [business] = await db
      .select()
      .from(businesses)
      .where(eq(businesses.ownerId, ownerId));
    return business;
  }

  async updateBusiness(id: string, updates: Partial<InsertBusiness>): Promise<Business> {
    const [updatedBusiness] = await db
      .update(businesses)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(businesses.id, id))
      .returning();
    return updatedBusiness;
  }

  async getBusinessesByIndustry(industry: string): Promise<Business[]> {
    return await db
      .select()
      .from(businesses)
      .where(and(eq(businesses.industry, industry), eq(businesses.isActive, true)));
  }

  // Buyer profile operations
  async createBuyerProfile(profile: InsertBuyerProfile): Promise<BuyerProfile> {
    const [newProfile] = await db
      .insert(buyerProfiles)
      .values(profile)
      .returning();
    return newProfile;
  }

  async getBuyerProfileByUserId(userId: string): Promise<BuyerProfile | undefined> {
    const [profile] = await db
      .select()
      .from(buyerProfiles)
      .where(eq(buyerProfiles.userId, userId));
    return profile;
  }

  async updateBuyerProfile(id: string, updates: Partial<InsertBuyerProfile>): Promise<BuyerProfile> {
    const [updatedProfile] = await db
      .update(buyerProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(buyerProfiles.id, id))
      .returning();
    return updatedProfile;
  }

  async getActiveBuyerProfiles(): Promise<BuyerProfile[]> {
    return await db
      .select()
      .from(buyerProfiles)
      .where(eq(buyerProfiles.isActive, true))
      .orderBy(desc(buyerProfiles.createdAt));
  }

  // Match operations
  async createMatch(match: InsertMatch): Promise<Match> {
    const [newMatch] = await db
      .insert(matches)
      .values(match)
      .returning();
    return newMatch;
  }

  async getMatchesForSeller(sellerId: string): Promise<Match[]> {
    return await db
      .select()
      .from(matches)
      .where(eq(matches.sellerId, sellerId))
      .orderBy(desc(matches.createdAt));
  }

  async getMatchesForBuyer(buyerId: string): Promise<Match[]> {
    return await db
      .select()
      .from(matches)
      .where(eq(matches.buyerId, buyerId))
      .orderBy(desc(matches.createdAt));
  }

  async updateMatchStatus(id: string, status: string, action?: string): Promise<Match> {
    const updates: any = { status, updatedAt: new Date() };
    if (action === "seller") updates.sellerAction = status;
    if (action === "buyer") updates.buyerAction = status;
    
    const [updatedMatch] = await db
      .update(matches)
      .set(updates)
      .where(eq(matches.id, id))
      .returning();
    return updatedMatch;
  }

  async getMatchById(id: string): Promise<Match | undefined> {
    const [match] = await db
      .select()
      .from(matches)
      .where(eq(matches.id, id));
    return match;
  }

  // Deal operations
  async createDeal(deal: InsertDeal): Promise<Deal> {
    const [newDeal] = await db
      .insert(deals)
      .values(deal)
      .returning();
    return newDeal;
  }

  async getDealsByUserId(userId: string): Promise<Deal[]> {
    return await db
      .select({
        deal: deals,
        match: matches,
      })
      .from(deals)
      .innerJoin(matches, eq(deals.matchId, matches.id))
      .where(eq(matches.sellerId, userId))
      .orderBy(desc(deals.updatedAt));
  }

  async updateDealStage(id: string, stage: string, progress?: number): Promise<Deal> {
    const updates: any = { currentStage: stage, updatedAt: new Date() };
    if (progress !== undefined) updates.stageProgress = progress;

    const [updatedDeal] = await db
      .update(deals)
      .set(updates)
      .where(eq(deals.id, id))
      .returning();
    return updatedDeal;
  }

  async getDealById(id: string): Promise<Deal | undefined> {
    const [deal] = await db
      .select()
      .from(deals)
      .where(eq(deals.id, id));
    return deal;
  }

  // Document operations
  async createDocument(document: InsertDocument): Promise<Document> {
    const [newDocument] = await db
      .insert(documents)
      .values(document)
      .returning();
    return newDocument;
  }

  async getDocumentsByDealId(dealId: string): Promise<Document[]> {
    return await db
      .select()
      .from(documents)
      .where(eq(documents.dealId, dealId))
      .orderBy(desc(documents.createdAt));
  }

  async updateDocumentAnalysis(id: string, analysis: any, riskFlags?: string[]): Promise<Document> {
    const [updatedDocument] = await db
      .update(documents)
      .set({
        aiAnalysisResults: analysis,
        aiAnalysisStatus: "completed",
        riskFlags,
        updatedAt: new Date(),
      })
      .where(eq(documents.id, id))
      .returning();
    return updatedDocument;
  }

  // Message operations
  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values(message)
      .returning();
    return newMessage;
  }

  async getMessagesByDealId(dealId: string): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.dealId, dealId))
      .orderBy(messages.createdAt);
  }

  async markMessagesAsRead(dealId: string, userId: string): Promise<void> {
    await db
      .update(messages)
      .set({ isRead: true })
      .where(and(eq(messages.dealId, dealId), eq(messages.receiverId, userId)));
  }

  // AI Insights operations
  async createAiInsight(insight: InsertAiInsight): Promise<AiInsight> {
    const [newInsight] = await db
      .insert(aiInsights)
      .values(insight)
      .returning();
    return newInsight;
  }

  async getAiInsightsByEntity(entityType: string, entityId: string): Promise<AiInsight[]> {
    return await db
      .select()
      .from(aiInsights)
      .where(and(eq(aiInsights.entityType, entityType), eq(aiInsights.entityId, entityId)))
      .orderBy(desc(aiInsights.createdAt));
  }
}

// Import memory storage for free tier
export { storage } from "./memoryStorage";
