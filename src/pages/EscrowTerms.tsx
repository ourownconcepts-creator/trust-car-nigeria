import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEOHead, BreadcrumbSchema, getBreadcrumbsFromPath } from "@/components/seo";

const EscrowTerms = () => {
  return (
    <>
      <SEOHead
        title="Escrow Service Terms"
        description="Terms and conditions for using List Your Car Nigeria's escrow payment service for vehicle transactions."
        keywords="escrow terms, secure car payment nigeria, escrow service terms"
        canonicalUrl="https://listyourcar.ng/escrow-terms"
      />

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-20">
          <div className="container-wide py-16">
            <BreadcrumbSchema items={getBreadcrumbsFromPath("/escrow-terms")} />
            <h1 className="text-4xl font-bold mb-8">Escrow Service Terms</h1>
            <p className="text-muted-foreground mb-8">Last updated: December 2024</p>

            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Overview of Escrow Service</h2>
                <p className="text-muted-foreground">
                  AutoTrust Nigeria provides an escrow service to facilitate secure vehicle transactions between 
                  buyers and sellers. This service holds funds in trust until both parties confirm the successful 
                  completion of the transaction.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. How the Escrow Service Works</h2>
                <p className="text-muted-foreground mb-4">
                  The escrow process follows these steps:
                </p>
                <ol className="list-decimal pl-6 text-muted-foreground space-y-2">
                  <li>Buyer and seller agree on the transaction terms on the AutoTrust platform</li>
                  <li>Buyer deposits the agreed amount into the escrow account</li>
                  <li>Seller delivers the vehicle to the buyer</li>
                  <li>Buyer inspects the vehicle and confirms receipt within the inspection period</li>
                  <li>Upon buyer confirmation, funds are released to the seller</li>
                </ol>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Inspection Period</h2>
                <p className="text-muted-foreground">
                  Buyers have a 48-hour inspection period from the time of vehicle delivery to confirm 
                  that the vehicle matches the listing description. During this period, buyers may:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-4">
                  <li>Confirm receipt and release funds to the seller</li>
                  <li>Report discrepancies and initiate a dispute</li>
                  <li>Request an extension (subject to seller approval)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Fees</h2>
                <p className="text-muted-foreground mb-4">
                  The escrow service fee is 1.5% of the transaction value, with a minimum fee of ₦10,000 
                  and a maximum of ₦500,000. Fees are typically split equally between buyer and seller 
                  unless otherwise agreed.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Disputes</h2>
                <p className="text-muted-foreground">
                  If a dispute arises, both parties must provide evidence to support their claims. 
                  AutoTrust will review the case and make a decision within 7 business days. Decisions 
                  may include full refund to buyer, partial refund, or release of funds to seller.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Refunds</h2>
                <p className="text-muted-foreground">
                  Refunds are processed within 5-7 business days after approval. The original escrow fee 
                  is non-refundable in cases where the transaction was cancelled by mutual agreement or 
                  buyer's decision without valid cause.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Seller Obligations</h2>
                <p className="text-muted-foreground mb-4">
                  Sellers using the escrow service agree to:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Provide accurate vehicle descriptions and photos</li>
                  <li>Deliver the vehicle as described in the listing</li>
                  <li>Transfer ownership documents upon payment confirmation</li>
                  <li>Respond to buyer inquiries within 24 hours</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Buyer Obligations</h2>
                <p className="text-muted-foreground mb-4">
                  Buyers using the escrow service agree to:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Deposit funds within the agreed timeframe</li>
                  <li>Inspect the vehicle promptly upon delivery</li>
                  <li>Confirm receipt or report issues within the inspection period</li>
                  <li>Act in good faith during any dispute resolution</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  AutoTrust acts as a neutral third party in escrow transactions. We are not responsible 
                  for the condition of vehicles, the accuracy of listings, or the conduct of buyers or 
                  sellers beyond our platform's policies.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">10. Contact</h2>
                <p className="text-muted-foreground">
                  For questions about our escrow service, contact us at{" "}
                  <a href="mailto:escrow@autotrust.ng" className="text-primary hover:underline">
                    escrow@autotrust.ng
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

export default EscrowTerms;
