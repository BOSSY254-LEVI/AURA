import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Sparkles,
  Send,
  Heart,
  Shield,
  MessageCircle,
  Lightbulb,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const quickPrompts = [
  {
    icon: Shield,
    label: "Analyze a message",
    prompt: "I received a message that made me uncomfortable. Can you help me analyze it?",
  },
  {
    icon: Heart,
    label: "I need support",
    prompt: "I'm feeling overwhelmed by something that happened online. Can we talk?",
  },
  {
    icon: Lightbulb,
    label: "Safety tips",
    prompt: "What are some practical tips to stay safe online?",
  },
  {
    icon: AlertTriangle,
    label: "Report guidance",
    prompt: "How do I properly document and report online harassment?",
  },
];

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser
            ? "bg-purple-100 dark:bg-purple-900/50"
            : "bg-gradient-to-br from-purple-500 to-teal-500"
        }`}
      >
        {isUser ? (
          <MessageCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
        ) : (
          <Sparkles className="w-4 h-4 text-white" />
        )}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-purple-600 text-white rounded-tr-sm"
            : "bg-muted rounded-tl-sm"
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        <p
          className={`text-xs mt-1 ${
            isUser ? "text-purple-200" : "text-muted-foreground"
          }`}
        >
          {message.timestamp.toLocaleTimeString(undefined, {
            hour: "numeric",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}

export default function Companion() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: chatHistory, isLoading: historyLoading } = useQuery<{ messages: Message[] }>({
    queryKey: ["/api/companion/chat"],
  });

  useEffect(() => {
    if (chatHistory?.messages) {
      setMessages(
        chatHistory.messages.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        }))
      );
    }
  }, [chatHistory]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest("POST", "/api/companion/chat", { message: content });
      return res.json();
    },
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        },
      ]);
      queryClient.invalidateQueries({ queryKey: ["/api/companion/chat"] });
    },
    onError: () => {
      toast({
        title: "Couldn't send message",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    },
  });

  const handleSend = () => {
    if (!input.trim() || sendMutation.isPending) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    sendMutation.mutate(input.trim());
    setInput("");
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            Safe Twin
          </h1>
          <p className="text-muted-foreground mt-1">
            Your trauma-informed AI companion
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMessages([])}
          disabled={messages.length === 0}
          data-testid="button-clear-chat"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          {historyLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="h-16 flex-1 rounded-2xl" />
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-teal-100 dark:from-purple-900/30 dark:to-teal-900/30 flex items-center justify-center mb-6">
                <Sparkles className="w-10 h-10 text-purple-500" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Hello, I'm Safe Twin</h2>
              <p className="text-muted-foreground max-w-md mb-8">
                I'm here to help you stay safe online. You can ask me to analyze
                suspicious messages, get safety advice, or simply talk about what
                you're experiencing. Everything we discuss stays private.
              </p>

              <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                {quickPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto py-3 px-4 flex-col items-start gap-2 text-left hover-elevate"
                    onClick={() => handleQuickPrompt(prompt.prompt)}
                    data-testid={`button-quick-prompt-${index}`}
                  >
                    <prompt.icon className="w-5 h-5 text-purple-500" />
                    <span className="text-sm font-medium">{prompt.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <MessageBubble key={index} message={message} />
              ))}
              {sendMutation.isPending && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        <div className="p-4 border-t border-border">
          <div className="flex gap-3">
            <Textarea
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="min-h-[60px] resize-none"
              data-testid="textarea-chat-input"
            />
            <Button
              size="icon"
              className="h-[60px] w-[60px]"
              onClick={handleSend}
              disabled={!input.trim() || sendMutation.isPending}
              data-testid="button-send-message"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Safe Twin provides supportive guidance but is not a substitute for
            professional help
          </p>
        </div>
      </Card>
    </div>
  );
}
