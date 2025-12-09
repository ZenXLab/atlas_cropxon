import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  Activity, 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Mail, 
  KeyRound,
  Building2,
  Crown,
  CheckCircle,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

// SSO Providers
const ssoProviders = [
  { id: "google", name: "Google Workspace", icon: "/google-icon.svg", color: "bg-white hover:bg-gray-50 border border-gray-200" },
  { id: "microsoft", name: "Microsoft Entra ID", icon: "/microsoft-icon.svg", color: "bg-[#2F2F2F] hover:bg-[#1F1F1F] text-white" },
  { id: "okta", name: "Okta", icon: "/okta-icon.svg", color: "bg-[#007DC1] hover:bg-[#006AA8] text-white" },
];

// Security features displayed
const securityFeatures = [
  { icon: Shield, text: "SOC 2 Type II Certified" },
  { icon: Lock, text: "256-bit AES Encryption" },
  { icon: CheckCircle, text: "GDPR & HIPAA Compliant" },
];

export const TraceflowAuth = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSSOOptions, setShowSSOOptions] = useState(false);
  
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if user has ATLAS Admin role (skip payment)
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user?.id)
        .single();

      if (roleData?.role === "admin") {
        toast.success("Welcome back, Admin!");
        navigate("/traceflow/dashboard");
      } else {
        // Check if user has active subscription
        const { data: subscription } = await supabase
          .from("traceflow_subscriptions")
          .select("*")
          .eq("user_id", data.user?.id)
          .eq("status", "active")
          .single();

        if (subscription) {
          navigate("/traceflow/dashboard");
        } else {
          navigate("/traceflow/onboarding");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword || !fullName || !companyName) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/traceflow/onboarding`,
          data: {
            full_name: fullName,
            company_name: companyName,
          },
        },
      });

      if (error) throw error;

      toast.success("Account created! Redirecting to setup...");
      navigate("/traceflow/onboarding");
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSSOLogin = async (provider: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: {
          redirectTo: `${window.location.origin}/traceflow/onboarding`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || `Failed to sign in with ${provider}`);
      setIsLoading(false);
    }
  };

  const handleSAMLLogin = () => {
    toast.info("Enterprise SAML SSO requires configuration. Contact sales@cropxon.com");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#0B3D91]/20 to-slate-900 flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0B3D91] to-[#00C2D8] p-12 flex-col justify-between relative overflow-hidden">
        {/* Animated background patterns */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-white/50 animate-pulse"
              style={{
                top: `${10 + i * 10}%`,
                left: 0,
                right: 0,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <Link to="/traceflow" className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Activity className="h-7 w-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">TRACEFLOW</span>
                <Crown className="h-5 w-5 text-[#FF8A00]" />
              </div>
              <span className="text-xs text-white/70">Digital Experience Intelligence</span>
            </div>
          </Link>

          <h1 className="text-4xl font-bold text-white mb-4">
            Every Signal.<br />One Intelligence.
          </h1>
          <p className="text-white/80 text-lg max-w-md">
            Unify clickstream, observability, and multi-modal feedback into a single AI-powered platform.
          </p>
        </div>

        {/* Security Badges */}
        <div className="relative z-10 space-y-4">
          <p className="text-white/60 text-sm uppercase tracking-wider">Security & Trust</p>
          <div className="flex flex-wrap gap-3">
            {securityFeatures.map((feature, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2"
              >
                <feature.icon className="h-4 w-4 text-white/80" />
                <span className="text-white/90 text-sm">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <Card className="w-full max-w-md bg-slate-800/50 backdrop-blur-xl border-slate-700/50 shadow-2xl">
          <CardHeader className="text-center pb-4">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B3D91] to-[#00C2D8] flex items-center justify-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">TRACEFLOW</span>
            </div>
            
            <CardTitle className="text-2xl text-white">
              {activeTab === "signin" ? "Welcome Back" : "Get Started"}
            </CardTitle>
            <CardDescription className="text-slate-400">
              {activeTab === "signin" 
                ? "Sign in to access your dashboard" 
                : "Create your enterprise account"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
              <TabsList className="grid w-full grid-cols-2 bg-slate-700/50">
                <TabsTrigger value="signin" className="data-[state=active]:bg-[#0B3D91] data-[state=active]:text-white">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-[#0B3D91] data-[state=active]:text-white">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              {/* Sign In Tab */}
              <TabsContent value="signin" className="space-y-4 mt-6">
                <form onSubmit={handleEmailSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <Input
                        type="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-slate-300">Password</Label>
                      <Link to="/reset-password" className="text-xs text-[#00C2D8] hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] hover:opacity-90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </TabsContent>

              {/* Sign Up Tab */}
              <TabsContent value="signup" className="space-y-4 mt-6">
                <form onSubmit={handleEmailSignUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Full Name</Label>
                      <Input
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Company</Label>
                      <Input
                        placeholder="Acme Inc"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Work Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <Input
                        type="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Password</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Min. 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Confirm Password</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] hover:opacity-90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* SSO Section */}
            <div className="space-y-4">
              <div className="relative">
                <Separator className="bg-slate-700" />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-800 px-3 text-xs text-slate-500">
                  or continue with
                </span>
              </div>

              {/* SSO Buttons */}
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSSOLogin("google")}
                  className="w-full bg-white hover:bg-gray-50 text-gray-800 border-gray-200"
                  disabled={isLoading}
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google Workspace
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSSOLogin("azure")}
                  className="w-full bg-[#2F2F2F] hover:bg-[#1F1F1F] text-white border-transparent"
                  disabled={isLoading}
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 21 21">
                    <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                    <rect x="11" y="1" width="9" height="9" fill="#00a4ef"/>
                    <rect x="1" y="11" width="9" height="9" fill="#7fba00"/>
                    <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
                  </svg>
                  Microsoft Entra ID
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowSSOOptions(!showSSOOptions)}
                  className="w-full bg-slate-700/50 hover:bg-slate-700 text-slate-300 border-slate-600"
                  disabled={isLoading}
                >
                  <Building2 className="h-5 w-5 mr-2" />
                  Enterprise SSO (SAML/OIDC)
                </Button>
              </div>

              {showSSOOptions && (
                <div className="bg-slate-700/30 rounded-lg p-4 space-y-3 animate-fade-in">
                  <p className="text-sm text-slate-400">
                    Enterprise SSO with custom SAML or OIDC providers
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSAMLLogin}
                    className="w-full bg-slate-700/50 hover:bg-slate-700 text-slate-300 border-slate-600"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Configure SAML SSO
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.info("Contact sales@cropxon.com for Okta setup")}
                    className="w-full bg-[#007DC1] hover:bg-[#006AA8] text-white border-transparent"
                  >
                    Okta Integration
                  </Button>
                </div>
              )}
            </div>

            {/* Terms */}
            <p className="text-xs text-center text-slate-500">
              By continuing, you agree to our{" "}
              <Link to="/terms" className="text-[#00C2D8] hover:underline">Terms of Service</Link>
              {" "}and{" "}
              <Link to="/privacy" className="text-[#00C2D8] hover:underline">Privacy Policy</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TraceflowAuth;
