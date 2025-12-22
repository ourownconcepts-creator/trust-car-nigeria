import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Reaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
}

interface ReactionCount {
  emoji: string;
  count: number;
  hasUserReacted: boolean;
}

export const useMessageReactions = (messageId: string) => {
  const { user } = useAuth();
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReactions = useCallback(async () => {
    if (!messageId) return;

    const { data, error } = await supabase
      .from("message_reactions")
      .select("*")
      .eq("message_id", messageId);

    if (!error && data) {
      setReactions(data);
    }
  }, [messageId]);

  const toggleReaction = async (emoji: string) => {
    if (!user || !messageId) return;

    const existingReaction = reactions.find(
      (r) => r.user_id === user.id && r.emoji === emoji
    );

    if (existingReaction) {
      // Remove reaction
      await supabase
        .from("message_reactions")
        .delete()
        .eq("id", existingReaction.id);
      
      setReactions((prev) => prev.filter((r) => r.id !== existingReaction.id));
    } else {
      // Add reaction
      const { data, error } = await supabase
        .from("message_reactions")
        .insert({
          message_id: messageId,
          user_id: user.id,
          emoji,
        })
        .select()
        .single();

      if (!error && data) {
        setReactions((prev) => [...prev, data]);
      }
    }
  };

  const getReactionCounts = (): ReactionCount[] => {
    const counts = new Map<string, { count: number; hasUserReacted: boolean }>();

    reactions.forEach((r) => {
      const existing = counts.get(r.emoji) || { count: 0, hasUserReacted: false };
      counts.set(r.emoji, {
        count: existing.count + 1,
        hasUserReacted: existing.hasUserReacted || r.user_id === user?.id,
      });
    });

    return Array.from(counts.entries()).map(([emoji, data]) => ({
      emoji,
      ...data,
    }));
  };

  // Subscribe to realtime updates
  useEffect(() => {
    if (!messageId) return;

    fetchReactions();

    const channel = supabase
      .channel(`reactions-${messageId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "message_reactions",
          filter: `message_id=eq.${messageId}`,
        },
        () => {
          fetchReactions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [messageId, fetchReactions]);

  return {
    reactions,
    loading,
    toggleReaction,
    getReactionCounts,
  };
};
