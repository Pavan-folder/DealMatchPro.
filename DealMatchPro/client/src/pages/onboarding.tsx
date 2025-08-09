import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import OnboardingFlow from "@/components/onboarding/onboarding-flow";

export default function Onboarding() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [userType, setUserType] = useState<"seller" | "buyer" | null>(null);
  const [businessData, setBusinessData] = useState({});
  const [buyerData, setBuyerData] = useState({});

  const completeOnboardingMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/onboarding/complete", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Welcome to DealConnect!",
        description: "Your profile has been set up successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Setup Failed",
        description: "There was an error setting up your profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleComplete = () => {
    completeOnboardingMutation.mutate({
      userType,
      businessData: userType === "seller" ? businessData : undefined,
      buyerData: userType === "buyer" ? buyerData : undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      <OnboardingFlow
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        userType={userType}
        setUserType={setUserType}
        businessData={businessData}
        setBusinessData={setBusinessData}
        buyerData={buyerData}
        setBuyerData={setBuyerData}
        onComplete={handleComplete}
        isLoading={completeOnboardingMutation.isPending}
      />
    </div>
  );
}
