"use client";

import { useEffect, useState } from "react";

interface SeedStatus {
  games: number;
  tickets: number;
  results: number;
  seeded: boolean;
}

export default function SeedStatusCard() {
  const [status, setStatus] = useState<SeedStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/seed");
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `HTTP ${res.status}`);
      }
      setStatus(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function runSeed() {
    setSeeding(true);
    setSeedResult(null);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setSeedResult(`Erro: ${data.error || res.statusText}`);
      } else {
        setSeedResult(JSON.stringify(data, null, 2));
        await refresh();
      }
    } catch (e) {
      setSeedResult(`Erro: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setSeeding(false);
    }
  }

  return (
    <section className="border border-zinc-800 rounded-lg p-4">
      <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
        Status do banco
      </h2>

      {loading && <div className="text-zinc-500 text-sm">Carregando…</div>}

      {error && (
        <div className="text-red-400 text-sm bg-red-900/20 border border-red-700/50 rounded p-3">
          {error}
          <div className="text-zinc-500 text-xs mt-2">
            Provavelmente o schema ainda não foi criado. Rode{" "}
            <code className="bg-zinc-900 px-1">supabase-migration.sql</code> no SQL Editor do
            Supabase primeiro.
          </div>
        </div>
      )}

      {status && (
        <>
          <div className="grid grid-cols-3 gap-2 text-sm mb-3">
            <Pill label="Jogos" value={status.games} expected={104} />
            <Pill label="Tickets" value={status.tickets} expected={18} />
            <Pill label="Resultados" value={status.results} expected={0} optional />
          </div>

          {!status.seeded && (
            <button
              onClick={runSeed}
              disabled={seeding}
              className="w-full py-2 rounded bg-red-600 hover:bg-red-700 disabled:opacity-50 font-medium text-sm"
            >
              {seeding ? "Inserindo…" : "Inserir seed no Supabase"}
            </button>
          )}

          {status.seeded && (
            <div className="text-green-400 text-sm">
              ✓ Banco populado. Próxima etapa pode começar.
            </div>
          )}

          {seedResult && (
            <pre className="mt-3 text-xs bg-zinc-900 border border-zinc-800 rounded p-3 overflow-x-auto whitespace-pre-wrap">
              {seedResult}
            </pre>
          )}
        </>
      )}
    </section>
  );
}

function Pill({
  label,
  value,
  expected,
  optional,
}: {
  label: string;
  value: number;
  expected: number;
  optional?: boolean;
}) {
  const ok = optional ? true : value >= expected;
  return (
    <div
      className={`rounded px-3 py-2 flex justify-between border ${
        ok ? "bg-zinc-900 border-zinc-800" : "bg-yellow-900/20 border-yellow-700/50"
      }`}
    >
      <span className="text-zinc-400">{label}</span>
      <span className="font-mono font-bold">
        {value}
        {!optional && <span className="text-zinc-600">/{expected}</span>}
      </span>
    </div>
  );
}
