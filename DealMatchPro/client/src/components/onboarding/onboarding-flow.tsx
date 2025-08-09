import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import GlassmorphismCard from "@/components/ui/glassmorphism-card";

interface OnboardingFlowProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  userType: "seller" | "buyer" | null;
  setUserType: (type: "seller" | "buyer") => void;
  businessData: any;
  setBusinessData: (data: any) => void;
  buyerData: any;
  setBuyerData: (data: any) => void;
  onComplete: () => void;
  isLoading: boolean;
}

export default function OnboardingFlow({
  currentStep,
  setCurrentStep,
  userType,
  setUserType,
  businessData,
  setBusinessData,
  buyerData,
  setBuyerData,
  onComplete,
  isLoading,
}: OnboardingFlowProps) {
  const [selectedFinancialReadiness, setSelectedFinancialReadiness] = useState<string[]>([]);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateBusinessData = (field: string, value: any) => {
    setBusinessData({ ...businessData, [field]: value });
  };

  const updateBuyerData = (field: string, value: any) => {
    setBuyerData({ ...buyerData, [field]: value });
  };

  const progressPercentage = (currentStep / 3) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-8">
      {/* Onboarding Header */}
      <div className="text-center mb-12">
        <h1 className="font-poppins text-4xl font-bold text-primary-900 mb-4" data-testid="text-onboarding-title">
          Welcome to DealConnect
        </h1>
        <p className="text-xl text-slate-600 mb-8">
          Let's set up your profile to find the perfect business matches
        </p>
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-2 mb-8">
          <div 
            className="bg-gradient-to-r from-primary-500 to-success-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
            data-testid="progress-bar"
          ></div>
        </div>
      </div>

      {/* Step 1: User Type Selection */}
      {currentStep === 1 && (
        <div className="animate-slide-up">
          <div className="text-center mb-8">
            <h2 className="font-poppins text-2xl font-semibold text-primary-900 mb-4">
              What brings you to DealConnect?
            </h2>
            <div className="flex justify-center space-x-4">
              <Button
                size="lg"
                variant={userType === "seller" ? "default" : "outline"}
                onClick={() => setUserType("seller")}
                className={userType === "seller" 
                  ? "bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-6 text-lg shadow-xl hover:shadow-2xl" 
                  : "px-8 py-6 text-lg border-2 border-primary-300 text-primary-700 hover:bg-primary-50"
                }
                data-testid="button-select-seller"
              >
                <i className="fas fa-building mr-3"></i>
                I'm Selling My Business
              </Button>
              <Button
                size="lg"
                variant={userType === "buyer" ? "default" : "outline"}
                onClick={() => setUserType("buyer")}
                className={userType === "buyer" 
                  ? "bg-gradient-to-r from-success-600 to-success-700 px-8 py-6 text-lg shadow-xl hover:shadow-2xl" 
                  : "px-8 py-6 text-lg border-2 border-success-300 text-success-700 hover:bg-success-50"
                }
                data-testid="button-select-buyer"
              >
                <i className="fas fa-search-dollar mr-3"></i>
                I'm Looking to Buy
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Seller Questionnaire */}
      {currentStep === 2 && userType === "seller" && (
        <div className="animate-slide-up">
          <GlassmorphismCard className="p-8 shadow-xl">
            <h2 className="font-poppins text-2xl font-semibold text-primary-900 mb-6">
              Tell us about your business
            </h2>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    placeholder="Your business name"
                    value={businessData.name || ""}
                    onChange={(e) => updateBusinessData("name", e.target.value)}
                    data-testid="input-business-name"
                  />
                </div>
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Select onValueChange={(value) => updateBusinessData("industry", value)}>
                    <SelectTrigger data-testid="select-industry">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="real_estate">Real Estate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="revenue">Annual Revenue Range</Label>
                  <Select onValueChange={(value) => updateBusinessData("annualRevenue", value)}>
                    <SelectTrigger data-testid="select-revenue">
                      <SelectValue placeholder="Select revenue range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under_1m">Under $1M</SelectItem>
                      <SelectItem value="1m_5m">$1M - $5M</SelectItem>
                      <SelectItem value="5m_10m">$5M - $10M</SelectItem>
                      <SelectItem value="10m_50m">$10M - $50M</SelectItem>
                      <SelectItem value="over_50m">$50M+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="years">Years in Business</Label>
                  <Input
                    id="years"
                    type="number"
                    placeholder="5"
                    value={businessData.yearsInBusiness || ""}
                    onChange={(e) => updateBusinessData("yearsInBusiness", parseInt(e.target.value))}
                    data-testid="input-years-in-business"
                  />
                </div>
              </div>

              <div>
                <Label className="text-base font-medium mb-4 block">Why are you selling?</Label>
                <RadioGroup 
                  value={businessData.sellingReason}
                  onValueChange={(value) => updateBusinessData("sellingReason", value)}
                  className="grid md:grid-cols-2 gap-4"
                >
                  {[
                    { value: "retirement", label: "Retirement", desc: "Ready to enjoy the next chapter" },
                    { value: "new_opportunity", label: "New Opportunity", desc: "Starting something new" },
                    { value: "financial", label: "Financial Goals", desc: "Liquidity event needed" },
                    { value: "partnership", label: "Strategic Partnership", desc: "Growth through acquisition" },
                  ].map((reason) => (
                    <label 
                      key={reason.value}
                      className="flex items-center p-4 border-2 border-slate-200 rounded-xl hover:border-primary-300 cursor-pointer transition-colors"
                      data-testid={`radio-reason-${reason.value}`}
                    >
                      <RadioGroupItem value={reason.value} className="mr-3" />
                      <div>
                        <div className="font-medium">{reason.label}</div>
                        <div className="text-sm text-slate-500">{reason.desc}</div>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-medium mb-4 block">Timeline for Sale</Label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { value: "asap", label: "ASAP" },
                    { value: "3_months", label: "3-6 Months" },
                    { value: "1_year", label: "6-12 Months" },
                    { value: "flexible", label: "Flexible" },
                  ].map((timeline) => (
                    <Button
                      key={timeline.value}
                      type="button"
                      variant={businessData.timeline === timeline.value ? "default" : "outline"}
                      onClick={() => updateBusinessData("timeline", timeline.value)}
                      data-testid={`button-timeline-${timeline.value}`}
                    >
                      {timeline.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="description">Business Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of your business, its products/services, and what makes it unique..."
                  rows={4}
                  value={businessData.description || ""}
                  onChange={(e) => updateBusinessData("description", e.target.value)}
                  data-testid="textarea-description"
                />
              </div>
            </div>
          </GlassmorphismCard>
        </div>
      )}

      {/* Step 2: Buyer Questionnaire */}
      {currentStep === 2 && userType === "buyer" && (
        <div className="animate-slide-up">
          <GlassmorphismCard className="p-8 shadow-xl">
            <h2 className="font-poppins text-2xl font-semibold text-primary-900 mb-6">
              What are you looking to acquire?
            </h2>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="budget">Investment Budget</Label>
                  <Select onValueChange={(value) => updateBuyerData("budgetRange", value)}>
                    <SelectTrigger data-testid="select-budget">
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under_500k">Under $500K</SelectItem>
                      <SelectItem value="500k_1m">$500K - $1M</SelectItem>
                      <SelectItem value="1m_5m">$1M - $5M</SelectItem>
                      <SelectItem value="5m_10m">$5M - $10M</SelectItem>
                      <SelectItem value="over_10m">$10M+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="experience">Acquisition Experience</Label>
                  <Select onValueChange={(value) => updateBuyerData("experience", value)}>
                    <SelectTrigger data-testid="select-experience">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="first_time">First-time buyer</SelectItem>
                      <SelectItem value="some_experience">Some experience (1-3 deals)</SelectItem>
                      <SelectItem value="experienced">Experienced (4+ deals)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium mb-4 block">Preferred Industries (select all that apply)</Label>
                <div className="grid md:grid-cols-3 gap-3">
                  {[
                    "Technology", "Healthcare", "Retail", "Manufacturing", "Services", "Real Estate"
                  ].map((industry) => (
                    <label 
                      key={industry}
                      className="flex items-center space-x-2 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                      data-testid={`checkbox-industry-${industry.toLowerCase()}`}
                    >
                      <Checkbox
                        checked={buyerData.preferredIndustries?.includes(industry.toLowerCase()) || false}
                        onCheckedChange={(checked) => {
                          const current = buyerData.preferredIndustries || [];
                          const updated = checked 
                            ? [...current, industry.toLowerCase()]
                            : current.filter((i: string) => i !== industry.toLowerCase());
                          updateBuyerData("preferredIndustries", updated);
                        }}
                      />
                      <span>{industry}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="timeline">Preferred Timeline</Label>
                <Select onValueChange={(value) => updateBuyerData("timeline", value)}>
                  <SelectTrigger data-testid="select-timeline">
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30_days">Within 30 days</SelectItem>
                    <SelectItem value="90_days">Within 90 days</SelectItem>
                    <SelectItem value="6_months">Within 6 months</SelectItem>
                    <SelectItem value="flexible">Flexible timing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="focus">Investment Focus</Label>
                <Textarea
                  id="focus"
                  placeholder="Describe what you're looking for in an acquisition, your investment thesis, and any specific requirements..."
                  rows={4}
                  value={buyerData.investmentFocus || ""}
                  onChange={(e) => updateBuyerData("investmentFocus", e.target.value)}
                  data-testid="textarea-focus"
                />
              </div>

              <div>
                <Label className="text-base font-medium mb-4 block">Financial Readiness</Label>
                <div className="space-y-3">
                  {[
                    { key: "financing", label: "I have pre-approved financing in place" },
                    { key: "diligence", label: "I have conducted due diligence before" },
                    { key: "support", label: "I have legal and accounting support ready" },
                    { key: "quick", label: "I can move quickly on the right opportunity" },
                  ].map((item) => (
                    <label 
                      key={item.key}
                      className="flex items-center space-x-3"
                      data-testid={`checkbox-readiness-${item.key}`}
                    >
                      <Checkbox
                        checked={selectedFinancialReadiness.includes(item.key)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedFinancialReadiness([...selectedFinancialReadiness, item.key]);
                          } else {
                            setSelectedFinancialReadiness(selectedFinancialReadiness.filter(k => k !== item.key));
                          }
                          updateBuyerData("hasFinancing", selectedFinancialReadiness.includes("financing"));
                        }}
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </GlassmorphismCard>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {currentStep === 3 && (
        <div className="animate-slide-up">
          <GlassmorphismCard className="p-8 shadow-xl text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-success-500 to-success-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-check text-white text-3xl"></i>
            </div>
            <h2 className="font-poppins text-2xl font-semibold text-primary-900 mb-4" data-testid="text-confirmation-title">
              All Set! Let's Get Started
            </h2>
            <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
              Your profile is ready. We'll now use AI to find the perfect matches based on your preferences and requirements.
            </p>
            
            <div className="bg-primary-50 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-primary-900 mb-4">What happens next?</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i className="fas fa-robot text-white"></i>
                  </div>
                  <div className="font-medium text-primary-900">AI Analysis</div>
                  <div className="text-primary-700">We analyze your profile for optimal matching</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-success-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i className="fas fa-search text-white"></i>
                  </div>
                  <div className="font-medium text-primary-900">Smart Matching</div>
                  <div className="text-primary-700">Find qualified {userType === "seller" ? "buyers" : "businesses"} in your criteria</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i className="fas fa-handshake text-white"></i>
                  </div>
                  <div className="font-medium text-primary-900">Start Connecting</div>
                  <div className="text-primary-700">Begin conversations with potential matches</div>
                </div>
              </div>
            </div>
          </GlassmorphismCard>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-8">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="px-6 py-3"
          data-testid="button-previous"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Previous
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={!userType || isLoading}
          className="bg-gradient-to-r from-primary-600 to-success-600 px-8 py-3 shadow-lg hover:shadow-xl"
          data-testid="button-next"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Setting up...
            </>
          ) : currentStep === 3 ? (
            <>
              Complete Setup
              <i className="fas fa-check ml-2"></i>
            </>
          ) : (
            <>
              Continue
              <i className="fas fa-arrow-right ml-2"></i>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
