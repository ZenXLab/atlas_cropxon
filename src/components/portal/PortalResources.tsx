import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, FileText, Download, ExternalLink,
  Palette, Code, Rocket, HelpCircle
} from "lucide-react";

export const PortalResources = () => {
  const resources = [
    {
      category: "UI Kits",
      icon: Palette,
      items: [
        { name: "Brand Guidelines", type: "PDF", size: "2.4 MB" },
        { name: "Design System", type: "Figma", size: "External" },
        { name: "Icon Library", type: "ZIP", size: "1.1 MB" },
      ]
    },
    {
      category: "Documentation",
      icon: BookOpen,
      items: [
        { name: "API Documentation", type: "PDF", size: "3.2 MB" },
        { name: "User Guide", type: "PDF", size: "1.8 MB" },
        { name: "Integration Guide", type: "PDF", size: "980 KB" },
      ]
    },
    {
      category: "Deployment",
      icon: Rocket,
      items: [
        { name: "Deployment Checklist", type: "PDF", size: "450 KB" },
        { name: "Environment Setup", type: "MD", size: "120 KB" },
        { name: "Release Notes", type: "PDF", size: "680 KB" },
      ]
    },
    {
      category: "Technical",
      icon: Code,
      items: [
        { name: "Architecture Overview", type: "PDF", size: "1.5 MB" },
        { name: "Database Schema", type: "PDF", size: "890 KB" },
        { name: "Security Guidelines", type: "PDF", size: "720 KB" },
      ]
    },
  ];

  const helpLinks = [
    { name: "Knowledge Base", description: "Browse our help articles", url: "#" },
    { name: "Video Tutorials", description: "Learn with step-by-step videos", url: "#" },
    { name: "FAQs", description: "Frequently asked questions", url: "#" },
    { name: "Contact Support", description: "Get help from our team", url: "#" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Resources</h1>
        <p className="text-muted-foreground">Documentation, guides, and helpful materials</p>
      </div>

      {/* Resource Categories */}
      <div className="grid gap-6 md:grid-cols-2">
        {resources.map((category) => {
          const Icon = category.icon;
          return (
            <Card key={category.category}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>{category.category}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {category.items.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{item.type}</Badge>
                      <Button variant="ghost" size="sm">
                        {item.type === "External" ? (
                          <ExternalLink className="h-4 w-4" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Help Links */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <HelpCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>Quick links to support resources</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {helpLinks.map((link, index) => (
              <a 
                key={index}
                href={link.url}
                className="p-4 rounded-lg border hover:border-primary/50 hover:bg-muted/30 transition-all group"
              >
                <h4 className="font-medium group-hover:text-primary transition-colors">
                  {link.name}
                </h4>
                <p className="text-sm text-muted-foreground">{link.description}</p>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
