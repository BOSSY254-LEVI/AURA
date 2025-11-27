import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { LearningProgress } from "@shared/schema";
import {
  BookOpen,
  Play,
  CheckCircle2,
  Clock,
  Star,
  Lock,
  ChevronRight,
  Award,
  Shield,
  AlertTriangle,
  Eye,
  User,
  Fingerprint,
  MessageSquare,
} from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number;
  content: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  icon: typeof Shield;
  color: string;
  bgColor: string;
  lessons: Lesson[];
  difficulty: "beginner" | "intermediate" | "advanced";
}

const learningModules: Module[] = [
  {
    id: "phishing",
    title: "Recognizing Phishing",
    description: "Learn to identify and avoid phishing attacks that steal your information",
    icon: AlertTriangle,
    color: "text-amber-600",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    difficulty: "beginner",
    lessons: [
      {
        id: "phishing-1",
        title: "What is Phishing?",
        description: "Understanding the basics of phishing attacks",
        duration: 5,
        content: `Phishing is a type of cyber attack where criminals try to trick you into giving them sensitive information like passwords, credit card numbers, or personal details.

**How Phishing Works:**
1. Attackers send messages that look like they're from trusted sources
2. These messages create urgency or fear to make you act quickly
3. They include links to fake websites that look real
4. Once you enter your information, they steal it

**Common Signs of Phishing:**
- Urgent language ("Act now!", "Your account will be closed!")
- Generic greetings ("Dear Customer" instead of your name)
- Suspicious email addresses that don't match the company
- Poor grammar or spelling mistakes
- Requests for personal information

**Remember:** Legitimate organizations will never ask for your password or sensitive information through email or messages.`,
      },
      {
        id: "phishing-2",
        title: "Email Phishing",
        description: "Identifying fake emails and protecting your inbox",
        duration: 8,
        content: `Email phishing is the most common form of phishing. Here's how to protect yourself:

**Check the Sender:**
- Look at the full email address, not just the display name
- Be suspicious of addresses with misspellings (like "faceb00k.com")
- Hover over links before clicking to see the real URL

**Red Flags in Emails:**
- Unexpected attachments, especially .exe or .zip files
- Pressure to click links immediately
- Offers that seem too good to be true
- Requests to verify your account by clicking a link

**What to Do:**
1. Don't click suspicious links
2. Don't download unexpected attachments
3. If unsure, go directly to the website by typing the address yourself
4. Report phishing emails to your email provider

**Tip:** When in doubt, contact the company directly through their official website or phone number.`,
      },
      {
        id: "phishing-3",
        title: "Social Media Phishing",
        description: "Staying safe on social platforms",
        duration: 6,
        content: `Social media platforms are increasingly targeted by phishers. Here's what to watch for:

**Common Tactics:**
- Fake friend requests from people pretending to be someone you know
- Messages claiming you've won a prize or contest
- Links in comments or DMs to "exclusive content"
- Fake login pages to steal your credentials

**Protection Strategies:**
1. Enable two-factor authentication on all social accounts
2. Be cautious of messages from accounts you don't recognize
3. Never share personal information in public posts
4. Verify unusual requests from friends through another channel

**If Your Account is Compromised:**
- Change your password immediately
- Review and revoke access to third-party apps
- Check for unauthorized posts or messages
- Alert your friends about the breach`,
      },
    ],
  },
  {
    id: "grooming",
    title: "Recognizing Grooming",
    description: "Understanding and identifying online grooming tactics",
    icon: User,
    color: "text-rose-600",
    bgColor: "bg-rose-100 dark:bg-rose-900/30",
    difficulty: "intermediate",
    lessons: [
      {
        id: "grooming-1",
        title: "What is Online Grooming?",
        description: "Understanding the warning signs",
        duration: 10,
        content: `Online grooming is when someone builds a relationship with a young person to manipulate and exploit them. This can happen to anyone.

**Stages of Grooming:**
1. **Selection:** Predators target people who seem vulnerable or lonely
2. **Trust Building:** They show excessive attention and interest
3. **Filling a Need:** They offer emotional support, gifts, or understanding
4. **Isolation:** They try to separate you from friends and family
5. **Desensitization:** They gradually introduce inappropriate topics
6. **Maintaining Control:** They use guilt, fear, or blackmail

**Warning Signs Someone May Be Grooming:**
- They want to be your "special" friend
- They ask you to keep conversations secret
- They make you feel like only they understand you
- They push boundaries gradually
- They send excessive compliments or gifts

**Remember:** A healthy relationship never involves secrets from trusted adults or pressure to do things that make you uncomfortable.`,
      },
      {
        id: "grooming-2",
        title: "Protecting Yourself",
        description: "Practical steps to stay safe",
        duration: 8,
        content: `Here are practical steps to protect yourself from online predators:

**Set Boundaries:**
- Never share personal information with strangers online
- Keep your profile private
- Don't share your location
- Trust your instincts - if something feels wrong, it probably is

**Safe Communication:**
- Only accept friend requests from people you know in real life
- Be cautious with people who seem "too perfect"
- Don't respond to uncomfortable questions or requests
- Never agree to meet someone you only know online without a trusted adult

**If You Feel Unsafe:**
1. Stop communication with the person
2. Don't delete evidence - take screenshots
3. Tell a trusted adult immediately
4. Report the account to the platform
5. Contact local authorities if needed

**You Are Not Alone:** If something has happened, it is NOT your fault. There are people who can help.`,
      },
    ],
  },
  {
    id: "deepfakes",
    title: "Understanding Deepfakes",
    description: "Learn about AI-generated fake media and how to spot them",
    icon: Eye,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    difficulty: "intermediate",
    lessons: [
      {
        id: "deepfakes-1",
        title: "What are Deepfakes?",
        description: "Understanding AI-generated fake content",
        duration: 7,
        content: `Deepfakes are synthetic media created using artificial intelligence to make fake but realistic-looking videos, images, or audio.

**How Deepfakes Work:**
- AI algorithms analyze real photos and videos
- They learn facial features, expressions, and voice patterns
- The AI creates new content that looks authentic

**Types of Deepfakes:**
1. **Face Swaps:** Putting one person's face on another's body
2. **Lip Sync:** Making it appear someone said something they didn't
3. **Full Body:** Creating entirely fake video of a person
4. **Voice Cloning:** Synthetic audio that sounds like a real person

**Why Deepfakes are Dangerous:**
- Used to create non-consensual intimate images
- Spread misinformation and fake news
- Damage reputations through fake videos
- Enable identity theft and fraud

**The Impact on Women:** Women are disproportionately targeted by malicious deepfakes, particularly for non-consensual intimate imagery.`,
      },
      {
        id: "deepfakes-2",
        title: "Spotting Fake Media",
        description: "How to identify manipulated content",
        duration: 8,
        content: `While deepfakes are becoming more sophisticated, there are still ways to spot them:

**Visual Clues:**
- Unnatural blinking or eye movement
- Blurry or warped areas around face edges
- Inconsistent lighting on the face vs. background
- Strange skin texture or color
- Hair that looks unnatural or doesn't move properly
- Mismatched jewelry, teeth, or accessories

**Audio Clues:**
- Unnatural pauses or breathing
- Flat or robotic tone
- Background noise inconsistencies
- Lip sync doesn't match perfectly

**What to Do If You're Targeted:**
1. Don't panic - you have options
2. Document everything (screenshots, URLs)
3. Report to the platform hosting the content
4. Contact law enforcement if necessary
5. Seek support from organizations that help deepfake victims

**Prevention Tips:**
- Limit photos and videos you share publicly
- Use privacy settings on social media
- Be cautious about video calls with strangers`,
      },
    ],
  },
  {
    id: "privacy",
    title: "Online Privacy",
    description: "Protect your personal information and digital footprint",
    icon: Shield,
    color: "text-teal-600",
    bgColor: "bg-teal-100 dark:bg-teal-900/30",
    difficulty: "beginner",
    lessons: [
      {
        id: "privacy-1",
        title: "Protecting Your Data",
        description: "Essential privacy practices",
        duration: 10,
        content: `Your personal data is valuable. Here's how to protect it:

**What Data to Protect:**
- Full name and date of birth
- Home address and phone number
- School or workplace information
- Financial information
- Photos and location data

**Privacy Settings Checklist:**
- Review privacy settings on all social media
- Disable location sharing when not needed
- Turn off ad personalization
- Limit who can see your posts and profile
- Regularly audit connected apps

**Strong Password Practices:**
- Use unique passwords for each account
- Make passwords at least 12 characters
- Include numbers, symbols, and mixed case
- Consider a password manager
- Enable two-factor authentication everywhere

**Browser Privacy:**
- Use private/incognito mode for sensitive browsing
- Clear cookies regularly
- Consider privacy-focused browsers
- Be careful with browser extensions`,
      },
      {
        id: "privacy-2",
        title: "Managing Your Digital Footprint",
        description: "Control what the internet knows about you",
        duration: 8,
        content: `Your digital footprint is the trail of data you leave online. Here's how to manage it:

**Types of Digital Footprints:**
1. **Active:** Content you intentionally share (posts, comments, photos)
2. **Passive:** Data collected without you knowing (browsing history, location data)

**Audit Your Online Presence:**
- Google yourself to see what's public
- Review old social media posts
- Check what data apps have collected
- Request data from major platforms

**Clean Up Your Footprint:**
- Delete old accounts you don't use
- Remove embarrassing or outdated content
- Opt out of data broker sites
- Update privacy settings regularly

**Think Before You Post:**
- Would you be comfortable if this was permanent?
- Could this be used against you later?
- Are you sharing others' information without consent?
- Could this reveal your location or routine?

**Remember:** Once something is online, it can be nearly impossible to completely remove.`,
      },
    ],
  },
  {
    id: "social-engineering",
    title: "Social Engineering",
    description: "Recognize manipulation tactics used by cyber criminals",
    icon: MessageSquare,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    difficulty: "advanced",
    lessons: [
      {
        id: "social-1",
        title: "Manipulation Tactics",
        description: "Understanding psychological manipulation online",
        duration: 12,
        content: `Social engineering is the art of manipulating people into giving up confidential information or taking actions that compromise security.

**Common Tactics:**
1. **Authority:** Pretending to be someone important (police, bank official)
2. **Urgency:** Creating time pressure to prevent careful thinking
3. **Fear:** Threatening consequences if you don't comply
4. **Reciprocity:** Doing a favor to make you feel obligated
5. **Social Proof:** Claiming "everyone else does it"
6. **Liking:** Building rapport to lower your defenses

**Examples in Action:**
- "I'm from IT, I need your password to fix your account"
- "Your account will be deleted in 24 hours unless you verify"
- "Your friend said you could help me with this"
- "I just saved you from a scam, now can you help me?"

**Defense Strategies:**
- Verify identities through official channels
- Take time to think - don't let urgency pressure you
- Question requests for sensitive information
- Trust your instincts when something feels off
- Confirm unusual requests through a different communication method`,
      },
      {
        id: "social-2",
        title: "Romance Scams",
        description: "Protecting your heart and wallet online",
        duration: 10,
        content: `Romance scams target people looking for love online and can cause emotional and financial devastation.

**How Romance Scams Work:**
1. Scammer creates an attractive fake profile
2. They initiate contact and build emotional connection
3. They express love quickly and intensely
4. They create a crisis requiring money
5. They ask for financial help or gifts

**Warning Signs:**
- They can't video chat or meet in person
- They claim to be overseas (military, business)
- They profess love very quickly
- They ask for money for emergencies
- Stories don't add up or change
- They want to move off the dating platform quickly

**Protect Yourself:**
- Do a reverse image search on their photos
- Never send money to someone you haven't met
- Be suspicious of anyone who avoids video calls
- Trust friends and family if they express concerns
- Report suspicious profiles to the platform

**If You've Been Scammed:**
- Stop all contact immediately
- Don't send more money (even if threatened)
- Report to law enforcement
- Seek emotional support - this is not your fault`,
      },
    ],
  },
];

function ModuleCard({ 
  module, 
  progress, 
  onClick 
}: { 
  module: Module; 
  progress: number;
  onClick: () => void;
}) {
  const Icon = module.icon;
  const difficultyColors = {
    beginner: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    intermediate: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    advanced: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  };

  return (
    <Card 
      className="hover-elevate cursor-pointer" 
      onClick={onClick}
      data-testid={`card-module-${module.id}`}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl ${module.bgColor} flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-6 h-6 ${module.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">{module.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {module.description}
            </p>
            <div className="flex items-center gap-3 mb-3">
              <Badge variant="secondary" className={difficultyColors[module.difficulty]}>
                {module.difficulty}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <BookOpen className="w-3 h-3" />
                <span>{module.lessons.length} lessons</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={progress} className="flex-1 h-2" />
              <span className="text-xs text-muted-foreground">{progress}%</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}

function LessonViewer({ 
  module, 
  lesson, 
  onComplete, 
  onClose,
  isCompleted,
}: { 
  module: Module;
  lesson: Lesson;
  onComplete: () => void;
  onClose: () => void;
  isCompleted: boolean;
}) {
  return (
    <DialogContent className="max-w-2xl max-h-[90vh]">
      <DialogHeader>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <module.icon className={`w-4 h-4 ${module.color}`} />
          <span>{module.title}</span>
        </div>
        <DialogTitle className="text-xl">{lesson.title}</DialogTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{lesson.duration} min read</span>
          </div>
          {isCompleted && (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle2 className="w-4 h-4" />
              <span>Completed</span>
            </div>
          )}
        </div>
      </DialogHeader>
      <ScrollArea className="mt-4 pr-4 max-h-[60vh]">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {lesson.content.split("\n\n").map((paragraph, i) => {
            if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
              return <h3 key={i} className="text-lg font-semibold mt-6 mb-2">{paragraph.slice(2, -2)}</h3>;
            }
            if (paragraph.startsWith("**")) {
              const [title, ...rest] = paragraph.split(":**");
              return (
                <div key={i} className="my-4">
                  <h4 className="font-semibold mb-1">{title.slice(2)}:</h4>
                  <p className="text-muted-foreground">{rest.join(":**")}</p>
                </div>
              );
            }
            if (paragraph.startsWith("-") || paragraph.startsWith("1.")) {
              const items = paragraph.split("\n");
              return (
                <ul key={i} className="list-disc pl-5 space-y-1 my-3">
                  {items.map((item, j) => (
                    <li key={j} className="text-muted-foreground">
                      {item.replace(/^[-\d.]\s*/, "")}
                    </li>
                  ))}
                </ul>
              );
            }
            return <p key={i} className="text-muted-foreground my-3">{paragraph}</p>;
          })}
        </div>
      </ScrollArea>
      <div className="flex gap-3 mt-6 pt-4 border-t">
        <Button variant="outline" className="flex-1" onClick={onClose}>
          Close
        </Button>
        {!isCompleted && (
          <Button className="flex-1 gap-2" onClick={onComplete}>
            <CheckCircle2 className="w-4 h-4" />
            Mark as Complete
          </Button>
        )}
      </div>
    </DialogContent>
  );
}

export default function Learn() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const { toast } = useToast();
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const { data: progress, isLoading } = useQuery<LearningProgress[]>({
    queryKey: ["/api/learning/progress"],
  });

  const completeMutation = useMutation({
    mutationFn: async ({ moduleId, lessonId }: { moduleId: string; lessonId: string }) => {
      await apiRequest("POST", "/api/learning/complete", { moduleId, lessonId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/learning/progress"] });
      toast({
        title: "Lesson completed!",
        description: "Great job! Keep learning to stay safe online.",
      });
    },
  });

  const getModuleProgress = (moduleId: string) => {
    const module = learningModules.find((m) => m.id === moduleId);
    if (!module || !progress) return 0;
    const completed = progress.filter(
      (p) => p.moduleId === moduleId && p.completed
    ).length;
    return Math.round((completed / module.lessons.length) * 100);
  };

  const isLessonCompleted = (moduleId: string, lessonId: string) => {
    return progress?.some(
      (p) => p.moduleId === moduleId && p.lessonId === lessonId && p.completed
    );
  };

  const totalProgress = Math.round(
    (progress?.filter((p) => p.completed).length || 0) /
    learningModules.reduce((acc, m) => acc + m.lessons.length, 0) * 100
  ) || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-purple-500" />
            {t("learn")}
          </h1>
          <p className="text-muted-foreground mt-1">
            Interactive lessons to protect yourself online
          </p>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-purple-600 to-teal-600 border-0 text-white overflow-hidden">
        <CardContent className="p-6 relative">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex items-center gap-6">
            <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Award className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1">Your Learning Progress</h2>
              <p className="text-white/80 text-sm mb-3">
                Complete all modules to become a Digital Safety Champion
              </p>
              <div className="flex items-center gap-3">
                <Progress value={totalProgress} className="flex-1 h-3 bg-white/20" />
                <span className="text-sm font-medium">{totalProgress}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Skeleton className="w-12 h-12 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {learningModules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              progress={getModuleProgress(module.id)}
              onClick={() => setSelectedModule(module)}
            />
          ))}
        </div>
      )}

      <Dialog open={!!selectedModule && !selectedLesson} onOpenChange={() => setSelectedModule(null)}>
        {selectedModule && (
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-lg ${selectedModule.bgColor} flex items-center justify-center`}>
                  <selectedModule.icon className={`w-5 h-5 ${selectedModule.color}`} />
                </div>
                <div>
                  <DialogTitle>{selectedModule.title}</DialogTitle>
                  <p className="text-sm text-muted-foreground">{selectedModule.lessons.length} lessons</p>
                </div>
              </div>
            </DialogHeader>
            <p className="text-sm text-muted-foreground mb-4">{selectedModule.description}</p>
            <div className="space-y-2">
              {selectedModule.lessons.map((lesson, index) => {
                const completed = isLessonCompleted(selectedModule.id, lesson.id);
                return (
                  <button
                    key={lesson.id}
                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left"
                    onClick={() => setSelectedLesson(lesson)}
                    data-testid={`button-lesson-${lesson.id}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      completed 
                        ? 'bg-green-100 dark:bg-green-900/30' 
                        : 'bg-muted'
                    }`}>
                      {completed ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <span className="text-sm text-muted-foreground">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{lesson.title}</p>
                      <p className="text-xs text-muted-foreground">{lesson.duration} min</p>
                    </div>
                    <Play className="w-4 h-4 text-muted-foreground" />
                  </button>
                );
              })}
            </div>
          </DialogContent>
        )}
      </Dialog>

      <Dialog open={!!selectedLesson} onOpenChange={() => setSelectedLesson(null)}>
        {selectedModule && selectedLesson && (
          <LessonViewer
            module={selectedModule}
            lesson={selectedLesson}
            isCompleted={isLessonCompleted(selectedModule.id, selectedLesson.id) || false}
            onComplete={() => {
              completeMutation.mutate({
                moduleId: selectedModule.id,
                lessonId: selectedLesson.id,
              });
            }}
            onClose={() => setSelectedLesson(null)}
          />
        )}
      </Dialog>
    </div>
  );
}
