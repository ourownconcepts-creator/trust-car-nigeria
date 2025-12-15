import { Helmet } from "react-helmet-async";
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
      <Helmet>
        <title>List Your Car - Nigeria's Trusted Verified Car Marketplace</title>
        <meta 
          name="description" 
          content="Buy and sell cars in Nigeria with complete confidence. Every seller is verified, every listing is authentic. One Car. One Poster. Zero Fraud." 
        />
        <meta name="keywords" content="buy cars Nigeria, sell cars Nigeria, verified car marketplace, trusted car dealers Lagos, car marketplace Africa" />
        <link rel="canonical" href="https://listyourcar.ng" />
        
        {/* Open Graph */}
        <meta property="og:title" content="List Your Car - Nigeria's Trusted Verified Car Marketplace" />
        <meta property="og:description" content="Buy and sell cars in Nigeria with complete confidence. Every seller is verified, every listing is authentic." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://listyourcar.ng" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="List Your Car - Nigeria's Trusted Verified Car Marketplace" />
        <meta name="twitter:description" content="Buy and sell cars in Nigeria with complete confidence. Every seller is verified, every listing is authentic." />
      </Helmet>

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
