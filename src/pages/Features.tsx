import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { 
  Users, 
  Calendar, 
  Wallet, 
  UserPlus, 
  FolderKanban, 
  Receipt, 
  ShieldCheck, 
  KeyRound, 
  Package, 
  FileSearch, 
  TrendingUp, 
  Megaphone, 
  Sparkles, 
  Zap, 
  Lock,
  ArrowRight,
  CheckCircle2,
  Building2
} from "lucide-react";

const modules = [
  {
    id: 1,
    icon: Users,
    title: "Workforce Management",
    tagline: "Your single source of truth for all employee data.",
    description: "Centralized employee database with multi-location & multi-entity support. Manage documents, ID proofs, employment letters, contracts, department structures, org charts, and the complete employee lifecycle from onboarding to exit.",
    features: [
      "Employee database with multi-location support",
      "Documents, ID proofs & contracts management",
      "Department & Org chart visualization",
      "Employee lifecycle management",
      "Seat allocation & equipment tracking"
    ],
    color: "from-blue-500 to-cyan-500",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500"
  },
  {
    id: 2,
    icon: Calendar,
    title: "Attendance & Leave OS",
    tagline: "Accurate payroll inputs. Zero manual errors.",
    description: "Complete attendance management with biometric, app-based, geofence, or API integration. Includes shift scheduling, roster management, leave policies, allocations, carry-forward rules, and manager approvals.",
    features: [
      "Biometric, app-based & geofence attendance",
      "Shift scheduling & roster management",
      "Leave policies & allocations",
      "Manager approval workflows",
      "Real-time insights dashboard"
    ],
    color: "from-green-500 to-emerald-500",
    iconBg: "bg-green-500/10",
    iconColor: "text-green-500"
  },
  {
    id: 3,
    icon: Wallet,
    title: "Payroll Engine",
    tagline: "Modern HR + payroll engineered for India's workforce.",
    description: "Zero manual payroll pain with 100% compliance. Auto salary calculations, PF, ESI, PT, TDS, LWF compliance, full CTC structure builder, bulk payslip generation, and income tax previews for employees.",
    features: [
      "Auto salary calculations",
      "PF, ESI, PT, TDS, LWF compliance",
      "Full CTC structure builder",
      "Bulk payslip generation",
      "Income tax preview for employees"
    ],
    color: "from-amber-500 to-orange-500",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500"
  },
  {
    id: 4,
    icon: UserPlus,
    title: "Recruitment & ATS",
    tagline: "Faster hiring. Structured candidate management.",
    description: "End-to-end recruitment with job posting, candidate pipeline management, resume parsing, interview scheduling, offer management, and comprehensive hiring analytics.",
    features: [
      "Job posting & distribution",
      "Candidate pipeline management",
      "AI-powered resume parsing",
      "Interview scheduling",
      "Hiring analytics & insights"
    ],
    color: "from-purple-500 to-violet-500",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-500"
  },
  {
    id: 5,
    icon: FolderKanban,
    title: "Projects & Tasks",
    tagline: "Plan it. Track it. Bill it. All on ATLAS.",
    description: "Complete project management where Operations, HR, and Finance come together. Project creation, task assignment, time tracking, billable hours, milestones, and resource management.",
    features: [
      "Project creation & management",
      "Task assignment & tracking",
      "Time tracking & billable hours",
      "Milestones & deadlines",
      "Resource management"
    ],
    color: "from-indigo-500 to-blue-500",
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-500"
  },
  {
    id: 6,
    icon: Receipt,
    title: "Finance & Expense",
    tagline: "Smarter billing for smarter businesses.",
    description: "Complete expense visibility with automated controls. Expense submissions, multi-level approvals, automated reimbursement calculations, budgeting, and vendor payment workflows.",
    features: [
      "Expense submissions & tracking",
      "Multi-level approvals",
      "Automated reimbursement calculations",
      "Budgeting & forecasting",
      "Vendor payment workflows"
    ],
    color: "from-teal-500 to-cyan-500",
    iconBg: "bg-teal-500/10",
    iconColor: "text-teal-500"
  },
  {
    id: 7,
    icon: ShieldCheck,
    title: "Compliance & Risk",
    tagline: "Compliance that completes itself.",
    description: "Zero compliance surprises with automated PF, ESIC, PT filings tracker, policy acknowledgment workflows, statutory registers, risk & governance dashboard, and certificate renewals.",
    features: [
      "PF, ESI, PT filings tracker",
      "Policy acknowledgment workflows",
      "Statutory registers",
      "Risk & governance dashboard",
      "Certificate renewals"
    ],
    color: "from-red-500 to-rose-500",
    iconBg: "bg-red-500/10",
    iconColor: "text-red-500"
  },
  {
    id: 8,
    icon: KeyRound,
    title: "Identity & Access",
    tagline: "Enterprise trust. Secure data governance.",
    description: "Role-based access control (RBAC), SSO integration with Google, Microsoft, Okta, SAML, API keys & app integrations, and comprehensive security audit logs.",
    features: [
      "Role-based access control (RBAC)",
      "SSO (Google, Microsoft, Okta, SAML)",
      "API keys & app integrations",
      "Security audit logs",
      "Multi-factor authentication"
    ],
    color: "from-slate-500 to-zinc-500",
    iconBg: "bg-slate-500/10",
    iconColor: "text-slate-500"
  },
  {
    id: 9,
    icon: Package,
    title: "Assets & EMS",
    tagline: "Your enterprise assets — under one roof.",
    description: "Complete asset lifecycle management for laptops, phones, SIMs, and tools. Assignment workflows, maintenance logs, and full asset lifecycle tracking.",
    features: [
      "Laptop, phone, SIM tracking",
      "Assignment workflows",
      "Maintenance logs",
      "Asset lifecycle management",
      "QR code tracking"
    ],
    color: "from-pink-500 to-rose-500",
    iconBg: "bg-pink-500/10",
    iconColor: "text-pink-500"
  },
  {
    id: 10,
    icon: FileSearch,
    title: "BGV Suite",
    tagline: "Instant trust. Automated verification.",
    description: "Risk-free hiring with PAN, Aadhaar, employment, and education checks. Third-party integration and automated status tracking for complete background verification.",
    features: [
      "PAN & Aadhaar verification",
      "Employment history checks",
      "Education verification",
      "Third-party integration",
      "Automated status tracking"
    ],
    color: "from-cyan-500 to-sky-500",
    iconBg: "bg-cyan-500/10",
    iconColor: "text-cyan-500"
  },
  {
    id: 11,
    icon: TrendingUp,
    title: "Performance Management",
    tagline: "Data-driven performance culture.",
    description: "Complete performance management with Goals/OKRs, 360° feedback, quarterly reviews, and comprehensive performance history tracking.",
    features: [
      "Goals & OKRs",
      "360° feedback",
      "Quarterly reviews",
      "Performance history",
      "Skill mapping"
    ],
    color: "from-emerald-500 to-green-500",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500"
  },
  {
    id: 12,
    icon: Megaphone,
    title: "Announcements & Docs",
    tagline: "Single source for internal communication.",
    description: "Company-wide announcements, policy center, employee letters, auto watermarking, and access logs for complete document management.",
    features: [
      "Company-wide announcements",
      "Policy center",
      "Employee letters",
      "Auto watermarking",
      "Access logs"
    ],
    color: "from-orange-500 to-amber-500",
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-500"
  },
  {
    id: 13,
    icon: Sparkles,
    title: "Proxima AI",
    tagline: "AI-native organization — not just HR automation.",
    description: "AI-powered insights, workflow automation, summaries, payroll anomaly detection, hiring recommendations, and employee sentiment analysis. Query your data like ChatGPT.",
    features: [
      "AI-powered insights",
      "Workflow automation",
      "Payroll anomaly detection",
      "Hiring recommendations",
      "Natural language queries"
    ],
    color: "from-violet-500 to-purple-500",
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-500"
  },
  {
    id: 14,
    icon: Zap,
    title: "OpZenix Automation",
    tagline: "Zero manual workflows. Everything runs automatically.",
    description: "Powered by Temporal Workflows for onboarding, approval chains, multi-step HR workflows, finance workflows, compliance workflows, and payroll pre-check automations.",
    features: [
      "Onboarding workflows",
      "Approval chains",
      "Multi-step HR workflows",
      "Finance & payment workflows",
      "Compliance automations"
    ],
    color: "from-yellow-500 to-amber-500",
    iconBg: "bg-yellow-500/10",
    iconColor: "text-yellow-500"
  },
  {
    id: 15,
    icon: Lock,
    title: "Governance Layer",
    tagline: "Built for trust. Designed for accuracy. Engineered for scale.",
    description: "Enterprise-grade security with access logs, file encryption & watermarking, virus scanning, DR replication, full audit log indexing, and API rate limits.",
    features: [
      "Access logs",
      "File encryption & watermarking",
      "Virus scanning",
      "DR replication",
      "API rate limits"
    ],
    color: "from-gray-500 to-slate-500",
    iconBg: "bg-gray-500/10",
    iconColor: "text-gray-500"
  }
];

const Features = () => {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: modulesRef, isVisible: modulesVisible } = useScrollAnimation({ threshold: 0.05 });

  return (
    <>
      <Helmet>
        <title>Features | CropXon ATLAS - Enterprise Workforce Operating System</title>
        <meta name="description" content="Explore all 15 modules of ATLAS - the unified workforce OS for HR, Payroll, Compliance, Finance, Recruitment, Projects, AI, and Automation." />
        <meta name="keywords" content="ATLAS features, HR software, payroll system, workforce management, compliance automation, AI HR, enterprise software" />
        <link rel="canonical" href="https://atlas.cropxon.com/features" />
      </Helmet>

      <main className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section */}
        <section 
          ref={heroRef as React.RefObject<HTMLElement>}
          className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden"
        >
          {/* Background gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className={`max-w-4xl mx-auto text-center transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-semibold tracking-wide uppercase mb-6">
                <Building2 className="w-4 h-4" />
                15 Unified Modules
              </span>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight mb-6">
                <span className="text-gradient">From Hire to Retire</span>
                <span className="block text-foreground mt-2">And Everything in Between</span>
              </h1>
              
              <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                ATLAS is an AI-powered Workforce OS that automates HR, Payroll, Compliance, Finance, 
                Recruitment, Projects, and Operations for modern enterprises.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/get-quote">
                  <Button variant="default" size="lg" className="group shadow-lg shadow-primary/20">
                    Start Your Journey
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/onboarding">
                  <Button variant="outline" size="lg">
                    Watch Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Modules Grid */}
        <section 
          ref={modulesRef as React.RefObject<HTMLElement>}
          className="py-20 lg:py-28"
        >
          <div className="container mx-auto px-4 lg:px-8">
            <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${modulesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight mb-6">
                One Platform. <span className="text-gradient">Infinite Possibilities.</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Explore the complete suite of modules that power modern enterprises.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {modules.map((module, index) => {
                const Icon = module.icon;
                return (
                  <div 
                    key={module.id}
                    className={`group relative bg-card border border-border/60 rounded-2xl p-6 lg:p-8 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 ${modulesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    {/* Module Number Badge */}
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center">
                      <span className="text-xs font-semibold text-muted-foreground">
                        {String(module.id).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-xl ${module.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-7 h-7 ${module.iconColor}`} strokeWidth={1.5} />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                      {module.title}
                    </h3>

                    {/* Tagline */}
                    <p className={`text-sm font-medium bg-gradient-to-r ${module.color} bg-clip-text text-transparent mb-4`}>
                      {module.tagline}
                    </p>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                      {module.description}
                    </p>

                    {/* Features List */}
                    <ul className="space-y-2">
                      {module.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-foreground/80">
                          <CheckCircle2 className={`w-4 h-4 ${module.iconColor} mt-0.5 flex-shrink-0`} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-28 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight mb-6">
                Ready to Transform Your Organization?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join hundreds of enterprises that trust ATLAS to manage their workforce, 
                streamline operations, and drive growth.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/get-quote">
                  <Button variant="default" size="lg" className="group shadow-lg shadow-primary/20">
                    Get Started Today
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/industries">
                  <Button variant="outline" size="lg">
                    View Industry Solutions
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default Features;
