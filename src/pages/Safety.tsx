import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, AlertTriangle, CheckCircle, Eye, Lock, UserCheck, Phone, MapPin } from "lucide-react";

const Safety = () => {
  const safetyTips = [
    {
      icon: UserCheck,
      title: "Only Deal with Verified Sellers",
      description: "Look for the verified badge on seller profiles. Verified sellers have passed our identity verification process.",
    },
    {
      icon: Eye,
      title: "Always Inspect Before Buying",
      description: "Never purchase a vehicle without seeing it in person. Schedule a viewing and bring a mechanic if possible.",
    },
    {
      icon: Lock,
      title: "Use Our Escrow Service",
      description: "Never send money directly to a seller. Our escrow service protects your payment until you confirm receipt.",
    },
    {
      icon: Phone,
      title: "Keep Communication on Platform",
      description: "Use our messaging system to communicate. This creates a record and helps our fraud detection systems.",
    },
    {
      icon: MapPin,
      title: "Meet in Safe Locations",
      description: "For viewings, meet in public places during daylight hours. Bring someone with you if possible.",
    },
    {
      icon: AlertTriangle,
      title: "Trust Your Instincts",
      description: "If a deal seems too good to be true, it probably is. Report suspicious listings immediately.",
    },
  ];

  const redFlags = [
    "Price significantly below market value",
    "Seller refuses to meet in person",
    "Requests for payment outside our platform",
    "Pressure to complete transaction quickly",
    "Inconsistent vehicle information",
    "Poor quality or stock photos",
    "Seller unable to provide documentation",
    "Requests for personal financial information",
  ];

  return (
    <>
      <Helmet>
        <title>Safety Tips - AutoTrust Nigeria</title>
        <meta name="description" content="Stay safe when buying or selling cars on AutoTrust Nigeria. Learn to identify scams and protect yourself." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-20">
          {/* Hero */}
          <section className="bg-gradient-to-b from-primary/5 to-background py-16">
            <div className="container-wide text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Stay Safe on AutoTrust</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Your safety is our priority. Follow these guidelines to protect yourself when buying or selling vehicles.
              </p>
            </div>
          </section>

          {/* Safety Tips */}
          <section className="py-16">
            <div className="container-wide">
              <h2 className="text-3xl font-bold text-center mb-12">Safety Tips</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {safetyTips.map((tip, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <tip.icon className="h-10 w-10 text-primary mb-4" />
                      <h3 className="font-semibold text-lg mb-2">{tip.title}</h3>
                      <p className="text-muted-foreground">{tip.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Red Flags */}
          <section className="py-16 bg-muted/50">
            <div className="container-wide">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                  <h2 className="text-3xl font-bold">Red Flags to Watch For</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {redFlags.map((flag, index) => (
                    <div key={index} className="flex items-start gap-3 bg-background p-4 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                      <span>{flag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* What We Do */}
          <section className="py-16">
            <div className="container-wide">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-center">How AutoTrust Protects You</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Identity Verification</h3>
                      <p className="text-muted-foreground">All sellers must verify their identity with government-issued ID before listing.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">AI-Powered Fraud Detection</h3>
                      <p className="text-muted-foreground">Our systems automatically detect suspicious listings and duplicate images.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Secure Escrow Payments</h3>
                      <p className="text-muted-foreground">Funds are held securely until the buyer confirms receipt of the vehicle.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Listing Review</h3>
                      <p className="text-muted-foreground">Our team reviews listings before they go live to ensure quality and accuracy.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Safety;
