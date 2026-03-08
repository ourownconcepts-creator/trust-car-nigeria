import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEOHead, BreadcrumbSchema, getBreadcrumbsFromPath } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Shield, CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Report = () => {
  const [formData, setFormData] = useState({
    reportType: "",
    listingUrl: "",
    description: "",
    contactEmail: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Report submitted successfully. Our team will review it within 24 hours.");
    setFormData({ reportType: "", listingUrl: "", description: "", contactEmail: "" });
  };

  const reportTypes = [
    "Fraudulent Listing",
    "Fake Photos",
    "Suspicious Seller",
    "Price Manipulation",
    "Stolen Vehicle",
    "Harassment",
    "Other",
  ];

  return (
    <>
      <Helmet>
        <title>Report Fraud - AutoTrust Nigeria</title>
        <meta name="description" content="Report suspicious listings, fraudulent activity, or safety concerns on AutoTrust Nigeria." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-20">
          {/* Hero */}
          <section className="bg-gradient-to-b from-destructive/5 to-background py-16">
            <div className="container-wide text-center">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Report Fraud or Abuse</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Help us keep AutoTrust safe by reporting suspicious activity. All reports are confidential.
              </p>
            </div>
          </section>

          {/* Report Form */}
          <section className="py-16">
            <div className="container-wide">
              <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Submit a Report</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="reportType">Type of Report *</Label>
                          <Select 
                            value={formData.reportType} 
                            onValueChange={(v) => setFormData({ ...formData, reportType: v })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select report type" />
                            </SelectTrigger>
                            <SelectContent>
                              {reportTypes.map((type) => (
                                <SelectItem key={type} value={type.toLowerCase().replace(/\s+/g, "-")}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="listingUrl">Listing URL (if applicable)</Label>
                          <Input 
                            id="listingUrl"
                            placeholder="https://autotrust.ng/car/..."
                            value={formData.listingUrl}
                            onChange={(e) => setFormData({ ...formData, listingUrl: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">Description *</Label>
                          <Textarea 
                            id="description"
                            placeholder="Please provide as much detail as possible about the issue..."
                            rows={6}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="contactEmail">Your Email (optional)</Label>
                          <Input 
                            id="contactEmail"
                            type="email"
                            placeholder="For follow-up if needed"
                            value={formData.contactEmail}
                            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                          />
                        </div>

                        <Button type="submit" size="lg">
                          Submit Report
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardContent className="pt-6">
                      <Shield className="h-10 w-10 text-primary mb-4" />
                      <h3 className="font-semibold text-lg mb-2">Your Report is Confidential</h3>
                      <p className="text-muted-foreground text-sm">
                        All reports are reviewed by our trust and safety team. Your identity will never be shared with the reported party.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-semibold text-lg mb-4">What Happens Next?</h3>
                      <ul className="space-y-3 text-sm">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>We review your report within 24 hours</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>Investigation is conducted if warranted</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>Appropriate action is taken (suspension, removal, etc.)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>You may be contacted if we need more information</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2">Emergency?</h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        If you believe you're in immediate danger or have been a victim of a crime, please contact local authorities.
                      </p>
                      <p className="font-medium">Nigeria Police: 112</p>
                    </CardContent>
                  </Card>
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

export default Report;
