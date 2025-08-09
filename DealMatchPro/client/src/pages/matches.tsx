import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/navigation/header";
import Sidebar from "@/components/navigation/sidebar";
import GlassmorphismCard from "@/components/ui/glassmorphism-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Matches() {
  const { user } = useAuth();

  const { data: matches, isLoading } = useQuery({
    queryKey: ["/api/matches"],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted": return "bg-success-100 text-success-800";
      case "pending": return "bg-gold-100 text-gold-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted": return "fas fa-check-circle";
      case "pending": return "fas fa-clock";
      case "rejected": return "fas fa-times-circle";
      default: return "fas fa-question-circle";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      <Header />
      
      <div className="pt-16 flex">
        <Sidebar />
        
        <main className="flex-1 p-6 lg:p-8 lg:ml-64">
          <div className="max-w-6xl mx-auto">
            
            {/* Header */}
            <div className="mb-8">
              <h1 className="font-poppins text-3xl font-bold text-primary-900 mb-2" data-testid="text-matches-title">
                Your Matches
              </h1>
              <p className="text-slate-600">
                {user?.userType === "seller" 
                  ? "Buyers who are interested in your business"
                  : "Businesses you've shown interest in"
                }
              </p>
            </div>

            {/* Match Cards */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {matches?.map((match: any) => (
                  <GlassmorphismCard key={match.id} className="p-6 shadow-xl">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={`https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=60&h=60&fit=crop&crop=face`}
                          alt="Match profile" 
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-primary-900" data-testid={`text-match-name-${match.id}`}>
                            {user?.userType === "seller" ? "Marcus Johnson" : "TechVenture Solutions"}
                          </h3>
                          <p className="text-slate-600">
                            {user?.userType === "seller" ? "Serial Entrepreneur & Investor" : "SaaS Company"}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getStatusColor(match.status)}>
                              <i className={`${getStatusIcon(match.status)} mr-1`}></i>
                              {match.status}
                            </Badge>
                            <span className="text-sm text-slate-500">
                              {match.aiCompatibilityScore && `${match.aiCompatibilityScore}% match`}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm text-slate-500 mb-2">
                          Matched {new Date(match.createdAt).toLocaleDateString()}
                        </div>
                        {match.status === "accepted" && (
                          <Button 
                            size="sm"
                            className="bg-gradient-to-r from-success-600 to-success-700"
                            data-testid={`button-view-deal-${match.id}`}
                          >
                            <i className="fas fa-briefcase mr-2"></i>
                            View Deal
                          </Button>
                        )}
                      </div>
                    </div>

                    {match.status === "pending" && (
                      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
                        <Button 
                          variant="outline"
                          size="sm"
                          className="border-slate-300 text-slate-600"
                          data-testid={`button-reject-${match.id}`}
                        >
                          <i className="fas fa-times mr-2"></i>
                          Pass
                        </Button>
                        <Button 
                          size="sm"
                          className="bg-gradient-to-r from-success-600 to-success-700"
                          data-testid={`button-accept-${match.id}`}
                        >
                          <i className="fas fa-heart mr-2"></i>
                          Connect
                        </Button>
                      </div>
                    )}

                    {match.status === "accepted" && (
                      <div className="bg-success-50 rounded-lg p-4 mt-4">
                        <div className="flex items-center space-x-2 text-success-800">
                          <i className="fas fa-handshake"></i>
                          <span className="font-medium">Deal in progress - Initial discussion phase</span>
                        </div>
                      </div>
                    )}
                  </GlassmorphismCard>
                ))}
                
                {(!matches || matches.length === 0) && (
                  <GlassmorphismCard className="p-12 text-center">
                    <i className="fas fa-heart text-4xl text-slate-400 mb-4"></i>
                    <h3 className="font-semibold text-slate-700 mb-2">No matches yet</h3>
                    <p className="text-slate-500 mb-6">
                      {user?.userType === "seller" 
                        ? "Start discovering qualified buyers to create your first match"
                        : "Start discovering businesses to create your first match"
                      }
                    </p>
                    <Button 
                      className="bg-gradient-to-r from-primary-600 to-success-600"
                      data-testid="button-start-discovering"
                    >
                      <i className="fas fa-search mr-2"></i>
                      Start Discovering
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
