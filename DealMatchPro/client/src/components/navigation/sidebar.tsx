import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const [location] = useLocation();

  const menuItems = [
    { href: "/", icon: "fas fa-tachometer-alt", label: "Dashboard", badge: null },
    { href: "/discover", icon: "fas fa-search", label: "Discover", badge: "12" },
    { href: "/matches", icon: "fas fa-heart", label: "Matches", badge: "5" },
    { href: "/deals", icon: "fas fa-briefcase", label: "Active Deals", badge: null },
    { href: "/documents", icon: "fas fa-file-alt", label: "Documents", badge: null },
    { href: "/analytics", icon: "fas fa-chart-line", label: "Analytics", badge: null },
  ];

  const bottomMenuItems = [
    { href: "/profile", icon: "fas fa-user", label: "Profile" },
    { href: "/settings", icon: "fas fa-cog", label: "Settings" },
    { href: "/help", icon: "fas fa-question-circle", label: "Help & Support" },
  ];

  return (
    <aside className="hidden lg:block fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] glassmorphism bg-white/60 border-r border-white/20 z-30">
      <div className="p-6">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg transition-colors text-slate-700 hover:bg-white/50",
                location === item.href && "bg-primary-500 text-white hover:bg-primary-600"
              )}
              data-testid={`link-sidebar-${item.label.toLowerCase().replace(/ /g, '-')}`}
            >
              <div className="flex items-center space-x-3">
                <i className={item.icon}></i>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  location === item.href 
                    ? "bg-white/20 text-white" 
                    : item.label === "Discover" 
                      ? "bg-gold-500 text-white"
                      : "bg-success-500 text-white"
                )}>
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-white/20">
          <div className="space-y-2">
            {bottomMenuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-lg transition-colors text-slate-700 hover:bg-white/50",
                  location === item.href && "bg-primary-500 text-white hover:bg-primary-600"
                )}
                data-testid={`link-sidebar-${item.label.toLowerCase().replace(/ /g, '-')}`}
              >
                <i className={item.icon}></i>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
