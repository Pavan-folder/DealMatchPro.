import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/navigation/header";
import Sidebar from "@/components/navigation/sidebar";
import MetricsCards from "@/components/dashboard/metrics-cards";
import RecentActivity from "@/components/dashboard/recent-activity";
import QuickActions from "@/components/dashboard/quick-actions";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      <Header />
      
      <div className="pt-16 flex">
        <Sidebar />
        
        <main className="flex-1 p-6 lg:p-8 lg:ml-64">
          <div className="max-w-6xl mx-auto">
            
            {/* Welcome Header */}
            <div className="mb-8">
              <h1 className="font-poppins text-3xl font-bold text-primary-900 mb-2" data-testid="text-welcome">
                Good morning, {user?.firstName || 'there'}!
              </h1>
              <p className="text-slate-600">Here's what's happening with your business today</p>
            </div>

            {/* Key Metrics */}
            <MetricsCards />

            {/* Recent Activity and Quick Actions */}
            <div className="grid lg:grid-cols-2 gap-8 mt-8">
              <RecentActivity />
              <QuickActions />
            </div>

          </div>
        </main>
      </div>

      {/* Mobile Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 glassmorphism bg-white/90 border-t border-white/20 z-40">
        <div className="flex items-center justify-around py-2">
          <a href="/" className="flex flex-col items-center space-y-1 p-2 text-primary-600" data-testid="link-home">
            <i className="fas fa-home"></i>
            <span className="text-xs">Home</span>
          </a>
          <a href="/discover" className="flex flex-col items-center space-y-1 p-2 text-slate-600" data-testid="link-discover">
            <i className="fas fa-search"></i>
            <span className="text-xs">Discover</span>
          </a>
          <a href="/matches" className="flex flex-col items-center space-y-1 p-2 text-slate-600 relative" data-testid="link-matches">
            <i className="fas fa-heart"></i>
            <span className="text-xs">Matches</span>
            <span className="absolute -top-1 -right-1 bg-success-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
          </a>
          <a href="/deals" className="flex flex-col items-center space-y-1 p-2 text-slate-600" data-testid="link-deals">
            <i className="fas fa-briefcase"></i>
            <span className="text-xs">Deals</span>
          </a>
          <a href="/profile" className="flex flex-col items-center space-y-1 p-2 text-slate-600" data-testid="link-profile">
            <i className="fas fa-user"></i>
            <span className="text-xs">Profile</span>
          </a>
        </div>
      </nav>
    </div>
  );
}
