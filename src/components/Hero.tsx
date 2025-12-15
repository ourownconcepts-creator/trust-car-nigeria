import { motion } from "framer-motion";
import { Shield, CheckCircle2, ArrowRight, BadgeCheck, Users, Car } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const stats = [
    { icon: Car, value: "2,500+", label: "Verified Listings" },
    { icon: Users, value: "15,000+", label: "Happy Buyers" },
    { icon: BadgeCheck, value: "100%", label: "Verified Sellers" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-accent/30 pb-20 pt-12 lg:pb-32 lg:pt-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute right-0 top-0 h-[500px] w-[500px] -translate-y-1/4 translate-x-1/4 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] translate-y-1/4 -translate-x-1/4 rounded-full bg-verification/10 blur-3xl" />
      </div>

      <div className="container-wide">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-verification/30 bg-verification/10 px-4 py-2"
            >
              <Shield className="h-4 w-4 text-verification" />
              <span className="text-sm font-medium text-foreground">Nigeria's Most Trusted Car Marketplace</span>
            </motion.div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              One Car. One Poster.{" "}
              <span className="relative">
                <span className="relative z-10 text-primary">Zero Fraud.</span>
                <span className="absolute bottom-2 left-0 -z-0 h-3 w-full bg-verification/30" />
              </span>
            </h1>

            <p className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground lg:mx-0">
              Buy and sell cars with complete confidence. Every seller is verified, 
              every listing is authentic, and every transaction is protected.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Button size="xl" variant="hero" className="group">
                Browse Verified Cars
                <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="xl" variant="heroOutline">
                Sell Your Car
              </Button>
            </div>

            {/* Trust Points */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:justify-start">
              {["Verified Sellers Only", "Secure Escrow Payments", "Fraud Protection"].map((point) => (
                <div key={point} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  {point}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Hero Image / Stats Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Card */}
              <div className="relative overflow-hidden rounded-2xl bg-card shadow-card-hover">
                <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-accent">
                  <img
                    src="https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80"
                    alt="Premium verified car"
                    className="h-full w-full object-cover"
                  />
                </div>
                
                {/* Floating Verification Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="absolute left-4 top-4"
                >
                  <div className="verification-badge shadow-lg">
                    <BadgeCheck className="h-4 w-4" />
                    Verified Seller
                  </div>
                </motion.div>

                {/* Car Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/90 to-transparent p-6 pt-16">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm font-medium text-primary-foreground/70">2024 Mercedes-Benz</p>
                      <h3 className="text-xl font-bold text-primary-foreground">GLE 450 4MATIC</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-primary-foreground/70">Starting from</p>
                      <p className="text-2xl font-bold text-verification">₦85M</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -bottom-6 -right-4 left-8 rounded-xl bg-card p-4 shadow-xl lg:-right-8 lg:left-12"
              >
                <div className="grid grid-cols-3 divide-x divide-border">
                  {stats.map((stat) => (
                    <div key={stat.label} className="px-3 text-center">
                      <stat.icon className="mx-auto mb-1 h-5 w-5 text-primary" />
                      <p className="text-lg font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
