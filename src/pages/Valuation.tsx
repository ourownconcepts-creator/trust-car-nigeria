import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, TrendingUp, Car, CheckCircle } from "lucide-react";
import { useState } from "react";

const Valuation = () => {
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    mileage: "",
    condition: "",
  });

  const carMakes = ["Toyota", "Honda", "Mercedes-Benz", "BMW", "Lexus", "Ford", "Hyundai", "Kia", "Nissan", "Volkswagen"];
  const years = Array.from({ length: 25 }, (_, i) => (new Date().getFullYear() - i).toString());
  const conditions = ["Excellent", "Good", "Fair", "Poor"];

  return (
    <>
      <Helmet>
        <title>Car Valuation - AutoTrust Nigeria</title>
        <meta name="description" content="Get a free instant valuation for your car. Find out how much your vehicle is worth in the Nigerian market." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-20">
          {/* Hero */}
          <section className="bg-gradient-to-b from-primary/5 to-background py-16">
            <div className="container-wide">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">What's Your Car Worth?</h1>
                  <p className="text-xl text-muted-foreground mb-6">
                    Get an instant, free valuation based on current Nigerian market data.
                  </p>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Free & Instant
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Market Accurate
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      No Obligation
                    </div>
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-5 w-5" />
                      Get Your Valuation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="make">Make</Label>
                        <Select value={formData.make} onValueChange={(v) => setFormData({ ...formData, make: v })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select make" />
                          </SelectTrigger>
                          <SelectContent>
                            {carMakes.map((make) => (
                              <SelectItem key={make} value={make.toLowerCase()}>{make}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="model">Model</Label>
                        <Input 
                          id="model" 
                          placeholder="e.g., Camry"
                          value={formData.model}
                          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="year">Year</Label>
                        <Select value={formData.year} onValueChange={(v) => setFormData({ ...formData, year: v })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent>
                            {years.map((year) => (
                              <SelectItem key={year} value={year}>{year}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mileage">Mileage (km)</Label>
                        <Input 
                          id="mileage" 
                          type="number"
                          placeholder="e.g., 50000"
                          value={formData.mileage}
                          onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="condition">Condition</Label>
                      <Select value={formData.condition} onValueChange={(v) => setFormData({ ...formData, condition: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          {conditions.map((cond) => (
                            <SelectItem key={cond} value={cond.toLowerCase()}>{cond}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button className="w-full" size="lg">
                      Get Free Valuation
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      By clicking, you agree to our Terms of Service
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* How it works */}
          <section className="py-16">
            <div className="container-wide">
              <h2 className="text-3xl font-bold text-center mb-12">How Our Valuation Works</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Car className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Enter Car Details</h3>
                  <p className="text-muted-foreground">Provide basic information about your vehicle including make, model, year, and condition.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Market Analysis</h3>
                  <p className="text-muted-foreground">We analyze current market trends, similar listings, and recent sales data in Nigeria.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calculator className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Instant Estimate</h3>
                  <p className="text-muted-foreground">Receive an accurate price range based on real market data within seconds.</p>
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

export default Valuation;
