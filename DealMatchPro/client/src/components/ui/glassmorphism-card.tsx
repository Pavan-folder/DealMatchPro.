import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface GlassmorphismCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function GlassmorphismCard({ 
  children, 
  className, 
  ...props 
}: GlassmorphismCardProps) {
  return (
    <Card
      className={cn(
        "glassmorphism-card backdrop-filter backdrop-blur-lg shadow-xl border-white/20",
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
}
