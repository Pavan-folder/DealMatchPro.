import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/navigation/header";
import Sidebar from "@/components/navigation/sidebar";
import DocumentAnalyzer from "@/components/ai/document-analyzer";
import GlassmorphismCard from "@/components/ui/glassmorphism-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AcquisitionWorkflowProps {
  deal: any;
  onBack: () => void;
}

export default function AcquisitionWorkflow({ deal, onBack }: AcquisitionWorkflowProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: dealRecommendations } = useQuery({
    queryKey: ["/api/ai/deal-recommendations", deal.id],
    enabled: !!deal.id,
  });

  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/messages", deal.id],
    enabled: !!deal.id,
  });

  const { data: documents, isLoading: documentsLoading } = useQuery({
    queryKey: ["/api/documents", deal.id],
    enabled: !!deal.id,
  });

  const updateStageMutation = useMutation({
    mutationFn: async ({ stage, progress }: { stage: string; progress?: number }) => {
      return await apiRequest("PUT", `/api/deals/${deal.id}/stage`, { stage, progress });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/deals"] });
      toast({
        title: "Stage Updated",
        description: "Deal progression has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "There was an error updating the deal stage.",
        variant: "destructive",
      });
    },
  });

  const generateNDAMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/ai/generate-nda", {
        businessType: "technology",
        transactionStructure: "asset_purchase",
      });
    },
    onSuccess: (data) => {
      toast({
        title: "NDA Generated",
        description: "AI-generated NDA template is ready for review.",
      });
    },
    onError: () => {
      toast({
        title: "Generation Failed",
        description: "Failed to generate NDA template.",
        variant: "destructive",
      });
    },
  });

  const dealStages = [
    { key: "initial_discussion", label: "Initial Discussion", progress: 20 },
    { key: "nda_signed", label: "NDA & Preliminary Info", progress: 40 },
    { key: "financial_review", label: "Financial Review", progress: 60 },
    { key: "due_diligence", label: "Due Diligence", progress: 80 },
    { key: "negotiation", label: "Final Negotiation", progress: 90 },
    { key: "closing", label: "Closing", progress: 100 },
  ];

  const getStageStatus = (stageKey: string) => {
    const currentIndex = dealStages.findIndex(s => s.key === deal.currentStage);
    const stageIndex = dealStages.findIndex(s => s.key === stageKey);
    
    if (stageIndex < currentIndex) return "completed";
    if (stageIndex === currentIndex) return "current";
    return "upcoming";
  };

  const getStageIcon = (status: string) => {
    switch (status) {
      case "completed": return "fas fa-check";
      case "current": return "fas fa-play";
      default: return "fas fa-circle";
    }
  };

  const getStageColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-success-500 text-white";
      case "current": return "bg-primary-500 text-white";
      default: return "bg-slate-300 text-slate-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      <Header />
      
      <div className="pt-16 flex">
        <Sidebar />
        
        <main className="flex-1 p-6 lg:p-8 lg:ml-64">
          <div className="max-w-6xl mx-auto">
            
            {/* Header with Deal Info */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  onClick={onBack}
                  className="p-2"
                  data-testid="button-back-to-deals"
                >
                  <i className="fas fa-arrow-left"></i>
                </Button>
                <div>
                  <h1 className="font-poppins text-3xl font-bold text-primary-900" data-testid="text-deal-title">
                    TechVenture Solutions Acquisition
                  </h1>
                  <p className="text-slate-600">Marcus Johnson • Deal ID: {deal.id?.slice(-8)}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-primary-900 mb-1" data-testid="text-deal-value">
                  ${deal.estimatedValue ? `${(Number(deal.estimatedValue) / 1000000).toFixed(1)}M` : "TBD"}
                </div>
                <Badge variant="outline" className="text-sm">
                  {deal.stageProgress}% Complete
                </Badge>
              </div>
            </div>

            {/* Match Success Banner */}
            <GlassmorphismCard className="p-6 mb-8 bg-gradient-to-r from-success-50 to-primary-50 border-success-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-success-500 to-success-600 rounded-full flex items-center justify-center">
                    <i className="fas fa-handshake text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-success-900">🎉 You've Got a Match!</h3>
                    <p className="text-success-700">Marcus Johnson is interested in your business. Let's guide you through the acquisition process.</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-success-300 text-success-700 hover:bg-success-50"
                    data-testid="button-start-chat"
                  >
                    <i className="fas fa-comment mr-2"></i>
                    Start Chat
                  </Button>
                  <Button 
                    size="sm"
                    className="bg-success-600 hover:bg-success-700"
                    data-testid="button-schedule-call"
                  >
                    <i className="fas fa-video mr-2"></i>
                    Schedule Call
                  </Button>
                </div>
              </div>
            </GlassmorphismCard>

            {/* AI Deal Assistant */}
            <GlassmorphismCard className="p-6 mb-8 bg-gradient-to-r from-primary-50 to-success-50 border-white/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-success-500 rounded-xl flex items-center justify-center">
                  <i className="fas fa-robot text-white"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-primary-900">AI Deal Assistant</h3>
                  <p className="text-sm text-slate-600">Your smart guide through the acquisition process</p>
                </div>
              </div>
              <div className="bg-white/60 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-lightbulb text-white text-sm"></i>
                  </div>
                  <div>
                    <p className="text-slate-700 mb-2"><strong>AI Recommendation:</strong> Based on the current stage, here are the recommended next steps:</p>
                    {dealRecommendations?.recommendations?.length > 0 ? (
                      <ul className="text-sm text-slate-600 space-y-1 ml-4">
                        {dealRecommendations.recommendations.map((rec: string, index: number) => (
                          <li key={index} data-testid={`text-recommendation-${index}`}>• {rec}</li>
                        ))}
                      </ul>
                    ) : (
                      <ul className="text-sm text-slate-600 space-y-1 ml-4">
                        <li>• Prepare your business overview and financial highlights</li>
                        <li>• Schedule an initial discovery call with the buyer</li>
                        <li>• Begin collecting due diligence materials</li>
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </GlassmorphismCard>

            {/* Main Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
                <TabsTrigger value="timeline" data-testid="tab-timeline">Timeline</TabsTrigger>
                <TabsTrigger value="documents" data-testid="tab-documents">Documents</TabsTrigger>
                <TabsTrigger value="messages" data-testid="tab-messages">Messages</TabsTrigger>
                <TabsTrigger value="analytics" data-testid="tab-analytics">Analytics</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <GlassmorphismCard className="p-6">
                  <h3 className="font-poppins text-xl font-semibold text-primary-900 mb-6">Deal Progress Overview</h3>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-medium text-primary-900 mb-4">Current Stage</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Stage</span>
                          <Badge variant="outline">{deal.currentStage?.replace('_', ' ') || 'Initial Discussion'}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Progress</span>
                          <span className="font-semibold text-primary-900">{deal.stageProgress || 20}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-primary-500 to-success-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${deal.stageProgress || 20}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-primary-900 mb-4">Key Metrics</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Estimated Value</span>
                          <span className="font-semibold text-primary-900">
                            ${deal.estimatedValue ? `${(Number(deal.estimatedValue) / 1000000).toFixed(1)}M` : "TBD"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Days Active</span>
                          <span className="font-semibold text-primary-900">
                            {Math.floor((new Date().getTime() - new Date(deal.createdAt).getTime()) / (1000 * 3600 * 24))}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Documents</span>
                          <span className="font-semibold text-primary-900">{documents?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassmorphismCard>

                <div className="grid md:grid-cols-2 gap-6">
                  <GlassmorphismCard className="p-6">
                    <h4 className="font-medium text-primary-900 mb-4">Quick Actions</h4>
                    <div className="space-y-3">
                      <Button 
                        className="w-full justify-start"
                        variant="outline"
                        onClick={() => generateNDAMutation.mutate()}
                        disabled={generateNDAMutation.isPending}
                        data-testid="button-generate-nda"
                      >
                        <i className="fas fa-file-contract mr-3"></i>
                        {generateNDAMutation.isPending ? "Generating..." : "Generate NDA Template"}
                      </Button>
                      <Button 
                        className="w-full justify-start"
                        variant="outline"
                        onClick={() => setActiveTab("documents")}
                        data-testid="button-upload-docs"
                      >
                        <i className="fas fa-upload mr-3"></i>
                        Upload Documents
                      </Button>
                      <Button 
                        className="w-full justify-start"
                        variant="outline"
                        data-testid="button-schedule-meeting"
                      >
                        <i className="fas fa-calendar mr-3"></i>
                        Schedule Meeting
                      </Button>
                    </div>
                  </GlassmorphismCard>

                  <GlassmorphismCard className="p-6">
                    <h4 className="font-medium text-primary-900 mb-4">Next Milestones</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-primary-50 rounded-lg">
                        <i className="fas fa-file-signature text-primary-600"></i>
                        <div>
                          <div className="font-medium text-primary-900">Sign NDA</div>
                          <div className="text-sm text-primary-700">Execute mutual non-disclosure agreement</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                        <i className="fas fa-chart-bar text-slate-600"></i>
                        <div>
                          <div className="font-medium text-slate-700">Financial Review</div>
                          <div className="text-sm text-slate-500">Share preliminary financial information</div>
                        </div>
                      </div>
                    </div>
                  </GlassmorphismCard>
                </div>
              </TabsContent>

              {/* Timeline Tab */}
              <TabsContent value="timeline" className="space-y-6">
                <GlassmorphismCard className="p-6">
                  <h3 className="font-poppins text-xl font-semibold text-primary-900 mb-6">Acquisition Process Timeline</h3>
                  
                  <div className="space-y-6">
                    {dealStages.map((stage) => {
                      const status = getStageStatus(stage.key);
                      return (
                        <div key={stage.key} className="flex items-start space-x-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getStageColor(status)}`}>
                            <i className={getStageIcon(status)}></i>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-primary-900">{stage.label}</h4>
                              <Badge variant={status === "completed" ? "default" : "outline"}>
                                {status === "completed" ? "Completed ✓" : 
                                 status === "current" ? "Current Step" : "Upcoming"}
                              </Badge>
                            </div>
                            <p className="text-slate-600 text-sm mb-3">
                              {stage.key === "initial_discussion" && "Exchange basic information, confirm mutual interest, and establish communication preferences."}
                              {stage.key === "nda_signed" && "Execute mutual NDA and share high-level business information to gauge fit."}
                              {stage.key === "financial_review" && "AI-powered financial analysis and preliminary valuation discussion."}
                              {stage.key === "due_diligence" && "Comprehensive business review with AI-powered document analysis and risk assessment."}
                              {stage.key === "negotiation" && "Purchase agreement negotiation and final terms discussion."}
                              {stage.key === "closing" && "Transaction closing with automated milestone tracking."}
                            </p>
                            
                            {status === "current" && (
                              <div className="bg-primary-50 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm text-primary-800 font-medium">Progress: {deal.stageProgress}%</span>
                                  <Button 
                                    size="sm"
                                    onClick={() => updateStageMutation.mutate({ 
                                      stage: dealStages[dealStages.findIndex(s => s.key === deal.currentStage) + 1]?.key || deal.currentStage,
                                      progress: stage.progress 
                                    })}
                                    disabled={updateStageMutation.isPending}
                                    data-testid={`button-advance-stage-${stage.key}`}
                                  >
                                    Advance Stage
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </GlassmorphismCard>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="space-y-6">
                <DocumentAnalyzer dealId={deal.id} />
              </TabsContent>

              {/* Messages Tab */}
              <TabsContent value="messages" className="space-y-6">
                <GlassmorphismCard className="p-6">
                  <h3 className="font-poppins text-xl font-semibold text-primary-900 mb-6">Communication Center</h3>
                  
                  {messagesLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="border border-slate-200 rounded-xl p-4">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                            <i className="fas fa-comment text-primary-600"></i>
                          </div>
                          <div>
                            <h4 className="font-medium text-primary-900">Secure Messaging</h4>
                            <p className="text-sm text-slate-600">Real-time chat with Marcus</p>
                          </div>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3 mb-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">Last message:</span>
                            <span className="text-slate-500">2 hours ago</span>
                          </div>
                          <p className="text-slate-700 mt-1">"Looking forward to reviewing your financials..."</p>
                        </div>
                        <Button 
                          className="w-full bg-primary-500 hover:bg-primary-600"
                          data-testid="button-open-chat"
                        >
                          <i className="fas fa-comment mr-2"></i>
                          Open Chat
                        </Button>
                      </div>

                      <div className="border border-slate-200 rounded-xl p-4">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-10 h-10 bg-success-100 rounded-xl flex items-center justify-center">
                            <i className="fas fa-video text-success-600"></i>
                          </div>
                          <div>
                            <h4 className="font-medium text-primary-900">Video Meetings</h4>
                            <p className="text-sm text-slate-600">Schedule and conduct calls</p>
                          </div>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3 mb-3">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-slate-600">Next meeting:</span>
                            <span className="text-slate-500">Tomorrow 2:00 PM</span>
                          </div>
                          <p className="text-slate-700">Initial Business Review Call</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            className="flex-1 bg-success-500 hover:bg-success-600"
                            data-testid="button-join-call"
                          >
                            <i className="fas fa-video mr-2"></i>
                            Join
                          </Button>
                          <Button 
                            variant="outline"
                            className="px-3"
                            data-testid="button-reschedule"
                          >
                            <i className="fas fa-calendar"></i>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </GlassmorphismCard>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <GlassmorphismCard className="p-6">
                  <h3 className="font-poppins text-xl font-semibold text-primary-900 mb-6">Deal Analytics</h3>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-primary-50 rounded-xl">
                      <div className="text-3xl font-bold text-primary-600 mb-2" data-testid="text-deal-score">94%</div>
                      <div className="text-sm text-primary-700">Deal Success Score</div>
                    </div>
                    <div className="text-center p-6 bg-success-50 rounded-xl">
                      <div className="text-3xl font-bold text-success-600 mb-2" data-testid="text-completion-time">28</div>
                      <div className="text-sm text-success-700">Days to Completion (Est.)</div>
                    </div>
                    <div className="text-center p-6 bg-gold-50 rounded-xl">
                      <div className="text-3xl font-bold text-gold-600 mb-2" data-testid="text-risk-level">Low</div>
                      <div className="text-sm text-gold-700">Risk Assessment</div>
                    </div>
                  </div>
                </GlassmorphismCard>
              </TabsContent>
            </Tabs>

          </div>
        </main>
      </div>
    </div>
  );
}
