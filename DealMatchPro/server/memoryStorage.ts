import {
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

// Simple in-memory storage for free tier
export class MemoryStorage implements IStorage {
  private users = new Map<string, User>();
  private businesses = new Map<string, Business>();
  private buyerProfiles = new Map<string, BuyerProfile>();
  private matches = new Map<string, Match>();
  private deals = new Map<string, Deal>();
  private documents = new Map<string, Document>();
  private messages = new Map<string, Message>();
  private aiInsights = new Map<string, AiInsight>();

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(user: UpsertUser): Promise<User> {
    const existingUser = this.users.get(user.id);
    const newUser: User = {
      id: user.id,
      email: user.email || null,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      profileImageUrl: user.profileImageUrl || null,
      userType: user.userType || null,
      onboardingCompleted: user.onboardingCompleted || false,
      createdAt: existingUser?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, newUser);
    return newUser;
  }

  async createBusiness(business: InsertBusiness): Promise<Business> {
    const id = this.generateId();
    const newBusiness: Business = {
      id,
      name: business.name,
      ownerId: business.ownerId,
      industry: business.industry,
      description: business.description || null,
      annualRevenue: business.annualRevenue || null,
      yearsInBusiness: business.yearsInBusiness || null,
      employees: business.employees || null,
      location: business.location || null,
      sellingReason: business.sellingReason || null,
      timeline: business.timeline || null,
      askingPrice: business.askingPrice || null,
      isActive: business.isActive || true,
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
    return [...this.businesses.values()].filter(b => b.industry === industry);
  }

  async createBuyerProfile(profile: InsertBuyerProfile): Promise<BuyerProfile> {
    const id = this.generateId();
    const newProfile: BuyerProfile = {
      id,
      userId: profile.userId,
      budgetRange: profile.budgetRange,
      location: profile.location || null,
      timeline: profile.timeline || null,
      isActive: profile.isActive || true,
      preferredIndustries: profile.preferredIndustries || null,
      experience: profile.experience || null,
      investmentFocus: profile.investmentFocus || null,
      acquisitionStructure: profile.acquisitionStructure || null,
      hasFinancing: profile.hasFinancing || null,
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
    return [...this.buyerProfiles.values()].filter(p => p.isActive);
  }

  async createMatch(match: InsertMatch): Promise<Match> {
    const id = this.generateId();
    const newMatch: Match = {
      id,
      businessId: match.businessId,
      buyerId: match.buyerId,
      sellerId: match.sellerId,
      status: match.status || "pending",
      aiCompatibilityScore: match.aiCompatibilityScore || null,
      sellerAction: match.sellerAction || "pending",
      buyerAction: match.buyerAction || "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.matches.set(id, newMatch);
    return newMatch;
  }

  async getMatchesForSeller(sellerId: string): Promise<Match[]> {
    return [...this.matches.values()].filter(m => m.sellerId === sellerId);
  }

  async getMatchesForBuyer(buyerId: string): Promise<Match[]> {
    return [...this.matches.values()].filter(m => m.buyerId === buyerId);
  }

  async updateMatchStatus(id: string, status: string, action?: string): Promise<Match> {
    const existing = this.matches.get(id);
    if (!existing) throw new Error("Match not found");
    
    const updated: Match = {
      ...existing,
      status: status as any,
      updatedAt: new Date(),
    };
    this.matches.set(id, updated);
    return updated;
  }

  async getMatchById(id: string): Promise<Match | undefined> {
    return this.matches.get(id);
  }

  async createDeal(deal: InsertDeal): Promise<Deal> {
    const id = this.generateId();
    const newDeal: Deal = {
      id,
      matchId: deal.matchId,
      isActive: deal.isActive || true,
      currentStage: deal.currentStage || "initial_discussion",
      stageProgress: deal.stageProgress || 0,
      estimatedValue: deal.estimatedValue || null,
      nextMilestone: deal.nextMilestone || null,
      milestoneDueDate: deal.milestoneDueDate || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.deals.set(id, newDeal);
    return newDeal;
  }

  async getDealsByUserId(userId: string): Promise<Deal[]> {
    // For memory storage, we need to join with matches to find deals for a user
    const userMatches = [...this.matches.values()].filter(m => 
      m.sellerId === userId || m.buyerId === userId
    );
    const matchIds = userMatches.map(m => m.id);
    return [...this.deals.values()].filter(d => matchIds.includes(d.matchId));
  }

  async updateDealStage(id: string, stage: string, progress?: number): Promise<Deal> {
    const existing = this.deals.get(id);
    if (!existing) throw new Error("Deal not found");
    
    const updated: Deal = {
      ...existing,
      currentStage: stage as any,
      stageProgress: progress || existing.stageProgress,
      updatedAt: new Date(),
    };
    this.deals.set(id, updated);
    return updated;
  }

  async getDealById(id: string): Promise<Deal | undefined> {
    return this.deals.get(id);
  }

  async createDocument(document: InsertDocument): Promise<Document> {
    const id = this.generateId();
    const newDocument: Document = {
      id,
      businessId: document.businessId || null,
      dealId: document.dealId || null,
      uploaderId: document.uploaderId,
      fileName: document.fileName,
      fileType: document.fileType,
      fileSize: document.fileSize,
      filePath: document.filePath,
      documentType: document.documentType,
      aiAnalysisStatus: document.aiAnalysisStatus || "pending",
      aiAnalysisResults: document.aiAnalysisResults || null,
      riskFlags: document.riskFlags || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.documents.set(id, newDocument);
    return newDocument;
  }

  async getDocumentsByDealId(dealId: string): Promise<Document[]> {
    return [...this.documents.values()].filter(d => d.dealId === dealId);
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
    const id = this.generateId();
    const newMessage: Message = {
      id,
      dealId: message.dealId || null,
      senderId: message.senderId,
      receiverId: message.receiverId,
      content: message.content,
      messageType: message.messageType || "text",
      isRead: message.isRead || false,
      createdAt: new Date(),
    };
    this.messages.set(id, newMessage);
    return newMessage;
  }

  async getMessagesByDealId(dealId: string): Promise<Message[]> {
    return [...this.messages.values()]
      .filter(m => m.dealId === dealId)
      .sort((a, b) => (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0));
  }

  async markMessagesAsRead(dealId: string, userId: string): Promise<void> {
    for (const [id, message] of [...this.messages.entries()]) {
      if (message.dealId === dealId && message.receiverId === userId) {
        this.messages.set(id, { ...message, isRead: true });
      }
    }
  }

  async createAiInsight(insight: InsertAiInsight): Promise<AiInsight> {
    const id = this.generateId();
    const newInsight: AiInsight = {
      id,
      entityType: insight.entityType,
      entityId: insight.entityId,
      insightType: insight.insightType,
      insights: insight.insights,
      confidence: insight.confidence || null,
      createdAt: new Date(),
    };
    this.aiInsights.set(id, newInsight);
    return newInsight;
  }

  async getAiInsightsByEntity(entityType: string, entityId: string): Promise<AiInsight[]> {
    return [...this.aiInsights.values()]
      .filter(i => i.entityType === entityType && i.entityId === entityId);
  }
}

export const storage = new MemoryStorage();