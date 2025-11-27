import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";

export function PanicButton() {
  const [isTriggered, setIsTriggered] = useState(false);
  const { toast } = useToast();

  const handlePanic = () => {
    setIsTriggered(true);
    toast({
      title: "Emergency Alert Sent",
      description: "Your trusted contacts have been notified.",
      variant: "destructive",
    });
    
    setTimeout(() => {
      setIsTriggered(false);
    }, 3000);
  };

  return (
    <Button
      size="lg"
      className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg transition-all ${
        isTriggered
          ? "bg-red-600 animate-pulse"
          : "bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600"
      }`}
      onClick={handlePanic}
      data-testid="button-panic-floating"
    >
      <AlertTriangle className="w-6 h-6 text-white" />
      <span className="sr-only">Emergency Alert</span>
    </Button>
  );
}
