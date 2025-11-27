import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { CommunityReport } from "@shared/schema";
import {
  Users,
  AlertTriangle,
  Plus,
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Globe,
  MessageSquareWarning,
} from "lucide-react";

const platformIcons: Record<string, string> = {
  twitter: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  facebook: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
  instagram: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
  whatsapp: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  tiktok: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  telegram: "bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400",
  other: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

const incidentTypes: Record<string, { label: string; color: string }> = {
  harassment: { label: "Harassment", color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400" },
  threats: { label: "Threats", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  hate_speech: { label: "Hate Speech", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  impersonation: { label: "Impersonation", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  image_abuse: { label: "Image Abuse", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  doxxing: { label: "Doxxing", color: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400" },
  scam: { label: "Scam", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  other: { label: "Other", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400" },
};

function ReportCard({ report }: { report: CommunityReport }) {
  const statusColors = {
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    verified: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    dismissed: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  };

  const StatusIcon = report.status === "verified" ? CheckCircle2 : report.status === "dismissed" ? XCircle : Clock;
  const formattedDate = report.createdAt
    ? new Date(report.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <Card className="hover-elevate" data-testid={`card-report-${report.id}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${platformIcons[report.platform] || platformIcons.other}`}>
            <Globe className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-2 mb-2">
              <Badge variant="secondary" className={incidentTypes[report.incidentType]?.color || incidentTypes.other.color}>
                {incidentTypes[report.incidentType]?.label || "Other"}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {report.platform}
              </Badge>
              <Badge variant="secondary" className={`flex items-center gap-1 ${statusColors[report.status as keyof typeof statusColors] || statusColors.pending}`}>
                <StatusIcon className="w-3 h-3" />
                {report.status}
              </Badge>
            </div>
            {report.accountIdentifier && (
              <p className="text-sm font-medium mb-1">@{report.accountIdentifier}</p>
            )}
            {report.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {report.description}
              </p>
            )}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{formattedDate}</span>
              </div>
              {report.region && (
                <div className="flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  <span>{report.region}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ReportDialog() {
  const [open, setOpen] = useState(false);
  const [platform, setPlatform] = useState("");
  const [accountIdentifier, setAccountIdentifier] = useState("");
  const [incidentType, setIncidentType] = useState("");
  const [description, setDescription] = useState("");
  const [region, setRegion] = useState("");
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/community/reports", {
        platform,
        accountIdentifier: accountIdentifier || null,
        incidentType,
        description: description || null,
        region: region || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community/reports"] });
      toast({
        title: "Report submitted",
        description: "Thank you for helping protect our community.",
      });
      setOpen(false);
      setPlatform("");
      setAccountIdentifier("");
      setIncidentType("");
      setDescription("");
      setRegion("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2" data-testid="button-new-report">
          <Plus className="w-4 h-4" />
          Report Account
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            Report Dangerous Account
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Your report is anonymous and helps protect others in our community.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
          className="space-y-4 mt-4"
        >
          <div className="space-y-2">
            <Label>Platform</Label>
            <Select value={platform} onValueChange={setPlatform} required>
              <SelectTrigger data-testid="select-platform">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="twitter">Twitter/X</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="telegram">Telegram</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="account">Account Username/ID (optional)</Label>
            <Input
              id="account"
              placeholder="@username or profile link"
              value={accountIdentifier}
              onChange={(e) => setAccountIdentifier(e.target.value)}
              data-testid="input-account-id"
            />
          </div>

          <div className="space-y-2">
            <Label>Type of Incident</Label>
            <Select value={incidentType} onValueChange={setIncidentType} required>
              <SelectTrigger data-testid="select-incident-type">
                <SelectValue placeholder="Select incident type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="harassment">Harassment</SelectItem>
                <SelectItem value="threats">Threats</SelectItem>
                <SelectItem value="hate_speech">Hate Speech</SelectItem>
                <SelectItem value="impersonation">Impersonation</SelectItem>
                <SelectItem value="image_abuse">Image Abuse</SelectItem>
                <SelectItem value="doxxing">Doxxing</SelectItem>
                <SelectItem value="scam">Scam</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe what happened..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              data-testid="textarea-description"
            />
          </div>

          <div className="space-y-2">
            <Label>Region (optional)</Label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger data-testid="select-region">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="east_africa">East Africa</SelectItem>
                <SelectItem value="west_africa">West Africa</SelectItem>
                <SelectItem value="north_africa">North Africa</SelectItem>
                <SelectItem value="southern_africa">Southern Africa</SelectItem>
                <SelectItem value="central_africa">Central Africa</SelectItem>
                <SelectItem value="global">Global</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 text-sm">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-muted-foreground">
              Your identity is protected - reports are anonymous
            </span>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={mutation.isPending || !platform || !incidentType}
              data-testid="button-submit-report"
            >
              {mutation.isPending ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Community() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  const { data: reports, isLoading } = useQuery<CommunityReport[]>({
    queryKey: ["/api/community/reports"],
  });

  const verifiedReports = reports?.filter((r) => r.status === "verified") || [];
  const pendingReports = reports?.filter((r) => r.status === "pending") || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <Users className="w-7 h-7 text-purple-500" />
            {t("community")}
          </h1>
          <p className="text-muted-foreground mt-1">
            Community-powered protection against digital threats
          </p>
        </div>
        <ReportDialog />
      </div>

      <Card className="bg-gradient-to-r from-purple-50 to-teal-50 dark:from-purple-950/20 dark:to-teal-950/20 border-purple-200 dark:border-purple-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-purple-900 dark:text-purple-100 mb-1">
                Collective Protection
              </h3>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                When you report dangerous accounts, you help protect thousands of other
                women and girls across Africa. All reports are anonymous and verified
                by our community moderators.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {reports?.length || 0}
            </div>
            <div className="text-xs text-muted-foreground">Total Reports</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {verifiedReports.length}
            </div>
            <div className="text-xs text-muted-foreground">Verified</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {pendingReports.length}
            </div>
            <div className="text-xs text-muted-foreground">Pending Review</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
              {new Set(reports?.map((r) => r.platform)).size || 0}
            </div>
            <div className="text-xs text-muted-foreground">Platforms</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="all" data-testid="tab-all-reports">All</TabsTrigger>
          <TabsTrigger value="verified" data-testid="tab-verified">Verified</TabsTrigger>
          <TabsTrigger value="pending" data-testid="tab-pending">Pending</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Skeleton className="w-10 h-10 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : reports && reports.length > 0 ? (
            <div className="space-y-4">
              {reports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <MessageSquareWarning className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-lg mb-1">No reports yet</h3>
                <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
                  Be the first to report a dangerous account and help protect our community
                </p>
                <ReportDialog />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="verified" className="mt-6">
          {verifiedReports.length > 0 ? (
            <div className="space-y-4">
              {verifiedReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No verified reports yet</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          {pendingReports.length > 0 ? (
            <div className="space-y-4">
              {pendingReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No pending reports</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
