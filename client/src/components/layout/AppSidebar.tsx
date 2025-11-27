import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/lib/i18n";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Lock,
  Sparkles,
  AlertTriangle,
  Users,
  BookOpen,
  Activity,
  Settings,
  LogOut,
  ChevronUp,
  Globe,
} from "lucide-react";
import { languages, type Language } from "@/lib/i18n";

const navigationItems = [
  {
    titleKey: "dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    titleKey: "vault",
    icon: Lock,
    href: "/vault",
  },
  {
    titleKey: "companion",
    icon: Sparkles,
    href: "/companion",
  },
  {
    titleKey: "emergency",
    icon: AlertTriangle,
    href: "/emergency",
  },
  {
    titleKey: "community",
    icon: Users,
    href: "/community",
  },
  {
    titleKey: "learn",
    icon: BookOpen,
    href: "/learn",
  },
  {
    titleKey: "insights",
    icon: Activity,
    href: "/insights",
  },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { user } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation(language);

  const userInitials = user
    ? `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase() || "AU"
    : "AU";

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-teal-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">AURA</h1>
            <p className="text-xs text-muted-foreground">{t("tagline")}</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = location === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      data-testid={`nav-${item.titleKey}`}
                    >
                      <Link href={item.href}>
                        <item.icon className="w-5 h-5" />
                        <span>{t(item.titleKey)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-3 h-auto py-2">
              <Avatar className="w-8 h-8">
                <AvatarImage 
                  src={user?.profileImageUrl || undefined} 
                  alt={user?.firstName || "User"} 
                  className="object-cover"
                />
                <AvatarFallback className="bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300 text-sm">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer">
                <Settings className="w-4 h-4 mr-2" />
                {t("settings")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center w-full px-2 py-1.5 text-sm rounded-sm hover:bg-accent cursor-pointer">
                <Globe className="w-4 h-4 mr-2" />
                Language: {languages[language].nativeName}
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right">
                {(Object.entries(languages) as [Language, { name: string; nativeName: string }][]).map(
                  ([code, lang]) => (
                    <DropdownMenuItem
                      key={code}
                      onClick={() => setLanguage(code)}
                      className={language === code ? "bg-accent" : ""}
                    >
                      {lang.nativeName}
                    </DropdownMenuItem>
                  )
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/api/logout" className="cursor-pointer text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                {t("logout")}
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
