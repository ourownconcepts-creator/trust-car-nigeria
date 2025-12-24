import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Cookies = () => {
  return (
    <>
      <Helmet>
        <title>Cookie Policy - AutoTrust Nigeria</title>
        <meta name="description" content="Learn about how AutoTrust Nigeria uses cookies and similar technologies." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-20">
          <div className="container-wide py-16">
            <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: December 2024</p>

            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">What Are Cookies?</h2>
                <p className="text-muted-foreground">
                  Cookies are small text files stored on your device when you visit our website. 
                  They help us provide you with a better experience by remembering your preferences 
                  and understanding how you use our platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Types of Cookies We Use</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-medium mb-2">Essential Cookies</h3>
                    <p className="text-muted-foreground">
                      Required for the website to function properly. These include authentication 
                      cookies that keep you logged in and security cookies that protect your data.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium mb-2">Functional Cookies</h3>
                    <p className="text-muted-foreground">
                      Remember your preferences like language settings and saved searches to 
                      provide a personalized experience.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium mb-2">Analytics Cookies</h3>
                    <p className="text-muted-foreground">
                      Help us understand how visitors interact with our website by collecting 
                      anonymous information about pages visited and actions taken.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium mb-2">Marketing Cookies</h3>
                    <p className="text-muted-foreground">
                      Used to track visitors across websites to display relevant advertisements. 
                      You can opt out of these cookies in your browser settings.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Managing Cookies</h2>
                <p className="text-muted-foreground mb-4">
                  You can control cookies through your browser settings:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Block all cookies (may affect website functionality)</li>
                  <li>Delete existing cookies</li>
                  <li>Allow cookies from specific websites only</li>
                  <li>Set preferences for different types of cookies</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Third-Party Cookies</h2>
                <p className="text-muted-foreground">
                  Some cookies are placed by third-party services that appear on our pages, such as 
                  analytics providers and payment processors. These third parties have their own 
                  privacy policies governing the use of cookies.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Updates to This Policy</h2>
                <p className="text-muted-foreground">
                  We may update this Cookie Policy from time to time. We will notify you of any 
                  significant changes by posting a notice on our website.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have questions about our use of cookies, please contact us at{" "}
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

export default Cookies;
