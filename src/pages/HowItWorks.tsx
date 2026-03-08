import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEOHead, BreadcrumbSchema, getBreadcrumbsFromPath } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Shield, CreditCard, Car, CheckCircle, UserCheck, FileText, Handshake } from "lucide-react";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  const buyerSteps = [
    {
      icon: Search,
      title: "Browse Verified Listings",
      description: "Search through our curated collection of verified vehicles. All sellers are identity-verified for your safety.",
    },
    {
      icon: FileText,
      title: "Request Inspection",
      description: "Schedule a professional inspection or arrange a viewing with the seller through our secure platform.",
    },
    {
      icon: CreditCard,
      title: "Secure Payment via Escrow",
      description: "Pay through our escrow service. Your money is held safely until you confirm receipt of the vehicle.",
    },
    {
      icon: Car,
      title: "Complete the Transfer",
      description: "Once you're satisfied with the vehicle, confirm delivery and the payment is released to the seller.",
    },
  ];

  const sellerSteps = [
    {
      icon: UserCheck,
      title: "Verify Your Identity",
      description: "Complete our quick verification process with a valid government ID to become a trusted seller.",
    },
    {
      icon: FileText,
      title: "Create Your Listing",
      description: "Upload photos, add vehicle details, and set your price. Our team reviews listings for quality.",
    },
    {
      icon: Handshake,
      title: "Connect with Buyers",
      description: "Receive inquiries from verified buyers and schedule viewings through our secure messaging system.",
    },
    {
      icon: CheckCircle,
      title: "Complete the Sale",
      description: "Once the buyer confirms receipt, receive your payment directly to your bank account.",
    },
  ];

  return (
    <>
      <SEOHead
        title="How It Works"
        description="Learn how List Your Car makes buying and selling cars safe and easy with verified sellers, escrow payments, and fraud protection."
        keywords="how to buy car nigeria, safe car selling, escrow car payment, verified car marketplace"
        canonicalUrl="https://listyourcar.ng/how-it-works"
      />

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-20">
          <div className="container-wide">
            <BreadcrumbSchema items={getBreadcrumbsFromPath("/how-it-works")} />
          </div>
          {/* Hero */}
          <section className="bg-gradient-to-b from-primary/5 to-background py-16">
            <div className="container-wide text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">How AutoTrust Works</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Buy and sell cars with confidence. Our platform ensures secure transactions and verified participants.
              </p>
            </div>
          </section>

          {/* Trust Features */}
          <section className="py-16 border-b">
            <div className="container-wide">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Verified Sellers</h3>
                  <p className="text-muted-foreground">Every seller undergoes identity verification with government-issued ID</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Escrow Protection</h3>
                  <p className="text-muted-foreground">Funds are held securely until you confirm receipt of your vehicle</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Fraud Detection</h3>
                  <p className="text-muted-foreground">AI-powered systems detect and prevent fraudulent listings</p>
                </div>
              </div>
            </div>
          </section>

          {/* For Buyers */}
          <section className="py-16">
            <div className="container-wide">
              <h2 className="text-3xl font-bold mb-2 text-center">For Buyers</h2>
              <p className="text-muted-foreground text-center mb-12">Find your perfect car with complete peace of mind</p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {buyerSteps.map((step, index) => (
                  <Card key={index} className="relative">
                    <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <CardContent className="pt-8 pb-6">
                      <step.icon className="h-10 w-10 text-primary mb-4" />
                      <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                      <p className="text-muted-foreground text-sm">{step.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-8">
                <Button asChild size="lg">
                  <Link to="/browse">Browse Cars</Link>
                </Button>
              </div>
            </div>
          </section>

          {/* For Sellers */}
          <section className="py-16 bg-muted/50">
            <div className="container-wide">
              <h2 className="text-3xl font-bold mb-2 text-center">For Sellers</h2>
              <p className="text-muted-foreground text-center mb-12">Sell your car quickly and safely</p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {sellerSteps.map((step, index) => (
                  <Card key={index} className="relative">
                    <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <CardContent className="pt-8 pb-6">
                      <step.icon className="h-10 w-10 text-primary mb-4" />
                      <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                      <p className="text-muted-foreground text-sm">{step.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-8">
                <Button asChild size="lg">
                  <Link to="/sell">Sell Your Car</Link>
                </Button>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16">
            <div className="container-wide text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Join thousands of Nigerians who trust AutoTrust for their car buying and selling needs.
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/auth">Create Account</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default HowItWorks;
