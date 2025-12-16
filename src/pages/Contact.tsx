import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "support@listyourcar.ng",
    description: "We'll respond within 24 hours",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+234 800 LIST CAR",
    description: "Mon-Fri 9AM-6PM WAT",
  },
  {
    icon: MapPin,
    title: "Office",
    value: "Victoria Island, Lagos",
    description: "By appointment only",
  },
  {
    icon: Clock,
    title: "Support Hours",
    value: "24/7 Online Support",
    description: "Via chat and email",
  },
];

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - List Your Car Nigeria</title>
        <meta name="description" content="Get in touch with List Your Car. We're here to help with any questions about buying, selling, or listing your car." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-20">
          {/* Hero */}
          <section className="py-16 bg-primary text-primary-foreground">
            <div className="container-wide">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl"
              >
                <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
                <p className="text-primary-foreground/80 text-lg">
                  Have questions? We're here to help. Reach out to our team and we'll 
                  get back to you as soon as possible.
                </p>
              </motion.div>
            </div>
          </section>

          <section className="py-16">
            <div className="container-wide">
              <div className="grid lg:grid-cols-3 gap-12">
                {/* Contact Form */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="lg:col-span-2"
                >
                  <div className="bg-card rounded-xl border border-border p-6 md:p-8">
                    <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Select
                          value={formData.subject}
                          onValueChange={(v) => setFormData({ ...formData, subject: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="support">Technical Support</SelectItem>
                            <SelectItem value="listing">Listing Help</SelectItem>
                            <SelectItem value="verification">Verification Issues</SelectItem>
                            <SelectItem value="partnership">Partnership Inquiry</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="How can we help you?"
                          rows={5}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          required
                        />
                      </div>

                      <Button type="submit" size="lg">
                        <Send className="h-4 w-4 mr-2" /> Send Message
                      </Button>
                    </form>
                  </div>
                </motion.div>

                {/* Contact Info */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {contactInfo.map((info) => (
                    <div
                      key={info.title}
                      className="bg-card rounded-xl border border-border p-6"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <info.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{info.title}</p>
                          <p className="font-medium">{info.value}</p>
                          <p className="text-xs text-muted-foreground mt-1">{info.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Live Chat CTA */}
                  <div className="bg-primary text-primary-foreground rounded-xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <MessageCircle className="h-8 w-8" />
                      <div>
                        <h3 className="font-semibold">Need Quick Help?</h3>
                        <p className="text-sm text-primary-foreground/80">Chat with our support team</p>
                      </div>
                    </div>
                    <Button variant="secondary" className="w-full">
                      Start Live Chat
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* FAQ CTA */}
          <section className="py-16 bg-muted/50">
            <div className="container-wide text-center">
              <h2 className="text-2xl font-bold mb-4">Looking for Quick Answers?</h2>
              <p className="text-muted-foreground mb-6">
                Check out our FAQ section for answers to common questions
              </p>
              <Button variant="outline" size="lg">
                View FAQ
              </Button>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Contact;
