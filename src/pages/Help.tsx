import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEOHead, FAQSchema, BreadcrumbSchema, getBreadcrumbsFromPath } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, MessageCircle, Phone, Mail, Car, Shield, CreditCard, User } from "lucide-react";
import { Link } from "react-router-dom";

const Help = () => {
  const categories = [
    { icon: Car, title: "Buying a Car", description: "How to search, inspect, and purchase vehicles" },
    { icon: User, title: "Selling a Car", description: "Listing, pricing, and completing sales" },
    { icon: Shield, title: "Verification", description: "Identity verification and trusted seller status" },
    { icon: CreditCard, title: "Payments & Escrow", description: "Understanding our secure payment system" },
  ];

  const faqs = [
    {
      question: "How do I create a listing?",
      answer: "To create a listing, first sign in to your account and complete seller verification. Then click 'Sell Your Car' and follow the step-by-step process to add photos, vehicle details, and set your price.",
    },
    {
      question: "How does the escrow service work?",
      answer: "Our escrow service holds the buyer's payment securely until both parties confirm the transaction is complete. Once the buyer receives and inspects the vehicle, they confirm receipt and the funds are released to the seller.",
    },
    {
      question: "What documents do I need for verification?",
      answer: "You'll need a valid government-issued ID (National ID, Driver's License, or International Passport) and a selfie for identity confirmation. For dealers, additional business documentation may be required.",
    },
    {
      question: "How long does verification take?",
      answer: "Most verifications are completed within 24-48 hours. You'll receive an email notification once your verification status is updated.",
    },
    {
      question: "Can I edit my listing after publishing?",
      answer: "Yes, you can edit your listing at any time from your dashboard. Changes to price or major details may require re-approval.",
    },
    {
      question: "What fees does AutoTrust charge?",
      answer: "Listing on AutoTrust is free. We charge a small transaction fee only when a sale is completed through our escrow service. See our pricing page for current rates.",
    },
  ];

  return (
    <>
      <SEOHead
        title="Help Center"
        description="Get help with buying, selling, and using List Your Car. Find answers to common questions and contact our support team."
        keywords="help center, car marketplace support, buying cars help, selling cars FAQ"
        canonicalUrl="https://listyourcar.ng/help"
      />

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-20">
          <div className="container-wide">
            <BreadcrumbSchema items={getBreadcrumbsFromPath("/help")} />
          </div>
          {/* Hero */}
          <section className="bg-gradient-to-b from-primary/5 to-background py-16">
            <div className="container-wide text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">How Can We Help?</h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Find answers to common questions or get in touch with our support team
              </p>
              <div className="max-w-lg mx-auto relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Search for help..." className="pl-10 h-12 text-lg" />
              </div>
            </div>
          </section>

          {/* Categories */}
          <section className="py-16">
            <div className="container-wide">
              <h2 className="text-2xl font-bold text-center mb-8">Browse by Category</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((cat, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="pt-6 text-center">
                      <cat.icon className="h-10 w-10 text-primary mx-auto mb-4" />
                      <h3 className="font-semibold text-lg mb-2">{cat.title}</h3>
                      <p className="text-muted-foreground text-sm">{cat.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-16 bg-muted/50">
            <div className="container-wide">
              <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
              <div className="max-w-3xl mx-auto">
                <Accordion type="single" collapsible className="space-y-4">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="bg-background rounded-lg px-6">
                      <AccordionTrigger className="text-left hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </section>

          {/* Contact Options */}
          <section className="py-16">
            <div className="container-wide">
              <h2 className="text-2xl font-bold text-center mb-8">Still Need Help?</h2>
              <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <MessageCircle className="h-10 w-10 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Live Chat</h3>
                    <p className="text-muted-foreground text-sm mb-4">Chat with our support team</p>
                    <Button variant="outline" size="sm">Start Chat</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Mail className="h-10 w-10 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Email Support</h3>
                    <p className="text-muted-foreground text-sm mb-4">Get a response within 24 hours</p>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/contact">Contact Us</Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Phone className="h-10 w-10 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Phone Support</h3>
                    <p className="text-muted-foreground text-sm mb-4">Mon-Fri, 9am-6pm WAT</p>
                    <Button variant="outline" size="sm" asChild>
                      <a href="tel:+2349000000000">Call Now</a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Help;
