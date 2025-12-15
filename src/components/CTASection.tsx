import { motion } from "framer-motion";
import { ArrowRight, Shield, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="relative overflow-hidden bg-background py-20 lg:py-28">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl rounded-3xl border border-border bg-card p-8 text-center shadow-xl lg:p-16"
        >
          <div className="mb-6 inline-flex items-center justify-center rounded-full bg-primary/10 p-4">
            <Shield className="h-10 w-10 text-primary" />
          </div>

          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Ready to Buy or Sell with Confidence?
          </h2>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Join thousands of Nigerians who have discovered the safest way to buy and sell cars. 
            Zero fraud, zero stress, 100% verified.
          </p>

          {/* Benefits */}
          <div className="mb-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {["Free to Browse", "Seller Verification", "Secure Payments", "24/7 Support"].map((benefit) => (
              <div key={benefit} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-success" />
                {benefit}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="xl" variant="hero" className="group">
              Start Selling Today
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="xl" variant="outline">
              Browse Cars
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
