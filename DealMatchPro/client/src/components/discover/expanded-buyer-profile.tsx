import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ExpandedBuyerProfileProps {
  profile: any;
  userType: string;
  onClose: () => void;
}

export default function ExpandedBuyerProfile({ profile, userType, onClose }: ExpandedBuyerProfileProps) {
  const { toast } = useToast();

  const createMatchMutation = useMutation({
    mutationFn: async ({ action }: { action: string }) => {
      return await apiRequest("POST", "/api/matches/create", {
        businessId: userType === "seller" ? undefined : profile.id,
        buyerId: userType === "seller" ? profile.id : undefined,
        action,
      });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
      
      if (variables.action === "accept") {
        toast({
          title: "Match Created!",
          description: "You've successfully connected. The conversation can now begin.",
        });
      }
      onClose();
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

  const renderDetailedInfo = () => {
    if (userType === "seller") {
      // Seller viewing buyer profile
      return (
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h4 className="font-semibold text-primary-900 text-lg mb-4">Investment Details</h4>
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-sm text-slate-500 mb-1">Budget Range</div>
                <div className="font-semibold text-primary-900 text-lg" data-testid="text-expanded-budget">
                  {profile.budgetRange || "Not specified"}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-sm text-slate-500 mb-1">Preferred Structure</div>
                <div className="font-semibold text-primary-900">
                  {profile.acquisitionStructure?.join(", ") || "Asset Purchase, Stock Purchase"}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-sm text-slate-500 mb-1">Decision Timeline</div>
                <div className="font-semibold text-primary-900">
                  {profile.timeline || "Flexible"}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-primary-900 text-lg mb-4">Experience & Background</h4>
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-sm text-slate-500 mb-1">Previous Acquisitions</div>
                <div className="font-semibold text-primary-900 text-lg">
                  {profile.experience || "Not specified"}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-sm text-slate-500 mb-1">Industry Focus</div>
                <div className="font-semibold text-primary-900">
                  {profile.preferredIndustries?.join(", ") || "Various Industries"}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-sm text-slate-500 mb-1">Geographic Preference</div>
                <div className="font-semibold text-primary-900">
                  {profile.location || "US & Canada"}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      // Buyer viewing business profile
      return (
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h4 className="font-semibold text-primary-900 text-lg mb-4">Business Details</h4>
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-sm text-slate-500 mb-1">Industry</div>
                <div className="font-semibold text-primary-900 text-lg" data-testid="text-expanded-industry">
                  {profile.industry || "Not specified"}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-sm text-slate-500 mb-1">Annual Revenue</div>
                <div className="font-semibold text-primary-900">
                  {profile.annualRevenue || "Contact for details"}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-sm text-slate-500 mb-1">Years in Business</div>
                <div className="font-semibold text-primary-900">
                  {profile.yearsInBusiness ? `${profile.yearsInBusiness} years` : "Established"}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-primary-900 text-lg mb-4">Sale Information</h4>
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-sm text-slate-500 mb-1">Selling Reason</div>
                <div className="font-semibold text-primary-900">
                  {profile.sellingReason || "Strategic decision"}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-sm text-slate-500 mb-1">Timeline</div>
                <div className="font-semibold text-primary-900">
                  {profile.timeline || "Flexible"}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-sm text-slate-500 mb-1">Asking Price</div>
                <div className="font-semibold text-primary-900">
                  {profile.askingPrice ? `$${Number(profile.askingPrice).toLocaleString()}` : "Contact for details"}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-poppins text-2xl font-bold text-primary-900" data-testid="text-expanded-title">
              {userType === "seller" ? "Buyer Profile" : "Business Profile"}
            </h2>
            <button 
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-700 transition-colors"
              data-testid="button-close-expanded"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start space-x-6 mb-8">
            <img 
              src={`https://images.unsplash.com/photo-${userType === "seller" ? "1472099645785-5658abf4ff4e" : "1560472354-b33ff0c44a43"}?ixlib=rb-4.0.3&w=120&h=120&fit=crop&crop=face`}
              alt="Expanded profile" 
              className="w-24 h-24 rounded-2xl object-cover"
              data-testid="img-expanded-profile"
            />
            <div className="flex-1">
              <h3 className="font-poppins text-2xl font-bold text-primary-900 mb-2" data-testid="text-expanded-name">
                {userType === "seller" 
                  ? "Investment Professional" 
                  : profile.name || "Business Opportunity"
                }
              </h3>
              <p className="text-lg text-slate-600 mb-3">
                {userType === "seller" 
                  ? "Serial Entrepreneur & Technology Investor"
                  : `${profile.industry || "Established Business"} • ${profile.location || "Prime Location"}`
                }
              </p>
              <div className="flex items-center space-x-4 mb-4">
                <Badge className="bg-success-100 text-success-800">
                  <i className="fas fa-shield-alt mr-1"></i>
                  Verified {userType === "seller" ? "Buyer" : "Business"}
                </Badge>
                <span className="flex items-center space-x-2 text-slate-600">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{userType === "seller" ? "San Francisco, CA" : profile.location || "Location Available"}</span>
                </span>
                <span className="flex items-center space-x-2 text-slate-600">
                  <i className="fas fa-calendar"></i>
                  <span>Member since 2022</span>
                </span>
              </div>
              {profile.compatibilityScore && (
                <div className="bg-gradient-to-r from-primary-500 to-success-500 text-white px-4 py-2 rounded-xl inline-block">
                  <span className="font-semibold">{Math.round(profile.compatibilityScore)}% Compatibility Match</span>
                </div>
              )}
            </div>
          </div>

          {renderDetailedInfo()}

          {/* Investment Thesis / Business Description */}
          <div className="mb-8">
            <h4 className="font-semibold text-primary-900 text-lg mb-4">
              {userType === "seller" ? "Investment Thesis" : "Business Overview"}
            </h4>
            <div className="bg-slate-50 rounded-xl p-6">
              <p className="text-slate-700 leading-relaxed mb-4" data-testid="text-expanded-description">
                {userType === "seller" 
                  ? (profile.investmentFocus || "I focus on acquiring profitable businesses with strong fundamentals and growth potential. My ideal targets demonstrate consistent performance and operate in expanding market segments.")
                  : (profile.description || "A well-established business with strong market position, consistent profitability, and significant growth potential. The company has built a loyal customer base and maintains competitive advantages in its industry.")
                }
              </p>
            </div>
          </div>

          {/* Readiness Indicators */}
          {userType === "seller" && (
            <div className="mb-8">
              <h4 className="font-semibold text-primary-900 text-lg mb-4">Financial Readiness</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-success-50 rounded-xl">
                  <i className="fas fa-check-circle text-success-600 text-xl"></i>
                  <span className="text-success-800">
                    {profile.hasFinancing ? "Pre-approved financing secured" : "Financing arrangements available"}
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-success-50 rounded-xl">
                  <i className="fas fa-check-circle text-success-600 text-xl"></i>
                  <span className="text-success-800">Legal team and advisors in place</span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-success-50 rounded-xl">
                  <i className="fas fa-check-circle text-success-600 text-xl"></i>
                  <span className="text-success-800">Due diligence experience</span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-success-50 rounded-xl">
                  <i className="fas fa-check-circle text-success-600 text-xl"></i>
                  <span className="text-success-800">Quick decision capability</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-200">
            <Button 
              variant="outline"
              onClick={() => handleAction("reject")}
              disabled={createMatchMutation.isPending}
              className="px-6 py-3 border-slate-300 text-slate-600 hover:border-slate-400"
              data-testid="button-expanded-reject"
            >
              <i className="fas fa-times mr-2"></i>
              Pass on This {userType === "seller" ? "Buyer" : "Business"}
            </Button>
            <Button 
              onClick={() => handleAction("accept")}
              disabled={createMatchMutation.isPending}
              className="bg-gradient-to-r from-success-600 to-success-700 px-8 py-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              data-testid="button-expanded-connect"
            >
              <i className="fas fa-heart mr-2"></i>
              {createMatchMutation.isPending ? "Connecting..." : "Connect & Start Conversation"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
