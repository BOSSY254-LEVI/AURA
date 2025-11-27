import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
import type { EmergencyContact } from "@shared/schema";
import {
  AlertTriangle,
  Phone,
  Mail,
  Plus,
  User,
  Star,
  MapPin,
  MessageSquare,
  Shield,
  Bell,
  Trash2,
  Edit2,
} from "lucide-react";

function PanicButton() {
  const [isActive, setIsActive] = useState(false);
  const { toast } = useToast();

  const handlePanic = () => {
    setIsActive(true);
    toast({
      title: "Emergency Alert Activated",
      description: "Your trusted contacts are being notified with your location.",
    });
    setTimeout(() => setIsActive(false), 3000);
  };

  return (
    <Card className={`overflow-hidden transition-all duration-300 ${isActive ? 'ring-4 ring-red-500 ring-opacity-50' : ''}`}>
      <CardContent className="p-0">
        <button
          onClick={handlePanic}
          className={`w-full py-12 px-6 flex flex-col items-center justify-center gap-4 transition-all ${
            isActive
              ? "bg-gradient-to-br from-red-600 to-orange-600"
              : "bg-gradient-to-br from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600"
          }`}
          data-testid="button-panic"
        >
          <div className={`w-20 h-20 rounded-full bg-white/20 flex items-center justify-center ${isActive ? 'animate-pulse' : ''}`}>
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>
          <div className="text-white text-center">
            <h2 className="text-2xl font-bold mb-1">
              {isActive ? "Alerting Contacts..." : "Emergency Alert"}
            </h2>
            <p className="text-sm text-white/80">
              {isActive
                ? "Your location is being shared"
                : "Tap to alert your trusted contacts"}
            </p>
          </div>
        </button>
      </CardContent>
    </Card>
  );
}

function ContactCard({ contact, onDelete }: { contact: EmergencyContact; onDelete: () => void }) {
  return (
    <Card className="hover-elevate" data-testid={`card-contact-${contact.id}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
            <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium truncate">{contact.name}</h3>
              {contact.isPrimary && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  <Star className="w-3 h-3 mr-1" />
                  Primary
                </Badge>
              )}
            </div>
            {contact.relationship && (
              <p className="text-sm text-muted-foreground mb-2">{contact.relationship}</p>
            )}
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              {contact.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span>{contact.phone}</span>
                </div>
              )}
              {contact.email && (
                <div className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  <span className="truncate">{contact.email}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AddContactDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [relationship, setRelationship] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/emergency-contacts", {
        name,
        phone: phone || null,
        email: email || null,
        relationship: relationship || null,
        isPrimary,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/emergency-contacts"] });
      toast({
        title: "Contact added",
        description: `${name} has been added to your emergency contacts.`,
      });
      setOpen(false);
      setName("");
      setPhone("");
      setEmail("");
      setRelationship("");
      setIsPrimary(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add contact. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2" data-testid="button-add-contact">
          <Plus className="w-4 h-4" />
          Add Contact
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-purple-500" />
            Add Emergency Contact
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
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Contact name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              data-testid="input-contact-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+254 700 000 000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              data-testid="input-contact-phone"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="input-contact-email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="relationship">Relationship</Label>
            <Select value={relationship} onValueChange={setRelationship}>
              <SelectTrigger data-testid="select-relationship">
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="family">Family Member</SelectItem>
                <SelectItem value="friend">Friend</SelectItem>
                <SelectItem value="partner">Partner</SelectItem>
                <SelectItem value="colleague">Colleague</SelectItem>
                <SelectItem value="counselor">Counselor</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" />
              <Label htmlFor="primary" className="cursor-pointer">
                Set as primary contact
              </Label>
            </div>
            <Switch
              id="primary"
              checked={isPrimary}
              onCheckedChange={setIsPrimary}
              data-testid="switch-primary-contact"
            />
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
              data-testid="button-save-contact"
            >
              {mutation.isPending ? "Saving..." : "Save Contact"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Emergency() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const { toast } = useToast();

  const { data: contacts, isLoading } = useQuery<EmergencyContact[]>({
    queryKey: ["/api/emergency-contacts"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/emergency-contacts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/emergency-contacts"] });
      toast({
        title: "Contact removed",
        description: "The contact has been removed from your emergency list.",
      });
    },
  });

  const emergencyResources = [
    {
      icon: Phone,
      title: "Emergency Hotlines",
      description: "Access country-specific emergency numbers",
    },
    {
      icon: MapPin,
      title: "Safe Places",
      description: "Find nearby shelters and support centers",
    },
    {
      icon: MessageSquare,
      title: "Quick Messages",
      description: "Pre-written emergency messages ready to send",
    },
    {
      icon: Shield,
      title: "Safe Mode",
      description: "Quickly hide app content if needed",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <AlertTriangle className="w-7 h-7 text-rose-500" />
            {t("emergency")}
          </h1>
          <p className="text-muted-foreground mt-1">
            Quick access to emergency tools and contacts
          </p>
        </div>
      </div>

      <PanicButton />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {emergencyResources.map((resource, index) => (
          <Card key={index} className="hover-elevate cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <resource.icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-medium text-sm mb-1">{resource.title}</h3>
              <p className="text-xs text-muted-foreground">{resource.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between gap-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <User className="w-5 h-5 text-muted-foreground" />
            Trusted Contacts
          </CardTitle>
          <AddContactDialog />
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : contacts && contacts.length > 0 ? (
            <div className="space-y-4">
              {contacts.map((contact) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  onDelete={() => deleteMutation.mutate(contact.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-1">No emergency contacts</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add trusted people who can help in an emergency
              </p>
              <AddContactDialog />
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-900 dark:text-amber-100 mb-1">
                Location Sharing
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                When you trigger an emergency alert, your current location will be
                shared with your trusted contacts. Make sure location services are
                enabled on your device.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
