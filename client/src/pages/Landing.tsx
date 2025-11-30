import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/lib/i18n";
import { 
  Shield, 
  Lock, 
  Heart, 
  Users, 
  BookOpen, 
  AlertTriangle,
  Sparkles,
  Globe,
  ChevronRight
} from "lucide-react";

const features = [
  {
    icon: Shield,
    titleKey: "AI Threat Detection",
    descKey: "Real-time analysis of messages for harassment, threats, and manipulation patterns",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Lock,
    titleKey: "Secure Evidence Vault",
    descKey: "Encrypted storage for screenshots, chat logs, and documentation with legal-ready exports",
    color: "text-teal-500",
    bgColor: "bg-teal-500/10",
  },
  {
    icon: Heart,
    titleKey: "Trauma-Informed Support",
    descKey: "Safe Twin AI companion providing empathetic guidance and emotional support",
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
  {
    icon: AlertTriangle,
    titleKey: "Emergency Response",
    descKey: "Quick-access panic button with trusted contact alerts and location sharing",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    icon: Users,
    titleKey: "Community Protection",
    descKey: "Anonymous reporting system to protect others from dangerous accounts",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: BookOpen,
    titleKey: "Digital Safety Education",
    descKey: "Interactive lessons on phishing, grooming, deepfakes, and privacy protection",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
];

export default function Landing() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  return (
         
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/30 dark:via-purple-950/10 to-background">
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-teal-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold tracking-tight">AURA</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="gap-2" asChild>
              <a href="/api/login" data-testid="button-login-header">
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{t("login")}</span>
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-20">
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-8">
              <Shield className="w-4 h-4" />
              <span>Protecting African Women & Girls</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-teal-500 bg-clip-text text-transparent">
                {t("welcome")}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-4 font-medium">
              {t("tagline")}
            </p>
            
            <p className="text-base md:text-lg text-muted-foreground/80 max-w-2xl mx-auto mb-10">
              {t("description")}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="w-full sm:w-auto gap-2 text-base px-8 py-6 bg-gradient-to-r from-purple-600 to-purple-700 border-purple-border"
                asChild
              >
                <a href="/api/login" data-testid="button-get-started">
                  Get Started Free
                  <ChevronRight className="w-5 h-5" />
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto gap-2 text-base px-8 py-6"
                data-testid="button-learn-more"
              >
                <BookOpen className="w-5 h-5" />
                Learn More
              </Button>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comprehensive Protection
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              AURA combines AI-powered threat detection with trauma-informed support 
              to create a sanctuary of digital safety
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group hover-elevate border-border/50 bg-card/50 backdrop-blur-sm"
                data-testid={`card-feature-${index}`}
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.titleKey}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.descKey}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
          <Card className="bg-gradient-to-br from-purple-600 to-purple-800 border-0 overflow-hidden">
            <CardContent className="p-8 md:p-12 text-center text-white relative">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
              <div className="relative z-10">
                <Heart className="w-12 h-12 mx-auto mb-6 opacity-90" />
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  You Are Not Alone
                </h2>
                <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
                  AURA was designed by and for African women and girls. 
                  Every feature is built with trauma-informed care, cultural sensitivity, 
                  and your complete safety in mind.
                </p>
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="gap-2 bg-white text-purple-700 border-white"
                  asChild
                >
                  <a href="/api/login" data-testid="button-join-community">
                    Join Our Community
                    <ChevronRight className="w-5 h-5" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">6</div>
              <div className="text-sm text-muted-foreground">Languages Supported</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">AI Protection</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Private & Secure</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">Free</div>
              <div className="text-sm text-muted-foreground">Forever</div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/50 py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-teal-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">AURA</span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Autonomous Unified Response Assistant - Protecting Digital Lives
          </p>
        </div>
      </footer>
    </div>
  );
}
