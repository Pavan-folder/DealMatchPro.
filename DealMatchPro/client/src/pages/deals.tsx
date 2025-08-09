import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/navigation/header";
import Sidebar from "@/components/navigation/sidebar";
import AcquisitionWorkflow from "@/components/deals/acquisition-workflow";
import GlassmorphismCard from "@/components/ui/glassmorphism-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Deals() {
  const [selectedDeal, setSelectedDeal] = useState<any>(null);

  const { data: deals, isLoading } = useQuery({
    queryKey: ["/api/deals"],
  });

  const getStageColor = (stage: string) => {
    const stageColors: Record<string, string> = {
      "initial_discussion": "bg-blue-100 text-blue-800",
      "nda_signed": "bg-purple-100 text-purple-800",
      "financial_review": "bg-gold-100 text-gold-800",
      "due_diligence": "bg-orange-100 text-orange-800",
      "negotiation": "bg-red-100 text-red-800",
      "closing": "bg-green-100 text-green-800",
      "completed": "bg-success-100 text-success-800",
      "cancelled": "bg-slate-100 text-slate-800",
    };
    return stageColors[stage] || "bg-slate-100 text-slate-800";
  };

  const getStageLabel = (stage: string) => {
    const stageLabels: Record<string, string> = {
      "initial_discussion": "Initial Discussion",
      "nda_signed": "NDA Signed",
      "financial_review": "Financial Review",
      "due_diligence": "Due Diligence",
      "negotiation": "Negotiation",
      "closing": "Closing",
      "completed": "Completed",
      "cancelled": "Cancelled",
    };
    return stageLabels[stage] || stage;
  };

  if (selectedDeal) {
    return (
      <AcquisitionWorkflow 
        deal={selectedDeal} 
        onBack={() => setSelectedDeal(null)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      <Header />
      
      <div className="pt-16 flex">
        <Sidebar />
        
        <main className="flex-1 p-6 lg:p-8 lg:ml-64">
          <div className="max-w-6xl mx-auto">
            
            {/* Header */}
            <div className="mb-8">
              <h1 className="font-poppins text-3xl font-bold text-primary-900 mb-2" data-testid="text-deals-title">
                Active Deals
              </h1>
              <p className="text-slate-600">
                Track your acquisition deals through our intelligent workflow system
              </p>
            </div>

            {/* Deal Overview Cards */}
            {!isLoading && deals && deals.length > 0 && (
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <GlassmorphismCard className="p-6 bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <i className="fas fa-handshake text-2xl"></i>
                    <span className="text-sm opacity-90">Active</span>
                  </div>
                  <div className="text-3xl font-bold mb-2" data-testid="text-active-deals">
                    {deals.filter((d: any) => d.isActive).length}
                  </div>
                  <div className="text-sm opacity-90">Active Deals</div>
                </GlassmorphismCard>

                <GlassmorphismCard className="p-6 bg-gradient-to-br from-success-500 to-success-600 text-white shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <i className="fas fa-chart-line text-2xl"></i>
                    <span className="text-sm opacity-90">Progress</span>
                  </div>
                  <div className="text-3xl font-bold mb-2" data-testid="text-average-progress">
                    {deals.length > 0 
                      ? Math.round(deals.reduce((acc: number, deal: any) => acc + (deal.stageProgress || 0), 0) / deals.length)
                      : 0
                    }%
                  </div>
                  <div className="text-sm opacity-90">Average Progress</div>
                </GlassmorphismCard>

                <GlassmorphismCard className="p-6 bg-gradient-to-br from-gold-500 to-gold-600 text-white shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <i className="fas fa-dollar-sign text-2xl"></i>
                    <span className="text-sm opacity-90">Total Value</span>
                  </div>
                  <div className="text-3xl font-bold mb-2" data-testid="text-total-value">
                    $2.4M
                  </div>
                  <div className="text-sm opacity-90">Estimated Value</div>
                </GlassmorphismCard>
              </div>
            )}

            {/* Deal Cards */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {deals?.map((deal: any) => (
                  <GlassmorphismCard key={deal.id} className="p-6 shadow-xl hover:shadow-2xl transition-all">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={`https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&w=60&h=60&fit=crop`}
                          alt="Deal" 
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-primary-900" data-testid={`text-deal-name-${deal.id}`}>
                            TechVenture Solutions Acquisition
                          </h3>
                          <p className="text-slate-600">Marcus Johnson • San Francisco, CA</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getStageColor(deal.currentStage)}>
                              {getStageLabel(deal.currentStage)}
                            </Badge>
                            <span className="text-sm text-slate-500">
                              {deal.stageProgress}% complete
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-semibold text-primary-900 mb-1">
                          ${deal.estimatedValue ? `${(Number(deal.estimatedValue) / 1000000).toFixed(1)}M` : "TBD"}
                        </div>
                        <div className="text-sm text-slate-500">
                          Started {new Date(deal.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-slate-600 mb-2">
                        <span>Deal Progress</span>
                        <span>{deal.stageProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-primary-500 to-success-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${deal.stageProgress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Next Milestone */}
                    {deal.nextMilestone && (
                      <div className="bg-primary-50 rounded-lg p-3 mb-4">
                        <div className="flex items-center space-x-2">
                          <i className="fas fa-flag text-primary-600"></i>
                          <div>
                            <div className="text-sm font-medium text-primary-900">Next Milestone</div>
                            <div className="text-sm text-primary-700">{deal.nextMilestone}</div>
                            {deal.milestoneDueDate && (
                              <div className="text-xs text-primary-600 mt-1">
                                Due: {new Date(deal.milestoneDueDate).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                      <div className="flex items-center space-x-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          data-testid={`button-messages-${deal.id}`}
                        >
                          <i className="fas fa-comment mr-2"></i>
                          Messages
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          data-testid={`button-documents-${deal.id}`}
                        >
                          <i className="fas fa-file-alt mr-2"></i>
                          Documents
                        </Button>
                      </div>
                      
                      <Button 
                        onClick={() => setSelectedDeal(deal)}
                        className="bg-gradient-to-r from-primary-600 to-success-600"
                        data-testid={`button-view-deal-${deal.id}`}
                      >
                        <i className="fas fa-arrow-right mr-2"></i>
                        View Deal
                      </Button>
                    </div>
                  </GlassmorphismCard>
                ))}
                
                {(!deals || deals.length === 0) && (
                  <GlassmorphismCard className="p-12 text-center">
                    <i className="fas fa-briefcase text-4xl text-slate-400 mb-4"></i>
                    <h3 className="font-semibold text-slate-700 mb-2">No active deals</h3>
                    <p className="text-slate-500 mb-6">
                      Start by creating matches with qualified buyers or businesses
                    </p>
                    <Button 
                      className="bg-gradient-to-r from-primary-600 to-success-600"
                      data-testid="button-discover-matches"
                    >
                      <i className="fas fa-search mr-2"></i>
                      Discover Matches
                    </Button>
                  </GlassmorphismCard>
                )}
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
