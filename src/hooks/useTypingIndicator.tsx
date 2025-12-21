import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface TypingUser {
  id: string;
  name: string;
}

export const useTypingIndicator = (conversationKey: string) => {
  const { user } = useAuth();
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!user || !conversationKey) return;

    const channel = supabase.channel(`typing:${conversationKey}`, {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const typing: TypingUser[] = [];
        
        Object.entries(state).forEach(([userId, presences]) => {
          if (userId !== user.id && Array.isArray(presences)) {
            const presence = presences[0] as { isTyping?: boolean; name?: string };
            if (presence?.isTyping) {
              typing.push({ id: userId, name: presence.name || "Someone" });
            }
          }
        });
        
        setTypingUsers(typing);
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [user, conversationKey]);

  const startTyping = useCallback(async (userName: string) => {
    if (!channelRef.current) return;

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Track typing status
    await channelRef.current.track({
      isTyping: true,
      name: userName,
    });

    // Auto-stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(async () => {
      if (channelRef.current) {
        await channelRef.current.track({
          isTyping: false,
          name: userName,
        });
      }
    }, 3000);
  }, []);

  const stopTyping = useCallback(async () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    if (channelRef.current) {
      await channelRef.current.untrack();
    }
  }, []);

  return {
    typingUsers,
    startTyping,
    stopTyping,
  };
};
