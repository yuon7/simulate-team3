import { CompanyDetail } from "@/components/Company/Detail/CompanyDetail";

export default function CompanyDetailPage({ params }: { params: { id: string } }) {
  return (
    <main>
      <CompanyDetail id={parseInt(params.id)} />
    </main>
  );
}
