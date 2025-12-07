import React, { useState } from "react";
import { X, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useTenant } from "./TenantLayout";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const TrialBanner: React.FC = () => {
  const { trialDaysLeft } = useTenant();
  const [dismissed, setDismissed] = useState(false);
  const [showLimitsModal, setShowLimitsModal] = useState(false);

  if (dismissed) return null;

  const usagePercent = 70;
  const totalDays = 14;
  const daysUsed = totalDays - trialDaysLeft;

  return (
    <>
      <div className="fixed top-[72px] left-0 right-0 z-40 bg-gradient-to-r from-[#FFB020] to-[#FF8C00] text-white">
        <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="hidden sm:flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1.5">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-semibold">TRIAL</span>
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                You're on a 14-day trial. <span className="font-bold">{trialDaysLeft} days left</span> — 
                Upgrade to unlock SSO, custom domain, and unlimited workflows.
              </p>
              <div className="flex items-center gap-3 mt-1.5">
                <Progress 
                  value={usagePercent} 
                  className="h-1.5 flex-1 max-w-[200px] bg-white/30 [&>div]:bg-white" 
                />
                <span className="text-xs opacity-90">{usagePercent}% resources used</span>
                <button
                  onClick={() => setShowLimitsModal(true)}
                  className="text-xs underline underline-offset-2 hover:no-underline"
                >
                  View limits
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="bg-white text-[#FF8C00] hover:bg-white/90 font-semibold gap-1"
            >
              Upgrade Now
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 hidden sm:inline-flex"
            >
              Contact Sales
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDismissed(true)}
              className="h-8 w-8 text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Limits Modal */}
      <Dialog open={showLimitsModal} onOpenChange={setShowLimitsModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#0F1E3A]">Trial Limits</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between p-3 bg-[#F7F9FC] rounded-lg">
              <span className="text-sm text-[#6B7280]">Maximum Employees</span>
              <span className="font-semibold text-[#0F1E3A]">25 / 50</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#F7F9FC] rounded-lg">
              <span className="text-sm text-[#6B7280]">Automation Runs (Daily)</span>
              <span className="font-semibold text-[#0F1E3A]">18 / 25</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#F7F9FC] rounded-lg">
              <span className="text-sm text-[#6B7280]">Free BGV Verifications</span>
              <span className="font-semibold text-[#0F1E3A]">8 / 10</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#F7F9FC] rounded-lg">
              <span className="text-sm text-[#6B7280]">Storage</span>
              <span className="font-semibold text-[#0F1E3A]">1.2 GB / 2 GB</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#F7F9FC] rounded-lg">
              <span className="text-sm text-[#6B7280]">Trial Days Remaining</span>
              <span className="font-semibold text-[#FFB020]">{trialDaysLeft} days</span>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <h4 className="font-semibold text-[#0F1E3A] mb-2">Locked Features</h4>
              <ul className="space-y-2 text-sm text-[#6B7280]">
                <li className="flex items-center gap-2">
                  <X className="w-4 h-4 text-[#E23E57]" /> SSO Authentication
                </li>
                <li className="flex items-center gap-2">
                  <X className="w-4 h-4 text-[#E23E57]" /> Custom Domain
                </li>
                <li className="flex items-center gap-2">
                  <X className="w-4 h-4 text-[#E23E57]" /> Unlimited Workflows
                </li>
                <li className="flex items-center gap-2">
                  <X className="w-4 h-4 text-[#E23E57]" /> Managed Operations
                </li>
              </ul>
            </div>
          </div>
          <Button className="w-full bg-[#005EEB] hover:bg-[#004ACC]">
            Upgrade to Unlock All Features
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};
