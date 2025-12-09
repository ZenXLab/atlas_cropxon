import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
import { NetworkBackground } from "@/components/NetworkBackground";
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
  Loader2,
  MousePointerClick,
  BarChart3,
  Eye,
  Brain,
  Mic,
  Layers,
  Rocket
} from "lucide-react";
import { cn } from "@/lib/utils";

// Industry options with better icons
const industries = [
  { id: "ecommerce", label: "E-Commerce & Retail", icon: "🛒", color: "from-orange-500 to-amber-500" },
  { id: "fintech", label: "FinTech & Banking", icon: "🏦", color: "from-emerald-500 to-teal-500" },
  { id: "healthcare", label: "Healthcare & Wellness", icon: "🏥", color: "from-red-500 to-pink-500" },
  { id: "saas", label: "SaaS & Technology", icon: "💻", color: "from-blue-500 to-cyan-500" },
  { id: "education", label: "Education & EdTech", icon: "🎓", color: "from-purple-500 to-violet-500" },
  { id: "logistics", label: "Logistics & Supply Chain", icon: "🚚", color: "from-yellow-500 to-orange-500" },
  { id: "manufacturing", label: "Manufacturing & Industrial", icon: "🏭", color: "from-slate-500 to-zinc-500" },
  { id: "media", label: "Media & Entertainment", icon: "📺", color: "from-pink-500 to-rose-500" },
  { id: "travel", label: "Travel & Hospitality", icon: "✈️", color: "from-sky-500 to-blue-500" },
  { id: "other", label: "Other", icon: "🏢", color: "from-gray-500 to-slate-500" },
];

// Company size options
const companySizes = [
  { id: "1-10", label: "1-10 employees", description: "Startup", icon: "🚀" },
  { id: "11-50", label: "11-50 employees", description: "Small Business", icon: "📈" },
  { id: "51-200", label: "51-200 employees", description: "Mid-Market", icon: "🏢" },
  { id: "201-1000", label: "201-1000 employees", description: "Enterprise", icon: "🏛️" },
  { id: "1000+", label: "1000+ employees", description: "Large Enterprise", icon: "🌐" },
];

// Use case options with Lucide icons
const useCases = [
  { id: "session-replay", label: "Session Replay & Debugging", description: "Watch real user sessions", icon: MousePointerClick, color: "from-blue-500 to-cyan-500" },
  { id: "analytics", label: "Product Analytics", description: "Track key metrics & events", icon: BarChart3, color: "from-green-500 to-emerald-500" },
  { id: "ux-insights", label: "UX Intelligence & Heatmaps", description: "Visualize user behavior", icon: Eye, color: "from-orange-500 to-amber-500" },
  { id: "ai-insights", label: "AI-Powered Insights", description: "Automated analysis", icon: Brain, color: "from-purple-500 to-violet-500" },
  { id: "observability", label: "Experience Observability", description: "Frontend + backend correlation", icon: Layers, color: "from-red-500 to-pink-500" },
  { id: "voice-fusion", label: "Voice + Session Fusion", description: "Link calls to sessions", icon: Mic, color: "from-indigo-500 to-blue-500" },
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
    gradient: "from-blue-500 to-cyan-500",
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
    gradient: "from-primary to-accent",
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
    gradient: "from-amber-500 to-orange-500",
  },
];

// Steps
const steps = [
  { id: 1, title: "Industry & Company", icon: Building2 },
  { id: 2, title: "Use Cases", icon: Zap },
  { id: 3, title: "Choose Plan", icon: Crown },
  { id: 4, title: "Confirm", icon: Rocket },
];

// Floating orbs animation
const FloatingOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(4)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-72 h-72 rounded-full opacity-10"
        style={{
          background: `radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)`,
          left: `${20 + i * 25}%`,
          top: `${10 + (i % 2) * 60}%`,
        }}
        animate={{
          x: [0, 20, -20, 0],
          y: [0, -20, 20, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 10 + i * 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

// Animated particles
const Particles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(30)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-primary/30 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -30, 0],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 3,
        }}
      />
    ))}
  </div>
);

export const TraceflowOnboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // DEV MODE check
  const isDevMode = localStorage.getItem("TRACEFLOW_DEV_MODE") === "true";
  
  // DEV MODE: Skip to dashboard
  const handleDevSkip = () => {
    toast.success("Dev Mode: Skipping to dashboard...");
    navigate("/traceflow/dashboard");
  };

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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <NetworkBackground />
      <FloatingOrbs />
      <Particles />

      {/* Header */}
      <motion.div 
        className="border-b border-border bg-card/80 backdrop-blur-xl sticky top-0 z-40"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/traceflow" className="flex items-center gap-3">
              <motion.div 
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"
                animate={{ 
                  boxShadow: [
                    "0 0 15px hsl(var(--primary) / 0.3)",
                    "0 0 25px hsl(var(--primary) / 0.5)",
                    "0 0 15px hsl(var(--primary) / 0.3)",
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Activity className="h-5 w-5 text-primary-foreground" />
              </motion.div>
              <div>
                <span className="font-bold text-lg text-foreground">TRACEFLOW</span>
                <p className="text-xs text-muted-foreground">Setup Wizard</p>
              </div>
            </Link>
            {isAdmin && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
              >
                <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30">
                  <Crown className="h-3 w-3 mr-1" />
                  Admin Access
                </Badge>
              </motion.div>
            )}
            {/* DEV MODE Skip Button */}
            {isDevMode && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDevSkip}
                className="border-dashed border-yellow-500/50 text-yellow-600 hover:bg-yellow-500/10"
              >
                <Zap className="h-3 w-3 mr-1" />
                Skip to Dashboard (Dev)
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Progress Steps */}
      <div className="max-w-5xl mx-auto px-4 py-6 relative z-10">
        <motion.div 
          className="flex items-center justify-between mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {steps.map((step, index) => (
            <motion.div 
              key={step.id}
              className={cn(
                "flex items-center gap-2",
                currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
              )}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                  currentStep > step.id 
                    ? "bg-emerald-500 text-white"
                    : currentStep === step.id
                    ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/30"
                    : "bg-muted text-muted-foreground"
                )}
                animate={currentStep === step.id ? {
                  scale: [1, 1.05, 1],
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {currentStep > step.id ? <Check className="h-4 w-4" /> : <step.icon className="h-4 w-4" />}
              </motion.div>
              <span className="hidden sm:block text-sm font-medium">{step.title}</span>
              {index < steps.length - 1 && (
                <motion.div 
                  className={cn(
                    "hidden sm:block w-16 h-0.5 mx-2 rounded-full",
                    currentStep > step.id ? "bg-emerald-500" : "bg-muted"
                  )}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                />
              )}
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Progress value={progress} className="h-1.5 bg-muted" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8 relative z-10">
        <AnimatePresence mode="wait">
          {/* Step 1: Industry & Company */}
          {currentStep === 1 && (
            <motion.div 
              key="step1"
              className="space-y-8"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1 }}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center"
                >
                  <Building2 className="h-8 w-8 text-primary-foreground" />
                </motion.div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Tell us about your company</h2>
                <p className="text-muted-foreground">This helps us customize your experience</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Label className="text-foreground text-lg font-semibold">Industry</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {industries.map((ind, i) => (
                      <motion.button
                        key={ind.id}
                        onClick={() => setIndustry(ind.id)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.03 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          "p-4 rounded-xl border text-left transition-all relative overflow-hidden",
                          industry === ind.id
                            ? "bg-primary/10 border-primary shadow-lg shadow-primary/20"
                            : "bg-card/50 border-border hover:border-primary/50"
                        )}
                      >
                        {industry === ind.id && (
                          <motion.div
                            className={cn("absolute inset-0 bg-gradient-to-r opacity-10", ind.color)}
                            layoutId="industry-bg"
                          />
                        )}
                        <div className="relative z-10 flex items-center gap-3">
                          <span className="text-2xl">{ind.icon}</span>
                          <span className="text-sm font-medium text-foreground">{ind.label}</span>
                        </div>
                        {industry === ind.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2"
                          >
                            <Check className="h-4 w-4 text-primary" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                <motion.div 
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="space-y-4">
                    <Label className="text-foreground text-lg font-semibold">Company Size</Label>
                    <RadioGroup value={companySize} onValueChange={setCompanySize}>
                      {companySizes.map((size, i) => (
                        <motion.div
                          key={size.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + i * 0.05 }}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className={cn(
                            "flex items-center space-x-3 p-4 rounded-xl border cursor-pointer transition-all",
                            companySize === size.id
                              ? "bg-primary/10 border-primary shadow-lg shadow-primary/20"
                              : "bg-card/50 border-border hover:border-primary/50"
                          )}
                          onClick={() => setCompanySize(size.id)}
                        >
                          <RadioGroupItem value={size.id} id={size.id} />
                          <span className="text-xl">{size.icon}</span>
                          <div className="flex-1">
                            <Label htmlFor={size.id} className="text-foreground cursor-pointer font-medium">{size.label}</Label>
                            <p className="text-xs text-muted-foreground">{size.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </RadioGroup>
                  </div>

                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Label className="text-foreground">Website (Optional)</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="https://yourcompany.com"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="pl-10 bg-muted/50 border-border text-foreground"
                      />
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Use Cases */}
          {currentStep === 2 && (
            <motion.div 
              key="step2"
              className="space-y-8"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1 }}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center"
                >
                  <Zap className="h-8 w-8 text-primary-foreground" />
                </motion.div>
                <h2 className="text-3xl font-bold text-foreground mb-2">What do you want to achieve?</h2>
                <p className="text-muted-foreground">Select all that apply - we'll customize your dashboard</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {useCases.map((useCase, i) => (
                  <motion.button
                    key={useCase.id}
                    onClick={() => toggleUseCase(useCase.id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "p-6 rounded-xl border text-left transition-all relative overflow-hidden group",
                      selectedUseCases.includes(useCase.id)
                        ? "bg-primary/10 border-primary shadow-xl shadow-primary/20"
                        : "bg-card/50 border-border hover:border-primary/50"
                    )}
                  >
                    {selectedUseCases.includes(useCase.id) && (
                      <motion.div
                        className={cn("absolute inset-0 bg-gradient-to-br opacity-10", useCase.color)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.1 }}
                      />
                    )}
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <motion.div
                          className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br",
                            useCase.color
                          )}
                          animate={selectedUseCases.includes(useCase.id) ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <useCase.icon className="h-6 w-6 text-white" />
                        </motion.div>
                        <div className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                          selectedUseCases.includes(useCase.id)
                            ? "bg-primary border-primary"
                            : "border-muted-foreground"
                        )}>
                          {selectedUseCases.includes(useCase.id) && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                            >
                              <Check className="h-4 w-4 text-primary-foreground" />
                            </motion.div>
                          )}
                        </div>
                      </div>
                      <h3 className="text-foreground font-semibold mb-1">{useCase.label}</h3>
                      <p className="text-sm text-muted-foreground">{useCase.description}</p>
                    </div>
                  </motion.button>
                ))}
              </div>

              {selectedUseCases.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                    <Sparkles className="h-3 w-3 mr-1" />
                    {selectedUseCases.length} feature{selectedUseCases.length > 1 ? 's' : ''} selected
                  </Badge>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Step 3: Choose Plan */}
          {currentStep === 3 && (
            <motion.div 
              key="step3"
              className="space-y-8"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1 }}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 mx-auto mb-4 flex items-center justify-center"
                >
                  <Crown className="h-8 w-8 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Choose your plan</h2>
                <p className="text-muted-foreground">
                  {isAdmin ? "Admin access - All features unlocked" : "Scale as you grow. Cancel anytime."}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {pricingTiers.map((tier, i) => (
                  <motion.div
                    key={tier.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card
                      className={cn(
                        "relative cursor-pointer transition-all h-full",
                        selectedPlan === tier.id
                          ? "bg-primary/5 border-primary shadow-2xl shadow-primary/20"
                          : "bg-card/50 border-border hover:border-primary/50",
                        tier.popular && "ring-2 ring-amber-500"
                      )}
                      onClick={() => setSelectedPlan(tier.id)}
                    >
                      {tier.popular && (
                        <motion.div
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          className="absolute -top-3 left-1/2 -translate-x-1/2"
                        >
                          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Most Popular
                          </Badge>
                        </motion.div>
                      )}
                      
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-foreground text-xl">{tier.name}</CardTitle>
                          {selectedPlan === tier.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                            >
                              <Check className="h-4 w-4 text-primary-foreground" />
                            </motion.div>
                          )}
                        </div>
                        <CardDescription className="text-muted-foreground">{tier.description}</CardDescription>
                      </CardHeader>
                      
                      <CardContent className="space-y-6">
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold text-foreground">{tier.price}</span>
                          <span className="text-muted-foreground">{tier.period}</span>
                        </div>
                        
                        <div className={cn(
                          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r text-white",
                          tier.gradient
                        )}>
                          <Activity className="h-3 w-3" />
                          {tier.sessions}
                        </div>
                        
                        <ul className="space-y-3">
                          {tier.features.map((feature, idx) => (
                            <motion.li 
                              key={idx} 
                              className="flex items-center gap-2 text-sm text-muted-foreground"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 + idx * 0.05 }}
                            >
                              <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                <Check className="h-3 w-3 text-emerald-500" />
                              </div>
                              {feature}
                            </motion.li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4: Confirm */}
          {currentStep === 4 && (
            <motion.div 
              key="step4"
              className="space-y-8"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1 }}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 mx-auto mb-4 flex items-center justify-center"
                >
                  <Rocket className="h-8 w-8 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  {isAdmin ? "Ready to Launch!" : "Review & Confirm"}
                </h2>
                <p className="text-muted-foreground">
                  {isAdmin 
                    ? "Your admin access is ready. Click below to enter the dashboard."
                    : "Review your selections before proceeding to payment."}
                </p>
              </div>

              <motion.div 
                className="max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-card/80 backdrop-blur-xl border-border/50 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Setup Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Selected industry */}
                    <motion.div 
                      className="flex items-center justify-between py-3 border-b border-border"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <span className="text-muted-foreground">Industry</span>
                      <span className="text-foreground font-medium flex items-center gap-2">
                        {industries.find(i => i.id === industry)?.icon}
                        {industries.find(i => i.id === industry)?.label}
                      </span>
                    </motion.div>

                    {/* Company size */}
                    <motion.div 
                      className="flex items-center justify-between py-3 border-b border-border"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 }}
                    >
                      <span className="text-muted-foreground">Company Size</span>
                      <span className="text-foreground font-medium">
                        {companySizes.find(s => s.id === companySize)?.label}
                      </span>
                    </motion.div>

                    {/* Use cases */}
                    <motion.div 
                      className="py-3 border-b border-border"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <span className="text-muted-foreground block mb-3">Selected Features</span>
                      <div className="flex flex-wrap gap-2">
                        {selectedUseCases.map((uc) => {
                          const useCase = useCases.find(u => u.id === uc);
                          return (
                            <Badge 
                              key={uc} 
                              variant="outline" 
                              className="bg-primary/10 border-primary/30 text-foreground"
                            >
                              {useCase?.label}
                            </Badge>
                          );
                        })}
                      </div>
                    </motion.div>

                    {/* Selected plan */}
                    <motion.div 
                      className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-r",
                            pricingTiers.find(t => t.id === selectedPlan)?.gradient
                          )}>
                            <Crown className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">
                              {pricingTiers.find(t => t.id === selectedPlan)?.name} Plan
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {pricingTiers.find(t => t.id === selectedPlan)?.sessions}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-foreground">
                            {pricingTiers.find(t => t.id === selectedPlan)?.price}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {pricingTiers.find(t => t.id === selectedPlan)?.period}
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {isAdmin && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-center"
                      >
                        <Crown className="h-6 w-6 text-amber-500 mx-auto mb-2" />
                        <p className="text-amber-700 dark:text-amber-300 font-medium">
                          Admin Access Enabled
                        </p>
                        <p className="text-sm text-amber-600 dark:text-amber-400">
                          Full platform access without payment required
                        </p>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <motion.div 
          className="flex items-center justify-between mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            {currentStep < steps.length ? (
              <Button
                onClick={handleNext}
                className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/30"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={isLoading}
                className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 text-white shadow-lg shadow-emerald-500/30"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Rocket className="h-4 w-4" />
                    {isAdmin ? "Launch Dashboard" : "Proceed to Payment"}
                  </>
                )}
              </Button>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default TraceflowOnboarding;
