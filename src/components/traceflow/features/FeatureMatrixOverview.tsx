import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { featureMatrixStatus } from "@/lib/traceflowDemoData";
import { 
  Radio, 
  Server, 
  Activity, 
  Bot, 
  Clock, 
  Database, 
  Globe, 
  Zap,
  Shield,
  Building2,
  Target,
  DollarSign,
  Package,
  Rocket,
  Check,
  AlertCircle,
  ChevronRight,
  TrendingUp,
  BarChart3,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryData {
  name: string;
  total: number;
  implemented: number;
  partial: number;
  planned: number;
}

const categoryIcons: Record<string, React.ReactNode> = {
  'A': <Radio className="h-4 w-4" />,
  'B': <Server className="h-4 w-4" />,
  'C': <Activity className="h-4 w-4" />,
  'D': <Bot className="h-4 w-4" />,
  'E': <Clock className="h-4 w-4" />,
  'F': <Database className="h-4 w-4" />,
  'G': <Globe className="h-4 w-4" />,
  'H': <Zap className="h-4 w-4" />,
  'I': <Shield className="h-4 w-4" />,
  'J': <Building2 className="h-4 w-4" />,
  'K': <Target className="h-4 w-4" />,
  'L': <DollarSign className="h-4 w-4" />,
  'M': <Package className="h-4 w-4" />,
  'N': <Rocket className="h-4 w-4" />,
};

const categoryColors: Record<string, string> = {
  'A': 'from-blue-500 to-cyan-500',
  'B': 'from-emerald-500 to-teal-500',
  'C': 'from-purple-500 to-pink-500',
  'D': 'from-violet-500 to-purple-500',
  'E': 'from-amber-500 to-orange-500',
  'F': 'from-rose-500 to-red-500',
  'G': 'from-indigo-500 to-blue-500',
  'H': 'from-yellow-500 to-amber-500',
  'I': 'from-sky-500 to-blue-500',
  'J': 'from-slate-500 to-gray-500',
  'K': 'from-orange-500 to-red-500',
  'L': 'from-green-500 to-emerald-500',
  'M': 'from-pink-500 to-rose-500',
  'N': 'from-cyan-500 to-teal-500',
};

export const FeatureMatrixOverview = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const totalFeatures = Object.values(featureMatrixStatus).reduce((acc, cat) => acc + cat.total, 0);
  const totalImplemented = Object.values(featureMatrixStatus).reduce((acc, cat) => acc + cat.implemented, 0);
  const totalPartial = Object.values(featureMatrixStatus).reduce((acc, cat) => acc + cat.partial, 0);
  const overallProgress = Math.round((totalImplemented / totalFeatures) * 100);

  return (
    <Card className="bg-card/80 backdrop-blur border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-base">TRACEFLOW Feature Matrix</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Complete DXI OS implementation status across 14 categories
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-600 text-xs">
              {overallProgress}% Complete
            </Badge>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Check className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-600 font-medium">{totalImplemented} Implemented</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-amber-500" />
                <span className="text-amber-600">{totalPartial} Partial</span>
              </span>
              <span className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">{totalFeatures - totalImplemented - totalPartial} Planned</span>
              </span>
            </div>
            <span className="font-semibold">{totalFeatures} Total Features</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden flex">
            <motion.div 
              className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full"
              initial={{ width: 0 }}
              animate={{ width: `${(totalImplemented / totalFeatures) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            <motion.div 
              className="bg-gradient-to-r from-amber-500 to-amber-400 h-full"
              initial={{ width: 0 }}
              animate={{ width: `${(totalPartial / totalFeatures) * 100}%` }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[320px] pr-2">
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(featureMatrixStatus).map(([key, category], idx) => {
              const progress = (category.implemented / category.total) * 100;
              const isSelected = selectedCategory === key;

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedCategory(isSelected ? null : key)}
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md group",
                    isSelected 
                      ? "ring-2 ring-primary/30 border-primary/30 bg-primary/5" 
                      : "border-border/50 hover:border-primary/20 bg-muted/30"
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "p-1.5 rounded-md bg-gradient-to-br text-white",
                        categoryColors[key]
                      )}>
                        {categoryIcons[key]}
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-muted-foreground">{key}.</span>
                          <span className="text-xs font-medium truncate max-w-[100px]">{category.name}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform",
                      isSelected && "rotate-90"
                    )} />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-muted-foreground">{category.total} features</span>
                      <span className={cn(
                        "font-medium",
                        progress >= 80 ? "text-emerald-600" : progress >= 50 ? "text-amber-600" : "text-red-600"
                      )}>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden flex">
                      <div 
                        className="bg-emerald-500 h-full transition-all duration-500"
                        style={{ width: `${(category.implemented / category.total) * 100}%` }}
                      />
                      <div 
                        className="bg-amber-500 h-full transition-all duration-500"
                        style={{ width: `${(category.partial / category.total) * 100}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-muted-foreground">
                      <span className="text-emerald-600">{category.implemented} ✓</span>
                      <span className="text-amber-600">{category.partial} ◐</span>
                      <span>{category.planned} ○</span>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 pt-2 border-t border-border/50"
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-3 w-3 text-primary" />
                          <span className="text-[10px] text-primary">Click to view module details</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-center gap-6 text-[10px]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Implemented
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Partial
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-muted" />
            Planned
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
