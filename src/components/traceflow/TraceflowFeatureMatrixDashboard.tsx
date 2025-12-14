import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { 
  FeatureMatrixOverview,
  CaptureEngineModule,
  AIAgentSystemModule,
  EnterpriseRunnerModule,
  SecurityComplianceModule,
  IndustryModulesPanel,
  StreamingProcessingModule,
  TemporalWorkflowsModule,
  StorageIndexingModule,
  ControlPlaneModule,
  ObservabilityModule,
  CostOptimizationModule,
  ProductizedOutputsModule,
  FutureExpansionsModule,
  DeploymentModesModule,
} from "./features";
import { LayoutGrid, Sparkles, Download, Share2, GripVertical, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModuleConfig {
  id: string;
  component: React.ComponentType;
  colSpan: number;
  label: string;
}

const defaultModules: ModuleConfig[] = [
  { id: "overview", component: FeatureMatrixOverview, colSpan: 12, label: "Overview" },
  { id: "capture", component: CaptureEngineModule, colSpan: 6, label: "Capture Engine" },
  { id: "ai-agents", component: AIAgentSystemModule, colSpan: 6, label: "AI Agents" },
  { id: "runner", component: EnterpriseRunnerModule, colSpan: 6, label: "Enterprise Runner" },
  { id: "security", component: SecurityComplianceModule, colSpan: 6, label: "Security" },
  { id: "streaming", component: StreamingProcessingModule, colSpan: 6, label: "Streaming" },
  { id: "temporal", component: TemporalWorkflowsModule, colSpan: 6, label: "Workflows" },
  { id: "storage", component: StorageIndexingModule, colSpan: 6, label: "Storage" },
  { id: "control-plane", component: ControlPlaneModule, colSpan: 6, label: "Control Plane" },
  { id: "observability", component: ObservabilityModule, colSpan: 6, label: "Observability" },
  { id: "cost", component: CostOptimizationModule, colSpan: 6, label: "Cost Optimization" },
  { id: "deployment", component: DeploymentModesModule, colSpan: 6, label: "Deployment" },
  { id: "outputs", component: ProductizedOutputsModule, colSpan: 6, label: "Outputs" },
  { id: "future", component: FutureExpansionsModule, colSpan: 12, label: "Future" },
  { id: "industries", component: IndustryModulesPanel, colSpan: 12, label: "Industries" },
];

interface SortableModuleProps {
  module: ModuleConfig;
  isDragging?: boolean;
}

const SortableModule = ({ module }: SortableModuleProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: module.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const Component = module.component;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={cn(
        `col-span-${module.colSpan}`,
        module.colSpan === 12 && "col-span-12",
        module.colSpan === 6 && "col-span-12 lg:col-span-6",
        isDragging && "z-50 opacity-90 ring-2 ring-primary rounded-xl"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative group h-full">
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing bg-primary/10 rounded-lg p-1.5"
        >
          <GripVertical className="h-4 w-4 text-primary" />
        </div>
        <Component />
      </div>
    </motion.div>
  );
};

export const TraceflowFeatureMatrixDashboard = () => {
  const [modules, setModules] = useState<ModuleConfig[]>(defaultModules);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setModules((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  const handleReset = useCallback(() => {
    setModules(defaultModules);
  }, []);

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
          <Button variant="outline" size="sm" className="gap-1" onClick={handleReset}>
            <RotateCcw className="h-3.5 w-3.5" /> Reset Layout
          </Button>
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

      {/* Drag hint */}
      <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 w-fit">
        <GripVertical className="h-3.5 w-3.5" />
        <span>Hover and drag module cards to reorder. Changes are saved automatically.</span>
      </div>

      <ScrollArea className="h-[calc(100vh-180px)]">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={modules.map(m => m.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-12 gap-4">
              {modules.map((module) => (
                <SortableModule key={module.id} module={module} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </ScrollArea>
    </div>
  );
};
