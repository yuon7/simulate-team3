import { CompanyDashboard } from "@/components/Company/Dashboard/CompanyDashboard";
import { CompanyProfileSummary } from "@/features/Company/Dashboard/CompanyProfileSummary";

export default function CompanyPage() {
  return (
    <main>
      <CompanyDashboard summary={<CompanyProfileSummary />} />
    </main>
  );
}