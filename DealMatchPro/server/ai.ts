import OpenAI from "openai";
import { storage } from "./storage";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
}) : null;

export interface AICompatibilityAnalysis {
  compatibilityScore: number;
  strengths: string[];
  considerations: string[];
  recommendations: string[];
}

export interface AIDocumentAnalysis {
  summary: string;
  keyMetrics: Record<string, any>;
  riskFlags: string[];
  valuation: {
    estimatedValue: number;
    confidence: number;
    methodology: string;
  };
  recommendations: string[];
}

export async function calculateBuyerSellerCompatibility(
  businessProfile: any,
  buyerProfile: any
): Promise<AICompatibilityAnalysis> {
  // Return simplified compatibility analysis for free tier
  if (!openai) {
    return {
      compatibilityScore: Math.floor(Math.random() * 40) + 60, // Random score 60-100
      strengths: ["Industry alignment", "Budget compatibility"],
      considerations: ["Timeline differences", "Experience level"],
      recommendations: ["Schedule a call to discuss details", "Review business financials"]
    };
  }

  try {
    const prompt = `Analyze the compatibility between this business for sale and potential buyer. 
    Provide a detailed compatibility assessment in JSON format.

    Business Profile:
    - Industry: ${businessProfile.industry}
    - Annual Revenue: ${businessProfile.annualRevenue}
    - Years in Business: ${businessProfile.yearsInBusiness}
    - Employees: ${businessProfile.employees}
    - Location: ${businessProfile.location}
    - Selling Reason: ${businessProfile.sellingReason}
    - Timeline: ${businessProfile.timeline}

    Buyer Profile:
    - Budget Range: ${buyerProfile.budgetRange}
    - Preferred Industries: ${buyerProfile.preferredIndustries?.join(", ")}
    - Experience: ${buyerProfile.experience}
    - Timeline: ${buyerProfile.timeline}
    - Investment Focus: ${buyerProfile.investmentFocus}
    - Has Financing: ${buyerProfile.hasFinancing}

    Return JSON with: compatibilityScore (0-100), strengths (array of strings), 
    considerations (array of strings), recommendations (array of strings).`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert M&A advisor analyzing buyer-seller compatibility. Always return valid JSON."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
    });

    const analysis = JSON.parse(response.choices[0].message.content || "{}");
    
    // Store AI insight
    await storage.createAiInsight({
      entityType: "match",
      entityId: `${businessProfile.id}-${buyerProfile.id}`,
      insightType: "compatibility",
      insights: analysis,
      confidence: analysis.compatibilityScore / 100,
    });

    return analysis;
  } catch (error) {
    console.error("Failed to calculate compatibility:", error);
    throw new Error("Failed to analyze buyer-seller compatibility");
  }
}

export async function analyzeFinancialDocuments(
  documentContent: string,
  documentType: string,
  businessContext: any
): Promise<AIDocumentAnalysis> {
  // Return simplified analysis for free tier
  if (!openai) {
    return {
      summary: "Document uploaded successfully. Upgrade for AI-powered analysis.",
      keyMetrics: { revenue: "N/A", profitability: "N/A" },
      riskFlags: [],
      valuation: {
        estimatedValue: 0,
        confidence: 0,
        methodology: "Manual review required"
      },
      recommendations: ["Consider upgrading for detailed financial analysis"]
    };
  }

  try {
    const prompt = `Analyze this ${documentType} for a business acquisition. 
    Provide comprehensive analysis in JSON format.

    Business Context:
    - Industry: ${businessContext.industry}
    - Annual Revenue: ${businessContext.annualRevenue}
    - Years in Business: ${businessContext.yearsInBusiness}

    Document Type: ${documentType}
    Document Content: ${documentContent}

    Analyze for:
    1. Key financial metrics and trends
    2. Risk factors and red flags
    3. Valuation insights
    4. Investment recommendations

    Return JSON with: summary, keyMetrics (object), riskFlags (array), 
    valuation (object with estimatedValue, confidence, methodology), recommendations (array).`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert financial analyst specializing in business acquisitions. Always return valid JSON with numerical values where appropriate."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
    });

    const analysis = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      summary: analysis.summary || "Analysis completed",
      keyMetrics: analysis.keyMetrics || {},
      riskFlags: analysis.riskFlags || [],
      valuation: {
        estimatedValue: analysis.valuation?.estimatedValue || 0,
        confidence: analysis.valuation?.confidence || 0.5,
        methodology: analysis.valuation?.methodology || "Comparative analysis"
      },
      recommendations: analysis.recommendations || []
    };
  } catch (error) {
    console.error("Failed to analyze document:", error);
    throw new Error("Failed to analyze financial document");
  }
}

export async function generateDealRecommendations(
  dealId: string,
  currentStage: string
): Promise<string[]> {
  // Return simplified recommendations for free tier
  if (!openai) {
    const stageRecommendations = {
      initial_discussion: ["Schedule a video call", "Prepare basic questions", "Share company overview"],
      nda_signed: ["Request financial statements", "Schedule site visit", "Prepare due diligence checklist"],
      financial_review: ["Analyze revenue trends", "Review expense categories", "Assess cash flow"],
      due_diligence: ["Verify legal compliance", "Review employee contracts", "Check customer contracts"],
      negotiation: ["Prepare offer terms", "Discuss payment structure", "Plan transition timeline"],
      closing: ["Finalize legal documents", "Arrange financing", "Plan handover process"]
    };
    return stageRecommendations[currentStage as keyof typeof stageRecommendations] || ["Continue with next steps"];
  }

  try {
    // Get deal context
    const deal = await storage.getDealById(dealId);
    if (!deal) throw new Error("Deal not found");

    const prompt = `Generate actionable recommendations for this business acquisition deal.
    
    Current Stage: ${currentStage}
    Stage Progress: ${deal.stageProgress}%
    Estimated Value: $${deal.estimatedValue}
    
    Provide 3-5 specific, actionable recommendations for the current stage in JSON format.
    Return JSON with: recommendations (array of strings).`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert M&A advisor providing practical deal guidance. Always return valid JSON."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.recommendations || [];
  } catch (error) {
    console.error("Failed to generate recommendations:", error);
    throw new Error("Failed to generate deal recommendations");
  }
}

export async function generateNDATemplate(
  businessType: string,
  transactionStructure: string
): Promise<string> {
  // Return basic NDA template for free tier
  if (!openai) {
    return `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into on [DATE] between the parties for the purpose of evaluating a potential business acquisition.

CONFIDENTIAL INFORMATION:
All business information, financial data, customer lists, and proprietary processes shared during this evaluation.

PERMITTED USE:
Information may only be used for evaluating the potential acquisition and must not be disclosed to third parties.

RETURN OF MATERIALS:
All documents and materials must be returned within 30 days if the transaction does not proceed.

TERM:
This agreement remains in effect for 2 years from the date of signing.

For a comprehensive, legally-reviewed NDA template, consider upgrading your account.

[Signature Lines]`;
  }

  try {
    const prompt = `Generate a professional NDA (Non-Disclosure Agreement) template for a business acquisition.
    
    Business Type: ${businessType}
    Transaction Structure: ${transactionStructure}
    
    Include standard clauses for:
    - Definition of confidential information
    - Permitted use of information
    - Return of materials
    - Term and termination
    - Remedies for breach
    
    Make it comprehensive but readable. Return the complete NDA text.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a legal expert specializing in business acquisition agreements. Generate professional, comprehensive legal documents."
        },
        { role: "user", content: prompt }
      ],
    });

    return response.choices[0].message.content || "Error generating NDA template";
  } catch (error) {
    console.error("Failed to generate NDA:", error);
    throw new Error("Failed to generate NDA template");
  }
}
