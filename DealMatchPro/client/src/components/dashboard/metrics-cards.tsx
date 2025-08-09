import GlassmorphismCard from "@/components/ui/glassmorphism-card";

export default function MetricsCards() {
  const metrics = [
    {
      title: "Profile Views",
      value: "127",
      change: "+23% from last week",
      icon: "fas fa-eye",
      gradient: "from-primary-500 to-primary-600",
      period: "This Week",
    },
    {
      title: "Active Matches",
      value: "8",
      change: "3 new this week",
      icon: "fas fa-heart",
      gradient: "from-success-500 to-success-600",
      period: "Total",
    },
    {
      title: "Active Deals",
      value: "3",
      change: "2 in due diligence",
      icon: "fas fa-handshake",
      gradient: "from-gold-500 to-gold-600",
      period: "In Progress",
    },
    {
      title: "Response Time",
      value: "2.4h",
      change: "30% faster",
      icon: "fas fa-chart-line",
      gradient: "from-purple-500 to-purple-600",
      period: "Average",
    },
  ];

  return (
    <div className="grid md:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <GlassmorphismCard 
          key={metric.title}
          className={`p-6 bg-gradient-to-br ${metric.gradient} text-white shadow-xl`}
        >
          <div className="flex items-center justify-between mb-4">
            <i className={`${metric.icon} text-2xl`}></i>
            <span className="text-sm opacity-90">{metric.period}</span>
          </div>
          <div className="text-3xl font-bold mb-2" data-testid={`text-metric-${index}`}>
            {metric.value}
          </div>
          <div className="text-sm opacity-90 mb-2">{metric.title}</div>
          <div className="flex items-center text-sm">
            <i className="fas fa-arrow-up mr-1"></i>
            <span>{metric.change}</span>
          </div>
        </GlassmorphismCard>
      ))}
    </div>
  );
}
