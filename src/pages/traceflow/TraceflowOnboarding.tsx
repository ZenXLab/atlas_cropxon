import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { 
  Activity, 
  ArrowRight, 
  ArrowLeft,
  Building2, 
  Users,
  Globe,
  Zap,
  Check,
  Crown,
  Sparkles,
  Shield,
  CreditCard,
  FileText,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

// Industry options
const industries = [
  { id: "ecommerce", label: "E-Commerce & Retail", icon: "🛒" },
  { id: "fintech", label: "FinTech & Banking", icon: "🏦" },
  { id: "healthcare", label: "Healthcare & Wellness", icon: "🏥" },
  { id: "saas", label: "SaaS & Technology", icon: "💻" },
  { id: "education", label: "Education & EdTech", icon: "🎓" },
  { id: "logistics", label: "Logistics & Supply Chain", icon: "🚚" },
  { id: "manufacturing", label: "Manufacturing & Industrial", icon: "🏭" },
  { id: "media", label: "Media & Entertainment", icon: "📺" },
  { id: "travel", label: "Travel & Hospitality", icon: "✈️" },
  { id: "other", label: "Other", icon: "🏢" },
];

// Company size options
const companySizes = [
  { id: "1-10", label: "1-10 employees", description: "Startup" },
  { id: "11-50", label: "11-50 employees", description: "Small Business" },
  { id: "51-200", label: "51-200 employees", description: "Mid-Market" },
  { id: "201-1000", label: "201-1000 employees", description: "Enterprise" },
  { id: "1000+", label: "1000+ employees", description: "Large Enterprise" },
];

// Use case options
const useCases = [
  { id: "session-replay", label: "Session Replay & Debugging", icon: "🎬" },
  { id: "analytics", label: "Product Analytics", icon: "📊" },
  { id: "ux-insights", label: "UX Intelligence & Heatmaps", icon: "🔥" },
  { id: "ai-insights", label: "AI-Powered Insights", icon: "🤖" },
  { id: "observability", label: "Experience Observability", icon: "👁️" },
  { id: "voice-fusion", label: "Voice + Session Fusion", icon: "🎤" },
];

// Pricing tiers
const pricingTiers = [
  {
    id: "starter",
    name: "Starter",
    price: "$499",
    period: "/month",
    description: "Perfect for growing teams",
    sessions: "50,000 sessions/mo",
    features: [
      "Session Replay",
      "Basic Analytics",
      "5 Team Members",
      "30-Day Retention",
      "Email Support",
    ],
    popular: false,
  },
  {
    id: "professional",
    name: "Professional",
    price: "$1,499",
    period: "/month",
    description: "For scaling organizations",
    sessions: "250,000 sessions/mo",
    features: [
      "Everything in Starter",
      "AI Session Summaries",
      "Heatmaps & Funnels",
      "25 Team Members",
      "90-Day Retention",
      "Priority Support",
      "API Access",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large-scale deployments",
    sessions: "Unlimited sessions",
    features: [
      "Everything in Professional",
      "NeuroRouter AI Engine",
      "Voice Fusion",
      "Unlimited Team Members",
      "Custom Retention",
      "SSO & SAML",
      "Dedicated Support",
      "SLA Guarantee",
    ],
    popular: false,
  },
];

// Steps
const steps = [
  { id: 1, title: "Industry & Company", icon: Building2 },
  { id: 2, title: "Use Cases", icon: Zap },
  { id: 3, title: "Choose Plan", icon: Crown },
  { id: 4, title: "Billing", icon: CreditCard },
];

export const TraceflowOnboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Form data
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [website, setWebsite] = useState("");
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([]);
  const [selectedPlan, setSelectedPlan] = useState("professional");

  // Check if user is ATLAS admin (skip billing)
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user?.id) {
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();

        if (data?.role === "admin") {
          setIsAdmin(true);
        }
      }
    };
    checkAdminStatus();
  }, [user]);

  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => {
    if (currentStep === 1 && (!industry || !companySize)) {
      toast.error("Please complete all required fields");
      return;
    }
    if (currentStep === 2 && selectedUseCases.length === 0) {
      toast.error("Please select at least one use case");
      return;
    }
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleUseCase = (id: string) => {
    setSelectedUseCases(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // Save onboarding data
      const { error } = await supabase.from("traceflow_subscriptions").insert({
        user_id: user?.id,
        plan: selectedPlan,
        status: isAdmin ? "active" : "pending_payment",
        industry,
        company_size: companySize,
        website,
        use_cases: selectedUseCases,
      });

      if (error) throw error;

      if (isAdmin) {
        toast.success("Setup complete! Welcome to TRACEFLOW.");
        navigate("/traceflow/dashboard");
      } else {
        // Redirect to payment
        toast.success("Redirecting to secure payment...");
        navigate("/traceflow/billing", { 
          state: { plan: selectedPlan, industry, companySize } 
        });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to complete setup");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#0B3D91]/20 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B3D91] to-[#00C2D8] flex items-center justify-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg text-white">TRACEFLOW</span>
                <p className="text-xs text-slate-400">Setup Wizard</p>
              </div>
            </div>
            {isAdmin && (
              <Badge className="bg-[#FF8A00]/20 text-[#FF8A00] border-[#FF8A00]/30">
                <Crown className="h-3 w-3 mr-1" />
                Admin Access
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className={cn(
                "flex items-center gap-2",
                currentStep >= step.id ? "text-white" : "text-slate-500"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                currentStep > step.id 
                  ? "bg-emerald-500 text-white"
                  : currentStep === step.id
                  ? "bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] text-white"
                  : "bg-slate-700 text-slate-400"
              )}>
                {currentStep > step.id ? <Check className="h-4 w-4" /> : step.id}
              </div>
              <span className="hidden sm:block text-sm font-medium">{step.title}</span>
              {index < steps.length - 1 && (
                <div className={cn(
                  "hidden sm:block w-12 h-px mx-2",
                  currentStep > step.id ? "bg-emerald-500" : "bg-slate-700"
                )} />
              )}
            </div>
          ))}
        </div>
        <Progress value={progress} className="h-1 bg-slate-800" />
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Step 1: Industry & Company */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Tell us about your company</h2>
              <p className="text-slate-400">This helps us customize your experience</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Label className="text-white text-lg">Industry</Label>
                <div className="grid grid-cols-2 gap-2">
                  {industries.map((ind) => (
                    <button
                      key={ind.id}
                      onClick={() => setIndustry(ind.id)}
                      className={cn(
                        "p-3 rounded-lg border text-left transition-all",
                        industry === ind.id
                          ? "bg-[#0B3D91]/30 border-[#00C2D8] text-white"
                          : "bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600"
                      )}
                    >
                      <span className="mr-2">{ind.icon}</span>
                      <span className="text-sm">{ind.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-white text-lg">Company Size</Label>
                  <RadioGroup value={companySize} onValueChange={setCompanySize}>
                    {companySizes.map((size) => (
                      <div
                        key={size.id}
                        className={cn(
                          "flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all",
                          companySize === size.id
                            ? "bg-[#0B3D91]/30 border-[#00C2D8]"
                            : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                        )}
                        onClick={() => setCompanySize(size.id)}
                      >
                        <RadioGroupItem value={size.id} id={size.id} />
                        <div>
                          <Label htmlFor={size.id} className="text-white cursor-pointer">{size.label}</Label>
                          <p className="text-xs text-slate-400">{size.description}</p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Website (Optional)</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                      placeholder="https://yourcompany.com"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="pl-10 bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Use Cases */}
        {currentStep === 2 && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">What do you want to achieve?</h2>
              <p className="text-slate-400">Select all that apply</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {useCases.map((useCase) => (
                <button
                  key={useCase.id}
                  onClick={() => toggleUseCase(useCase.id)}
                  className={cn(
                    "p-6 rounded-xl border text-left transition-all",
                    selectedUseCases.includes(useCase.id)
                      ? "bg-[#0B3D91]/30 border-[#00C2D8] shadow-lg shadow-[#00C2D8]/10"
                      : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{useCase.icon}</span>
                    <Checkbox 
                      checked={selectedUseCases.includes(useCase.id)}
                      className="data-[state=checked]:bg-[#00C2D8] data-[state=checked]:border-[#00C2D8]"
                    />
                  </div>
                  <h3 className="text-white font-medium">{useCase.label}</h3>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Choose Plan */}
        {currentStep === 3 && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Choose your plan</h2>
              <p className="text-slate-400">
                {isAdmin ? "Admin access - All features unlocked" : "Scale as you grow"}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {pricingTiers.map((tier) => (
                <Card
                  key={tier.id}
                  className={cn(
                    "relative cursor-pointer transition-all",
                    selectedPlan === tier.id
                      ? "bg-[#0B3D91]/30 border-[#00C2D8] shadow-lg shadow-[#00C2D8]/10"
                      : "bg-slate-800/50 border-slate-700 hover:border-slate-600",
                    tier.popular && "ring-2 ring-[#FF8A00]"
                  )}
                  onClick={() => setSelectedPlan(tier.id)}
                >
                  {tier.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF8A00] text-white">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader className="pb-4">
                    <CardTitle className="text-white flex items-center gap-2">
                      {tier.name}
                      {selectedPlan === tier.id && (
                        <Check className="h-5 w-5 text-[#00C2D8]" />
                      )}
                    </CardTitle>
                    <CardDescription className="text-slate-400">{tier.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <span className="text-3xl font-bold text-white">{tier.price}</span>
                      <span className="text-slate-400">{tier.period}</span>
                    </div>
                    <p className="text-sm text-[#00C2D8]">{tier.sessions}</p>
                    <ul className="space-y-2">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                          <Check className="h-4 w-4 text-emerald-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Billing */}
        {currentStep === 4 && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">
                {isAdmin ? "Confirm Setup" : "Billing Information"}
              </h2>
              <p className="text-slate-400">
                {isAdmin 
                  ? "Review your selections and complete setup"
                  : "Secure payment processing"}
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-slate-700">
                    <span className="text-slate-400">Selected Plan</span>
                    <span className="text-white font-medium capitalize">{selectedPlan}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-700">
                    <span className="text-slate-400">Industry</span>
                    <span className="text-white">{industries.find(i => i.id === industry)?.label}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-700">
                    <span className="text-slate-400">Company Size</span>
                    <span className="text-white">{companySize}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-400">Use Cases</span>
                    <span className="text-white">{selectedUseCases.length} selected</span>
                  </div>

                  {isAdmin ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 mt-6">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <Shield className="h-5 w-5" />
                        <span className="font-medium">Admin Access Granted</span>
                      </div>
                      <p className="text-sm text-emerald-300/80 mt-1">
                        Payment step skipped for ATLAS administrators
                      </p>
                    </div>
                  ) : (
                    <div className="bg-[#0B3D91]/10 border border-[#0B3D91]/30 rounded-lg p-4 mt-6">
                      <div className="flex items-center gap-2 text-[#00C2D8]">
                        <CreditCard className="h-5 w-5" />
                        <span className="font-medium">Secure Payment</span>
                      </div>
                      <p className="text-sm text-slate-400 mt-1">
                        You'll be redirected to our secure payment portal
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {currentStep < steps.length ? (
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-[#0B3D91] to-[#00C2D8]"
            >
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={isLoading}
              className="bg-gradient-to-r from-[#0B3D91] to-[#00C2D8]"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              {isAdmin ? "Complete Setup" : "Proceed to Payment"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TraceflowOnboarding;
