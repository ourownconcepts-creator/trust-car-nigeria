import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEOHead, BreadcrumbSchema, getBreadcrumbsFromPath } from "@/components/seo";

const Privacy = () => {
  return (
    <>
      <SEOHead
        title="Privacy Policy"
        description="Learn how List Your Car Nigeria protects your personal information and data privacy."
        keywords="privacy policy, data protection nigeria, car marketplace privacy"
        canonicalUrl="https://listyourcar.ng/privacy"
      />

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-20">
          <div className="container-wide py-16">
            <BreadcrumbSchema items={getBreadcrumbsFromPath("/privacy")} />
            <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: December 2024</p>

            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
                <p className="text-muted-foreground mb-4">
                  We collect information you provide directly to us, including:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Name, email address, and phone number when you create an account</li>
                  <li>Government-issued ID for seller verification</li>
                  <li>Vehicle information when you create listings</li>
                  <li>Payment information for transactions</li>
                  <li>Communications between buyers and sellers</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
                <p className="text-muted-foreground mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Verify seller identities and prevent fraud</li>
                  <li>Process transactions and send related information</li>
                  <li>Send promotional communications (with your consent)</li>
                  <li>Respond to your comments and questions</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
                <p className="text-muted-foreground mb-4">
                  We do not sell your personal information. We may share information with:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Other users as necessary to facilitate transactions</li>
                  <li>Service providers who assist in our operations</li>
                  <li>Law enforcement when required by law</li>
                  <li>Third parties with your consent</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
                <p className="text-muted-foreground">
                  We implement appropriate security measures to protect your personal information, 
                  including encryption, secure servers, and regular security audits. However, no 
                  method of transmission over the Internet is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
                <p className="text-muted-foreground mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Opt out of marketing communications</li>
                  <li>Export your data</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have questions about this Privacy Policy, please contact us at{" "}
                  <a href="mailto:privacy@autotrust.ng" className="text-primary hover:underline">
                    privacy@autotrust.ng
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

export default Privacy;
