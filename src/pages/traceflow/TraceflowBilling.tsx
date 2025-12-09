import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { NetworkBackground } from "@/components/NetworkBackground";
import { 
  Activity, 
  CreditCard, 
  Building2,
  Shield,
  Lock,
  CheckCircle,
  Loader2,
  FileText,
  ArrowLeft,
  Sparkles,
  Zap,
  Crown,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";

// Plan pricing details
const planPricing: Record<string, { name: string; price: number; sessions: string; color: string }> = {
  starter: { name: "Starter", price: 499, sessions: "50,000 sessions/mo", color: "from-blue-500 to-cyan-500" },
  professional: { name: "Professional", price: 1499, sessions: "250,000 sessions/mo", color: "from-primary to-accent" },
  enterprise: { name: "Enterprise", price: 0, sessions: "Unlimited", color: "from-amber-500 to-orange-500" },
};

// Payment methods
const paymentMethods = [
  { id: "card", label: "Credit/Debit Card", icon: CreditCard, description: "Instant activation" },
  { id: "bank", label: "Bank Transfer", icon: Building2, description: "1-2 business days" },
  { id: "invoice", label: "Invoice (NET 30)", icon: FileText, description: "Enterprise billing" },
];

// Animated pulse ring component
const PulseRing = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-primary/20 rounded-full"
        initial={{ width: 100, height: 100, opacity: 0.5 }}
        animate={{
          width: [100, 400],
          height: [100, 400],
          opacity: [0.5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: i * 1,
          ease: "easeOut",
        }}
      />
    ))}
  </div>
);

// Animated floating particles
const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-primary/40 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [-20, 20],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 2,
        }}
      />
    ))}
  </div>
);

export const TraceflowBilling = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);

  // Get plan from navigation state
  const { plan, industry, companySize } = location.state || { 
    plan: "professional", 
    industry: "", 
    companySize: "" 
  };

  const selectedPlan = planPricing[plan] || planPricing.professional;
  const taxRate = 0.18; // 18% GST for India
  const subtotal = selectedPlan.price;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  // Card form state
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");

  // Billing address
  const [billingName, setBillingName] = useState("");
  const [billingEmail, setBillingEmail] = useState(user?.email || "");
  const [billingAddress, setBillingAddress] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingCountry, setBillingCountry] = useState("");
  const [billingGst, setBillingGst] = useState("");

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handlePayment = async () => {
    if (paymentMethod === "card" && (!cardNumber || !cardExpiry || !cardCvv || !cardName)) {
      toast.error("Please fill in all card details");
      return;
    }

    if (!billingName || !billingEmail || !billingAddress) {
      toast.error("Please complete billing information");
      return;
    }

    setIsLoading(true);
    setIsProcessing(true);
    
    try {
      // Create invoice record
      const invoiceNumber = `TF-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      const { data: invoice, error: invoiceError } = await supabase
        .from("traceflow_invoices")
        .insert({
          user_id: user?.id,
          invoice_number: invoiceNumber,
          plan,
          subtotal,
          tax,
          total,
          billing_name: billingName,
          billing_email: billingEmail,
          billing_address: billingAddress,
          billing_city: billingCity,
          billing_country: billingCountry,
          billing_gst: billingGst,
          payment_method: paymentMethod,
          status: paymentMethod === "invoice" ? "pending" : "processing",
        })
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // Update subscription status
      await supabase
        .from("traceflow_subscriptions")
        .update({ 
          status: paymentMethod === "invoice" ? "pending_payment" : "active",
          invoice_id: invoice.id 
        })
        .eq("user_id", user?.id);

      if (paymentMethod === "invoice") {
        toast.success("Invoice generated! Check your email for payment details.");
      } else {
        // Simulate payment processing with animation
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        await supabase
          .from("traceflow_invoices")
          .update({ status: "paid", paid_at: new Date().toISOString() })
          .eq("id", invoice.id);

        await supabase
          .from("traceflow_subscriptions")
          .update({ status: "active" })
          .eq("user_id", user?.id);

        toast.success("Payment successful! Welcome to TRACEFLOW.");
      }

      navigate("/traceflow/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <NetworkBackground />
      <FloatingParticles />
      <PulseRing />

      {/* Processing Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            className="fixed inset-0 bg-background/90 backdrop-blur-xl z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center space-y-6">
              <motion.div
                className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-accent mx-auto flex items-center justify-center"
                animate={{ 
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    "0 0 0 0 hsl(var(--primary) / 0.4)",
                    "0 0 0 30px hsl(var(--primary) / 0)",
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Lock className="h-10 w-10 text-primary-foreground" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-2xl font-bold text-foreground">Processing Payment</h3>
                <p className="text-muted-foreground mt-2">Securing your transaction...</p>
              </motion.div>
              <motion.div
                className="flex items-center justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-primary rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div 
        className="border-b border-border bg-card/80 backdrop-blur-xl sticky top-0 z-40"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(-1)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </motion.div>
              <Link to="/" className="flex items-center gap-3">
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
                  <p className="text-xs text-muted-foreground">Secure Checkout</p>
                </div>
              </Link>
            </div>
            <motion.div 
              className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Lock className="h-4 w-4 text-emerald-500" />
              <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">256-bit SSL Encrypted</span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <motion.div 
            className="lg:col-span-2 space-y-6"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Payment Method Selection */}
            <Card className="bg-card/80 backdrop-blur-xl border-border/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Payment Method
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Choose how you'd like to pay
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="grid grid-cols-3 gap-4">
                    {paymentMethods.map((method) => (
                      <motion.div
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          "flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all",
                          paymentMethod === method.id
                            ? "bg-primary/10 border-primary shadow-lg shadow-primary/20"
                            : "bg-muted/30 border-border hover:border-primary/50"
                        )}
                      >
                        <RadioGroupItem value={method.id} id={method.id} className="sr-only" />
                        <motion.div
                          animate={paymentMethod === method.id ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ duration: 0.3 }}
                        >
                          <method.icon className={cn(
                            "h-6 w-6",
                            paymentMethod === method.id ? "text-primary" : "text-muted-foreground"
                          )} />
                        </motion.div>
                        <Label 
                          htmlFor={method.id} 
                          className={cn(
                            "text-sm cursor-pointer text-center font-medium",
                            paymentMethod === method.id ? "text-foreground" : "text-muted-foreground"
                          )}
                        >
                          {method.label}
                        </Label>
                        <span className="text-xs text-muted-foreground">{method.description}</span>
                      </motion.div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Card Details */}
            <AnimatePresence mode="wait">
              {paymentMethod === "card" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Card className="bg-card/80 backdrop-blur-xl border-border/50 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-foreground flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-primary" />
                        Card Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-foreground">Card Number</Label>
                        <Input
                          placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          maxLength={19}
                          className="bg-muted/50 border-border text-foreground text-lg tracking-widest"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-foreground">Expiry Date</Label>
                          <Input
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                            maxLength={5}
                            className="bg-muted/50 border-border text-foreground"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-foreground">CVV</Label>
                          <Input
                            type="password"
                            placeholder="•••"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                            maxLength={4}
                            className="bg-muted/50 border-border text-foreground"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-foreground">Cardholder Name</Label>
                        <Input
                          placeholder="John Doe"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className="bg-muted/50 border-border text-foreground"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Bank Transfer Info */}
              {paymentMethod === "bank" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Card className="bg-card/80 backdrop-blur-xl border-border/50 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-foreground flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        Bank Transfer Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-muted/30 rounded-xl p-5 space-y-3 border border-border/50">
                        {[
                          { label: "Bank Name", value: "HDFC Bank" },
                          { label: "Account Name", value: "CropXon Innovations Pvt Ltd" },
                          { label: "Account Number", value: "50200012345678" },
                          { label: "IFSC Code", value: "HDFC0001234" },
                          { label: "SWIFT Code", value: "HDFCINBB" },
                        ].map((item, i) => (
                          <motion.div 
                            key={item.label}
                            className="flex justify-between py-2 border-b border-border/30 last:border-0"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <span className="text-muted-foreground">{item.label}</span>
                            <span className="text-foreground font-mono font-medium">{item.value}</span>
                          </motion.div>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Please include your company name and invoice number in the payment reference.
                        Access will be activated within 24 hours of payment confirmation.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Invoice Info */}
              {paymentMethod === "invoice" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Card className="bg-card/80 backdrop-blur-xl border-border/50 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-foreground flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Invoice Payment (NET 30)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                        <p className="text-amber-700 dark:text-amber-300 text-sm">
                          An invoice will be generated and sent to your billing email.
                          Payment is due within 30 days. Access will be granted immediately for a trial period.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Billing Address */}
            <Card className="bg-card/80 backdrop-blur-xl border-border/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-foreground">Billing Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">Full Name / Company</Label>
                    <Input
                      placeholder="Acme Inc"
                      value={billingName}
                      onChange={(e) => setBillingName(e.target.value)}
                      className="bg-muted/50 border-border text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Email</Label>
                    <Input
                      type="email"
                      placeholder="billing@company.com"
                      value={billingEmail}
                      onChange={(e) => setBillingEmail(e.target.value)}
                      className="bg-muted/50 border-border text-foreground"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Address</Label>
                  <Input
                    placeholder="123 Business Street"
                    value={billingAddress}
                    onChange={(e) => setBillingAddress(e.target.value)}
                    className="bg-muted/50 border-border text-foreground"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">City</Label>
                    <Input
                      placeholder="Mumbai"
                      value={billingCity}
                      onChange={(e) => setBillingCity(e.target.value)}
                      className="bg-muted/50 border-border text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Country</Label>
                    <Input
                      placeholder="India"
                      value={billingCountry}
                      onChange={(e) => setBillingCountry(e.target.value)}
                      className="bg-muted/50 border-border text-foreground"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">GST Number (Optional)</Label>
                  <Input
                    placeholder="22AAAAA0000A1Z5"
                    value={billingGst}
                    onChange={(e) => setBillingGst(e.target.value)}
                    className="bg-muted/50 border-border text-foreground"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            className="space-y-6"
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-card/80 backdrop-blur-xl border-border/50 shadow-xl sticky top-24">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Selected Plan */}
                <motion.div 
                  className={cn(
                    "p-4 rounded-xl bg-gradient-to-r",
                    selectedPlan.color,
                    "text-white relative overflow-hidden"
                  )}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold">{selectedPlan.name}</span>
                      <Crown className="h-5 w-5" />
                    </div>
                    <p className="text-white/80 text-sm">{selectedPlan.sessions}</p>
                  </div>
                </motion.div>

                {/* Features included */}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Includes</p>
                  {[
                    "Universal Capture Engine",
                    "AI Session Intelligence",
                    "UX Intelligence Dashboard",
                    "Journey Analytics",
                    "24/7 Priority Support"
                  ].map((feature, i) => (
                    <motion.div 
                      key={feature}
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                    >
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <Check className="h-3 w-3 text-emerald-500" />
                      </div>
                      <span className="text-sm text-foreground">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                <Separator className="bg-border" />

                {/* Pricing breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>GST (18%)</span>
                    <span>₹{tax.toLocaleString()}</span>
                  </div>
                  <Separator className="bg-border" />
                  <div className="flex justify-between text-lg font-bold text-foreground">
                    <span>Total</span>
                    <motion.span
                      className="text-primary"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      ₹{total.toLocaleString()}
                    </motion.span>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">Billed monthly</p>
                </div>

                {/* CTA Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    onClick={handlePayment}
                    className="w-full h-14 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/30"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="h-5 w-5 mr-2" />
                        {paymentMethod === "invoice" ? "Generate Invoice" : `Pay ₹${total.toLocaleString()}`}
                      </>
                    )}
                  </Button>
                </motion.div>

                {/* Security badges */}
                <div className="flex items-center justify-center gap-4 pt-4">
                  {[
                    { icon: Shield, text: "SOC 2" },
                    { icon: Lock, text: "PCI DSS" },
                    { icon: CheckCircle, text: "GDPR" },
                  ].map((badge, i) => (
                    <motion.div 
                      key={badge.text}
                      className="flex items-center gap-1 text-muted-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                    >
                      <badge.icon className="h-3 w-3" />
                      <span className="text-xs">{badge.text}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TraceflowBilling;
