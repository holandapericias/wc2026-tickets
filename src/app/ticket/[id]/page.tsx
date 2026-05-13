import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import TicketDetailClient from "@/components/TicketDetailClient";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function TicketDetailPage({ params }: { params: { id: string } }) {
  const supabase = getSupabase();
  const { data: ticket } = await supabase
    .from("tickets")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!ticket) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="max-w-[1600px] mx-auto px-4 py-6">
        <TicketDetailClient
          ticket={ticket}
          backLink={ticket.owner === "roberto" ? "/roberto" : "/dashboard"}
          backLabel={ticket.owner === "roberto" ? "Roberto" : "Dashboard"}
        />
      </main>
    </>
  );
}
