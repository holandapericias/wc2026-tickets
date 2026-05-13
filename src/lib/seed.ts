export const TICKET_SEED_DATA = [
  { owner: "stephen", game_num: 19, match_name: "Argentina vs Algeria", match_date: "2026-06-16", venue: "GEHA Field at Arrowhead Stadium", city: "Kansas City", category: 3, section: "310", row_num: "14", seats: "1,2", qty: 2, cost_per_ticket: 140, total_cost: 280 },
  { owner: "stephen", game_num: 37, match_name: "Uruguay vs Cape Verde", match_date: "2026-06-21", venue: "Hard Rock Stadium", city: "Miami", category: 2, section: "349", row_num: "30", seats: "14,15", qty: 2, cost_per_ticket: 355, total_cost: 710 },
  { owner: "stephen", game_num: 44, match_name: "Jordan vs Algeria", match_date: "2026-06-22", venue: "Levi's Stadium", city: "San Francisco", category: 3, section: "416", row_num: "5", seats: "20,21", qty: 2, cost_per_ticket: 215, total_cost: 430 },
  { owner: "stephen", game_num: 58, match_name: "Tunisia vs Netherlands", match_date: "2026-06-25", venue: "GEHA Field at Arrowhead Stadium", city: "Kansas City", category: 3, section: "307", row_num: "28", seats: "1,2", qty: 2, cost_per_ticket: 140, total_cost: 280 },
  { owner: "stephen", game_num: 71, match_name: "Colombia vs Portugal", match_date: "2026-06-27", venue: "Hard Rock Stadium", city: "Miami", category: 2, section: "350", row_num: "29", seats: "11,12", qty: 2, cost_per_ticket: 360, total_cost: 720 },
  { owner: "stephen", game_num: 73, match_name: "R32: 2nd Place A vs 2nd Place B", match_date: "2026-06-28", venue: "SoFi Stadium", city: "Los Angeles", category: 2, section: "544", row_num: "7", seats: "4,5", qty: 2, cost_per_ticket: 500, total_cost: 1000 },
  { owner: "stephen", game_num: 76, match_name: "R32: 1st Place C vs 2nd Place F", match_date: "2026-06-29", venue: "NRG Stadium", city: "Houston", category: 1, section: "326", row_num: "J", seats: "1,2", qty: 2, cost_per_ticket: 440, total_cost: 880 },
  { owner: "stephen", game_num: 77, match_name: "R32: 1st Place I vs Best 3rd", match_date: "2026-06-30", venue: "MetLife Stadium", city: "New York", category: 1, section: "149", row_num: "9", seats: "21,22", qty: 2, cost_per_ticket: 665, total_cost: 1330 },
  { owner: "stephen", game_num: 77, match_name: "R32: 1st Place I vs Best 3rd", match_date: "2026-06-30", venue: "MetLife Stadium", city: "New York", category: 2, section: "315", row_num: "8", seats: "1,2", qty: 2, cost_per_ticket: 500, total_cost: 1000 },
  { owner: "stephen", game_num: 80, match_name: "R32: 1st Place L vs Best 3rd", match_date: "2026-07-01", venue: "Mercedes-Benz Stadium", city: "Atlanta", category: 1, section: "116", row_num: "26", seats: "26,27", qty: 2, cost_per_ticket: 440, total_cost: 880 },
  { owner: "stephen", game_num: 86, match_name: "R32: 1st Place J vs 2nd Place H", match_date: "2026-07-03", venue: "Hard Rock Stadium", city: "Miami", category: 1, section: "242", row_num: "4", seats: "3,4", qty: 2, cost_per_ticket: 505, total_cost: 1010 },
  { owner: "stephen", game_num: 90, match_name: "R16: Winner G73 vs Winner G75", match_date: "2026-07-04", venue: "NRG Stadium", city: "Houston", category: 1, section: "118", row_num: "CC", seats: "21,22,23,24", qty: 4, cost_per_ticket: 620, total_cost: 2480 },
  { owner: "stephen", game_num: 91, match_name: "R16: Winner G76 vs Winner G78", match_date: "2026-07-05", venue: "MetLife Stadium", city: "New York", category: 2, section: "343", row_num: "15", seats: "5,6,7,8", qty: 4, cost_per_ticket: 730, total_cost: 2920 },
  { owner: "stephen", game_num: 93, match_name: "R16: Winner G83 vs Winner G84", match_date: "2026-07-06", venue: "AT&T Stadium", city: "Dallas", category: 1, section: "204", row_num: "14", seats: "13,14", qty: 2, cost_per_ticket: 640, total_cost: 1280 },
  { owner: "stephen", game_num: 93, match_name: "R16: Winner G83 vs Winner G84", match_date: "2026-07-06", venue: "AT&T Stadium", city: "Dallas", category: 2, section: "405", row_num: "4", seats: "17,18", qty: 2, cost_per_ticket: 485, total_cost: 970 },
  { owner: "stephen", game_num: 98, match_name: "QF: Winner G93 vs Winner G94", match_date: "2026-07-10", venue: "SoFi Stadium", city: "Los Angeles", category: 2, section: "511", row_num: "17", seats: "14,15", qty: 2, cost_per_ticket: 1150, total_cost: 2300 },
  { owner: "stephen", game_num: 100, match_name: "QF: Winner G95 vs Winner G96", match_date: "2026-07-11", venue: "GEHA Field at Arrowhead Stadium", city: "Kansas City", category: 1, section: "131", row_num: "19", seats: "21,22", qty: 2, cost_per_ticket: 1180, total_cost: 2360 },
  { owner: "stephen", game_num: 100, match_name: "QF: Winner G95 vs Winner G96", match_date: "2026-07-11", venue: "GEHA Field at Arrowhead Stadium", city: "Kansas City", category: 2, section: "343", row_num: "24", seats: "17,18", qty: 2, cost_per_ticket: 825, total_cost: 1650 },
];

// Roberto's 4 tickets. Costs/prices pending — set to 0 placeholders; UI treats
// cost_per_ticket=0 as "awaiting cost data" and suppresses misleading margin numbers.
export const ROBERTO_SEED_DATA = [
  { owner: "roberto", game_num: 0, match_name: "Ivory Coast vs Ecuador", match_date: "2026-06-14", venue: "TBD", city: "TBD", category: 0, section: "114", row_num: "15", seats: "1,2,3,4", qty: 4, cost_per_ticket: 0, total_cost: 0 },
  { owner: "roberto", game_num: 0, match_name: "Brazil vs Haiti", match_date: "2026-06-19", venue: "TBD", city: "TBD", category: 0, section: "112", row_num: "20", seats: "20,21,22,23", qty: 4, cost_per_ticket: 0, total_cost: 0 },
  { owner: "roberto", game_num: 0, match_name: "Ivory Coast vs Curacao", match_date: "2026-06-25", venue: "TBD", city: "TBD", category: 0, section: "124", row_num: "14", seats: "1,2,3,4", qty: 4, cost_per_ticket: 0, total_cost: 0 },
  { owner: "roberto", game_num: 0, match_name: "R16: Winner G74 vs Winner G77", match_date: "2026-07-04", venue: "TBD", city: "TBD", category: 0, section: "114", row_num: "22", seats: "12,13,14,15", qty: 4, cost_per_ticket: 0, total_cost: 0 },
];

export const TOTAL_COST_BASIS = 22480;
export const TARGET_NET_PROFIT = 25000;
export const SELLER_FEE = 0.15;
