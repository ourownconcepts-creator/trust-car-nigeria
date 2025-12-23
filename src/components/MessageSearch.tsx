import { useState, useEffect } from "react";
import { Search, X, MessageCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

interface SearchResult {
  id: string;
  content: string;
  created_at: string;
  listing_id: string;
  sender_id: string;
  recipient_id: string;
  listing_title?: string;
  other_user_name?: string;
}

interface MessageSearchProps {
  onSelectResult?: (listingId: string, otherUserId: string) => void;
}

const MessageSearch = ({ onSelectResult }: MessageSearchProps) => {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const searchMessages = async () => {
      if (!query.trim() || !user) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const { data: messages, error } = await supabase
          .from("messages")
          .select("id, content, created_at, listing_id, sender_id, recipient_id")
          .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
          .ilike("content", `%${query}%`)
          .order("created_at", { ascending: false })
          .limit(20);

        if (error) throw error;

        // Fetch additional details for each result
        const enrichedResults = await Promise.all(
          (messages || []).map(async (msg) => {
            const otherUserId = msg.sender_id === user.id ? msg.recipient_id : msg.sender_id;
            
            const [profileRes, listingRes] = await Promise.all([
              supabase.from("profiles").select("full_name, email").eq("id", otherUserId).single(),
              supabase.from("car_listings").select("title").eq("id", msg.listing_id).single()
            ]);

            return {
              ...msg,
              other_user_name: profileRes.data?.full_name || profileRes.data?.email || "Unknown",
              listing_title: listingRes.data?.title || "Unknown Listing"
            };
          })
        );

        setResults(enrichedResults);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchMessages, 300);
    return () => clearTimeout(debounce);
  }, [query, user]);

  const handleResultClick = (result: SearchResult) => {
    const otherUserId = result.sender_id === user?.id ? result.recipient_id : result.sender_id;
    onSelectResult?.(result.listing_id, otherUserId);
    setIsOpen(false);
    setQuery("");
  };

  const highlightMatch = (text: string, searchQuery: string) => {
    if (!searchQuery.trim()) return text;
    const regex = new RegExp(`(${searchQuery})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-primary/30 text-foreground rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search messages..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isOpen && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <MessageCircle className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">No messages found</p>
            </div>
          ) : (
            <ScrollArea className="max-h-[300px]">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="w-full text-left p-3 hover:bg-muted/50 transition-colors border-b border-border last:border-0"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{result.other_user_name}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(result.created_at), "MMM d")}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1 truncate">
                    {result.listing_title}
                  </p>
                  <p className="text-sm truncate">
                    {highlightMatch(result.content, query)}
                  </p>
                </button>
              ))}
            </ScrollArea>
          )}
        </div>
      )}

      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default MessageSearch;
