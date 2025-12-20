import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, ChevronLeft, Send, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMessages } from "@/hooks/useMessages";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

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
    sendMessage 
  } = useMessages();
  
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const handleSelectConversation = async (conv: Conversation) => {
    setSelectedConversation(conv);
    await fetchMessages(conv.listing_id, conv.other_user_id);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sending) return;

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
                    <p className="font-medium truncate">{conv.other_user_name}</p>
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
          onClick={() => setSelectedConversation(null)}
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
          <p className="font-medium truncate">{selectedConversation.other_user_name}</p>
          <p className="text-sm text-muted-foreground truncate">{selectedConversation.listing_title}</p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => {
              const isOwn = message.sender_id === user?.id;
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                      isOwn
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}
                    >
                      {format(new Date(message.created_at), "h:mm a")}
                    </p>
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
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
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
