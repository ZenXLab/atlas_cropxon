import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { industryModulesData, featureMatrixStatus } from "@/lib/traceflowDemoData";
import { FeatureModuleCard } from "./FeatureModuleCard";
import { 
  Building2, 
  ShieldCheck, 
  ShoppingCart, 
  Laptop,
  Check,
  TrendingUp,
  DollarSign,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";

const industryIcons: Record<string, React.ReactNode> = {
  'bfsi': <Building2 className="h-4 w-4 text-blue-500" />,
  'insurance': <ShieldCheck className="h-4 w-4 text-purple-500" />,
  'ecommerce': <ShoppingCart className="h-4 w-4 text-amber-500" />,
  'saas': <Laptop className="h-4 w-4 text-emerald-500" />,
};

export const IndustryModulesPanel = () => {
  const [activeIndustry, setActiveIndustry] = useState('bfsi');

  const industries = [
    { id: 'bfsi', name: 'BFSI', data: industryModulesData.bfsi },
    { id: 'insurance', name: 'Insurance', data: industryModulesData.insurance },
    { id: 'ecommerce', name: 'E-commerce', data: industryModulesData.ecommerce },
    { id: 'saas', name: 'SaaS/B2B', data: industryModulesData.saas },
  ];

  const activeData = industries.find(i => i.id === activeIndustry)?.data;

  return (
    <FeatureModuleCard
      id="industry-modules"
      title="Industry-Specific Modules"
      description="Vertical-specific analytics and insights for BFSI, Insurance, E-commerce, and SaaS"
      icon={<Building2 className="h-5 w-5 text-amber-500" />}
      category="K"
      stats={[
        { label: 'Active Industries', value: '4', change: '', trend: 'stable' as const },
        { label: 'Total Insights', value: '45.2K', change: '+24%', trend: 'up' as const },
        { label: 'Revenue Saved', value: '₹289M', change: '+18%', trend: 'up' as const },
        { label: 'Avg ROI', value: '12.4x', change: '+2.1x', trend: 'up' as const },
      ]}
      status={featureMatrixStatus['K']}
      accentColor="amber"
    >
      <div className="space-y-4">
        {/* Industry Tabs */}
        <Tabs value={activeIndustry} onValueChange={setActiveIndustry}>
          <TabsList className="grid grid-cols-4 h-8">
            {industries.map((ind) => (
              <TabsTrigger 
                key={ind.id} 
                value={ind.id}
                className="text-[10px] h-6 data-[state=active]:bg-primary/10"
              >
                <span className="mr-1">{industryIcons[ind.id]}</span>
                {ind.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {industries.map((industry) => (
            <TabsContent key={industry.id} value={industry.id} className="mt-3">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-2"
              >
                {industry.data.features.map((feature, idx) => (
                  <motion.div
                    key={feature.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-3 rounded-lg bg-gradient-to-r from-amber-500/5 to-orange-500/5 border border-amber-500/10 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        <div className="p-1.5 rounded-md bg-amber-500/10 mt-0.5">
                          <Sparkles className="h-3 w-3 text-amber-500" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium">{feature.name}</span>
                            <Badge variant="outline" className="text-[9px] h-4 text-emerald-600 border-emerald-500/30">
                              <Check className="h-2.5 w-2.5 mr-1" />
                              Active
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              {feature.insights.toLocaleString()} insights
                            </span>
                            <span className="flex items-center gap-1 text-emerald-600 font-medium">
                              <DollarSign className="h-3 w-3" />
                              {feature.revenue}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 text-[10px]">
                        View
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Summary */}
        <div className="p-3 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-amber-500" />
              <div>
                <p className="text-xs font-medium">Total Revenue Impact</p>
                <p className="text-[10px] text-muted-foreground">Across all industry modules</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-emerald-600">₹289M</p>
              <p className="text-[10px] text-emerald-600">+18% MoM</p>
            </div>
          </div>
        </div>
      </div>
    </FeatureModuleCard>
  );
};
