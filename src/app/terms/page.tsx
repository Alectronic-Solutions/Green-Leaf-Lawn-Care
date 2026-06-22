import type { Metadata } from "next";
import { LegalLayout } from "@/components/site/legal-layout";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern your use of Green Leaf Lawn Care services and this website.",
};

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      subtitle="The terms that govern your use of our services and this website."
      lastUpdated="June 1, 2025"
    >
      <h2>Agreement to terms</h2>
      <p>
        By requesting a quote, scheduling service, or using this website, you
        agree to be bound by these Terms of Service. If you do not agree, do not
        use our services or this website. These terms apply to all customers of
        Green Leaf Lawn Care, LLC (&ldquo;Green Leaf,&rdquo; &ldquo;we,&rdquo;
        &ldquo;us,&rdquo; or &ldquo;our&rdquo;).
      </p>

      <h2>Services</h2>

      <h3>Scope of work</h3>
      <p>
        Each service visit is described in your quote or service agreement. Work
        performed outside that scope requires written authorization. Green Leaf
        reserves the right to decline service to any property at any time.
      </p>

      <h3>Scheduling and access</h3>
      <p>
        You agree to provide safe and unobstructed access to your property on
        your scheduled service day. This includes unlocking gates, restraining
        or confining pets, and removing vehicles or objects that block the
        service area. If a crew cannot access the property, the visit may be
        skipped and billed at the standard rate.
      </p>

      <h3>Weather and conditions</h3>
      <p>
        Green Leaf reserves the right to reschedule visits due to severe weather,
        unsafe ground conditions, or other circumstances outside our control. We
        will notify you of any rescheduled visits as soon as practicable.
      </p>

      <h2>Pricing and payment</h2>

      <h3>Estimates</h3>
      <p>
        Quotes provided online or by phone are estimates based on information
        you provide. Final pricing is confirmed after an on-site visit. Your
        quoted price will not increase without notice and your approval.
      </p>

      <h3>Billing</h3>
      <p>
        You may be billed per visit or by monthly invoice, as agreed at signup.
        Invoices are due within 15 days of the invoice date. Accounts more than
        30 days past due may be paused until the balance is resolved. We reserve
        the right to charge a late fee of 1.5% per month on overdue balances.
      </p>

      <h3>Cancellations</h3>
      <p>
        There are no long-term contracts. You may pause or cancel service with
        48 hours notice before your next scheduled visit at no charge. Canceling
        with less than 48 hours notice may result in a cancellation fee equal to
        one standard visit at your regular rate.
      </p>

      <h2>Satisfaction guarantee</h2>
      <p>
        If you are not satisfied with a visit, notify us within 48 hours and we
        will return to address the issue at no additional charge. This remedy is
        your sole recourse for service quality concerns. Green Leaf is not liable
        for any consequential or indirect damages arising from a service visit.
      </p>

      <h2>Property and liability</h2>

      <h3>Your property</h3>
      <p>
        You represent that you own the property or have authority to authorize
        lawn care services on it. You are responsible for marking sprinkler
        heads, buried utilities, pet waste, and other hazards before each visit.
        Green Leaf is not liable for damage to unmarked underground items.
      </p>

      <h3>Our liability</h3>
      <p>
        Green Leaf carries general liability insurance. In the event of damage
        caused by our crew, notify us within 72 hours. Our total liability for
        any claim arising from a single service visit is limited to the amount
        paid for that visit. We are not liable for pre-existing conditions,
        normal wear, or outcomes beyond our reasonable control (drought, disease,
        pest infestation, etc.).
      </p>

      <h3>Chemicals and re-entry</h3>
      <p>
        When fertilizer or pesticide applications are performed, we will provide
        you with the applicable re-entry interval. You agree to keep people and
        pets off treated areas for the stated period. Green Leaf is not liable
        for harm resulting from failure to observe re-entry intervals.
      </p>

      <h2>Website use</h2>
      <p>
        This website is provided for informational purposes and to allow you to
        request services. You agree not to use this site for any unlawful purpose
        or to submit false or misleading information. All content on this site is
        owned by Green Leaf Lawn Care and may not be reproduced without written
        permission.
      </p>

      <h2>Dispute resolution</h2>
      <p>
        We prefer to resolve disputes by phone or email before escalating. If a
        dispute cannot be resolved informally, you agree to binding arbitration
        in Hennepin County, Minnesota, under the rules of the American
        Arbitration Association. You waive the right to a jury trial or class
        action for any dispute arising from these terms.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of the State of Minnesota, without
        regard to conflict of law principles.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        We may update these terms from time to time. Continued use of our
        services after changes are posted constitutes your agreement to the
        updated terms. We will note the effective date at the top of this page.
      </p>

      <h2>Contact us</h2>
      <p>
        Questions about these terms? Reach us at:
      </p>
      <ul>
        <li>Email: <a href="mailto:hello@greenleaflawncare.com">hello@greenleaflawncare.com</a></li>
        <li>Phone: <a href="tel:+17635550142">(763) 555-0142</a></li>
        <li>Mail: Green Leaf Lawn Care, LLC, 1482 Oak Ridge Avenue, Maple Grove, MN 55369</li>
      </ul>
    </LegalLayout>
  );
}
