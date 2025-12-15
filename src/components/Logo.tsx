import { Shield, Check } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const Logo = ({ size = "md", showText = true }: LogoProps) => {
  const sizes = {
    sm: { icon: 24, text: "text-lg" },
    md: { icon: 32, text: "text-xl" },
    lg: { icon: 40, text: "text-2xl" },
  };

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative">
        <div className="relative flex items-center justify-center rounded-xl bg-primary p-2 shadow-lg">
          <Shield 
            size={sizes[size].icon} 
            className="text-primary-foreground" 
            strokeWidth={2.5}
          />
          <div className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-verification shadow-sm">
            <Check size={10} className="text-verification-foreground" strokeWidth={3} />
          </div>
        </div>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`${sizes[size].text} font-bold tracking-tight text-foreground`}>
            List Your Car
          </span>
          {size !== "sm" && (
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Verified Marketplace
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
