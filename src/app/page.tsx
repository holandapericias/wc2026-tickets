import { GAMES } from "@/data/games";
import { MY_TICKETS, TOTAL_SEATS, TOTAL_COST_BASIS } from "@/data/my-tickets";
import { GROUPS } from "@/data/groups";
import SeedStatusCard from "./SeedStatusCard";

export const dynamic = "force-dynamic";

function fmt(n: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export default function Home() {
  const groupCount = Object.keys(GROUPS).length;
  const gamesByStage = GAMES.reduce<Record<string, number>>((acc, g) => {
    acc[g.stage] = (acc[g.stage] || 0) + 1;
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <header className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-600 text-white text-lg font-bold flex items-center justify-center">
            WC
          </div>
          <div>
            <h1 className="text-2xl font-bold">Meu Chaveamento — Copa 2026</h1>
            <p className="text-zinc-400 text-sm">
              Etapa 2 de 9 — seed carregado em código, pronto pra inserir no banco.
            </p>
          </div>
        </header>

        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat label="Jogos no calendário" value={String(GAMES.length)} />
          <Stat label="Grupos" value={String(groupCount)} />
          <Stat label="Meus pacotes" value={String(MY_TICKETS.length)} />
          <Stat label="Assentos" value={String(TOTAL_SEATS)} />
        </section>

        <section className="border border-zinc-800 rounded-lg p-4">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            Distribuição de jogos por fase
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
            {Object.entries(gamesByStage).map(([stage, count]) => (
              <div key={stage} className="bg-zinc-900 rounded px-3 py-2 flex justify-between">
                <span className="text-zinc-400">{stage}</span>
                <span className="font-mono font-bold">{count}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="border border-zinc-800 rounded-lg p-4">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            Custo base do portfólio
          </h2>
          <div className="font-mono text-2xl font-bold">{fmt(TOTAL_COST_BASIS)}</div>
          <p className="text-zinc-500 text-xs mt-1">
            Soma do que paguei nos 18 pacotes ({TOTAL_SEATS} assentos).
          </p>
        </section>

        <SeedStatusCard />

        <footer className="text-zinc-600 text-xs pt-8 border-t border-zinc-800">
          Próximas etapas: 3 (motor de resolução), 4 (integração com football-data.org),
          5 (tela &ldquo;Resultados&rdquo;), 6 (&ldquo;Grupos&rdquo;), 7 (&ldquo;Chaveamento&rdquo;),
          8 (cron), 9 (polimento).
        </footer>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-center">
      <div className="text-2xl font-mono font-bold">{value}</div>
      <div className="text-xs text-zinc-400 uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
}
