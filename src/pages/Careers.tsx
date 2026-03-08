import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEOHead, BreadcrumbSchema, getBreadcrumbsFromPath } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Briefcase, Heart, Users, Zap, Globe } from "lucide-react";

const Careers = () => {
  const openPositions = [
    {
      title: "Senior Software Engineer",
      department: "Engineering",
      location: "Lagos, Nigeria",
      type: "Full-time",
      description: "Build and scale our platform infrastructure to serve millions of users across Nigeria.",
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "Lagos, Nigeria (Hybrid)",
      type: "Full-time",
      description: "Create intuitive and beautiful experiences for buyers and sellers on our platform.",
    },
    {
      title: "Customer Success Manager",
      department: "Operations",
      location: "Lagos / Abuja",
      type: "Full-time",
      description: "Help our users navigate the car buying and selling process with exceptional support.",
    },
    {
      title: "Marketing Specialist",
      department: "Marketing",
      location: "Lagos, Nigeria",
      type: "Full-time",
      description: "Drive growth through creative campaigns and strategic marketing initiatives.",
    },
  ];

  const benefits = [
    { icon: Heart, title: "Health Insurance", description: "Comprehensive health coverage for you and your family" },
    { icon: Zap, title: "Learning Budget", description: "Annual allowance for courses, conferences, and books" },
    { icon: Users, title: "Flexible Work", description: "Hybrid work environment with flexible hours" },
    { icon: Globe, title: "Remote Options", description: "Work from anywhere options for eligible roles" },
  ];

  return (
    <>
      <Helmet>
        <title>Careers - AutoTrust Nigeria</title>
        <meta name="description" content="Join the AutoTrust Nigeria team. We're building the most trusted automotive marketplace in Africa." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-20">
          {/* Hero */}
          <section className="bg-gradient-to-b from-primary/5 to-background py-16">
            <div className="container-wide text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Join Our Mission</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Help us transform the automotive industry in Nigeria. We're looking for passionate 
                people who want to make a real impact.
              </p>
              <Button size="lg" asChild>
                <a href="#positions">View Open Positions</a>
              </Button>
            </div>
          </section>

          {/* Why Join Us */}
          <section className="py-16">
            <div className="container-wide">
              <h2 className="text-3xl font-bold text-center mb-12">Why Join AutoTrust?</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {benefits.map((benefit, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <benefit.icon className="h-10 w-10 text-primary mb-4" />
                      <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground text-sm">{benefit.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Open Positions */}
          <section id="positions" className="py-16 bg-muted/50">
            <div className="container-wide">
              <h2 className="text-3xl font-bold text-center mb-4">Open Positions</h2>
              <p className="text-muted-foreground text-center mb-12">
                Find your next opportunity and grow with us
              </p>

              <div className="space-y-4 max-w-3xl mx-auto">
                {openPositions.map((position, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{position.title}</CardTitle>
                          <p className="text-muted-foreground text-sm mt-1">{position.description}</p>
                        </div>
                        <Button>Apply</Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {position.department}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {position.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {position.type}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-12">
                <p className="text-muted-foreground mb-4">
                  Don't see a role that fits? We're always looking for talented people.
                </p>
                <Button variant="outline" asChild>
                  <a href="mailto:careers@listyourcar.ng">Send Us Your Resume</a>
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

export default Careers;
