import type { Metadata } from "next";
import { LegalLayout } from "@/components/site/legal-layout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Green Leaf Lawn Care collects, uses, and protects the information you share with us.",
};

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      subtitle="How we collect, use, and protect the information you share with us."
      lastUpdated="June 1, 2025"
    >
      <h2>Who we are</h2>
      <p>
        Green Leaf Lawn Care, LLC (&ldquo;Green Leaf,&rdquo; &ldquo;we,&rdquo;
        &ldquo;us,&rdquo; or &ldquo;our&rdquo;) provides residential lawn care
        services in the northwest Twin Cities metro. Our principal place of
        business is 1482 Oak Ridge Avenue, Maple Grove, MN 55369. You can reach
        us at{" "}
        <a href="mailto:hello@greenleaflawncare.com">
          hello@greenleaflawncare.com
        </a>{" "}
        or by phone at{" "}
        <a href="tel:+17635550142">(763) 555-0142</a>.
      </p>

      <h2>Information we collect</h2>

      <h3>Information you give us</h3>
      <p>
        When you request a quote, schedule service, or contact us, we collect:
      </p>
      <ul>
        <li>Your name, phone number, and email address</li>
        <li>Your service address and property details</li>
        <li>The services you are interested in and any notes you provide</li>
        <li>Payment information when you set up billing (processed by a third-party payment provider; we do not store card numbers)</li>
      </ul>

      <h3>Information collected automatically</h3>
      <p>
        When you visit our website, our hosting provider may collect standard
        server log data including your IP address, browser type, referring page,
        and pages visited. We use this data only in aggregate to understand how
        visitors use the site. We do not use tracking pixels, behavioral
        advertising networks, or cross-site trackers.
      </p>

      <h2>How we use your information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Respond to your quote requests and schedule service visits</li>
        <li>Send service reminders and completion notifications by text or email</li>
        <li>Process payments and send receipts</li>
        <li>Improve our website and service quality</li>
        <li>Comply with legal obligations</li>
      </ul>
      <p>
        We will not sell, rent, or trade your personal information to third
        parties for their marketing purposes.
      </p>

      <h2>Text messaging</h2>
      <p>
        If you provide a phone number, you may receive service-related text
        messages such as crew arrival notices and visit confirmations. Message
        frequency varies. Standard message and data rates may apply. Reply STOP
        at any time to opt out. Reply HELP for help. Opting out will not affect
        your ability to receive service.
      </p>

      <h2>How we share your information</h2>
      <p>
        We share your information only with service providers that help us run
        the business, such as our scheduling software, payment processor, and
        text messaging platform. Each provider is bound by contract to use your
        data only to perform services on our behalf.
      </p>
      <p>
        We may disclose information if required by law, court order, or to
        protect the safety of our customers or employees.
      </p>

      <h2>Data retention</h2>
      <p>
        We retain customer records for as long as your account is active and for
        a reasonable period after your last transaction. If you ask us to delete
        your information, we will honor that request except where retention is
        required by law (for example, financial records).
      </p>

      <h2>Your rights</h2>
      <p>
        You may request access to, correction of, or deletion of the personal
        information we hold about you at any time. To make a request, email us
        at{" "}
        <a href="mailto:hello@greenleaflawncare.com">
          hello@greenleaflawncare.com
        </a>{" "}
        with the subject line &ldquo;Privacy Request.&rdquo; We will respond
        within 30 days.
      </p>

      <h2>Security</h2>
      <p>
        We take reasonable steps to protect your information from unauthorized
        access, including encrypted connections (HTTPS) for all web traffic and
        restricted access to customer data within our organization. No method of
        transmission over the internet is 100% secure, and we cannot guarantee
        absolute security.
      </p>

      <h2>Children</h2>
      <p>
        Our services are not directed at children under 13. We do not knowingly
        collect personal information from children under 13. If you believe we
        have done so unintentionally, contact us and we will delete the
        information promptly.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy from time to time. When we do, we will revise
        the &ldquo;last updated&rdquo; date at the top. Continued use of our
        website or services after changes are posted constitutes your acceptance
        of the updated policy.
      </p>

      <h2>Contact us</h2>
      <p>
        Questions about this policy or your personal data? Reach us at:
      </p>
      <ul>
        <li>Email: <a href="mailto:hello@greenleaflawncare.com">hello@greenleaflawncare.com</a></li>
        <li>Phone: <a href="tel:+17635550142">(763) 555-0142</a></li>
        <li>Mail: Green Leaf Lawn Care, LLC, 1482 Oak Ridge Avenue, Maple Grove, MN 55369</li>
      </ul>
    </LegalLayout>
  );
}
