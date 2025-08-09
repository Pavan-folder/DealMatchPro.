import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import GlassmorphismCard from "@/components/ui/glassmorphism-card";

export default function RecentActivity() {
  // In a real implementation, this would fetch actual activity data
  const mockActivities = [
    {
      id: 1,
      type: "match",
      title: "New match with Marcus Johnson",
      description: "SaaS investor from San Francisco",
      time: "2 hours ago",
      icon: "fas fa-heart",
      iconColor: "bg-success-100 text-success-600",
      action: "View",
      actionVariant: "success" as const,
    },
    {
      id: 2,
      type: "document",
      title: "Document request from Sarah Chen",
      description: "Requesting updated financial statements",
      time: "4 hours ago",
      icon: "fas fa-file-alt",
      iconColor: "bg-blue-100 text-blue-600",
      action: "Upload",
      actionVariant: "default" as const,
    },
    {
      id: 3,
      type: "analysis",
      title: "AI analysis complete",
      description: "Financial documents processed successfully",
      time: "6 hours ago",
      icon: "fas fa-robot",
      iconColor: "bg-gold-100 text-gold-600",
      action: "Review",
      actionVariant: "secondary" as const,
    },
    {
      id: 4,
      type: "meeting",
      title: "Upcoming call scheduled",
      description: "Initial review with TechVenture Capital",
      time: "Tomorrow at 2:00 PM",
      icon: "fas fa-video",
      iconColor: "bg-purple-100 text-purple-600",
      action: "Prepare",
      actionVariant: "outline" as const,
    },
  ];

  return (
    <GlassmorphismCard className="p-6 shadow-xl">
      <h3 className="font-poppins text-xl font-semibold text-primary-900 mb-6">Recent Activity</h3>
      <div className="space-y-4">
        {mockActivities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-4 p-4 bg-slate-50 rounded-xl">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activity.iconColor}`}>
              <i className={activity.icon}></i>
            </div>
            <div className="flex-1">
              <p className="text-slate-800 font-medium" data-testid={`text-activity-title-${activity.id}`}>
                {activity.title}
              </p>
              <p className="text-sm text-slate-600" data-testid={`text-activity-description-${activity.id}`}>
                {activity.description}
              </p>
              <span className="text-xs text-slate-500">{activity.time}</span>
            </div>
            <Button 
              size="sm"
              variant={activity.actionVariant}
              className={
                activity.actionVariant === "success" 
                  ? "bg-success-500 hover:bg-success-600 text-white"
                  : activity.actionVariant === "secondary"
                  ? "bg-gold-500 hover:bg-gold-600 text-white"
                  : ""
              }
              data-testid={`button-activity-action-${activity.id}`}
            >
              {activity.action}
            </Button>
          </div>
        ))}
      </div>
    </GlassmorphismCard>
  );
}
