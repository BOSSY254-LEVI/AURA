import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/lib/i18n";
import type { Threat, SafetyInsight } from "server/shared/schema";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";

const COLORS = ["#8b5cf6", "#14b8a6", "#f59e0b", "#ef4444", "#6366f1", "#ec4899"];

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string | number;
  change?: string;
  icon: typeof TrendingUp;
  trend?: "up" | "down" | "neutral";
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {change && (
              <div className="flex items-center gap-1 mt-1">
                {trend === "up" ? (
                  <TrendingUp className="w-3 h-3 text-green-500" />
                ) : trend === "down" ? (
                  <TrendingDown className="w-3 h-3 text-rose-500" />
                ) : null}
                <span
                  className={`text-xs ${
                    trend === "up"
                      ? "text-green-600"
                      : trend === "down"
                      ? "text-rose-600"
                      : "text-muted-foreground"
                  }`}
                >
                  {change}
                </span>
              </div>
            )}
          </div>
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <Icon className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ThreatsByCategory({ threats }: { threats: Threat[] }) {
  const categoryData = threats.reduce((acc, threat) => {
    const type = threat.type || "unknown";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(categoryData).map(([name, value]) => ({
    name: name.replace("_", " ").replace(/^\w/, (c) => c.toUpperCase()),
    value,
  }));

  if (data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        No threat data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent }) =>
            `${name} (${(percent * 100).toFixed(0)}%)`
          }
          labelLine={false}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

function ThreatTimeline({ threats }: { threats: Threat[] }) {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split("T")[0];
  });

  const timelineData = last7Days.map((date) => {
    const dayThreats = threats.filter((t) => {
      const threatDate = t.createdAt
        ? new Date(t.createdAt).toISOString().split("T")[0]
        : null;
      return threatDate === date;
    });
    return {
      date: new Date(date).toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      threats: dayThreats.length,
      resolved: dayThreats.filter((t) => t.isResolved).length,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={timelineData}>
        <defs>
          <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          stroke="hsl(var(--muted-foreground))"
        />
        <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
          }}
        />
        <Area
          type="monotone"
          dataKey="threats"
          stroke="#8b5cf6"
          fill="url(#colorThreats)"
          name="Total Threats"
        />
        <Area
          type="monotone"
          dataKey="resolved"
          stroke="#14b8a6"
          fill="url(#colorResolved)"
          name="Resolved"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function SeverityBreakdown({ threats }: { threats: Threat[] }) {
  const severityData = ["low", "medium", "high", "critical"].map((severity) => ({
    severity: severity.charAt(0).toUpperCase() + severity.slice(1),
    count: threats.filter((t) => t.severity === severity).length,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={severityData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
        <YAxis
          dataKey="severity"
          type="category"
          tick={{ fontSize: 12 }}
          stroke="hsl(var(--muted-foreground))"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
          }}
        />
        <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function RecentThreatsTable({ threats }: { threats: Threat[] }) {
  const severityColors = {
    critical: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
    high: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    low: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
  };

  return (
    <div className="space-y-3">
      {threats.slice(0, 10).map((threat) => (
        <div
          key={threat.id}
          className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm capitalize">
                {threat.type?.replace("_", " ")}
              </span>
              <Badge
                variant="secondary"
                className={severityColors[threat.severity as keyof typeof severityColors]}
              >
                {threat.severity}
              </Badge>
              {threat.isResolved && (
                <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Resolved
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {threat.content}
            </p>
          </div>
          <div className="text-xs text-muted-foreground text-right flex-shrink-0">
            {threat.createdAt && new Date(threat.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}
      {threats.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No threats recorded yet
        </div>
      )}
    </div>
  );
}

export default function Insights() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  const { data: threats, isLoading: threatsLoading } = useQuery<Threat[]>({
    queryKey: ["/api/threats"],
  });

  const allThreats = threats || [];
  const resolvedThreats = allThreats.filter((t) => t.isResolved);
  const criticalThreats = allThreats.filter((t) => t.severity === "critical" || t.severity === "high");

  const thisWeekThreats = allThreats.filter((t) => {
    if (!t.createdAt) return false;
    const threatDate = new Date(t.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return threatDate >= weekAgo;
  });

  const resolutionRate = allThreats.length > 0 
    ? Math.round((resolvedThreats.length / allThreats.length) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <Activity className="w-7 h-7 text-purple-500" />
          {t("insights")}
        </h1>
        <p className="text-muted-foreground mt-1">
          Track your safety metrics and threat patterns
        </p>
      </div>

      {threatsLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Threats"
            value={allThreats.length}
            change={`${thisWeekThreats.length} this week`}
            icon={AlertTriangle}
            trend="neutral"
          />
          <StatCard
            title="Resolved"
            value={resolvedThreats.length}
            change={`${resolutionRate}% resolution rate`}
            icon={CheckCircle2}
            trend="up"
          />
          <StatCard
            title="High Priority"
            value={criticalThreats.length}
            change="Needs attention"
            icon={Shield}
            trend={criticalThreats.length > 0 ? "down" : "neutral"}
          />
          <StatCard
            title="This Week"
            value={thisWeekThreats.length}
            change="Last 7 days"
            icon={Calendar}
            trend="neutral"
          />
        </div>
      )}

      <Tabs defaultValue="timeline" className="w-full">
        <TabsList>
          <TabsTrigger value="timeline" className="gap-2" data-testid="tab-timeline">
            <BarChart3 className="w-4 h-4" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="categories" className="gap-2" data-testid="tab-categories">
            <PieChartIcon className="w-4 h-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="severity" className="gap-2" data-testid="tab-severity">
            <Activity className="w-4 h-4" />
            Severity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Threat Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              {threatsLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <ThreatTimeline threats={allThreats} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Threats by Category</CardTitle>
            </CardHeader>
            <CardContent>
              {threatsLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <ThreatsByCategory threats={allThreats} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="severity" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Severity Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {threatsLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <SeverityBreakdown threats={allThreats} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {threatsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-3">
                  <Skeleton className="h-10 flex-1 rounded-lg" />
                </div>
              ))}
            </div>
          ) : (
            <RecentThreatsTable threats={allThreats} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
