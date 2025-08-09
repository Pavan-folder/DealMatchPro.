import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  calculateBuyerSellerCompatibility, 
  analyzeFinancialDocuments, 
  generateDealRecommendations,
  generateNDATemplate
} from "./ai";
import multer from "multer";
import path from "path";
import fs from "fs/promises";

// File upload configuration
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
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

  // Onboarding routes
  app.post('/api/onboarding/complete', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { userType, businessData, buyerData } = req.body;

      // Update user type and onboarding status
      await storage.upsertUser({
        id: userId,
        userType,
        onboardingCompleted: true,
      });

      if (userType === 'seller' && businessData) {
        await storage.createBusiness({
          ownerId: userId,
          ...businessData,
        });
      }

      if (userType === 'buyer' && buyerData) {
        await storage.createBuyerProfile({
          userId,
          ...buyerData,
        });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Onboarding error:", error);
      res.status(500).json({ message: "Failed to complete onboarding" });
    }
  });

  // Business profile routes
  app.get('/api/business/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const business = await storage.getBusinessByOwnerId(userId);
      res.json(business);
    } catch (error) {
      console.error("Error fetching business:", error);
      res.status(500).json({ message: "Failed to fetch business profile" });
    }
  });

  app.put('/api/business/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const business = await storage.getBusinessByOwnerId(userId);
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }

      const updatedBusiness = await storage.updateBusiness(business.id, req.body);
      res.json(updatedBusiness);
    } catch (error) {
      console.error("Error updating business:", error);
      res.status(500).json({ message: "Failed to update business profile" });
    }
  });

  // Buyer profile routes
  app.get('/api/buyer/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.getBuyerProfileByUserId(userId);
      res.json(profile);
    } catch (error) {
      console.error("Error fetching buyer profile:", error);
      res.status(500).json({ message: "Failed to fetch buyer profile" });
    }
  });

  app.put('/api/buyer/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.getBuyerProfileByUserId(userId);
      if (!profile) {
        return res.status(404).json({ message: "Buyer profile not found" });
      }

      const updatedProfile = await storage.updateBuyerProfile(profile.id, req.body);
      res.json(updatedProfile);
    } catch (error) {
      console.error("Error updating buyer profile:", error);
      res.status(500).json({ message: "Failed to update buyer profile" });
    }
  });

  // Discovery routes
  app.get('/api/discover/buyers', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const business = await storage.getBusinessByOwnerId(userId);
      if (!business) {
        return res.status(404).json({ message: "Business profile required" });
      }

      const buyers = await storage.getActiveBuyerProfiles();
      
      // Calculate AI compatibility for each buyer
      const buyersWithCompatibility = await Promise.all(
        buyers.map(async (buyer) => {
          try {
            const compatibility = await calculateBuyerSellerCompatibility(business, buyer);
            return {
              ...buyer,
              compatibilityScore: compatibility.compatibilityScore,
              aiInsights: compatibility,
            };
          } catch (error) {
            return {
              ...buyer,
              compatibilityScore: 0,
              aiInsights: null,
            };
          }
        })
      );

      // Sort by compatibility score
      buyersWithCompatibility.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

      res.json(buyersWithCompatibility);
    } catch (error) {
      console.error("Error fetching buyers:", error);
      res.status(500).json({ message: "Failed to fetch buyers" });
    }
  });

  app.get('/api/discover/businesses', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const buyerProfile = await storage.getBuyerProfileByUserId(userId);
      if (!buyerProfile) {
        return res.status(404).json({ message: "Buyer profile required" });
      }

      // Get businesses matching buyer's preferred industries
      const allBusinesses: any[] = [];
      for (const industry of buyerProfile.preferredIndustries || []) {
        const businesses = await storage.getBusinessesByIndustry(industry);
        allBusinesses.push(...businesses);
      }

      // Remove duplicates and calculate compatibility
      const uniqueBusinesses = Array.from(new Set(allBusinesses.map(b => b.id)))
        .map(id => allBusinesses.find(b => b.id === id));

      const businessesWithCompatibility = await Promise.all(
        uniqueBusinesses.map(async (business) => {
          try {
            const compatibility = await calculateBuyerSellerCompatibility(business, buyerProfile);
            return {
              ...business,
              compatibilityScore: compatibility.compatibilityScore,
              aiInsights: compatibility,
            };
          } catch (error) {
            return {
              ...business,
              compatibilityScore: 0,
              aiInsights: null,
            };
          }
        })
      );

      businessesWithCompatibility.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

      res.json(businessesWithCompatibility);
    } catch (error) {
      console.error("Error fetching businesses:", error);
      res.status(500).json({ message: "Failed to fetch businesses" });
    }
  });

  // Matching routes
  app.post('/api/matches/create', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { businessId, buyerId, action } = req.body;

      // Determine if current user is seller or buyer
      const business = await storage.getBusinessByOwnerId(userId);
      const buyerProfile = await storage.getBuyerProfileByUserId(userId);

      let matchData: any = {
        businessId,
        buyerId,
        sellerId: business?.ownerId || '',
      };

      if (business) {
        // Seller is creating the match
        matchData.sellerAction = action;
        matchData.sellerId = userId;
      } else if (buyerProfile) {
        // Buyer is creating the match  
        matchData.buyerAction = action;
        matchData.sellerId = businessId; // This should be the seller's user ID
      }

      const match = await storage.createMatch(matchData);
      
      // If both parties have accepted, create a deal
      if (match.sellerAction === 'accept' && match.buyerAction === 'accept') {
        const deal = await storage.createDeal({
          matchId: match.id,
          currentStage: 'initial_discussion',
          stageProgress: 10,
        });
        
        res.json({ match, deal });
      } else {
        res.json({ match });
      }
    } catch (error) {
      console.error("Error creating match:", error);
      res.status(500).json({ message: "Failed to create match" });
    }
  });

  app.get('/api/matches', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      let matches = [];
      if (user?.userType === 'seller') {
        matches = await storage.getMatchesForSeller(userId);
      } else {
        const buyerProfile = await storage.getBuyerProfileByUserId(userId);
        if (buyerProfile) {
          matches = await storage.getMatchesForBuyer(buyerProfile.id);
        }
      }

      res.json(matches);
    } catch (error) {
      console.error("Error fetching matches:", error);
      res.status(500).json({ message: "Failed to fetch matches" });
    }
  });

  app.put('/api/matches/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { action } = req.body;
      const userId = req.user.claims.sub;

      // Determine if user is seller or buyer for this match
      const user = await storage.getUser(userId);
      const actionType = user?.userType === 'seller' ? 'seller' : 'buyer';

      const match = await storage.updateMatchStatus(id, action, actionType);
      
      // Create deal if both parties accepted
      if (match.sellerAction === 'accept' && match.buyerAction === 'accept') {
        const deal = await storage.createDeal({
          matchId: match.id,
          currentStage: 'initial_discussion',
          stageProgress: 10,
        });
        
        res.json({ match, deal });
      } else {
        res.json({ match });
      }
    } catch (error) {
      console.error("Error updating match:", error);
      res.status(500).json({ message: "Failed to update match" });
    }
  });

  // Deal routes
  app.get('/api/deals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const deals = await storage.getDealsByUserId(userId);
      res.json(deals);
    } catch (error) {
      console.error("Error fetching deals:", error);
      res.status(500).json({ message: "Failed to fetch deals" });
    }
  });

  app.get('/api/deals/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const deal = await storage.getDealById(id);
      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }
      res.json(deal);
    } catch (error) {
      console.error("Error fetching deal:", error);
      res.status(500).json({ message: "Failed to fetch deal" });
    }
  });

  app.put('/api/deals/:id/stage', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { stage, progress } = req.body;
      
      const deal = await storage.updateDealStage(id, stage, progress);
      res.json(deal);
    } catch (error) {
      console.error("Error updating deal stage:", error);
      res.status(500).json({ message: "Failed to update deal stage" });
    }
  });

  // AI-powered routes
  app.post('/api/ai/generate-nda', isAuthenticated, async (req: any, res) => {
    try {
      const { businessType, transactionStructure } = req.body;
      const nda = await generateNDATemplate(businessType, transactionStructure);
      res.json({ nda });
    } catch (error) {
      console.error("Error generating NDA:", error);
      res.status(500).json({ message: "Failed to generate NDA template" });
    }
  });

  app.get('/api/ai/deal-recommendations/:dealId', isAuthenticated, async (req: any, res) => {
    try {
      const { dealId } = req.params;
      const deal = await storage.getDealById(dealId);
      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }

      const recommendations = await generateDealRecommendations(dealId, deal.currentStage);
      res.json({ recommendations });
    } catch (error) {
      console.error("Error generating recommendations:", error);
      res.status(500).json({ message: "Failed to generate recommendations" });
    }
  });

  // Document upload and analysis
  app.post('/api/documents/upload', isAuthenticated, upload.single('document'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const userId = req.user.claims.sub;
      const { dealId, businessId, documentType } = req.body;

      // Read file content for AI analysis
      const fileContent = await fs.readFile(req.file.path, 'utf-8');
      
      // Create document record
      const document = await storage.createDocument({
        dealId: dealId || null,
        businessId: businessId || null,
        uploaderId: userId,
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        filePath: req.file.path,
        documentType,
        aiAnalysisStatus: 'processing',
      });

      // Perform AI analysis in background
      try {
        const business = businessId ? await storage.getBusinessByOwnerId(userId) : null;
        const analysis = await analyzeFinancialDocuments(
          fileContent, 
          documentType, 
          business || {}
        );

        await storage.updateDocumentAnalysis(
          document.id, 
          analysis, 
          analysis.riskFlags
        );

        // Store AI insights
        await storage.createAiInsight({
          entityType: 'business',
          entityId: businessId || document.id,
          insightType: 'risk_assessment',
          insights: analysis,
          confidence: analysis.valuation.confidence,
        });
      } catch (analysisError) {
        console.error("AI analysis failed:", analysisError);
        await storage.updateDocumentAnalysis(document.id, { error: "Analysis failed" });
      }

      res.json({ document, message: "Document uploaded successfully" });
    } catch (error) {
      console.error("Error uploading document:", error);
      res.status(500).json({ message: "Failed to upload document" });
    }
  });

  app.get('/api/documents/:dealId', isAuthenticated, async (req: any, res) => {
    try {
      const { dealId } = req.params;
      const documents = await storage.getDocumentsByDealId(dealId);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  // Messages
  app.get('/api/messages/:dealId', isAuthenticated, async (req: any, res) => {
    try {
      const { dealId } = req.params;
      const userId = req.user.claims.sub;
      
      const messages = await storage.getMessagesByDealId(dealId);
      
      // Mark messages as read
      await storage.markMessagesAsRead(dealId, userId);
      
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post('/api/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { dealId, receiverId, content, messageType = 'text' } = req.body;

      const message = await storage.createMessage({
        dealId,
        senderId: userId,
        receiverId,
        content,
        messageType,
      });

      res.json(message);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // WebSocket setup for real-time features
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    console.log('New WebSocket connection');

    ws.on('message', (data: string) => {
      try {
        const message = JSON.parse(data);
        
        // Broadcast to all connected clients (in production, you'd want to target specific users)
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
          }
        });
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });

  return httpServer;
}
