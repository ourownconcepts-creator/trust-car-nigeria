import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEOHead, BreadcrumbSchema, getBreadcrumbsFromPath } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Download, ExternalLink } from "lucide-react";

const Press = () => {
  const pressReleases = [
    {
      date: "December 2024",
      title: "AutoTrust Nigeria Launches AI-Powered Fraud Detection",
      excerpt: "New technology helps identify fraudulent listings before they reach buyers.",
    },
    {
      date: "November 2024",
      title: "AutoTrust Reaches 10,000 Verified Sellers Milestone",
      excerpt: "Platform continues rapid growth as Nigeria's most trusted car marketplace.",
    },
    {
      date: "October 2024",
      title: "Partnership with Major Nigerian Banks for Secure Escrow",
      excerpt: "New partnerships enable faster, safer transactions for all users.",
    },
  ];

  const mediaFeatures = [
    { outlet: "TechCabal", title: "How AutoTrust is Solving Nigeria's Car Fraud Problem" },
    { outlet: "BusinessDay", title: "The Rise of Digital Car Marketplaces in Nigeria" },
    { outlet: "Guardian Nigeria", title: "AutoTrust: Building Trust in Online Car Sales" },
  ];

  return (
    <>
      <Helmet>
        <title>Press - AutoTrust Nigeria</title>
        <meta name="description" content="Latest news, press releases, and media resources from AutoTrust Nigeria." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-20">
          {/* Hero */}
          <section className="bg-gradient-to-b from-primary/5 to-background py-16">
            <div className="container-wide">
              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Press & Media</h1>
                <p className="text-xl text-muted-foreground mb-6">
                  Get the latest news about AutoTrust Nigeria and access media resources.
                </p>
                <Button asChild>
                  <a href="mailto:press@listyourcar.ng">
                    <Mail className="mr-2 h-4 w-4" />
                    Media Inquiries
                  </a>
                </Button>
              </div>
            </div>
          </section>

          {/* Press Releases */}
          <section className="py-16">
            <div className="container-wide">
              <h2 className="text-3xl font-bold mb-8">Press Releases</h2>
              <div className="space-y-6 max-w-3xl">
                {pressReleases.map((release, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <p className="text-sm text-muted-foreground mb-2">{release.date}</p>
                      <h3 className="text-xl font-semibold mb-2">{release.title}</h3>
                      <p className="text-muted-foreground mb-4">{release.excerpt}</p>
                      <Button variant="link" className="p-0 h-auto">
                        Read More <ExternalLink className="ml-1 h-3 w-3" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Media Features */}
          <section className="py-16 bg-muted/50">
            <div className="container-wide">
              <h2 className="text-3xl font-bold mb-8">In the Media</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {mediaFeatures.map((feature, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <p className="text-sm font-medium text-primary mb-2">{feature.outlet}</p>
                      <h3 className="font-semibold">{feature.title}</h3>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Brand Assets */}
          <section className="py-16">
            <div className="container-wide">
              <h2 className="text-3xl font-bold mb-4">Brand Assets</h2>
              <p className="text-muted-foreground mb-8">
                Download our logos, brand guidelines, and media kit for press use.
              </p>
              <div className="flex gap-4">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Logo Pack
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Brand Guidelines
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Media Kit
                </Button>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="py-16 bg-muted/50">
            <div className="container-wide text-center">
              <h2 className="text-2xl font-bold mb-4">Media Contact</h2>
              <p className="text-muted-foreground mb-6">
                For press inquiries, interviews, or more information, please contact our media team.
              </p>
              <a href="mailto:press@listyourcar.ng" className="text-primary hover:underline text-lg">
                press@listyourcar.ng
              </a>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Press;
