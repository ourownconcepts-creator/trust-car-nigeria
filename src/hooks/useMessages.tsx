import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Message {
  id: string;
  listing_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  edited_at?: string | null;
  sender_profile?: {
    full_name: string | null;
    email: string;
  };
  recipient_profile?: {
    full_name: string | null;
    email: string;
  };
  listing?: {
    title: string;
    images: string[] | null;
  };
}

interface Conversation {
  listing_id: string;
  other_user_id: string;
  other_user_name: string;
  listing_title: string;
  listing_image: string | null;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

export const useMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchConversations = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch all messages for user
      const { data: allMessages, error } = await supabase
        .from("messages")
        .select(`
          id,
          listing_id,
          sender_id,
          recipient_id,
          content,
          is_read,
          created_at
        `)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Group by listing + other user
      const conversationMap = new Map<string, any>();
      
      for (const msg of allMessages || []) {
        const otherUserId = msg.sender_id === user.id ? msg.recipient_id : msg.sender_id;
        const key = `${msg.listing_id}-${otherUserId}`;
        
        if (!conversationMap.has(key)) {
          // Fetch other user profile
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, email")
            .eq("id", otherUserId)
            .single();

          // Fetch listing
          const { data: listing } = await supabase
            .from("car_listings")
            .select("title, images")
            .eq("id", msg.listing_id)
            .single();

          conversationMap.set(key, {
            listing_id: msg.listing_id,
            other_user_id: otherUserId,
            other_user_name: profile?.full_name || profile?.email || "Unknown",
            listing_title: listing?.title || "Unknown Listing",
            listing_image: listing?.images?.[0] || null,
            last_message: msg.content,
            last_message_time: msg.created_at,
            unread_count: 0,
          });
        }

        if (!msg.is_read && msg.recipient_id === user.id) {
          const conv = conversationMap.get(key);
          conv.unread_count++;
        }
      }

      const convList = Array.from(conversationMap.values());
      setConversations(convList);
      setUnreadCount(convList.reduce((sum, c) => sum + c.unread_count, 0));
    } catch (error: any) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchMessages = useCallback(async (listingId: string, otherUserId: string) => {
    if (!user) return [];

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("listing_id", listingId)
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${user.id})`)
        .order("created_at", { ascending: true });

      if (error) throw error;

      setMessages(data || []);

      // Mark messages as read
      await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("listing_id", listingId)
        .eq("sender_id", otherUserId)
        .eq("recipient_id", user.id);

      return data || [];
    } catch (error: any) {
      console.error("Error fetching messages:", error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  const sendMessage = async (listingId: string, recipientId: string, content: string) => {
    if (!user) {
      toast.error("You must be logged in to send messages");
      return null;
    }

    try {
      // Get sender profile for notification
      const { data: senderProfile } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", user.id)
        .single();

      // Get listing title for notification
      const { data: listing } = await supabase
        .from("car_listings")
        .select("title")
        .eq("id", listingId)
        .single();

      const { data, error } = await supabase
        .from("messages")
        .insert({
          listing_id: listingId,
          sender_id: user.id,
          recipient_id: recipientId,
          content,
        })
        .select()
        .single();

      if (error) throw error;

      setMessages(prev => [...prev, data]);
      toast.success("Message sent!");

      // Send email notification to recipient (fire and forget)
      supabase.functions.invoke("send-message-notification", {
        body: {
          recipientId,
          senderName: senderProfile?.full_name || senderProfile?.email || "A buyer",
          listingTitle: listing?.title || "your listing",
          messagePreview: content,
          listingId,
        },
      }).catch((err) => console.error("Failed to send email notification:", err));

      return data;
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
      return null;
    }
  };

  const editMessage = async (messageId: string, newContent: string) => {
    if (!user) {
      toast.error("You must be logged in to edit messages");
      return false;
    }

    try {
      const { error } = await supabase
        .from("messages")
        .update({ 
          content: newContent,
          edited_at: new Date().toISOString()
        })
        .eq("id", messageId)
        .eq("sender_id", user.id);

      if (error) throw error;

      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, content: newContent, edited_at: new Date().toISOString() } 
            : msg
        )
      );
      toast.success("Message edited");
      return true;
    } catch (error: any) {
      console.error("Error editing message:", error);
      toast.error("Failed to edit message");
      return false;
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!user) {
      toast.error("You must be logged in to delete messages");
      return false;
    }

    try {
      const { error } = await supabase
        .from("messages")
        .delete()
        .eq("id", messageId)
        .eq("sender_id", user.id);

      if (error) throw error;

      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      toast.success("Message deleted");
      return true;
    } catch (error: any) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
      return false;
    }
  };

  // Subscribe to realtime messages
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("user-messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `recipient_id=eq.${user.id}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
          setUnreadCount(prev => prev + 1);
          toast.info("New message received!");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    messages,
    conversations,
    loading,
    unreadCount,
    fetchConversations,
    fetchMessages,
    sendMessage,
    editMessage,
    deleteMessage,
  };
};
