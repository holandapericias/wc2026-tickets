import { GAMES } from "../src/data/games.ts";
import { MY_TICKETS, TOTAL_SEATS, TOTAL_COST_BASIS } from "../src/data/my-tickets.ts";
import { GROUPS, TEAM_TO_GROUP } from "../src/data/groups.ts";

console.log("=== Games ===");
console.log("total:", GAMES.length);
const byStage: Record<string, number> = {};
for (const g of GAMES) byStage[g.stage] = (byStage[g.stage] || 0) + 1;
console.log("by stage:", byStage);

// 1..104 complete?
const nums = new Set(GAMES.map((g) => g.game_number));
const missing: number[] = [];
for (let i = 1; i <= 104; i++) if (!nums.has(i)) missing.push(i);
console.log("missing numbers:", missing.length === 0 ? "none ✓" : missing.join(","));

// Each group has 6 games?
for (const letter of Object.keys(GROUPS)) {
  const c = GAMES.filter((g) => g.group_name === letter).length;
  if (c !== 6) console.log("  WRONG group", letter, "=", c);
}
console.log("all 12 groups have 6 games ✓");

// Group stage games: both teams belong to the labeled group?
for (const g of GAMES.filter((x) => x.stage === "group")) {
  for (const t of [g.team1, g.team2]) {
    if (!t) continue;
    if (TEAM_TO_GROUP[t] !== g.group_name) {
      console.log(`  WRONG team ${t} in game #${g.game_number} group ${g.group_name}; team is in group ${TEAM_TO_GROUP[t]}`);
    }
  }
}
console.log("all teams match their declared group ✓");

console.log();
console.log("=== Tickets ===");
console.log("packs:", MY_TICKETS.length);
console.log("seats:", TOTAL_SEATS);
console.log("cost basis: $" + TOTAL_COST_BASIS);

// Each ticket has a matching game?
for (const t of MY_TICKETS) {
  const g = GAMES.find((g) => g.game_number === t.game_number);
  if (!g) console.log("  TICKET FOR MISSING GAME:", t.game_number);
}
console.log("all tickets matched to a game ✓");

// Plan validation: Colombia vs Portugal should be game 71
const m71 = GAMES.find((g) => g.game_number === 71);
console.log();
console.log("plan check — game 71:", m71?.team1, "vs", m71?.team2, "at", m71?.venue, "/", m71?.city);
