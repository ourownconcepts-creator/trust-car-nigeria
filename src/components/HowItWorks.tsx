import { motion } from "framer-motion";
import { UserCheck, Search, ShieldCheck, Handshake } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: UserCheck,
      step: "01",
      title: "Get Verified",
      description: "Complete a quick ID verification. We validate your identity and, for sellers, proof of car ownership.",
      forSeller: true,
      forBuyer: false,
    },
    {
      icon: Search,
      step: "02",
      title: "Browse or List",
      description: "Buyers browse verified listings with confidence. Sellers create detailed, trust-marked listings.",
      forSeller: true,
      forBuyer: true,
    },
    {
      icon: ShieldCheck,
      step: "03",
      title: "Secure Transaction",
      description: "Use our escrow service. Funds are protected until inspection and buyer approval.",
      forSeller: true,
      forBuyer: true,
    },
    {
      icon: Handshake,
      step: "04",
      title: "Complete Deal",
      description: "After inspection approval, ownership transfers safely. Both parties protected throughout.",
      forSeller: true,
      forBuyer: true,
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
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            A simple, secure process designed to protect both buyers and sellers
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-border via-primary/30 to-border lg:block" />

          <div className="space-y-12 lg:space-y-0">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className={`relative flex flex-col items-center gap-8 lg:flex-row ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Content */}
                <div className={`flex-1 ${index % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}>
                  <div
                    className={`inline-block ${
                      index % 2 === 0 ? "lg:ml-auto" : "lg:mr-auto"
                    }`}
                  >
                    <span className="mb-2 block text-sm font-bold text-primary">
                      Step {step.step}
                    </span>
                    <h3 className="mb-2 text-xl font-semibold text-foreground">{step.title}</h3>
                    <p className="max-w-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>

                {/* Icon */}
                <div className="relative z-10 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-primary shadow-lg lg:h-20 lg:w-20">
                  <step.icon className="h-8 w-8 text-primary-foreground lg:h-10 lg:w-10" />
                </div>

                {/* Spacer for alignment */}
                <div className="hidden flex-1 lg:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
