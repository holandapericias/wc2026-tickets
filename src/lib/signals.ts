import { SignalLevel, Ticket, PriceScan } from "./types";

const HIGH_DEMAND_TEAMS = [
  "Argentina", "Brazil", "France", "England", "USA", "Germany",
  "Spain", "Portugal", "Netherlands", "Colombia", "Mexico", "Italy"
];

const MEDIUM_DEMAND_TEAMS = [
  "Uruguay", "Belgium", "Croatia", "Morocco", "Japan", "South Korea",
  "Senegal", "Australia", "Canada", "Ecuador", "Switzerland"
];

function getStage(matchName: string): string {
  if (matchName.startsWith("QF")) return "QF";
  if (matchName.startsWith("R16")) return "R16";
  if (matchName.startsWith("R32")) return "R32";
  return "GROUP";
}

function getTeamDemandScore(matchName: string): number {
  const name = matchName.toLowerCase();
  for (const team of HIGH_DEMAND_TEAMS) {
    if (name.includes(team.toLowerCase())) return 80;
  }
  for (const team of MEDIUM_DEMAND_TEAMS) {
    if (name.includes(team.toLowerCase())) return 50;
  }
  const stage = getStage(matchName);
  if (stage === "QF") return 70;
  if (stage === "R16") return 60;
  if (stage === "R32") return 45;
  return 30;
}

function getPriceMultipleScore(multiple: number | null): number {
  if (!multiple || multiple < 1) return 0;
  if (multiple < 1.5) return 20;
  if (multiple < 2) return 40;
  if (multiple < 3) return 60;
  if (multiple < 4) return 80;
  return 100;
}

function getDaysLeftScore(daysLeft: number): number {
  if (daysLeft > 60) return 0;
  if (daysLeft > 45) return 10;
  if (daysLeft > 30) return 25;
  if (daysLeft > 21) return 40;
  if (daysLeft > 14) return 60;
  if (daysLeft > 7) return 80;
  return 100;
}

function getTrendScore(trend: "rising" | "falling" | "flat"): number {
  if (trend === "falling") return -20;
  if (trend === "flat") return 0;
  return 20;
}

function getStageScore(matchName: string): number {
  const stage = getStage(matchName);
  if (stage === "QF") return 20;
  if (stage === "R16") return 15;
  if (stage === "R32") return 10;
  return 0;
}

export function calculateTrend(scans: PriceScan[]): "rising" | "falling" | "flat" {
  if (scans.length < 2) return "flat";

  const sorted = [...scans]
    .filter((s) => s.ask_price != null)
    .sort((a, b) => new Date(a.scanned_at).getTime() - new Date(b.scanned_at).getTime());

  if (sorted.length < 2) return "flat";

  const recent = sorted.slice(-3);
  const first = recent[0].ask_price!;
  const last = recent[recent.length - 1].ask_price!;
  const pctChange = (last - first) / first;

  if (pctChange > 0.05) return "rising";
  if (pctChange < -0.05) return "falling";
  return "flat";
}

export function calculateSignal(
  ticket: Ticket,
  multiple: number | null,
  daysLeft: number,
  trend: "rising" | "falling" | "flat"
): { signal: SignalLevel; score: number } {
  const priceScore = getPriceMultipleScore(multiple) * 0.3;
  const daysScore = getDaysLeftScore(daysLeft) * 0.25;
  const trendScore = (50 + getTrendScore(trend)) * 0.2;
  const teamScore = getTeamDemandScore(ticket.match_name) * 0.15;
  const stageScore = getStageScore(ticket.match_name) * 0.1;

  const rawScore = priceScore + daysScore + trendScore + teamScore + stageScore;
  const score = Math.min(100, Math.max(0, Math.round(rawScore)));

  let signal: SignalLevel;
  if (score >= 80) signal = "FIRE";
  else if (score >= 65) signal = "LIST NOW";
  else if (score >= 50) signal = "SELL";
  else if (score >= 35) signal = "WATCH";
  else signal = "HOLD";

  return { signal, score };
}

export function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr + "T00:00:00");
  const now = new Date();
  return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}
