import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FeatureMatrixOverview,
  CaptureEngineModule,
  AIAgentSystemModule,
  EnterpriseRunnerModule,
  SecurityComplianceModule,
  IndustryModulesPanel
} from "./features";
import { LayoutGrid, Sparkles, Download, Share2 } from "lucide-react";

export const TraceflowFeatureMatrixDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
            <LayoutGrid className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              TRACEFLOW OS Feature Matrix
              <Badge className="bg-amber-500/10 text-amber-600 text-[10px]">Enterprise</Badge>
            </h1>
            <p className="text-sm text-muted-foreground">
              Complete Digital Experience Intelligence Platform — 14 Categories, 183 Features
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Share2 className="h-3.5 w-3.5" /> Share
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
          <Button size="sm" className="gap-1 bg-gradient-to-r from-primary to-accent text-white">
            <Sparkles className="h-3.5 w-3.5" /> Request Demo
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-120px)]">
        <div className="grid grid-cols-12 gap-4">
          {/* Feature Matrix Overview - Full Width */}
          <motion.div 
            className="col-span-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FeatureMatrixOverview />
          </motion.div>

          {/* Module Cards Grid */}
          <motion.div 
            className="col-span-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <CaptureEngineModule />
          </motion.div>

          <motion.div 
            className="col-span-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <AIAgentSystemModule />
          </motion.div>

          <motion.div 
            className="col-span-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <EnterpriseRunnerModule />
          </motion.div>

          <motion.div 
            className="col-span-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <SecurityComplianceModule />
          </motion.div>

          <motion.div 
            className="col-span-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <IndustryModulesPanel />
          </motion.div>
        </div>
      </ScrollArea>
    </div>
  );
};
