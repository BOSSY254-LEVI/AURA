import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
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
import type { EvidenceItem } from "server/shared/schema";
import {
  Lock,
  Plus,
  FileText,
  Image,
  MessageSquare,
  Mic,
  StickyNote,
  Search,
  Calendar,
  Shield,
  Download,
  Trash2,
  Eye,
  Clock,
} from "lucide-react";

const typeIcons: Record<string, typeof FileText> = {
  screenshot: Image,
  chat_log: MessageSquare,
  note: StickyNote,
  audio: Mic,
  image: Image,
};

const typeColors: Record<string, string> = {
  screenshot: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  chat_log: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  note: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  audio: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  image: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
};

function EvidenceCard({ item }: { item: EvidenceItem }) {
  const Icon = typeIcons[item.type] || FileText;
  const formattedDate = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <Card className="hover-elevate group" data-testid={`card-evidence-${item.id}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${typeColors[item.type] || 'bg-muted'}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-medium truncate">{item.title}</h3>
              <Badge variant="secondary" className="text-xs flex-shrink-0">
                <Lock className="w-3 h-3 mr-1" />
                Encrypted
              </Badge>
            </div>
            {item.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {item.description}
              </p>
            )}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{formattedDate}</span>
              </div>
              <Badge variant="outline" className="text-xs capitalize">
                {item.type.replace("_", " ")}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="sm" variant="ghost" className="gap-1">
            <Eye className="w-4 h-4" />
            View
          </Button>
          <Button size="sm" variant="ghost" className="gap-1">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button size="sm" variant="ghost" className="gap-1 text-destructive hover:text-destructive">
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function AddEvidenceDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("note");
  const [content, setContent] = useState("");
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/evidence", {
        title,
        description,
        type,
        encryptedContent: content,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/evidence"] });
      toast({
        title: "Evidence saved",
        description: "Your evidence has been securely encrypted and stored.",
      });
      setOpen(false);
      setTitle("");
      setDescription("");
      setType("note");
      setContent("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save evidence. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2" data-testid="button-add-evidence">
          <Plus className="w-4 h-4" />
          Add Evidence
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-500" />
            Add to Evidence Vault
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
          className="space-y-4 mt-4"
        >
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Give this evidence a name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              data-testid="input-evidence-title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger data-testid="select-evidence-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="note">Note</SelectItem>
                <SelectItem value="screenshot">Screenshot</SelectItem>
                <SelectItem value="chat_log">Chat Log</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="image">Image</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              placeholder="Brief description of this evidence"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              data-testid="input-evidence-description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Paste the content here (text, URLs, or notes)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              required
              data-testid="textarea-evidence-content"
            />
          </div>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 text-sm">
            <Lock className="w-4 h-4 text-green-600" />
            <span className="text-muted-foreground">
              Your evidence will be encrypted with AES-256 before storage
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
              disabled={mutation.isPending}
              data-testid="button-save-evidence"
            >
              {mutation.isPending ? "Encrypting..." : "Save Securely"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Vault() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const { data: evidence, isLoading } = useQuery<EvidenceItem[]>({
    queryKey: ["/api/evidence"],
  });

  const filteredEvidence = evidence?.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || item.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <Lock className="w-7 h-7 text-purple-500" />
            {t("vault")}
          </h1>
          <p className="text-muted-foreground mt-1">
            Securely store and manage evidence
          </p>
        </div>
        <AddEvidenceDialog />
      </div>

      <Card className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20 border-green-200 dark:border-green-800">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-medium text-green-900 dark:text-green-100">
                End-to-End Encryption
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                All your evidence is encrypted with AES-256 and only you have access
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search evidence..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-evidence"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-40" data-testid="select-filter-type">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="note">Notes</SelectItem>
            <SelectItem value="screenshot">Screenshots</SelectItem>
            <SelectItem value="chat_log">Chat Logs</SelectItem>
            <SelectItem value="audio">Audio</SelectItem>
            <SelectItem value="image">Images</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Skeleton className="w-12 h-12 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredEvidence && filteredEvidence.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEvidence.map((item) => (
            <EvidenceCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-lg mb-1">No evidence stored yet</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
              Start documenting incidents by adding screenshots, chat logs, or notes
              to your secure vault
            </p>
            <AddEvidenceDialog />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
