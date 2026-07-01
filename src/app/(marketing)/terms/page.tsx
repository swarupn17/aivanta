import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of Use for Aivanta Scholar Foundation.",
};

const email = (
  <a className="font-semibold text-dusty-600" href="mailto:info@aivantascholar.org">
    info@aivantascholar.org
  </a>
);

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms of Use"
      title="Terms of Use"
      lead="The terms governing participation in Aivanta Scholar Foundation assessments and use of this website."
      sections={[
        {
          heading: "Participation",
          body: "Participation in all assessments is voluntary. Schools and students may choose any one, two, or all three subjects. There is no compulsion to register for all subjects.",
        },
        {
          heading: "Fees & refunds",
          body: "The assessment fee is ₹150 per subject, inclusive of study material, evaluation and a printed certificate. Refund terms are as communicated at the time of registration.",
        },
        {
          heading: "Confidentiality",
          body: "Question papers are confidential and may not be reproduced or distributed without written permission from the Foundation.",
        },
        { heading: "Contact", body: <>For questions about these terms, email {email}.</> },
      ]}
    />
  );
}
