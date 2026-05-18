"use client";

import { useEffect, useState } from "react";
import { REAL_DATA_CONNECTED } from "@/lib/feature-flags";

interface ScanInfo {
  ticket_id: string;
  game_num: number;
  match_name: string;
  last_scan: string | null;
  scan_count: number;
}

interface SourceInfo {
  name: string;
  count: number;
}

interface Props {
  /** Optional owner filter — if set, only that owner's tickets/scans are shown. */
  owner?: string;
}

export default function ScraperStatus({ owner }: Props) {
  const [lastScrape, setLastScrape] = useState<string | null>(null);
  const [ticketScans, setTicketScans] = useState<ScanInfo[]>([]);
  const [sources, setSources] = useState<SourceInfo[]>([]);
  const [totalScans, setTotalScans] = useState(0);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [owner]);

  async function loadStatus() {
    try {
      const ticketsUrl = owner ? `/api/tickets?owner=${owner}` : "/api/tickets";
      const scansUrl = owner
        ? `/api/prices?owner=${owner}&limit=2000`
        : "/api/prices?limit=2000";

      const [ticketsRes, scansRes] = await Promise.all([
        fetch(ticketsUrl),
        fetch(scansUrl),
      ]);
      const tickets = await ticketsRes.json();
      const scans = await scansRes.json();

      if (Array.isArray(scans) && scans.length > 0) {
        setLastScrape(scans[0].scanned_at);
        setTotalScans(scans.length);

        const sourceMap = new Map<string, number>();
        scans.forEach((s: { source: string }) => {
          sourceMap.set(s.source, (sourceMap.get(s.source) || 0) + 1);
        });
        setSources(Array.from(sourceMap.entries()).map(([name, count]) => ({ name, count })));

        if (Array.isArray(tickets)) {
          const ticketMap = new Map<string, ScanInfo>();
          tickets.forEach((t: { id: string; game_num: number; match_name: string }) => {
            ticketMap.set(t.id, {
              ticket_id: t.id,
              game_num: t.game_num,
              match_name: t.match_name,
              last_scan: null,
              scan_count: 0,
            });
          });
          scans.forEach((s: { ticket_id: string; scanned_at: string }) => {
            const info = ticketMap.get(s.ticket_id);
            if (info) {
              info.scan_count++;
              if (!info.last_scan || s.scanned_at > info.last_scan) {
                info.last_scan = s.scanned_at;
              }
            }
          });
          setTicketScans(
            Array.from(ticketMap.values()).sort((a, b) => a.game_num - b.game_num),
          );
        }
      } else {
        setLastScrape(null);
        setTotalScans(0);
        if (Array.isArray(tickets)) {
          setTicketScans(
            tickets.map(
              (t: { id: string; game_num: number; match_name: string }) => ({
                ticket_id: t.id,
                game_num: t.game_num,
                match_name: t.match_name,
                last_scan: null,
                scan_count: 0,
              }),
            ),
          );
        }
      }
    } catch (e) {
      console.error("Failed to load scraper status:", e);
    } finally {
      setLoading(false);
    }
  }

  async function triggerScrape() {
    setRunning(true);
    setResult("");
    try {
      const res = await fetch("/api/scrape/trigger", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setResult(
          `Scrape complete: ${data.scanned} tickets scanned. ${data.errors?.length || 0} errors.`,
        );
        setLastScrape(new Date().toISOString());
        await loadStatus();
      } else {
        setResult(`Scrape failed: ${data.errors?.join(", ") || "Unknown error"}`);
      }
    } catch (e) {
      setResult("Scrape failed: " + String(e));
    } finally {
      setRunning(false);
    }
  }

  const nextScrape = new Date();
  nextScrape.setDate(nextScrape.getDate() + 1);
  nextScrape.setHours(8, 0, 0, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Scraper Status</h1>
        <button
          onClick={triggerScrape}
          disabled={running || !REAL_DATA_CONNECTED}
          title={
            REAL_DATA_CONNECTED
              ? undefined
              : "Disabled — real FIFA data source not yet connected"
          }
          className="px-4 py-2 bg-fifa-red text-white rounded-lg text-sm font-medium hover:bg-fifa-red-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {running ? "Scraping..." : "Run Scrape Now"}
        </button>
      </div>

      {!REAL_DATA_CONNECTED && (
        <div className="border border-yellow-700/40 bg-yellow-900/20 text-yellow-100 rounded-lg p-3 text-sm">
          Scraper is currently disabled. The previous simulator generated synthetic
          prices, not real FIFA data. Re-enable will happen after the real FIFA
          marketplace scraper (Playwright + Browserless) is wired up.
        </div>
      )}

      {result && (
        <div
          className={`border rounded-lg p-3 text-sm ${
            result.includes("failed")
              ? "bg-red-900/20 border-red-700 text-red-300"
              : "bg-green-900/20 border-green-700 text-green-300"
          }`}
        >
          {result}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="kpi-card">
          <div className="text-xs text-dark-muted uppercase mb-1">Last Scrape</div>
          <div className="text-lg font-mono text-dark-text">
            {lastScrape ? new Date(lastScrape).toLocaleString() : "Never"}
          </div>
        </div>
        <div className="kpi-card">
          <div className="text-xs text-dark-muted uppercase mb-1">Next Scrape (Cron)</div>
          <div className="text-lg font-mono text-dark-text">
            {nextScrape.toLocaleString()}
          </div>
        </div>
        <div className="kpi-card">
          <div className="text-xs text-dark-muted uppercase mb-1">Total Price Scans</div>
          <div className="text-lg font-mono text-dark-text">{totalScans}</div>
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-lg p-4">
        <h3 className="text-sm font-semibold text-dark-muted uppercase mb-3">Source Breakdown</h3>
        {sources.length === 0 ? (
          <div className="text-dark-muted text-sm">No scans yet</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {sources.map((s) => (
              <div key={s.name} className="bg-dark-surface rounded-lg p-3 text-center">
                <div className="text-xs text-dark-muted uppercase">{s.name}</div>
                <div className="text-xl font-mono font-bold text-dark-text">{s.count}</div>
                <div className="text-xs text-dark-muted">scans</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-dark-card border border-dark-border rounded-lg p-4">
        <h3 className="text-sm font-semibold text-dark-muted uppercase mb-3">
          Per-Ticket Data Freshness
        </h3>
        {loading ? (
          <div className="text-dark-muted text-sm">Loading...</div>
        ) : ticketScans.length === 0 ? (
          <div className="text-dark-muted text-sm">
            No tickets found. Seed the database first.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-dark-muted uppercase">
                  <th className="text-left px-3 py-2">Game</th>
                  <th className="text-left px-3 py-2">Match</th>
                  <th className="text-left px-3 py-2">Last Scan</th>
                  <th className="text-right px-3 py-2">Total Scans</th>
                  <th className="text-center px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {ticketScans.map((ts) => {
                  const fresh =
                    ts.last_scan &&
                    Date.now() - new Date(ts.last_scan).getTime() < 24 * 60 * 60 * 1000;
                  return (
                    <tr key={ts.ticket_id} className="border-t border-dark-border">
                      <td className="px-3 py-2 font-mono text-dark-muted">
                        {ts.game_num > 0 ? `G${ts.game_num}` : "—"}
                      </td>
                      <td className="px-3 py-2">{ts.match_name}</td>
                      <td className="px-3 py-2 text-dark-muted text-xs">
                        {ts.last_scan ? new Date(ts.last_scan).toLocaleString() : "Never"}
                      </td>
                      <td className="px-3 py-2 text-right font-mono">{ts.scan_count}</td>
                      <td className="px-3 py-2 text-center">
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${
                            fresh
                              ? "bg-green-400"
                              : ts.last_scan
                                ? "bg-yellow-400"
                                : "bg-red-400"
                          }`}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
