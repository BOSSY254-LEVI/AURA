import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import type { Threat } from "@shared/schema";
import { 
  Shield, 
  MessageSquareWarning, 
  FileText, 
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  ChevronRight,
  Activity
} from "lucide-react";
import { Link } from "wouter";

function SafetyScoreCard({ score }: { score: number }) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-amber-500";
    return "text-rose-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Needs Attention";
    return "At Risk";
  };

  return (
    <Card className="bg-gradient-to-br from-purple-600 to-purple-800 border-0 text-white overflow-hidden">
      <CardContent className="p-6 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5" />
            <span className="text-sm font-medium text-white/90">Safety Score</span>
          </div>
          <div className="flex items-end gap-3 mb-4">
            <span className="text-5xl font-bold">{score}</span>
            <span className="text-2xl text-white/70 mb-1">/100</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${score >= 80 ? 'bg-green-400' : score >= 60 ? 'bg-amber-400' : 'bg-rose-400'}`} />
            <span className="text-sm text-white/80">{getScoreLabel(score)}</span>
          </div>
          <Progress 
            value={score} 
            className="mt-4 h-2 bg-white/20" 
          />
        </div>
      </CardContent>
    </Card>
  );
}

function ThreatCard({ threat }: { threat: Threat }) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400";
      case "high": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "medium": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      default: return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "harassment": return MessageSquareWarning;
      case "threat": return AlertTriangle;
      default: return Activity;
    }
  };

  const Icon = getTypeIcon(threat.type);
  const formattedDate = threat.createdAt 
    ? new Date(threat.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    : '';

  return (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-card hover-elevate border border-border/50">
      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm capitalize">{threat.type.replace('_', ' ')}</span>
          <Badge variant="secondary" className={`text-xs ${getSeverityColor(threat.severity)}`}>
            {threat.severity}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{threat.content}</p>
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{formattedDate}</span>
          {threat.isResolved && (
            <>
              <CheckCircle2 className="w-3 h-3 text-green-500 ml-2" />
              <span className="text-green-600 dark:text-green-400">Resolved</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickActions() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  const actions = [
    { 
      icon: MessageSquareWarning, 
      label: t("analyzeMessage"), 
      href: "/companion",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    { 
      icon: FileText, 
      label: t("addEvidence"), 
      href: "/vault",
      color: "text-teal-500",
      bgColor: "bg-teal-500/10"
    },
    { 
      icon: AlertTriangle, 
      label: t("reportIncident"), 
      href: "/community",
      color: "text-amber-500",
      bgColor: "bg-amber-500/10"
    },
    { 
      icon: Sparkles, 
      label: t("getHelp"), 
      href: "/companion",
      color: "text-rose-500",
      bgColor: "bg-rose-500/10"
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-muted-foreground" />
          {t("quickActions")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Button 
                variant="ghost" 
                className="w-full h-auto flex-col gap-2 p-4 hover-elevate"
                data-testid={`button-quick-action-${index}`}
              >
                <div className={`w-10 h-10 rounded-lg ${action.bgColor} flex items-center justify-center`}>
                  <action.icon className={`w-5 h-5 ${action.color}`} />
                </div>
                <span className="text-xs font-medium text-center">{action.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const { user } = useAuth();

  const { data: threats, isLoading: threatsLoading } = useQuery<Threat[]>({
    queryKey: ["/api/threats"],
  });

  const safetyScore = user?.safetyScore ?? 85;
  const recentThreats = threats?.slice(0, 5) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            {t("dashboard")}
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back{user?.name ? `, ${user.name}` : ''}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SafetyScoreCard score={safetyScore} />

          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between gap-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-muted-foreground" />
                {t("recentThreats")}
              </CardTitle>
              <Link href="/insights">
                <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="pt-0">
              {threatsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-4 p-4">
                      <Skeleton className="w-10 h-10 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentThreats.length > 0 ? (
                <div className="space-y-3">
                  {recentThreats.map((threat) => (
                    <ThreatCard key={threat.id} threat={threat} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-medium mb-1">{t("noThreats")}</h3>
                  <p className="text-sm text-muted-foreground">{t("stayVigilant")}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <QuickActions />

          <Card className="bg-gradient-to-br from-teal-50 to-purple-50 dark:from-teal-950/30 dark:to-purple-950/30 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Safe Twin</h3>
                  <p className="text-xs text-muted-foreground">Your AI companion</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Need someone to talk to? Safe Twin is here to help with guidance, 
                support, and safety advice.
              </p>
              <Link href="/companion">
                <Button className="w-full gap-2" data-testid="button-talk-to-safe-twin">
                  <Sparkles className="w-4 h-4" />
                  Talk to Safe Twin
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
