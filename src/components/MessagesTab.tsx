import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, ChevronLeft, Send, Loader2, User, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMessages } from "@/hooks/useMessages";
import { useAuth } from "@/hooks/useAuth";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";
import { useUserStatus } from "@/hooks/useUserStatus";
import { format } from "date-fns";
import ReadReceipt from "@/components/ReadReceipt";
import TypingIndicator from "@/components/TypingIndicator";
import PushNotificationToggle from "@/components/PushNotificationToggle";
import MessageReactions from "@/components/MessageReactions";
import UserStatusIndicator from "@/components/UserStatusIndicator";
import MessageSearch from "@/components/MessageSearch";
import MessageActions from "@/components/MessageActions";
import { supabase } from "@/integrations/supabase/client";

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

const MessagesTab = () => {
  const { user } = useAuth();
  const { 
    conversations, 
    messages, 
    loading, 
    fetchConversations, 
    fetchMessages, 
    sendMessage,
    editMessage,
    deleteMessage
  } = useMessages();
  
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [userName, setUserName] = useState("User");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversationKey = selectedConversation 
    ? `${selectedConversation.listing_id}-${selectedConversation.other_user_id}` 
    : "";
  
  // Get user IDs for status tracking
  const userIds = useMemo(() => {
    return selectedConversation ? [selectedConversation.other_user_id] : [];
  }, [selectedConversation]);
  const { getStatus } = useUserStatus(userIds);
  
  const { typingUsers, startTyping, stopTyping } = useTypingIndicator(conversationKey);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    const fetchUserName = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", user.id)
        .single();
      if (data) {
        setUserName(data.full_name || data.email || "User");
      }
    };
    fetchUserName();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectConversation = async (conv: Conversation) => {
    setSelectedConversation(conv);
    await fetchMessages(conv.listing_id, conv.other_user_id);
  };

  const handleBack = () => {
    stopTyping();
    setSelectedConversation(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    if (e.target.value.trim()) {
      startTyping(userName);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sending) return;

    stopTyping();
    setSending(true);
    try {
      await sendMessage(
        selectedConversation.listing_id,
        selectedConversation.other_user_id,
        newMessage.trim()
      );
      setNewMessage("");
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading && conversations.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Conversation list view
  if (!selectedConversation) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">Messages</h2>
          <PushNotificationToggle />
        </div>
        
        <MessageSearch 
          onSelectResult={(listingId, otherUserId) => {
            const conv = conversations.find(
              c => c.listing_id === listingId && c.other_user_id === otherUserId
            );
            if (conv) {
              handleSelectConversation(conv);
            }
          }}
        />
        
        {conversations.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No messages yet</h3>
            <p className="text-muted-foreground">
              When buyers message you about your listings, they'll appear here.
            </p>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {conversations.map((conv, index) => (
              <motion.button
                key={`${conv.listing_id}-${conv.other_user_id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSelectConversation(conv)}
                className={`w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors text-left ${
                  index < conversations.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="w-14 h-14 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                  {conv.listing_image ? (
                    <img
                      src={conv.listing_image}
                      alt={conv.listing_title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MessageCircle className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{conv.other_user_name}</p>
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {format(new Date(conv.last_message_time), "MMM d")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{conv.listing_title}</p>
                  <p className="text-sm text-muted-foreground truncate mt-1">
                    {conv.last_message}
                  </p>
                </div>
                {conv.unread_count > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full flex-shrink-0">
                    {conv.unread_count}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Conversation detail view
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden">
          {selectedConversation.listing_image ? (
            <img
              src={selectedConversation.listing_image}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium truncate">{selectedConversation.other_user_name}</p>
            <UserStatusIndicator 
              isOnline={getStatus(selectedConversation.other_user_id).isOnline}
              lastActive={getStatus(selectedConversation.other_user_id).lastActive}
              size="sm"
            />
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {selectedConversation.listing_title}
            {!getStatus(selectedConversation.other_user_id).isOnline && 
              getStatus(selectedConversation.other_user_id).lastActive && (
              <span className="ml-2 text-xs">
                • Last seen {format(getStatus(selectedConversation.other_user_id).lastActive!, "MMM d, h:mm a")}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => {
              const isOwn = message.sender_id === user?.id;
              const isEdited = !!(message as any).edited_at;
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"} group`}
                >
                  <div className="max-w-[75%] relative">
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        isOwn
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <div
                        className={`flex items-center justify-end gap-1 text-xs mt-1 ${
                          isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}
                      >
                        {isEdited && (
                          <span className="flex items-center gap-0.5">
                            <Pencil className="h-3 w-3" />
                            edited
                          </span>
                        )}
                        <span>{format(new Date(message.created_at), "h:mm a")}</span>
                        <ReadReceipt isRead={message.is_read || false} isOwn={isOwn} />
                      </div>
                    </div>
                    <MessageReactions messageId={message.id} isOwn={isOwn} />
                    <MessageActions
                      messageId={message.id}
                      content={message.content}
                      isOwn={isOwn}
                      onEdit={editMessage}
                      onDelete={deleteMessage}
                    />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {loading && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}

          <TypingIndicator typingUsers={typingUsers} />
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            onBlur={() => stopTyping()}
            placeholder="Type a message..."
            className="min-h-[44px] max-h-[120px] resize-none"
            rows={1}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
            size="icon"
            className="flex-shrink-0"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessagesTab;
