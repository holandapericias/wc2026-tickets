import { notFound } from "next/navigation";
import ScraperStatus from "@/components/ScraperStatus";
import { ROBERTO_ACCESS_SLUG } from "@/lib/access";

export const dynamic = "force-dynamic";

export default function PublicScraperPage({ params }: { params: { slug: string } }) {
  if (params.slug !== ROBERTO_ACCESS_SLUG) {
    notFound();
  }
  return <ScraperStatus owner="roberto" />;
}
