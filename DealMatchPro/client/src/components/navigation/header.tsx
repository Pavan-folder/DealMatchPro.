import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glassmorphism bg-white/80 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2" data-testid="link-logo">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-success-500 rounded-lg flex items-center justify-center">
                <i className="fas fa-handshake text-white text-sm"></i>
              </div>
              <span className="font-poppins font-bold text-xl text-primary-900">DealConnect</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-slate-600 hover:text-primary-600 font-medium transition-colors" data-testid="link-dashboard">
              Dashboard
            </Link>
            <Link href="/discover" className="text-slate-600 hover:text-primary-600 font-medium transition-colors" data-testid="link-discover">
              Discover
            </Link>
            <Link href="/matches" className="text-slate-600 hover:text-primary-600 font-medium transition-colors" data-testid="link-matches">
              Matches
            </Link>
            <Link href="/deals" className="text-slate-600 hover:text-primary-600 font-medium transition-colors" data-testid="link-deals">
              Deals
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="relative p-2" data-testid="button-notifications">
              <i className="fas fa-bell text-slate-600"></i>
              <span className="absolute -top-1 -right-1 bg-gold-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 p-2" data-testid="button-profile-menu">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.profileImageUrl} />
                    <AvatarFallback>
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-sm font-medium text-slate-700">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <i className="fas fa-chevron-down text-xs text-slate-500"></i>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center space-x-2" data-testid="link-profile">
                    <i className="fas fa-user"></i>
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.location.href = "/api/logout"} data-testid="button-logout">
                  <i className="fas fa-sign-out-alt mr-2"></i>
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
