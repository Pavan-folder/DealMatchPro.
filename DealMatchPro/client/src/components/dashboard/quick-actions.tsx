import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import GlassmorphismCard from "@/components/ui/glassmorphism-card";

export default function QuickActions() {
  const { user } = useAuth();

  const quickActions = [
    {
      href: "/discover",
      title: user?.userType === "seller" ? "Discover New Buyers" : "Discover Businesses",
      description: user?.userType === "seller" 
        ? "Browse qualified buyer profiles" 
        : "Find businesses for acquisition",
      icon: "fas fa-search",
      gradient: "from-primary-500 to-primary-600",
      testId: "button-discover",
    },
    {
      href: "/profile",
      title: user?.userType === "seller" ? "Update Business Profile" : "Update Investment Profile",
      description: "Keep your information current",
      icon: "fas fa-user-edit",
      gradient: "from-success-500 to-success-600",
      testId: "button-update-profile",
    },
    {
      href: "/deals?tab=documents",
      title: "Upload Documents",
      description: user?.userType === "seller" 
        ? "Add financial statements & tax returns"
        : "Upload due diligence materials",
      icon: "fas fa-cloud-upload",
      gradient: "from-gold-500 to-gold-600",
      testId: "button-upload-documents",
    },
    {
      href: "/help",
      title: "Schedule Consultation",
      description: user?.userType === "seller" 
        ? "Get expert guidance on your sale"
        : "Strategic acquisition advice",
      icon: "fas fa-calendar-alt",
      gradient: "from-purple-500 to-purple-600",
      testId: "button-schedule-consultation",
    },
  ];

  return (
    <GlassmorphismCard className="p-6 shadow-xl">
      <h3 className="font-poppins text-xl font-semibold text-primary-900 mb-6">Quick Actions</h3>
      <div className="space-y-4">
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Button
              className={`w-full flex items-center space-x-4 p-4 bg-gradient-to-r ${action.gradient} text-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 h-auto`}
              data-testid={action.testId}
            >
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <i className={action.icon}></i>
              </div>
              <div className="text-left flex-1">
                <div className="font-semibold">{action.title}</div>
                <div className="text-sm opacity-90">{action.description}</div>
              </div>
              <i className="fas fa-arrow-right ml-auto"></i>
            </Button>
          </Link>
        ))}
      </div>

      {/* AI Insights Section */}
      <div className="mt-6 pt-6 border-t border-white/20">
        <h4 className="font-medium text-primary-900 mb-4 flex items-center space-x-2">
          <i className="fas fa-robot text-primary-600"></i>
          <span>AI Recommendations</span>
        </h4>
        <div className="space-y-3">
          <div className="bg-primary-50 rounded-lg p-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <i className="fas fa-lightbulb text-white text-xs"></i>
              </div>
              <div>
                <p className="text-sm text-primary-900 font-medium mb-1">
                  {user?.userType === "seller" 
                    ? "Optimize Your Profile" 
                    : "Expand Your Search"
                  }
                </p>
                <p className="text-xs text-primary-700">
                  {user?.userType === "seller"
                    ? "Adding recent financial data could increase match quality by 15%"
                    : "Consider broadening your industry preferences to see 23% more opportunities"
                  }
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-success-50 rounded-lg p-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-success-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <i className="fas fa-chart-line text-white text-xs"></i>
              </div>
              <div>
                <p className="text-sm text-success-900 font-medium mb-1">
                  {user?.userType === "seller"
                    ? "Market Timing"
                    : "Competitive Analysis"
                  }
                </p>
                <p className="text-xs text-success-700">
                  {user?.userType === "seller"
                    ? "Current market conditions favor sellers in your industry"
                    : "Similar acquisitions in your target range are 18% below historical averages"
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-6 border-t border-white/20">
        <h4 className="font-medium text-primary-900 mb-4">This Week</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-primary-900" data-testid="text-weekly-views">
              {user?.userType === "seller" ? "12" : "8"}
            </div>
            <div className="text-xs text-slate-600">
              {user?.userType === "seller" ? "Profile Views" : "Businesses Viewed"}
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-success-600" data-testid="text-weekly-matches">
              {user?.userType === "seller" ? "3" : "5"}
            </div>
            <div className="text-xs text-slate-600">
              {user?.userType === "seller" ? "New Matches" : "Interests Sent"}
            </div>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-6 pt-6 border-t border-white/20">
        <Button 
          variant="outline" 
          className="w-full justify-start"
          data-testid="button-help-center"
        >
          <i className="fas fa-question-circle mr-3"></i>
          <div className="text-left">
            <div className="font-medium">Need Help?</div>
            <div className="text-sm text-slate-500">Access our help center and guides</div>
          </div>
        </Button>
      </div>
    </GlassmorphismCard>
  );
}
