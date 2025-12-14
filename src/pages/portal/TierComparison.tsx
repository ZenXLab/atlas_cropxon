import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Crown, Zap, Star, Building2, ArrowRight, Sparkles } from "lucide-react";
import { useClientTier, ClientTier, tierModules } from "@/hooks/useClientTier";
import { cn } from "@/lib/utils";

const tierDetails: Record<ClientTier, {
  name: string;
  description: string;
  price: string;
  priceLabel: string;
  icon: React.ElementType;
  color: string;
  bgGradient: string;
  features: string[];
  highlights: string[];
}> = {
  basic: {
    name: "Basic",
    description: "Essential tools for individuals and small teams",
    price: "₹999",
    priceLabel: "/month",
    icon: Star,
    color: "text-gray-600",
    bgGradient: "from-gray-100 to-gray-50",
    features: tierModules.basic,
    highlights: ["Up to 5 projects", "Basic file storage", "Email support"],
  },
  standard: {
    name: "Standard",
    description: "Advanced features for growing businesses",
    price: "₹2,499",
    priceLabel: "/month",
    icon: Zap,
    color: "text-blue-600",
    bgGradient: "from-blue-100 to-blue-50",
    features: tierModules.standard,
    highlights: ["Up to 25 projects", "10GB file storage", "Priority support", "Team collaboration"],
  },
  advanced: {
    name: "Advanced",
    description: "Powerful tools for scaling organizations",
    price: "₹4,999",
    priceLabel: "/month",
    icon: Crown,
    color: "text-purple-600",
    bgGradient: "from-purple-100 to-purple-50",
    features: tierModules.advanced,
    highlights: ["Unlimited projects", "50GB file storage", "AI-powered insights", "Advanced analytics", "Dedicated support"],
  },
  enterprise: {
    name: "Enterprise",
    description: "Complete solution for large enterprises",
    price: "Custom",
    priceLabel: "pricing",
    icon: Building2,
    color: "text-amber-600",
    bgGradient: "from-amber-100 to-amber-50",
    features: tierModules.enterprise,
    highlights: ["Everything in Advanced", "MSP Monitoring", "Custom integrations", "SLA guarantee", "24/7 phone support", "Dedicated account manager"],
  },
};

const allModules = [
  "Dashboard", "Projects", "Files", "Invoices", "Tickets", 
  "Meetings", "Team", "Feedback", "Resources", "Settings",
  "AI Dashboard", "MSP Monitoring"
];

const TierComparison: React.FC = () => {
  const navigate = useNavigate();
  const { tier: currentTier } = useClientTier();
  const tiers: ClientTier[] = ["basic", "standard", "advanced", "enterprise"];

  const handleUpgrade = (tier: ClientTier) => {
    navigate("/contact", { state: { upgradeRequest: tier } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge className="bg-primary/10 text-primary border-0 px-4 py-1.5">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            Plan Comparison
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Choose the Right Plan for Your Business
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Compare all plans side by side and find the perfect fit for your organization's needs.
          </p>
        </div>

        {/* Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier) => {
            const details = tierDetails[tier];
            const Icon = details.icon;
            const isCurrentTier = tier === currentTier;
            const isUpgrade = tiers.indexOf(tier) > tiers.indexOf(currentTier);

            return (
              <Card 
                key={tier}
                className={cn(
                  "relative overflow-hidden transition-all duration-300 hover:shadow-xl",
                  isCurrentTier && "ring-2 ring-primary shadow-lg"
                )}
              >
                {isCurrentTier && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-primary" />
                )}
                <CardHeader className={cn("pb-4 bg-gradient-to-br", details.bgGradient)}>
                  <div className="flex items-center justify-between mb-3">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-white shadow-sm", details.color)}>
                      <Icon className="w-6 h-6" />
                    </div>
                    {isCurrentTier && (
                      <Badge className="bg-primary text-primary-foreground">Current Plan</Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{details.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{details.description}</p>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-foreground">{details.price}</span>
                    <span className="text-muted-foreground ml-1">{details.priceLabel}</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Key Highlights */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Key Benefits:</p>
                    {details.highlights.map((highlight, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-muted-foreground">{highlight}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  {isUpgrade ? (
                    <Button 
                      className="w-full gap-2 bg-primary hover:bg-primary/90"
                      onClick={() => handleUpgrade(tier)}
                    >
                      Upgrade Now
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : isCurrentTier ? (
                    <Button variant="outline" className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button variant="ghost" className="w-full" disabled>
                      Included
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Detailed Feature Comparison Table */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-muted/50 border-b">
            <CardTitle className="text-xl">Detailed Module Comparison</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left p-4 font-medium text-foreground">Module</th>
                    {tiers.map((tier) => (
                      <th key={tier} className="text-center p-4 font-medium text-foreground">
                        <div className="flex flex-col items-center gap-1">
                          <span className="capitalize">{tier}</span>
                          {tier === currentTier && (
                            <Badge variant="secondary" className="text-xs">Current</Badge>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allModules.map((module, i) => (
                    <tr key={module} className={cn("border-b", i % 2 === 0 && "bg-muted/10")}>
                      <td className="p-4 font-medium text-foreground">{module}</td>
                      {tiers.map((tier) => {
                        const hasModule = tierModules[tier].includes(module);
                        return (
                          <td key={tier} className="text-center p-4">
                            {hasModule ? (
                              <Check className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-muted-foreground/50 mx-auto" />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade CTA Section */}
        <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardContent className="p-8 text-center space-y-4">
            <h3 className="text-2xl font-bold text-foreground">Need a Custom Solution?</h3>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our Enterprise plan can be customized to fit your specific business requirements.
              Contact our sales team for a tailored solution.
            </p>
            <Button 
              size="lg" 
              className="gap-2"
              onClick={() => navigate("/contact")}
            >
              Contact Sales
              <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TierComparison;
