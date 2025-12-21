import { Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReadReceiptProps {
  isRead: boolean;
  isOwn: boolean;
  className?: string;
}

const ReadReceipt = ({ isRead, isOwn, className }: ReadReceiptProps) => {
  if (!isOwn) return null;

  return (
    <span className={cn("inline-flex items-center ml-1", className)}>
      {isRead ? (
        <CheckCheck className="h-3.5 w-3.5 text-primary-foreground/70" />
      ) : (
        <Check className="h-3.5 w-3.5 text-primary-foreground/50" />
      )}
    </span>
  );
};

export default ReadReceipt;
