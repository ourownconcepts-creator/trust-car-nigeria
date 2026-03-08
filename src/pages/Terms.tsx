import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEOHead, BreadcrumbSchema, getBreadcrumbsFromPath } from "@/components/seo";

const Terms = () => {
  return (
    <>
      <SEOHead
        title="Terms of Service"
        description="Read the terms and conditions for using List Your Car Nigeria's car marketplace platform."
        keywords="terms of service, car marketplace terms, list your car terms"
        canonicalUrl="https://listyourcar.ng/terms"
      />

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-20">
          <div className="container-wide py-16">
            <BreadcrumbSchema items={getBreadcrumbsFromPath("/terms")} />
            <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
            <p className="text-muted-foreground mb-8">Last updated: December 2024</p>

            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By accessing or using AutoTrust Nigeria, you agree to be bound by these Terms of Service. 
                  If you do not agree to these terms, please do not use our platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. User Accounts</h2>
                <p className="text-muted-foreground mb-4">
                  To use certain features, you must create an account. You agree to:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>Be responsible for all activities under your account</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Seller Verification</h2>
                <p className="text-muted-foreground">
                  All sellers must complete our verification process before listing vehicles. This includes 
                  providing valid government-issued identification. We reserve the right to reject or 
                  suspend any account that fails verification or provides false information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Listing Guidelines</h2>
                <p className="text-muted-foreground mb-4">
                  When creating listings, you must:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Provide accurate vehicle information</li>
                  <li>Use only genuine photos of the actual vehicle</li>
                  <li>Be the legal owner or authorized seller of the vehicle</li>
                  <li>Not list stolen, salvaged, or encumbered vehicles</li>
                  <li>Respond promptly to buyer inquiries</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Escrow Services</h2>
                <p className="text-muted-foreground">
                  Our escrow service holds funds securely until the buyer confirms receipt and acceptance 
                  of the vehicle. Sellers agree to deliver the vehicle as described, and buyers agree to 
                  complete inspection within the specified timeframe.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Prohibited Activities</h2>
                <p className="text-muted-foreground mb-4">
                  You may not:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Post fraudulent or misleading listings</li>
                  <li>Use the platform for money laundering</li>
                  <li>Harass other users</li>
                  <li>Circumvent our verification or fraud detection systems</li>
                  <li>Use automated tools to scrape or access our platform</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  AutoTrust Nigeria acts as a marketplace facilitator. We are not responsible for the 
                  condition of vehicles, the conduct of buyers or sellers, or any disputes between parties. 
                  Our liability is limited to the fees paid to us for our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Contact</h2>
                <p className="text-muted-foreground">
                  For questions about these Terms, contact us at{" "}
                  <a href="mailto:legal@autotrust.ng" className="text-primary hover:underline">
                    legal@autotrust.ng
                  </a>
                </p>
              </section>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Terms;
