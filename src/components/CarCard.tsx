import { motion } from "framer-motion";
import { BadgeCheck, MapPin, Calendar, Fuel, Settings2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CarCardProps {
  car: {
    id: string;
    title: string;
    brand: string;
    model: string;
    year: number;
    price: number;
    location: string;
    mileage: string;
    fuelType: string;
    transmission: string;
    image: string;
    isVerified: boolean;
    isDealer: boolean;
    sellerName: string;
  };
  index?: number;
}

const CarCard = ({ car, index = 0 }: CarCardProps) => {
  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `₦${(price / 1000000).toFixed(1)}M`;
    }
    return `₦${(price / 1000).toFixed(0)}K`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover"
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={car.image}
          alt={car.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {car.isVerified && (
            <div className="verification-badge">
              <BadgeCheck className="h-3.5 w-3.5" />
              Verified
            </div>
          )}
          {car.isDealer && (
            <div className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">
              Dealer
            </div>
          )}
        </div>

        {/* Wishlist Button */}
        <button className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-card/90 backdrop-blur-sm transition-colors hover:bg-card">
          <Heart className="h-4 w-4 text-muted-foreground" />
        </button>

        {/* Price Tag */}
        <div className="absolute bottom-3 right-3">
          <div className="rounded-lg bg-card/95 px-3 py-1.5 backdrop-blur-sm">
            <span className="text-lg font-bold text-foreground">{formatPrice(car.price)}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <div className="mb-3">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {car.year} {car.brand}
          </p>
          <h3 className="text-lg font-semibold text-foreground line-clamp-1">{car.model}</h3>
        </div>

        {/* Specs Grid */}
        <div className="mb-4 grid grid-cols-2 gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {car.location}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {car.mileage}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Fuel className="h-3.5 w-3.5" />
            {car.fuelType}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Settings2 className="h-3.5 w-3.5" />
            {car.transmission}
          </div>
        </div>

        {/* Seller Info */}
        <div className="flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-medium text-accent-foreground">
              {car.sellerName.charAt(0)}
            </div>
            <span className="text-sm text-muted-foreground">{car.sellerName}</span>
          </div>
          <Button variant="ghost" size="sm" className="text-primary">
            View Details
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CarCard;
