import { notFound } from "next/navigation";
import TicketDetailClient from "@/components/TicketDetailClient";
import { ROBERTO_ACCESS_SLUG } from "@/lib/access";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function PublicTicketDetailPage({
  params,
}: {
  params: { slug: string; id: string };
}) {
  if (params.slug !== ROBERTO_ACCESS_SLUG) {
    notFound();
  }

  const supabase = getSupabase();
  const { data: ticket } = await supabase
    .from("tickets")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!ticket || ticket.owner !== "roberto") {
    notFound();
  }

  return (
    <TicketDetailClient
      ticket={ticket}
      backLink={`/r/${params.slug}`}
      backLabel="Roberto"
    />
  );
}
