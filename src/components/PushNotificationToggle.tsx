import { Bell, BellOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useState } from "react";

const PushNotificationToggle = () => {
  const { isSupported, isSubscribed, permission, subscribe, unsubscribe } = usePushNotifications();
  const [loading, setLoading] = useState(false);

  if (!isSupported) {
    return null;
  }

  const handleToggle = async () => {
    setLoading(true);
    try {
      if (isSubscribed) {
        await unsubscribe();
      } else {
        await subscribe();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={isSubscribed ? "secondary" : "outline"}
      size="sm"
      onClick={handleToggle}
      disabled={loading || permission === "denied"}
      className="gap-2"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isSubscribed ? (
        <Bell className="h-4 w-4" />
      ) : (
        <BellOff className="h-4 w-4" />
      )}
      {permission === "denied" 
        ? "Notifications blocked" 
        : isSubscribed 
          ? "Notifications on" 
          : "Enable notifications"}
    </Button>
  );
};

export default PushNotificationToggle;
