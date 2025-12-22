import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smile, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMessageReactions } from "@/hooks/useMessageReactions";
import { cn } from "@/lib/utils";

interface MessageReactionsProps {
  messageId: string;
  isOwn: boolean;
}

const EMOJI_OPTIONS = ["👍", "❤️", "😂", "😮", "😢", "🔥", "👏", "🙏"];

const MessageReactions = ({ messageId, isOwn }: MessageReactionsProps) => {
  const { toggleReaction, getReactionCounts } = useMessageReactions(messageId);
  const [isOpen, setIsOpen] = useState(false);
  const reactionCounts = getReactionCounts();

  const handleReaction = async (emoji: string) => {
    await toggleReaction(emoji);
    setIsOpen(false);
  };

  return (
    <div className={cn("flex items-center gap-1 mt-1", isOwn ? "justify-end" : "justify-start")}>
      {/* Display existing reactions */}
      <AnimatePresence>
        {reactionCounts.map(({ emoji, count, hasUserReacted }) => (
          <motion.button
            key={emoji}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => handleReaction(emoji)}
            className={cn(
              "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-colors",
              hasUserReacted
                ? "bg-primary/20 border border-primary/40"
                : "bg-muted/80 border border-border hover:bg-muted"
            )}
          >
            <span>{emoji}</span>
            <span className="text-muted-foreground">{count}</span>
          </motion.button>
        ))}
      </AnimatePresence>

      {/* Add reaction button */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {reactionCounts.length > 0 ? (
              <Plus className="h-3 w-3" />
            ) : (
              <Smile className="h-3 w-3" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" side="top" align={isOwn ? "end" : "start"}>
          <div className="flex gap-1">
            {EMOJI_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleReaction(emoji)}
                className="text-lg hover:scale-125 transition-transform p-1"
              >
                {emoji}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MessageReactions;
