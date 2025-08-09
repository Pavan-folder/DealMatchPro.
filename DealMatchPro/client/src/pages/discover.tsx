import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/navigation/header";
import Sidebar from "@/components/navigation/sidebar";
import BuyerProfileCard from "@/components/discover/buyer-profile-card";
import ExpandedBuyerProfile from "@/components/discover/expanded-buyer-profile";
import { Button } from "@/components/ui/button";
import GlassmorphismCard from "@/components/ui/glassmorphism-card";

export default function Discover() {
  const { user } = useAuth();
  const [expandedProfile, setExpandedProfile] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const { data: profiles, isLoading } = useQuery({
    queryKey: ["/api/discover/buyers"],
    enabled: user?.userType === "seller",
  });

  const { data: businesses, isLoading: isLoadingBusinesses } = useQuery({
    queryKey: ["/api/discover/businesses"],
    enabled: user?.userType === "buyer",
  });

  const data = user?.userType === "seller" ? profiles : businesses;
  const loading = user?.userType === "seller" ? isLoading : isLoadingBusinesses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      <Header />
      
      <div className="pt-16 flex">
        <Sidebar />
        
        <main className="flex-1 p-6 lg:p-8 lg:ml-64">
          <div className="max-w-6xl mx-auto">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="font-poppins text-3xl font-bold text-primary-900 mb-2" data-testid="text-discover-title">
                  {user?.userType === "seller" ? "Discover Buyers" : "Discover Businesses"}
                </h1>
                <p className="text-slate-600">
                  {user?.userType === "seller" 
                    ? "Find qualified buyers interested in businesses like yours"
                    : "Find businesses that match your investment criteria"
                  }
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  className="glassmorphism bg-white/80"
                  data-testid="button-filters"
                >
                  <i className="fas fa-filter mr-2"></i>
                  Filters
                </Button>
                
                <Button 
                  variant="outline" 
                  className="glassmorphism bg-white/80"
                  onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                  data-testid="button-toggle-view"
                >
                  <i className={`fas ${viewMode === "grid" ? "fa-list" : "fa-th-large"} mr-2`}></i>
                  {viewMode === "grid" ? "List" : "Grid"} View
                </Button>
              </div>
            </div>

            {/* AI Compatibility Insights */}
            <GlassmorphismCard className="mb-8 p-6 bg-gradient-to-r from-primary-50 to-success-50 border-white/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-success-500 rounded-xl flex items-center justify-center">
                  <i className="fas fa-robot text-white"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-primary-900">AI Match Insights</h3>
                  <p className="text-sm text-slate-600">Based on your profile and preferences</p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/60 rounded-xl p-4">
                  <div className="text-2xl font-bold text-success-600 mb-1" data-testid="text-compatibility">87%</div>
                  <div className="text-sm text-slate-600">
                    {user?.userType === "seller" ? "Compatibility with tech buyers" : "Match with tech businesses"}
                  </div>
                </div>
                <div className="bg-white/60 rounded-xl p-4">
                  <div className="text-2xl font-bold text-gold-500 mb-1" data-testid="text-leads">12</div>
                  <div className="text-sm text-slate-600">High-quality leads this week</div>
                </div>
                <div className="bg-white/60 rounded-xl p-4">
                  <div className="text-2xl font-bold text-primary-600 mb-1" data-testid="text-success-rate">3.2x</div>
                  <div className="text-sm text-slate-600">Higher success rate with similar profiles</div>
                </div>
              </div>
            </GlassmorphismCard>

            {/* Profile Cards */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {data?.map((profile: any) => (
                  <BuyerProfileCard
                    key={profile.id}
                    profile={profile}
                    userType={user?.userType || "seller"}
                    onExpand={setExpandedProfile}
                  />
                ))}
                
                {(!data || data.length === 0) && (
                  <GlassmorphismCard className="p-12 text-center">
                    <i className="fas fa-search text-4xl text-slate-400 mb-4"></i>
                    <h3 className="font-semibold text-slate-700 mb-2">No matches found</h3>
                    <p className="text-slate-500">
                      {user?.userType === "seller" 
                        ? "We're constantly adding new qualified buyers. Check back soon!"
                        : "We're constantly adding new businesses for sale. Check back soon!"
                      }
                    </p>
                  </GlassmorphismCard>
                )}
              </div>
            )}

            {/* Load More Button */}
            {data && data.length > 0 && (
              <div className="text-center mt-8">
                <Button 
                  variant="outline"
                  className="glassmorphism bg-white/80 px-8 py-3"
                  data-testid="button-load-more"
                >
                  Load More {user?.userType === "seller" ? "Buyers" : "Businesses"}
                  <i className="fas fa-arrow-down ml-2"></i>
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Expanded Profile Modal */}
      {expandedProfile && (
        <ExpandedBuyerProfile
          profile={expandedProfile}
          userType={user?.userType || "seller"}
          onClose={() => setExpandedProfile(null)}
        />
      )}
    </div>
  );
}
