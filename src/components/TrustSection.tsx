import { motion } from "framer-motion";
import { Shield, UserCheck, FileCheck, Lock, BadgeCheck, AlertTriangle } from "lucide-react";

const TrustSection = () => {
  const features = [
    {
      icon: UserCheck,
      title: "Verified Sellers Only",
      description: "Every seller must complete government ID verification before listing. No exceptions.",
      highlight: true,
    },
    {
      icon: FileCheck,
      title: "Proof of Ownership",
      description: "We verify car documents and ownership papers before any listing goes live.",
    },
    {
      icon: Shield,
      title: "One Car, One Listing",
      description: "Our VIN verification system ensures each car can only be listed once by its true owner.",
    },
    {
      icon: Lock,
      title: "Secure Escrow",
      description: "Payments are held securely until you've inspected and approved your vehicle.",
    },
    {
      icon: BadgeCheck,
      title: "Dealer Verification",
      description: "Licensed dealers undergo CAC verification and background checks.",
    },
    {
      icon: AlertTriangle,
      title: "Fraud Detection",
      description: "AI-powered systems detect duplicate listings, fake images, and suspicious activity.",
    },
  ];

  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="container-wide">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Shield className="h-4 w-4" />
            Trust-First Platform
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Why Nigeria Trusts Us
          </h2>
          <p className="text-lg text-muted-foreground">
            We've built the verification infrastructure that makes fraud impossible, 
            not just difficult.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:shadow-card-hover ${
                feature.highlight
                  ? "border-verification/30 bg-verification/5"
                  : "border-border bg-card"
              }`}
            >
              <div
                className={`mb-4 inline-flex rounded-xl p-3 ${
                  feature.highlight
                    ? "bg-verification/20 text-verification"
                    : "bg-primary/10 text-primary"
                }`}
              >
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>

              {feature.highlight && (
                <div className="absolute right-4 top-4">
                  <span className="verification-badge text-[10px]">Core Feature</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
