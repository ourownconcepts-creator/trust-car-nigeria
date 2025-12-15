import { motion } from "framer-motion";
import { BadgeCheck, Star, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const DealerSection = () => {
  const dealers = [
    {
      id: "1",
      name: "Premium Motors Lagos",
      location: "Victoria Island, Lagos",
      rating: 4.9,
      reviews: 128,
      carsListed: 45,
      verified: true,
      logo: "PM",
      specialty: "Luxury & Sports Cars",
    },
    {
      id: "2",
      name: "Elite Auto Gallery",
      location: "Lekki, Lagos",
      rating: 4.8,
      reviews: 96,
      carsListed: 32,
      verified: true,
      logo: "EA",
      specialty: "German Imports",
    },
    {
      id: "3",
      name: "Abuja AutoMart",
      location: "Maitama, Abuja",
      rating: 4.7,
      reviews: 84,
      carsListed: 28,
      verified: true,
      logo: "AA",
      specialty: "SUVs & Family Cars",
    },
    {
      id: "4",
      name: "AutoNation PH",
      location: "Port Harcourt",
      rating: 4.8,
      reviews: 67,
      carsListed: 23,
      verified: true,
      logo: "AN",
      specialty: "Toyota & Lexus Specialist",
    },
  ];

  return (
    <section className="bg-primary py-20 lg:py-28">
      <div className="container-wide">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end"
        >
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2">
              <BadgeCheck className="h-4 w-4 text-verification" />
              <span className="text-sm font-medium text-primary-foreground">CAC Verified Dealers</span>
            </div>
            <h2 className="mb-2 text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Trusted Dealerships
            </h2>
            <p className="text-primary-foreground/70">
              Shop from verified dealers with transparent business records
            </p>
          </div>
          <Button
            variant="heroOutline"
            className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
          >
            View All Dealers
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>

        {/* Dealers Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {dealers.map((dealer, index) => (
            <motion.div
              key={dealer.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group rounded-2xl bg-card p-6 shadow-lg transition-all duration-300 hover:shadow-card-hover"
            >
              {/* Logo & Verified Badge */}
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
                  {dealer.logo}
                </div>
                {dealer.verified && (
                  <div className="verification-badge text-[10px]">
                    <BadgeCheck className="h-3 w-3" />
                    Verified
                  </div>
                )}
              </div>

              {/* Info */}
              <h3 className="mb-1 text-lg font-semibold text-foreground">{dealer.name}</h3>
              <p className="mb-3 text-xs text-muted-foreground">{dealer.specialty}</p>

              <div className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {dealer.location}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between border-t border-border pt-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-verification text-verification" />
                  <span className="font-medium text-foreground">{dealer.rating}</span>
                  <span className="text-xs text-muted-foreground">({dealer.reviews})</span>
                </div>
                <span className="text-sm text-muted-foreground">{dealer.carsListed} cars</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DealerSection;
