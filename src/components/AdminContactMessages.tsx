import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Clock, CheckCircle2, Eye, Trash2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  responded_at: string | null;
  responded_by: string | null;
}

const AdminContactMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages((data as ContactMessage[]) || []);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      toast.error("Failed to load contact messages");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from("contact_messages")
        .update({ 
          status: "read",
          responded_at: new Date().toISOString(),
          responded_by: user?.id 
        })
        .eq("id", id);

      if (error) throw error;
      
      setMessages(messages.map(m => 
        m.id === id ? { ...m, status: "read", responded_at: new Date().toISOString() } : m
      ));
      toast.success("Marked as read");
    } catch (error) {
      console.error("Error updating message:", error);
      toast.error("Failed to update message");
    }
  };

  const handleMarkAsResolved = async (id: string) => {
    try {
      const { error } = await supabase
        .from("contact_messages")
        .update({ 
          status: "resolved",
          responded_at: new Date().toISOString(),
          responded_by: user?.id 
        })
        .eq("id", id);

      if (error) throw error;
      
      setMessages(messages.map(m => 
        m.id === id ? { ...m, status: "resolved", responded_at: new Date().toISOString() } : m
      ));
      toast.success("Marked as resolved");
    } catch (error) {
      console.error("Error updating message:", error);
      toast.error("Failed to update message");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setMessages(messages.filter(m => m.id !== id));
      toast.success("Message deleted");
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unread":
        return "destructive";
      case "read":
        return "secondary";
      case "resolved":
        return "default";
      default:
        return "secondary";
    }
  };

  const getSubjectLabel = (subject: string) => {
    const labels: Record<string, string> = {
      general: "General Inquiry",
      support: "Technical Support",
      listing: "Listing Help",
      verification: "Verification Issues",
      partnership: "Partnership Inquiry",
      other: "Other",
    };
    return labels[subject] || subject;
  };

  const unreadCount = messages.filter(m => m.status === "unread").length;

  if (loading) {
    return (
      <div className="bg-card rounded-xl border border-border p-12 text-center">
        <div className="animate-pulse">Loading messages...</div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No contact messages</h3>
            <p className="text-muted-foreground">Messages from the contact form will appear here</p>
          </div>
        ) : (
          messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-card rounded-xl border p-6 ${
                msg.status === "unread" ? "border-primary/50 bg-primary/5" : "border-border"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{msg.name}</h3>
                    <Badge variant={getStatusColor(msg.status)} className="capitalize">
                      {msg.status}
                    </Badge>
                    <Badge variant="outline">{getSubjectLabel(msg.subject)}</Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {msg.email}
                    </span>
                    {msg.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {msg.phone}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {new Date(msg.created_at).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">{msg.message}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedMessage(msg)}
                  >
                    <Eye className="h-4 w-4 mr-1" /> View
                  </Button>
                  {msg.status === "unread" && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleMarkAsRead(msg.id)}
                    >
                      Mark Read
                    </Button>
                  )}
                  {msg.status !== "resolved" && (
                    <Button
                      size="sm"
                      className="bg-success hover:bg-success/90"
                      onClick={() => handleMarkAsResolved(msg.id)}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" /> Resolve
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(msg.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Message Detail Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contact Message</DialogTitle>
            <DialogDescription>
              From {selectedMessage?.name} • {selectedMessage && new Date(selectedMessage.created_at).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{selectedMessage.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a href={`mailto:${selectedMessage.email}`} className="font-medium text-primary hover:underline">
                    {selectedMessage.email}
                  </a>
                </div>
                {selectedMessage.phone && (
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <a href={`tel:${selectedMessage.phone}`} className="font-medium text-primary hover:underline">
                      {selectedMessage.phone}
                    </a>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Subject</p>
                  <p className="font-medium">{getSubjectLabel(selectedMessage.subject)}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Message</p>
                <div className="bg-muted rounded-lg p-4">
                  <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" asChild>
                  <a href={`mailto:${selectedMessage.email}`}>Reply via Email</a>
                </Button>
                {selectedMessage.status !== "resolved" && (
                  <Button 
                    className="bg-success hover:bg-success/90"
                    onClick={() => {
                      handleMarkAsResolved(selectedMessage.id);
                      setSelectedMessage(null);
                    }}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1" /> Mark as Resolved
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminContactMessages;
