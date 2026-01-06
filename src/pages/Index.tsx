import { SEOHead, OrganizationSchema, LocalBusinessSchema } from "@/components/seo";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustSection from "@/components/TrustSection";
import FeaturedCars from "@/components/FeaturedCars";
import HowItWorks from "@/components/HowItWorks";
import DealerSection from "@/components/DealerSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <SEOHead
        title="List Your Car - Nigeria's Trusted Verified Car Marketplace"
        description="Buy and sell cars in Nigeria with complete confidence. Every seller is verified, every listing is authentic. One Car. One Poster. Zero Fraud."
        keywords="buy cars Nigeria, sell cars Nigeria, verified car marketplace, trusted car dealers Lagos, used cars Nigeria, car marketplace Africa, Nigerian car sales"
        canonicalUrl="https://listyourcar.ng"
        ogType="website"
      />
      <OrganizationSchema />
      <LocalBusinessSchema />

      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <Hero />
          <TrustSection />
          <FeaturedCars />
          <HowItWorks />
          <DealerSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
