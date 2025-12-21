import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMessages } from "@/hooks/useMessages";
import { useAuth } from "@/hooks/useAuth";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";
import { formatDistanceToNow } from "date-fns";
import ReadReceipt from "@/components/ReadReceipt";
import TypingIndicator from "@/components/TypingIndicator";
import { supabase } from "@/integrations/supabase/client";

interface MessageDialogProps {
  listingId: string;
  sellerId: string;
  listingTitle: string;
  trigger?: React.ReactNode;
}

const MessageDialog = ({ listingId, sellerId, listingTitle, trigger }: MessageDialogProps) => {
  const { user } = useAuth();
  const { messages, fetchMessages, sendMessage, loading } = useMessages();
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [userName, setUserName] = useState("User");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversationKey = `${listingId}-${sellerId}`;
  const { typingUsers, startTyping, stopTyping } = useTypingIndicator(
    isOpen ? conversationKey : ""
  );

  useEffect(() => {
    if (isOpen && user) {
      fetchMessages(listingId, sellerId);
    }
  }, [isOpen, listingId, sellerId, user, fetchMessages]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    if (e.target.value.trim()) {
      startTyping(userName);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;

    stopTyping();
    setSending(true);
    await sendMessage(listingId, sellerId, newMessage.trim());
    setNewMessage("");
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      stopTyping();
    }
    setIsOpen(open);
  };

  if (!user) {
    return (
      <Button onClick={() => window.location.href = "/auth"}>
        <MessageCircle className="h-5 w-5 mr-2" /> Sign in to Message
      </Button>
    );
  }

  if (user.id === sellerId) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full" size="lg">
            <MessageCircle className="h-5 w-5 mr-2" /> Contact Seller
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">Message about {listingTitle}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-[400px]">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/50 rounded-lg">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <MessageCircle className="h-12 w-12 mb-2 opacity-50" />
                <p>No messages yet</p>
                <p className="text-sm">Start the conversation!</p>
              </div>
            ) : (
              <AnimatePresence>
                {messages.map((msg) => {
                  const isOwn = msg.sender_id === user.id;
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          isOwn
                            ? "bg-primary text-primary-foreground"
                            : "bg-background border border-border"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        <div className={`flex items-center justify-end gap-1 text-xs mt-1 ${
                          isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}>
                          <span>
                            {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                          </span>
                          <ReadReceipt isRead={msg.is_read || false} isOwn={isOwn} />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
            <TypingIndicator typingUsers={typingUsers} />
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="pt-4 border-t border-border mt-4">
            <div className="flex gap-2">
              <Textarea
                value={newMessage}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onBlur={() => stopTyping()}
                placeholder="Type your message..."
                className="min-h-[60px] resize-none"
                disabled={sending}
              />
              <Button
                onClick={handleSend}
                disabled={!newMessage.trim() || sending}
                size="icon"
                className="h-[60px] w-[60px]"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessageDialog;
