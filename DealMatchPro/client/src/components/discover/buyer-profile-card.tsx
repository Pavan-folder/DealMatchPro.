import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import GlassmorphismCard from "@/components/ui/glassmorphism-card";

interface BuyerProfileCardProps {
  profile: any;
  userType: string;
  onExpand: (profile: any) => void;
}

export default function BuyerProfileCard({ profile, userType, onExpand }: BuyerProfileCardProps) {
  const { toast } = useToast();
  const [actionTaken, setActionTaken] = useState<string | null>(null);

  const createMatchMutation = useMutation({
    mutationFn: async ({ action }: { action: string }) => {
      return await apiRequest("POST", "/api/matches/create", {
        businessId: userType === "seller" ? undefined : profile.id,
        buyerId: userType === "seller" ? profile.id : undefined,
        action,
      });
    },
    onSuccess: (data, variables) => {
      setActionTaken(variables.action);
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
      
      if (variables.action === "accept") {
        toast({
          title: "Match Created!",
          description: "You've successfully connected. The conversation can now begin.",
        });
      }
    },
    onError: () => {
      toast({
        title: "Action Failed",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAction = (action: "accept" | "reject") => {
    createMatchMutation.mutate({ action });
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 90) return "bg-gradient-to-r from-success-500 to-success-600";
    if (score >= 80) return "bg-gradient-to-r from-primary-500 to-primary-600";
    if (score >= 70) return "bg-gradient-to-r from-gold-500 to-gold-600";
    return "bg-gradient-to-r from-slate-500 to-slate-600";
  };

  const renderProfileInfo = () => {
    if (userType === "seller") {
      // Seller viewing buyer profiles
      return (
        <>
          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="text-sm text-slate-500 mb-1">Budget Range</div>
              <div className="font-semibold text-primary-900" data-testid={`text-budget-${profile.id}`}>
                {profile.budgetRange || "Not specified"}
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="text-sm text-slate-500 mb-1">Experience</div>
              <div className="font-semibold text-primary-900" data-testid={`text-experience-${profile.id}`}>
                {profile.experience || "Not specified"}
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="text-sm text-slate-500 mb-1">Timeline</div>
              <div className="font-semibold text-primary-900" data-testid={`text-timeline-${profile.id}`}>
                {profile.timeline || "Flexible"}
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="text-sm text-slate-500 mb-1">Industries</div>
              <div className="font-semibold text-primary-900" data-testid={`text-industries-${profile.id}`}>
                {profile.preferredIndustries?.slice(0, 2).join(", ") || "Various"}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-medium text-primary-900 mb-2">Investment Focus:</h4>
            <p className="text-slate-600 leading-relaxed" data-testid={`text-focus-${profile.id}`}>
              {profile.investmentFocus || "Looking for profitable businesses with growth potential."}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <div className="flex items-center space-x-4">
              {profile.hasFinancing && (
                <div className="flex items-center space-x-2">
                  <i className="fas fa-shield-alt text-success-500"></i>
                  <span className="text-sm text-slate-600">Pre-approved financing</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <i className="fas fa-clock text-gold-500"></i>
                <span className="text-sm text-slate-600">Fast decision maker</span>
              </div>
            </div>
          </div>
        </>
      );
    } else {
      // Buyer viewing business profiles
      return (
        <>
          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="text-sm text-slate-500 mb-1">Industry</div>
              <div className="font-semibold text-primary-900" data-testid={`text-industry-${profile.id}`}>
                {profile.industry || "Not specified"}
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="text-sm text-slate-500 mb-1">Revenue</div>
              <div className="font-semibold text-primary-900" data-testid={`text-revenue-${profile.id}`}>
                {profile.annualRevenue || "Not disclosed"}
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="text-sm text-slate-500 mb-1">Years Active</div>
              <div className="font-semibold text-primary-900" data-testid={`text-years-${profile.id}`}>
                {profile.yearsInBusiness || "Not specified"}
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="text-sm text-slate-500 mb-1">Location</div>
              <div className="font-semibold text-primary-900" data-testid={`text-location-${profile.id}`}>
                {profile.location || "Not specified"}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-medium text-primary-900 mb-2">Business Description:</h4>
            <p className="text-slate-600 leading-relaxed" data-testid={`text-description-${profile.id}`}>
              {profile.description || "A well-established business with strong fundamentals and growth potential."}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <i className="fas fa-chart-line text-success-500"></i>
                <span className="text-sm text-slate-600">Profitable business</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fas fa-users text-gold-500"></i>
                <span className="text-sm text-slate-600">Established team</span>
              </div>
            </div>
          </div>
        </>
      );
    }
  };

  if (actionTaken) {
    return (
      <GlassmorphismCard className="p-6 shadow-xl opacity-75">
        <div className="text-center py-8">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            actionTaken === "accept" ? "bg-success-100" : "bg-slate-100"
          }`}>
            <i className={`fas ${
              actionTaken === "accept" ? "fa-heart text-success-600" : "fa-times text-slate-600"
            } text-2xl`}></i>
          </div>
          <h3 className="font-semibold text-slate-700 mb-2">
            {actionTaken === "accept" ? "Match Created!" : "Passed"}
          </h3>
          <p className="text-slate-500">
            {actionTaken === "accept" 
              ? "You can now start a conversation" 
              : "This profile won't be shown again"
            }
          </p>
        </div>
      </GlassmorphismCard>
    );
  }

  return (
    <GlassmorphismCard className="swipe-card shadow-xl overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <img 
              src={`https://images.unsplash.com/photo-${userType === "seller" ? "1507003211169-0a1dd7228f2d" : "1560472354-b33ff0c44a43"}?ixlib=rb-4.0.3&w=80&h=80&fit=crop&crop=face`}
              alt="Profile" 
              className="w-16 h-16 rounded-xl object-cover"
              data-testid={`img-profile-${profile.id}`}
            />
            <div>
              <h3 className="font-poppins text-xl font-semibold text-primary-900" data-testid={`text-name-${profile.id}`}>
                {userType === "seller" 
                  ? "Investment Professional" 
                  : profile.name || "Business Opportunity"
                }
              </h3>
              <p className="text-slate-600">
                {userType === "seller" 
                  ? "Experienced Investor"
                  : `${profile.industry || "Business"} • ${profile.location || "Location TBD"}`
                }
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className="bg-success-100 text-success-800">
                  ✓ Verified {userType === "seller" ? "Buyer" : "Business"}
                </Badge>
                <span className="text-slate-400">•</span>
                <span className="text-sm text-slate-500">
                  {userType === "seller" ? "San Francisco, CA" : profile.location || "Location Available"}
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse-soft"></div>
              <span className="text-sm text-success-600 font-medium">Active Now</span>
            </div>
            {profile.compatibilityScore && (
              <div className={`text-white px-3 py-1 rounded-full text-sm font-medium ${getCompatibilityColor(profile.compatibilityScore)}`}>
                {Math.round(profile.compatibilityScore)}% Match
              </div>
            )}
          </div>
        </div>

        {renderProfileInfo()}

        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => onExpand(profile)}
            className="px-4 py-2 border-primary-300 text-primary-600 hover:bg-primary-50"
            data-testid={`button-expand-${profile.id}`}
          >
            <i className="fas fa-eye mr-2"></i>
            View Full Profile
          </Button>
          
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline"
              onClick={() => handleAction("reject")}
              disabled={createMatchMutation.isPending}
              className="px-6 py-2 border-slate-300 text-slate-600 hover:border-slate-400"
              data-testid={`button-reject-${profile.id}`}
            >
              <i className="fas fa-times mr-2"></i>
              Pass
            </Button>
            <Button 
              onClick={() => handleAction("accept")}
              disabled={createMatchMutation.isPending}
              className="bg-gradient-to-r from-success-600 to-success-700 px-6 py-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              data-testid={`button-accept-${profile.id}`}
            >
              <i className="fas fa-heart mr-2"></i>
              {createMatchMutation.isPending ? "Connecting..." : "Connect"}
            </Button>
          </div>
        </div>
      </div>
    </GlassmorphismCard>
  );
}
