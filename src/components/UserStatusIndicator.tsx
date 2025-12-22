import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface UserStatusIndicatorProps {
  isOnline: boolean;
  lastActive: Date | null;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const UserStatusIndicator = ({ 
  isOnline, 
  lastActive, 
  showText = false,
  size = "md" 
}: UserStatusIndicatorProps) => {
  const sizeClasses = {
    sm: "h-2 w-2",
    md: "h-2.5 w-2.5",
    lg: "h-3 w-3",
  };

  const getLastActiveText = () => {
    if (isOnline) return "Online";
    if (!lastActive) return "Offline";
    return `Active ${formatDistanceToNow(lastActive, { addSuffix: true })}`;
  };

  return (
    <div className="flex items-center gap-1.5">
      <span
        className={cn(
          "rounded-full flex-shrink-0",
          sizeClasses[size],
          isOnline 
            ? "bg-green-500 animate-pulse" 
            : "bg-muted-foreground/50"
        )}
      />
      {showText && (
        <span className={cn(
          "text-xs",
          isOnline ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
        )}>
          {getLastActiveText()}
        </span>
      )}
    </div>
  );
};

export default UserStatusIndicator;
