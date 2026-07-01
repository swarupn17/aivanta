import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Aivanta Scholar Foundation.",
};

const email = (
  <a className="font-semibold text-dusty-600" href="mailto:info@aivantascholar.org">
    info@aivantascholar.org
  </a>
);

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy Policy"
      title="Privacy Policy"
      lead="How Aivanta Scholar Foundation collects, uses and protects information."
      sections={[
        {
          heading: "Information we collect",
          body: "We collect school and student details provided during registration, such as school name, contact person, and enrolment numbers, strictly for conducting assessments and issuing certificates.",
        },
        {
          heading: "How we use information",
          body: "Information is used only for assessment administration, result processing, certificate generation, and necessary communication. We do not sell personal data.",
        },
        {
          heading: "Data protection",
          body: "We follow reasonable security practices to protect student data. Personally identifiable information of minors is handled with special care and only with school/parent consent.",
        },
        { heading: "Contact", body: <>For any privacy questions, email {email}.</> },
      ]}
    />
  );
}
