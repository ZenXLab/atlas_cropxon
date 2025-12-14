import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Shield, EyeOff, Plus, Trash2, Save, Lock, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export interface PrivacySettings {
  maskAllInputs: boolean;
  maskPasswords: boolean;
  maskEmails: boolean;
  maskCreditCards: boolean;
  maskPhoneNumbers: boolean;
  excludedPages: string[];
  excludedSelectors: string[];
  recordCanvas: boolean;
  collectFonts: boolean;
  inlineStylesheet: boolean;
}

export const defaultPrivacySettings: PrivacySettings = {
  maskAllInputs: true,
  maskPasswords: true,
  maskEmails: false,
  maskCreditCards: true,
  maskPhoneNumbers: false,
  excludedPages: ["/admin", "/portal", "/tenant"],
  excludedSelectors: [".sensitive", "[data-private]", ".credit-card"],
  recordCanvas: false,
  collectFonts: false,
  inlineStylesheet: true,
};

interface PrivacyControlsProps {
  settings: PrivacySettings;
  onSettingsChange: (settings: PrivacySettings) => void;
  onSave: () => void;
}

export const PrivacyControls = ({ settings, onSettingsChange, onSave }: PrivacyControlsProps) => {
  const [newExcludedPage, setNewExcludedPage] = useState("");
  const [newExcludedSelector, setNewExcludedSelector] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = <K extends keyof PrivacySettings>(key: K, value: PrivacySettings[K]) => {
    onSettingsChange({ ...settings, [key]: value });
    setHasChanges(true);
  };

  const addExcludedPage = () => {
    if (newExcludedPage && !settings.excludedPages.includes(newExcludedPage)) {
      updateSetting("excludedPages", [...settings.excludedPages, newExcludedPage]);
      setNewExcludedPage("");
    }
  };

  const removeExcludedPage = (page: string) => {
    updateSetting("excludedPages", settings.excludedPages.filter(p => p !== page));
  };

  const addExcludedSelector = () => {
    if (newExcludedSelector && !settings.excludedSelectors.includes(newExcludedSelector)) {
      updateSetting("excludedSelectors", [...settings.excludedSelectors, newExcludedSelector]);
      setNewExcludedSelector("");
    }
  };

  const removeExcludedSelector = (selector: string) => {
    updateSetting("excludedSelectors", settings.excludedSelectors.filter(s => s !== selector));
  };

  const handleSave = () => {
    onSave();
    setHasChanges(false);
    toast.success("Privacy settings saved");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Privacy Controls
          </h2>
          <p className="text-muted-foreground">
            Configure what data is captured and masked in session recordings
          </p>
        </div>
        <Button onClick={handleSave} disabled={!hasChanges}>
          <Save className="h-4 w-4 mr-1" />
          Save Changes
        </Button>
      </div>

      {/* Warning Banner */}
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <p className="font-medium text-amber-600">Privacy Compliance Notice</p>
              <p className="text-sm text-muted-foreground">
                Ensure your session recording configuration complies with GDPR, CCPA, and other 
                applicable privacy regulations. Always mask sensitive personal data.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Data Masking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <EyeOff className="h-4 w-4" />
              Data Masking
            </CardTitle>
            <CardDescription>
              Automatically mask sensitive data types in recordings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Mask All Inputs</Label>
                <p className="text-xs text-muted-foreground">Replace all input values with ****</p>
              </div>
              <Switch
                checked={settings.maskAllInputs}
                onCheckedChange={(v) => updateSetting("maskAllInputs", v)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  Mask Passwords
                  <Badge variant="destructive" className="text-[10px]">Required</Badge>
                </Label>
                <p className="text-xs text-muted-foreground">Always mask password fields</p>
              </div>
              <Switch
                checked={settings.maskPasswords}
                onCheckedChange={(v) => updateSetting("maskPasswords", v)}
                disabled
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Mask Email Addresses</Label>
                <p className="text-xs text-muted-foreground">Mask email input fields</p>
              </div>
              <Switch
                checked={settings.maskEmails}
                onCheckedChange={(v) => updateSetting("maskEmails", v)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  Mask Credit Cards
                  <Badge variant="destructive" className="text-[10px]">Required</Badge>
                </Label>
                <p className="text-xs text-muted-foreground">Mask payment card numbers</p>
              </div>
              <Switch
                checked={settings.maskCreditCards}
                onCheckedChange={(v) => updateSetting("maskCreditCards", v)}
                disabled
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Mask Phone Numbers</Label>
                <p className="text-xs text-muted-foreground">Mask phone input fields</p>
              </div>
              <Switch
                checked={settings.maskPhoneNumbers}
                onCheckedChange={(v) => updateSetting("maskPhoneNumbers", v)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Recording Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Lock className="h-4 w-4" />
              Recording Options
            </CardTitle>
            <CardDescription>
              Configure what elements are captured in recordings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Record Canvas Elements</Label>
                <p className="text-xs text-muted-foreground">Capture canvas/WebGL content</p>
              </div>
              <Switch
                checked={settings.recordCanvas}
                onCheckedChange={(v) => updateSetting("recordCanvas", v)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Collect Fonts</Label>
                <p className="text-xs text-muted-foreground">Include font files in recordings</p>
              </div>
              <Switch
                checked={settings.collectFonts}
                onCheckedChange={(v) => updateSetting("collectFonts", v)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Inline Stylesheets</Label>
                <p className="text-xs text-muted-foreground">Embed CSS for accurate replay</p>
              </div>
              <Switch
                checked={settings.inlineStylesheet}
                onCheckedChange={(v) => updateSetting("inlineStylesheet", v)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Excluded Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Excluded Pages</CardTitle>
            <CardDescription>
              Pages where session recording is disabled
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="/admin/*, /checkout..."
                value={newExcludedPage}
                onChange={(e) => setNewExcludedPage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addExcludedPage()}
              />
              <Button variant="outline" size="icon" onClick={addExcludedPage}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="h-[150px]">
              <AnimatePresence>
                {settings.excludedPages.map((page) => (
                  <motion.div
                    key={page}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center justify-between p-2 hover:bg-muted/50 rounded"
                  >
                    <code className="text-sm">{page}</code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeExcludedPage(page)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Excluded Selectors */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Excluded CSS Selectors</CardTitle>
            <CardDescription>
              Elements matching these selectors won't be recorded
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-3">
              <Input
                placeholder=".sensitive, #secret-data..."
                value={newExcludedSelector}
                onChange={(e) => setNewExcludedSelector(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addExcludedSelector()}
              />
              <Button variant="outline" size="icon" onClick={addExcludedSelector}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="h-[150px]">
              <AnimatePresence>
                {settings.excludedSelectors.map((selector) => (
                  <motion.div
                    key={selector}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center justify-between p-2 hover:bg-muted/50 rounded"
                  >
                    <code className="text-sm">{selector}</code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeExcludedSelector(selector)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
