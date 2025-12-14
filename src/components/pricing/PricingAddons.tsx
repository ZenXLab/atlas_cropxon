import { useState } from "react";
import { Check, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Addon {
  id: string;
  name: string;
  price: number;
  unit: string;
  category: string;
}

interface PricingAddonsProps {
  region: 'india' | 'global';
  selectedAddons?: string[];
  onAddonsChange?: (addons: string[], totalPrice: number) => void;
}

const indiaAddons: Addon[] = [
  { id: "bgv", name: "Background Verification (BGV)", price: 49, unit: "/check", category: "HR" },
  { id: "doc-verify", name: "Document Verification", price: 25, unit: "/document", category: "HR" },
  { id: "notifications", name: "Slack/WhatsApp Notifications", price: 2, unit: "/user/mo", category: "HR" },
  { id: "payroll-reprocess", name: "Payroll Re-processing", price: 5, unit: "/employee", category: "Payroll" },
  { id: "payroll-approval", name: "Payroll Approval Workflows", price: 1, unit: "/user/mo", category: "Payroll" },
  { id: "workflow-runs", name: "Extra 1,000 Workflow Runs", price: 999, unit: "/month", category: "Automation" },
  { id: "proxima-ai", name: "Proxima AI Assistant", price: 49, unit: "/user/mo", category: "AI" },
  { id: "ai-insights", name: "AI Insights Dashboard", price: 19, unit: "/user/mo", category: "AI" },
];

const globalAddons: Addon[] = [
  { id: "bgv", name: "Background Verification (BGV)", price: 1.5, unit: "/check", category: "HR" },
  { id: "doc-verify", name: "Document Verification", price: 0.75, unit: "/document", category: "HR" },
  { id: "notifications", name: "Slack/WhatsApp Notifications", price: 0.5, unit: "/user/mo", category: "HR" },
  { id: "payroll-reprocess", name: "Payroll Re-processing", price: 0.25, unit: "/employee", category: "Payroll" },
  { id: "payroll-approval", name: "Payroll Approval Workflows", price: 0.15, unit: "/user/mo", category: "Payroll" },
  { id: "workflow-runs", name: "Extra 1,000 Workflow Runs", price: 29, unit: "/month", category: "Automation" },
  { id: "proxima-ai", name: "Proxima AI Assistant", price: 1.5, unit: "/user/mo", category: "AI" },
  { id: "ai-insights", name: "AI Insights Dashboard", price: 0.5, unit: "/user/mo", category: "AI" },
];

export const PricingAddons = ({ region, selectedAddons: externalSelected, onAddonsChange }: PricingAddonsProps) => {
  const [internalSelected, setInternalSelected] = useState<string[]>([]);
  
  const selectedAddons = externalSelected ?? internalSelected;
  const addons = region === 'india' ? indiaAddons : globalAddons;
  const categories = [...new Set(addons.map(a => a.category))];
  const currency = region === 'india' ? '₹' : '$';

  const toggleAddon = (addonId: string) => {
    const newSelected = selectedAddons.includes(addonId)
      ? selectedAddons.filter(id => id !== addonId)
      : [...selectedAddons, addonId];
    
    if (onAddonsChange) {
      const totalPrice = newSelected.reduce((sum, id) => {
        const addon = addons.find(a => a.id === id);
        return sum + (addon?.price || 0);
      }, 0);
      onAddonsChange(newSelected, totalPrice);
    } else {
      setInternalSelected(newSelected);
    }
  };

  const calculateTotalAddonPrice = () => {
    return selectedAddons.reduce((sum, id) => {
      const addon = addons.find(a => a.id === id);
      return sum + (addon?.price || 0);
    }, 0);
  };

  const totalPrice = calculateTotalAddonPrice();

  return (
    <div className="bg-gradient-to-br from-card to-secondary/30 rounded-3xl border border-border/50 p-8 lg:p-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
          <Plus className="w-4 h-4" />
          Power-Up Modules
        </div>
        <h3 className="text-3xl font-heading font-bold text-foreground mb-3">
          Add-On Modules
        </h3>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Enhance your ATLAS experience with powerful add-ons. Click to select and see total cost.
        </p>
      </div>

      {/* Selected Add-ons Summary */}
      {selectedAddons.length > 0 && (
        <div className="mb-8 p-4 rounded-xl bg-primary/10 border border-primary/20">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Selected Add-ons ({selectedAddons.length})</p>
              <div className="flex flex-wrap gap-2">
                {selectedAddons.map(id => {
                  const addon = addons.find(a => a.id === id);
                  return addon ? (
                    <span 
                      key={id} 
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium"
                    >
                      {addon.name}
                      <button 
                        onClick={() => toggleAddon(id)}
                        className="ml-1 hover:bg-primary/30 rounded-full p-0.5"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Estimated Add-on Cost</p>
              <p className="text-2xl font-bold text-primary">
                {currency}{totalPrice.toLocaleString()}<span className="text-sm font-normal text-muted-foreground">/mo*</span>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div key={category} className="space-y-4">
            <h4 className="text-sm font-bold text-primary uppercase tracking-wider border-b border-primary/20 pb-2">
              {category} Add-ons
            </h4>
            <ul className="space-y-3">
              {addons
                .filter((addon) => addon.category === category)
                .map((addon) => {
                  const isSelected = selectedAddons.includes(addon.id);
                  return (
                    <li
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={cn(
                        "bg-background/50 rounded-xl p-4 border cursor-pointer transition-all group",
                        isSelected 
                          ? "border-primary bg-primary/5 shadow-md" 
                          : "border-border/50 hover:border-primary/30 hover:bg-background/80"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors",
                          isSelected 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-primary/10 group-hover:bg-primary/20"
                        )}>
                          {isSelected ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Plus className="w-3 h-3 text-primary" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={cn(
                            "text-sm font-medium leading-tight",
                            isSelected ? "text-primary" : "text-foreground"
                          )}>
                            {addon.name}
                          </p>
                          <p className="text-primary font-bold mt-1">
                            {currency}{addon.price}
                            <span className="text-muted-foreground font-normal text-xs">
                              {addon.unit}
                            </span>
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground mt-6">
        * Estimated cost varies based on usage. Final billing calculated on actual consumption.
      </p>
    </div>
  );
};
