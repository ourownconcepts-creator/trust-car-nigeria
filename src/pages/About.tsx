import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Shield, Users, Car, CheckCircle2, Target, Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const stats = [
  { value: "10,000+", label: "Verified Sellers" },
  { value: "50,000+", label: "Cars Listed" },
  { value: "₦25B+", label: "Transactions Completed" },
  { value: "99.9%", label: "Fraud Prevention Rate" },
];

const values = [
  {
    icon: Shield,
    title: "Trust First",
    description: "Every transaction on our platform is built on verified identities and authentic listings.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "We're building a marketplace where buyers and sellers can connect with confidence.",
  },
  {
    icon: Target,
    title: "Transparency",
    description: "No hidden fees, no fake listings. What you see is what you get.",
  },
  {
    icon: Heart,
    title: "Customer First",
    description: "Our support team is dedicated to ensuring smooth transactions for everyone.",
  },
];

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us - List Your Car Nigeria</title>
        <meta name="description" content="Learn about List Your Car - Nigeria's trusted verified car marketplace. Our mission is to make car buying and selling safe, simple, and transparent." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-20">
          {/* Hero */}
          <section className="py-20 bg-primary text-primary-foreground">
            <div className="container-wide">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl"
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Building Trust in<br />Nigerian Auto Trade
                </h1>
                <p className="text-xl text-primary-foreground/80">
                  List Your Car was founded with a simple mission: to create a car marketplace 
                  where trust isn't optional—it's guaranteed. One car. One poster. Zero fraud.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Stats */}
          <section className="py-16 border-b border-border">
            <div className="container-wide">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <p className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</p>
                    <p className="text-muted-foreground">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Mission */}
          <section className="py-20">
            <div className="container-wide">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                  <p className="text-muted-foreground text-lg mb-6">
                    For too long, buying and selling cars in Nigeria has been plagued by fraud, 
                    fake listings, and unverified sellers. We're changing that.
                  </p>
                  <p className="text-muted-foreground text-lg mb-6">
                    List Your Car is more than a marketplace—it's a movement towards 
                    transparency and trust in the automotive industry. Every seller is verified. 
                    Every listing is authentic. Every transaction is secure.
                  </p>
                  <div className="space-y-4">
                    {[
                      "Mandatory seller verification",
                      "VIN-based duplicate prevention",
                      "Professional inspection network",
                      "Secure escrow payments",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-success" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-muted rounded-2xl aspect-square flex items-center justify-center"
                >
                  <Car className="h-32 w-32 text-muted-foreground/30" />
                </motion.div>
              </div>
            </div>
          </section>

          {/* Values */}
          <section className="py-20 bg-muted/50">
            <div className="container-wide">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Our Values</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  These principles guide everything we do at List Your Car
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {values.map((value, index) => (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card rounded-xl border border-border p-6"
                  >
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Team CTA */}
          <section className="py-20">
            <div className="container-wide text-center">
              <h2 className="text-3xl font-bold mb-4">Join Our Team</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                We're always looking for talented individuals who share our passion for 
                transforming the automotive industry in Nigeria.
              </p>
              <a
                href="mailto:careers@listyourcar.ng"
                className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-8 py-3 font-medium hover:bg-primary/90 transition-colors"
              >
                View Open Positions
              </a>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default About;
