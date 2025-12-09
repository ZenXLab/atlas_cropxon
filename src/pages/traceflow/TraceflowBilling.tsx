import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import { 
  Activity, 
  CreditCard, 
  Building2,
  Shield,
  Lock,
  CheckCircle,
  Loader2,
  FileText,
  Download,
  Mail,
  ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

// Plan pricing details
const planPricing: Record<string, { name: string; price: number; sessions: string }> = {
  starter: { name: "Starter", price: 499, sessions: "50,000 sessions/mo" },
  professional: { name: "Professional", price: 1499, sessions: "250,000 sessions/mo" },
  enterprise: { name: "Enterprise", price: 0, sessions: "Unlimited" },
};

// Payment methods
const paymentMethods = [
  { id: "card", label: "Credit/Debit Card", icon: CreditCard },
  { id: "bank", label: "Bank Transfer / ACH", icon: Building2 },
  { id: "invoice", label: "Invoice (NET 30)", icon: FileText },
];

export const TraceflowBilling = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

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
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
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
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#0B3D91]/20 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="text-slate-400 hover:text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B3D91] to-[#00C2D8] flex items-center justify-center">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="font-bold text-lg text-white">TRACEFLOW</span>
                  <p className="text-xs text-slate-400">Secure Checkout</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-emerald-500" />
              <span className="text-sm text-slate-400">256-bit SSL Encrypted</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method Selection */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Payment Method</CardTitle>
                <CardDescription className="text-slate-400">
                  Choose how you'd like to pay
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="grid grid-cols-3 gap-4">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={cn(
                          "flex flex-col items-center gap-2 p-4 rounded-lg border cursor-pointer transition-all",
                          paymentMethod === method.id
                            ? "bg-[#0B3D91]/30 border-[#00C2D8]"
                            : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                        )}
                      >
                        <RadioGroupItem value={method.id} id={method.id} className="sr-only" />
                        <method.icon className={cn(
                          "h-6 w-6",
                          paymentMethod === method.id ? "text-[#00C2D8]" : "text-slate-400"
                        )} />
                        <Label 
                          htmlFor={method.id} 
                          className={cn(
                            "text-sm cursor-pointer text-center",
                            paymentMethod === method.id ? "text-white" : "text-slate-400"
                          )}
                        >
                          {method.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Card Details */}
            {paymentMethod === "card" && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Card Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Card Number</Label>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Expiry Date</Label>
                      <Input
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        maxLength={5}
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">CVV</Label>
                      <Input
                        type="password"
                        placeholder="•••"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        maxLength={4}
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Cardholder Name</Label>
                    <Input
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Bank Transfer Info */}
            {paymentMethod === "bank" && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Bank Transfer Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-slate-700/30 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Bank Name</span>
                      <span className="text-white">HDFC Bank</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Account Name</span>
                      <span className="text-white">CropXon Innovations Pvt Ltd</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Account Number</span>
                      <span className="text-white font-mono">50200012345678</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">IFSC Code</span>
                      <span className="text-white font-mono">HDFC0001234</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">SWIFT Code</span>
                      <span className="text-white font-mono">HDFCINBB</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400">
                    Please include your company name and invoice number in the payment reference.
                    Access will be activated within 24 hours of payment confirmation.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Invoice Info */}
            {paymentMethod === "invoice" && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Invoice Payment (NET 30)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                    <p className="text-amber-300 text-sm">
                      An invoice will be generated and sent to your billing email.
                      Payment is due within 30 days. Access will be granted immediately for a trial period.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Billing Address */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Billing Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Full Name / Company</Label>
                    <Input
                      placeholder="Acme Inc"
                      value={billingName}
                      onChange={(e) => setBillingName(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Email</Label>
                    <Input
                      type="email"
                      placeholder="billing@company.com"
                      value={billingEmail}
                      onChange={(e) => setBillingEmail(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Address</Label>
                  <Input
                    placeholder="123 Business Street"
                    value={billingAddress}
                    onChange={(e) => setBillingAddress(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">City</Label>
                    <Input
                      placeholder="Mumbai"
                      value={billingCity}
                      onChange={(e) => setBillingCity(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Country</Label>
                    <Input
                      placeholder="India"
                      value={billingCountry}
                      onChange={(e) => setBillingCountry(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">GST Number (Optional)</Label>
                  <Input
                    placeholder="22AAAAA0000A1Z5"
                    value={billingGst}
                    onChange={(e) => setBillingGst(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 sticky top-24">
              <CardHeader>
                <CardTitle className="text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-medium">{selectedPlan.name} Plan</h3>
                    <p className="text-sm text-slate-400">{selectedPlan.sessions}</p>
                  </div>
                  <Badge className="bg-[#0B3D91]/30 text-[#00C2D8] border-[#00C2D8]/30">
                    Monthly
                  </Badge>
                </div>

                <Separator className="bg-slate-700" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Subtotal</span>
                    <span className="text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Tax (GST 18%)</span>
                    <span className="text-white">${tax.toFixed(2)}</span>
                  </div>
                </div>

                <Separator className="bg-slate-700" />

                <div className="flex justify-between">
                  <span className="text-white font-medium">Total</span>
                  <span className="text-2xl font-bold text-white">${total.toFixed(2)}</span>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] hover:opacity-90 mt-4"
                  size="lg"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <Lock className="h-5 w-5 mr-2" />
                  )}
                  {paymentMethod === "invoice" ? "Generate Invoice" : `Pay $${total.toFixed(2)}`}
                </Button>

                {/* Security Badges */}
                <div className="flex items-center justify-center gap-4 pt-4">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Shield className="h-3 w-3" />
                    SOC 2
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Lock className="h-3 w-3" />
                    PCI DSS
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <CheckCircle className="h-3 w-3" />
                    GDPR
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TraceflowBilling;
