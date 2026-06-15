// The user's 18 ticket packs (40 seats total). Listed per the plan
// section 3.3. `match_name` is the user's own label for the matchup
// (often a placeholder for knockout games) — the real teams are looked
// up at runtime by joining on game_number → games.team1/team2.
//
// Game 71 (Colombia vs Portugal) note: the plan flagged a possible mix-up
// between Match 69 and Match 71 — the official numbering has 71 as
// Colombia vs Portugal at Hard Rock, which matches the user's ticket.

export interface SeedTicket {
  game_number: number;
  category: number;       // FIFA pricing tier on the ticket (1, 2, 3)
  section: string;
  row_num: string;
  seats: string;
  qty: number;
  cost_per_ticket: number;
  total_cost: number;
}

export const MY_TICKETS: SeedTicket[] = [
  { game_number: 19,  category: 3, section: "310", row_num: "14", seats: "1,2",         qty: 2, cost_per_ticket: 140,  total_cost: 280  },
  { game_number: 37,  category: 2, section: "349", row_num: "30", seats: "14,15",       qty: 2, cost_per_ticket: 355,  total_cost: 710  },
  { game_number: 44,  category: 3, section: "416", row_num: "5",  seats: "20,21",       qty: 2, cost_per_ticket: 215,  total_cost: 430  },
  { game_number: 58,  category: 3, section: "307", row_num: "28", seats: "1,2",         qty: 2, cost_per_ticket: 140,  total_cost: 280  },
  { game_number: 71,  category: 2, section: "350", row_num: "29", seats: "11,12",       qty: 2, cost_per_ticket: 360,  total_cost: 720  },
  { game_number: 73,  category: 2, section: "544", row_num: "7",  seats: "4,5",         qty: 2, cost_per_ticket: 500,  total_cost: 1000 },
  { game_number: 76,  category: 1, section: "326", row_num: "J",  seats: "1,2",         qty: 2, cost_per_ticket: 440,  total_cost: 880  },
  { game_number: 77,  category: 1, section: "149", row_num: "9",  seats: "21,22",       qty: 2, cost_per_ticket: 665,  total_cost: 1330 },
  { game_number: 77,  category: 2, section: "315", row_num: "8",  seats: "1,2",         qty: 2, cost_per_ticket: 500,  total_cost: 1000 },
  { game_number: 80,  category: 1, section: "116", row_num: "26", seats: "26,27",       qty: 2, cost_per_ticket: 440,  total_cost: 880  },
  { game_number: 86,  category: 1, section: "242", row_num: "4",  seats: "3,4",         qty: 2, cost_per_ticket: 505,  total_cost: 1010 },
  { game_number: 90,  category: 1, section: "118", row_num: "CC", seats: "21,22,23,24", qty: 4, cost_per_ticket: 620,  total_cost: 2480 },
  { game_number: 91,  category: 2, section: "343", row_num: "15", seats: "5,6,7,8",     qty: 4, cost_per_ticket: 730,  total_cost: 2920 },
  { game_number: 93,  category: 1, section: "204", row_num: "14", seats: "13,14",       qty: 2, cost_per_ticket: 640,  total_cost: 1280 },
  { game_number: 93,  category: 2, section: "405", row_num: "4",  seats: "17,18",       qty: 2, cost_per_ticket: 485,  total_cost: 970  },
  { game_number: 98,  category: 2, section: "511", row_num: "17", seats: "14,15",       qty: 2, cost_per_ticket: 1150, total_cost: 2300 },
  { game_number: 100, category: 1, section: "131", row_num: "19", seats: "21,22",       qty: 2, cost_per_ticket: 1180, total_cost: 2360 },
  { game_number: 100, category: 2, section: "343", row_num: "24", seats: "17,18",       qty: 2, cost_per_ticket: 825,  total_cost: 1650 },
];

export const TICKET_PACK_COUNT = MY_TICKETS.length;          // 18
export const TOTAL_SEATS       = MY_TICKETS.reduce((s, t) => s + t.qty, 0);            // 40
export const TOTAL_COST_BASIS  = MY_TICKETS.reduce((s, t) => s + t.total_cost, 0);     // 22480
