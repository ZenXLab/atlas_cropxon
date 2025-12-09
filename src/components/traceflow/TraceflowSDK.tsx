import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Copy, 
  Check, 
  Code2, 
  Terminal,
  Globe,
  Smartphone,
  Shield,
  Zap,
  Settings,
  CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SDKConfigOptions {
  captureClicks: boolean;
  captureScrolls: boolean;
  captureFormInputs: boolean;
  captureRageClicks: boolean;
  captureMouse: boolean;
  maskSensitiveData: boolean;
  excludeSelectors: string;
  sampleRate: number;
}

const defaultConfig: SDKConfigOptions = {
  captureClicks: true,
  captureScrolls: true,
  captureFormInputs: true,
  captureRageClicks: true,
  captureMouse: false,
  maskSensitiveData: true,
  excludeSelectors: "[data-tf-ignore], .tf-ignore",
  sampleRate: 100
};

export const TraceflowSDK = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const [config, setConfig] = useState<SDKConfigOptions>(defaultConfig);
  const [apiKey] = useState("tf_live_xxxxxxxxxxxxxxxxxxxx");

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(null), 2000);
  };

  // Generate SDK script based on config
  const generateScript = () => {
    return `<!-- TRACEFLOW SDK - Enterprise Digital Experience Intelligence -->
<script>
(function(w,d,s,l,i){
  w[l]=w[l]||[];
  w[l].push({'tf.start': new Date().getTime(), event:'tf.init'});
  var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='traceflow'?'&l='+l:'';
  j.async=true;
  j.src='https://cdn.traceflow.io/sdk/v1/traceflow.min.js?id='+i+dl;
  f.parentNode.insertBefore(j,f);
})(window,document,'script','traceflow','${apiKey}');

// Configuration
window.TraceflowConfig = {
  apiKey: '${apiKey}',
  capture: {
    clicks: ${config.captureClicks},
    scrolls: ${config.captureScrolls},
    formInputs: ${config.captureFormInputs},
    rageClicks: ${config.captureRageClicks},
    mouseMovement: ${config.captureMouse}
  },
  privacy: {
    maskSensitiveData: ${config.maskSensitiveData},
    excludeSelectors: '${config.excludeSelectors}'
  },
  sampleRate: ${config.sampleRate}
};
</script>`;
  };

  const npmInstallScript = `npm install @traceflow/sdk`;
  
  const reactIntegration = `// pages/_app.tsx or App.tsx
import { TraceflowProvider } from '@traceflow/sdk/react';

export default function App({ Component, pageProps }) {
  return (
    <TraceflowProvider
      apiKey="${apiKey}"
      config={{
        capture: {
          clicks: ${config.captureClicks},
          scrolls: ${config.captureScrolls},
          formInputs: ${config.captureFormInputs},
          rageClicks: ${config.captureRageClicks},
          mouseMovement: ${config.captureMouse}
        },
        privacy: {
          maskSensitiveData: ${config.maskSensitiveData},
          excludeSelectors: '${config.excludeSelectors}'
        },
        sampleRate: ${config.sampleRate}
      }}
    >
      <Component {...pageProps} />
    </TraceflowProvider>
  );
}`;

  const nodeIntegration = `// server.js or app.js
const { TraceflowNode } = require('@traceflow/sdk/node');

const traceflow = new TraceflowNode({
  apiKey: '${apiKey}',
  environment: process.env.NODE_ENV,
  serviceName: 'your-backend-service'
});

// Express middleware
app.use(traceflow.middleware());

// Track custom events
traceflow.track('payment_initiated', {
  userId: user.id,
  amount: order.total,
  currency: 'INR'
});`;

  const mobileSDK = `// React Native
import { TraceflowMobile } from '@traceflow/sdk/mobile';

TraceflowMobile.init({
  apiKey: '${apiKey}',
  captureGestures: true,
  captureTaps: true,
  captureScrolls: true,
  maskSensitiveViews: true,
  excludeViewTags: ['sensitive', 'pii']
});

// iOS Swift
import TraceflowSDK

Traceflow.configure(
  apiKey: "${apiKey}",
  options: TraceflowOptions(
    captureGestures: true,
    privacyMode: .standard
  )
)

// Android Kotlin
Traceflow.init(
  context = this,
  apiKey = "${apiKey}",
  options = TraceflowOptions(
    captureGestures = true,
    privacyMode = PrivacyMode.STANDARD
  )
)`;

  return (
    <div className="space-y-6">
      {/* API Key Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-900 to-slate-800">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#00C2D8]" />
                Your API Key
              </CardTitle>
              <CardDescription className="text-slate-400">
                Use this key to authenticate your SDK installation
              </CardDescription>
            </div>
            <Badge className="bg-emerald-500/20 text-emerald-400">Production</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
            <code className="flex-1 text-[#00C2D8] font-mono text-sm">{apiKey}</code>
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={() => handleCopy(apiKey, 'apiKey')}
            >
              {copied === 'apiKey' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <p className="mt-3 text-xs text-slate-400 flex items-center gap-2">
            <Shield className="h-3 w-3" />
            Your API key is encrypted in transit and at rest. Never expose it in client-side code for sensitive operations.
          </p>
        </CardContent>
      </Card>

      {/* Integration Tabs */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-[#0B3D91]" />
            SDK Integration
          </CardTitle>
          <CardDescription>
            Choose your platform and follow the integration guide
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="javascript" className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="javascript" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Web
              </TabsTrigger>
              <TabsTrigger value="react" className="flex items-center gap-2">
                <Code2 className="h-4 w-4" />
                React/Next.js
              </TabsTrigger>
              <TabsTrigger value="node" className="flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                Node.js
              </TabsTrigger>
              <TabsTrigger value="mobile" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Mobile
              </TabsTrigger>
            </TabsList>

            <TabsContent value="javascript" className="space-y-4">
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Add this script before the closing <code>&lt;/head&gt;</code> tag
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(generateScript(), 'jsScript')}
                  >
                    {copied === 'jsScript' ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                    Copy
                  </Button>
                </div>
                <pre className="p-4 rounded-lg bg-slate-900 text-slate-100 text-sm overflow-x-auto">
                  <code>{generateScript()}</code>
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="react" className="space-y-4">
              <div className="mb-4 p-3 rounded-lg bg-muted flex items-center gap-3">
                <Terminal className="h-5 w-5 text-muted-foreground" />
                <code className="text-sm font-mono flex-1">{npmInstallScript}</code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCopy(npmInstallScript, 'npm')}
                >
                  {copied === 'npm' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Wrap your app with TraceflowProvider
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(reactIntegration, 'react')}
                  >
                    {copied === 'react' ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                    Copy
                  </Button>
                </div>
                <pre className="p-4 rounded-lg bg-slate-900 text-slate-100 text-sm overflow-x-auto">
                  <code>{reactIntegration}</code>
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="node" className="space-y-4">
              <div className="mb-4 p-3 rounded-lg bg-muted flex items-center gap-3">
                <Terminal className="h-5 w-5 text-muted-foreground" />
                <code className="text-sm font-mono flex-1">{npmInstallScript}</code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCopy(npmInstallScript, 'npm-node')}
                >
                  {copied === 'npm-node' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Initialize on your backend for full-stack observability
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(nodeIntegration, 'node')}
                  >
                    {copied === 'node' ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                    Copy
                  </Button>
                </div>
                <pre className="p-4 rounded-lg bg-slate-900 text-slate-100 text-sm overflow-x-auto">
                  <code>{nodeIntegration}</code>
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="mobile" className="space-y-4">
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    React Native, iOS (Swift), and Android (Kotlin) examples
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(mobileSDK, 'mobile')}
                  >
                    {copied === 'mobile' ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                    Copy
                  </Button>
                </div>
                <pre className="p-4 rounded-lg bg-slate-900 text-slate-100 text-sm overflow-x-auto max-h-96">
                  <code>{mobileSDK}</code>
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Configuration Options */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-[#0B3D91]" />
            SDK Configuration
          </CardTitle>
          <CardDescription>
            Customize what data TRACEFLOW captures
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Capture Settings */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                Capture Settings
              </h4>
              {[
                { key: 'captureClicks', label: 'Click Events', desc: 'Track all user clicks' },
                { key: 'captureScrolls', label: 'Scroll Events', desc: 'Track scroll behavior' },
                { key: 'captureFormInputs', label: 'Form Interactions', desc: 'Track form field focus/blur' },
                { key: 'captureRageClicks', label: 'Rage Click Detection', desc: 'Auto-detect frustration' },
                { key: 'captureMouse', label: 'Mouse Movement', desc: 'Track cursor positions' }
              ].map((setting) => (
                <div key={setting.key} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div>
                    <Label className="font-medium">{setting.label}</Label>
                    <p className="text-xs text-muted-foreground">{setting.desc}</p>
                  </div>
                  <Switch
                    checked={config[setting.key as keyof SDKConfigOptions] as boolean}
                    onCheckedChange={(checked) => 
                      setConfig(prev => ({ ...prev, [setting.key]: checked }))
                    }
                  />
                </div>
              ))}
            </div>

            {/* Privacy Settings */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Privacy & Compliance
              </h4>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <Label className="font-medium">Mask Sensitive Data</Label>
                  <p className="text-xs text-muted-foreground">Auto-mask PII and financial data</p>
                </div>
                <Switch
                  checked={config.maskSensitiveData}
                  onCheckedChange={(checked) => 
                    setConfig(prev => ({ ...prev, maskSensitiveData: checked }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Exclude Selectors</Label>
                <Input
                  value={config.excludeSelectors}
                  onChange={(e) => setConfig(prev => ({ ...prev, excludeSelectors: e.target.value }))}
                  placeholder="[data-tf-ignore], .tf-ignore"
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Elements matching these selectors won't be recorded
                </p>
              </div>

              <div className="space-y-2">
                <Label>Sample Rate (%)</Label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={config.sampleRate}
                  onChange={(e) => setConfig(prev => ({ ...prev, sampleRate: parseInt(e.target.value) || 100 }))}
                />
                <p className="text-xs text-muted-foreground">
                  Percentage of sessions to record (100 = all sessions)
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Installation Verification */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-emerald-50 to-teal-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-1">Verify Your Installation</h4>
              <p className="text-sm text-muted-foreground mb-3">
                After adding the SDK, visit your website and perform some actions. 
                Data should appear in your dashboard within 60 seconds.
              </p>
              <div className="flex items-center gap-3">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Zap className="h-4 w-4 mr-2" />
                  Test Connection
                </Button>
                <Button variant="outline">View Integration Docs</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TraceflowSDK;
