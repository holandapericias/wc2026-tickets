// All 104 matches of WC2026, with FIFA's official global numbering.
// Sources: FIFA published schedule cross-verified against Wikipedia
// 2026_FIFA_World_Cup_Group_{A..L} pages, Ticketmaster event listings
// (each TM event name includes "Match N"), and bracketmundial2026.com.
//
// Group-stage entries carry actual team names. Knockout entries carry
// placeholder references (e.g. "2A", "1E", "3A/B/C/D/F", "W74") in
// team1_ref / team2_ref; the resolver fills in real teams as group
// standings lock and prior knockout matches resolve.
//
// Note on the user's seed: the plan flagged a potential mix-up between
// Match 69 and Match 71 for "Colombia vs Portugal". The official schedule
// has Colombia vs Portugal as Match 71 (Hard Rock Stadium, Jun 27);
// Match 69 is Algeria vs Austria. The user's ticket is for Match 71.

export type Stage = "group" | "r32" | "r16" | "qf" | "sf" | "bronze" | "final";

export interface SeedGame {
  game_number: number;
  stage: Stage;
  match_date: string; // YYYY-MM-DD
  city: string;
  venue: string;
  group_name: string | null;
  team1: string | null;       // actual name for group stage; null for knockout until resolved
  team2: string | null;
  team1_ref: string | null;   // placeholder for knockout (e.g. "2A", "W74")
  team2_ref: string | null;
}

export const GAMES: SeedGame[] = [
  // ──────────────── Group Stage (1-72) ────────────────
  { game_number: 1,  stage: "group", match_date: "2026-06-11", city: "Mexico City",      venue: "Estadio Azteca",                  group_name: "A", team1: "Mexico",                  team2: "South Africa",         team1_ref: null, team2_ref: null },
  { game_number: 2,  stage: "group", match_date: "2026-06-11", city: "Guadalajara",      venue: "Estadio Akron",                   group_name: "A", team1: "South Korea",             team2: "Czechia",              team1_ref: null, team2_ref: null },
  { game_number: 3,  stage: "group", match_date: "2026-06-12", city: "Toronto",          venue: "BMO Field",                       group_name: "B", team1: "Canada",                  team2: "Bosnia and Herzegovina", team1_ref: null, team2_ref: null },
  { game_number: 4,  stage: "group", match_date: "2026-06-12", city: "Inglewood",        venue: "SoFi Stadium",                    group_name: "D", team1: "United States",           team2: "Paraguay",             team1_ref: null, team2_ref: null },
  { game_number: 5,  stage: "group", match_date: "2026-06-13", city: "Foxborough",       venue: "Gillette Stadium",                group_name: "C", team1: "Haiti",                   team2: "Scotland",             team1_ref: null, team2_ref: null },
  { game_number: 6,  stage: "group", match_date: "2026-06-13", city: "East Rutherford",  venue: "MetLife Stadium",                 group_name: "C", team1: "Brazil",                  team2: "Morocco",              team1_ref: null, team2_ref: null },
  { game_number: 7,  stage: "group", match_date: "2026-06-13", city: "Santa Clara",      venue: "Levi's Stadium",                  group_name: "B", team1: "Qatar",                   team2: "Switzerland",          team1_ref: null, team2_ref: null },
  { game_number: 8,  stage: "group", match_date: "2026-06-14", city: "Vancouver",        venue: "BC Place",                        group_name: "D", team1: "Australia",               team2: "Turkey",               team1_ref: null, team2_ref: null },
  { game_number: 9,  stage: "group", match_date: "2026-06-14", city: "Philadelphia",     venue: "Lincoln Financial Field",         group_name: "E", team1: "Ivory Coast",             team2: "Ecuador",              team1_ref: null, team2_ref: null },
  { game_number: 10, stage: "group", match_date: "2026-06-14", city: "Houston",          venue: "NRG Stadium",                     group_name: "E", team1: "Germany",                 team2: "Curacao",              team1_ref: null, team2_ref: null },
  { game_number: 11, stage: "group", match_date: "2026-06-14", city: "Arlington",        venue: "AT&T Stadium",                    group_name: "F", team1: "Netherlands",             team2: "Japan",                team1_ref: null, team2_ref: null },
  { game_number: 12, stage: "group", match_date: "2026-06-14", city: "Monterrey",        venue: "Estadio BBVA",                    group_name: "F", team1: "Sweden",                  team2: "Tunisia",              team1_ref: null, team2_ref: null },
  { game_number: 13, stage: "group", match_date: "2026-06-15", city: "Miami",            venue: "Hard Rock Stadium",               group_name: "H", team1: "Saudi Arabia",            team2: "Uruguay",              team1_ref: null, team2_ref: null },
  { game_number: 14, stage: "group", match_date: "2026-06-15", city: "Atlanta",          venue: "Mercedes-Benz Stadium",           group_name: "H", team1: "Spain",                   team2: "Cape Verde",           team1_ref: null, team2_ref: null },
  { game_number: 15, stage: "group", match_date: "2026-06-15", city: "Inglewood",        venue: "SoFi Stadium",                    group_name: "G", team1: "Iran",                    team2: "New Zealand",          team1_ref: null, team2_ref: null },
  { game_number: 16, stage: "group", match_date: "2026-06-15", city: "Seattle",          venue: "Lumen Field",                     group_name: "G", team1: "Belgium",                 team2: "Egypt",                team1_ref: null, team2_ref: null },
  { game_number: 17, stage: "group", match_date: "2026-06-16", city: "East Rutherford",  venue: "MetLife Stadium",                 group_name: "I", team1: "France",                  team2: "Senegal",              team1_ref: null, team2_ref: null },
  { game_number: 18, stage: "group", match_date: "2026-06-16", city: "Foxborough",       venue: "Gillette Stadium",                group_name: "I", team1: "Iraq",                    team2: "Norway",               team1_ref: null, team2_ref: null },
  { game_number: 19, stage: "group", match_date: "2026-06-16", city: "Kansas City",      venue: "GEHA Field at Arrowhead Stadium", group_name: "J", team1: "Argentina",               team2: "Algeria",              team1_ref: null, team2_ref: null },
  { game_number: 20, stage: "group", match_date: "2026-06-17", city: "Santa Clara",      venue: "Levi's Stadium",                  group_name: "J", team1: "Austria",                 team2: "Jordan",               team1_ref: null, team2_ref: null },
  { game_number: 21, stage: "group", match_date: "2026-06-17", city: "Toronto",          venue: "BMO Field",                       group_name: "L", team1: "Ghana",                   team2: "Panama",               team1_ref: null, team2_ref: null },
  { game_number: 22, stage: "group", match_date: "2026-06-17", city: "Arlington",        venue: "AT&T Stadium",                    group_name: "L", team1: "England",                 team2: "Croatia",              team1_ref: null, team2_ref: null },
  { game_number: 23, stage: "group", match_date: "2026-06-17", city: "Houston",          venue: "NRG Stadium",                     group_name: "K", team1: "Portugal",                team2: "DR Congo",             team1_ref: null, team2_ref: null },
  { game_number: 24, stage: "group", match_date: "2026-06-17", city: "Mexico City",      venue: "Estadio Azteca",                  group_name: "K", team1: "Uzbekistan",              team2: "Colombia",             team1_ref: null, team2_ref: null },
  { game_number: 25, stage: "group", match_date: "2026-06-18", city: "Atlanta",          venue: "Mercedes-Benz Stadium",           group_name: "A", team1: "Czechia",                 team2: "South Africa",         team1_ref: null, team2_ref: null },
  { game_number: 26, stage: "group", match_date: "2026-06-18", city: "Inglewood",        venue: "SoFi Stadium",                    group_name: "B", team1: "Switzerland",             team2: "Bosnia and Herzegovina", team1_ref: null, team2_ref: null },
  { game_number: 27, stage: "group", match_date: "2026-06-18", city: "Vancouver",        venue: "BC Place",                        group_name: "B", team1: "Canada",                  team2: "Qatar",                team1_ref: null, team2_ref: null },
  { game_number: 28, stage: "group", match_date: "2026-06-18", city: "Guadalajara",      venue: "Estadio Akron",                   group_name: "A", team1: "Mexico",                  team2: "South Korea",          team1_ref: null, team2_ref: null },
  { game_number: 29, stage: "group", match_date: "2026-06-19", city: "Philadelphia",     venue: "Lincoln Financial Field",         group_name: "C", team1: "Brazil",                  team2: "Haiti",                team1_ref: null, team2_ref: null },
  { game_number: 30, stage: "group", match_date: "2026-06-19", city: "Foxborough",       venue: "Gillette Stadium",                group_name: "C", team1: "Scotland",                team2: "Morocco",              team1_ref: null, team2_ref: null },
  { game_number: 31, stage: "group", match_date: "2026-06-19", city: "Santa Clara",      venue: "Levi's Stadium",                  group_name: "D", team1: "Turkey",                  team2: "Paraguay",             team1_ref: null, team2_ref: null },
  { game_number: 32, stage: "group", match_date: "2026-06-19", city: "Seattle",          venue: "Lumen Field",                     group_name: "D", team1: "United States",           team2: "Australia",            team1_ref: null, team2_ref: null },
  { game_number: 33, stage: "group", match_date: "2026-06-20", city: "Toronto",          venue: "BMO Field",                       group_name: "E", team1: "Germany",                 team2: "Ivory Coast",          team1_ref: null, team2_ref: null },
  { game_number: 34, stage: "group", match_date: "2026-06-20", city: "Kansas City",      venue: "GEHA Field at Arrowhead Stadium", group_name: "E", team1: "Ecuador",                 team2: "Curacao",              team1_ref: null, team2_ref: null },
  { game_number: 35, stage: "group", match_date: "2026-06-20", city: "Houston",          venue: "NRG Stadium",                     group_name: "F", team1: "Netherlands",             team2: "Sweden",               team1_ref: null, team2_ref: null },
  { game_number: 36, stage: "group", match_date: "2026-06-21", city: "Monterrey",        venue: "Estadio BBVA",                    group_name: "F", team1: "Tunisia",                 team2: "Japan",                team1_ref: null, team2_ref: null },
  { game_number: 37, stage: "group", match_date: "2026-06-21", city: "Miami",            venue: "Hard Rock Stadium",               group_name: "H", team1: "Uruguay",                 team2: "Cape Verde",           team1_ref: null, team2_ref: null },
  { game_number: 38, stage: "group", match_date: "2026-06-21", city: "Atlanta",          venue: "Mercedes-Benz Stadium",           group_name: "H", team1: "Spain",                   team2: "Saudi Arabia",         team1_ref: null, team2_ref: null },
  { game_number: 39, stage: "group", match_date: "2026-06-21", city: "Inglewood",        venue: "SoFi Stadium",                    group_name: "G", team1: "Belgium",                 team2: "Iran",                 team1_ref: null, team2_ref: null },
  { game_number: 40, stage: "group", match_date: "2026-06-21", city: "Vancouver",        venue: "BC Place",                        group_name: "G", team1: "New Zealand",             team2: "Egypt",                team1_ref: null, team2_ref: null },
  { game_number: 41, stage: "group", match_date: "2026-06-22", city: "East Rutherford",  venue: "MetLife Stadium",                 group_name: "I", team1: "Norway",                  team2: "Senegal",              team1_ref: null, team2_ref: null },
  { game_number: 42, stage: "group", match_date: "2026-06-22", city: "Philadelphia",     venue: "Lincoln Financial Field",         group_name: "I", team1: "France",                  team2: "Iraq",                 team1_ref: null, team2_ref: null },
  { game_number: 43, stage: "group", match_date: "2026-06-22", city: "Arlington",        venue: "AT&T Stadium",                    group_name: "J", team1: "Argentina",               team2: "Austria",              team1_ref: null, team2_ref: null },
  { game_number: 44, stage: "group", match_date: "2026-06-22", city: "Santa Clara",      venue: "Levi's Stadium",                  group_name: "J", team1: "Jordan",                  team2: "Algeria",              team1_ref: null, team2_ref: null },
  { game_number: 45, stage: "group", match_date: "2026-06-23", city: "Foxborough",       venue: "Gillette Stadium",                group_name: "L", team1: "England",                 team2: "Ghana",                team1_ref: null, team2_ref: null },
  { game_number: 46, stage: "group", match_date: "2026-06-23", city: "Toronto",          venue: "BMO Field",                       group_name: "L", team1: "Panama",                  team2: "Croatia",              team1_ref: null, team2_ref: null },
  { game_number: 47, stage: "group", match_date: "2026-06-23", city: "Houston",          venue: "NRG Stadium",                     group_name: "K", team1: "Portugal",                team2: "Uzbekistan",           team1_ref: null, team2_ref: null },
  { game_number: 48, stage: "group", match_date: "2026-06-23", city: "Guadalajara",      venue: "Estadio Akron",                   group_name: "K", team1: "Colombia",                team2: "DR Congo",             team1_ref: null, team2_ref: null },
  { game_number: 49, stage: "group", match_date: "2026-06-24", city: "Miami",            venue: "Hard Rock Stadium",               group_name: "C", team1: "Scotland",                team2: "Brazil",               team1_ref: null, team2_ref: null },
  { game_number: 50, stage: "group", match_date: "2026-06-24", city: "Atlanta",          venue: "Mercedes-Benz Stadium",           group_name: "C", team1: "Morocco",                 team2: "Haiti",                team1_ref: null, team2_ref: null },
  { game_number: 51, stage: "group", match_date: "2026-06-24", city: "Vancouver",        venue: "BC Place",                        group_name: "B", team1: "Switzerland",             team2: "Canada",               team1_ref: null, team2_ref: null },
  { game_number: 52, stage: "group", match_date: "2026-06-24", city: "Seattle",          venue: "Lumen Field",                     group_name: "B", team1: "Bosnia and Herzegovina",  team2: "Qatar",                team1_ref: null, team2_ref: null },
  { game_number: 53, stage: "group", match_date: "2026-06-24", city: "Mexico City",      venue: "Estadio Azteca",                  group_name: "A", team1: "Czechia",                 team2: "Mexico",               team1_ref: null, team2_ref: null },
  { game_number: 54, stage: "group", match_date: "2026-06-24", city: "Monterrey",        venue: "Estadio BBVA",                    group_name: "A", team1: "South Africa",            team2: "South Korea",          team1_ref: null, team2_ref: null },
  { game_number: 55, stage: "group", match_date: "2026-06-25", city: "Philadelphia",     venue: "Lincoln Financial Field",         group_name: "E", team1: "Curacao",                 team2: "Ivory Coast",          team1_ref: null, team2_ref: null },
  { game_number: 56, stage: "group", match_date: "2026-06-25", city: "East Rutherford",  venue: "MetLife Stadium",                 group_name: "E", team1: "Ecuador",                 team2: "Germany",              team1_ref: null, team2_ref: null },
  { game_number: 57, stage: "group", match_date: "2026-06-25", city: "Arlington",        venue: "AT&T Stadium",                    group_name: "F", team1: "Japan",                   team2: "Sweden",               team1_ref: null, team2_ref: null },
  { game_number: 58, stage: "group", match_date: "2026-06-25", city: "Kansas City",      venue: "GEHA Field at Arrowhead Stadium", group_name: "F", team1: "Tunisia",                 team2: "Netherlands",          team1_ref: null, team2_ref: null },
  { game_number: 59, stage: "group", match_date: "2026-06-25", city: "Inglewood",        venue: "SoFi Stadium",                    group_name: "D", team1: "Turkey",                  team2: "United States",        team1_ref: null, team2_ref: null },
  { game_number: 60, stage: "group", match_date: "2026-06-25", city: "Santa Clara",      venue: "Levi's Stadium",                  group_name: "D", team1: "Paraguay",                team2: "Australia",            team1_ref: null, team2_ref: null },
  { game_number: 61, stage: "group", match_date: "2026-06-26", city: "Foxborough",       venue: "Gillette Stadium",                group_name: "I", team1: "Norway",                  team2: "France",               team1_ref: null, team2_ref: null },
  { game_number: 62, stage: "group", match_date: "2026-06-26", city: "Toronto",          venue: "BMO Field",                       group_name: "I", team1: "Senegal",                 team2: "Iraq",                 team1_ref: null, team2_ref: null },
  { game_number: 63, stage: "group", match_date: "2026-06-26", city: "Seattle",          venue: "Lumen Field",                     group_name: "G", team1: "Egypt",                   team2: "Iran",                 team1_ref: null, team2_ref: null },
  { game_number: 64, stage: "group", match_date: "2026-06-26", city: "Vancouver",        venue: "BC Place",                        group_name: "G", team1: "New Zealand",             team2: "Belgium",              team1_ref: null, team2_ref: null },
  { game_number: 65, stage: "group", match_date: "2026-06-26", city: "Houston",          venue: "NRG Stadium",                     group_name: "H", team1: "Cape Verde",              team2: "Saudi Arabia",         team1_ref: null, team2_ref: null },
  { game_number: 66, stage: "group", match_date: "2026-06-26", city: "Guadalajara",      venue: "Estadio Akron",                   group_name: "H", team1: "Uruguay",                 team2: "Spain",                team1_ref: null, team2_ref: null },
  { game_number: 67, stage: "group", match_date: "2026-06-27", city: "East Rutherford",  venue: "MetLife Stadium",                 group_name: "L", team1: "Panama",                  team2: "England",              team1_ref: null, team2_ref: null },
  { game_number: 68, stage: "group", match_date: "2026-06-27", city: "Philadelphia",     venue: "Lincoln Financial Field",         group_name: "L", team1: "Croatia",                 team2: "Ghana",                team1_ref: null, team2_ref: null },
  { game_number: 69, stage: "group", match_date: "2026-06-27", city: "Kansas City",      venue: "GEHA Field at Arrowhead Stadium", group_name: "J", team1: "Algeria",                 team2: "Austria",              team1_ref: null, team2_ref: null },
  { game_number: 70, stage: "group", match_date: "2026-06-27", city: "Arlington",        venue: "AT&T Stadium",                    group_name: "J", team1: "Jordan",                  team2: "Argentina",            team1_ref: null, team2_ref: null },
  { game_number: 71, stage: "group", match_date: "2026-06-27", city: "Miami",            venue: "Hard Rock Stadium",               group_name: "K", team1: "Colombia",                team2: "Portugal",             team1_ref: null, team2_ref: null },
  { game_number: 72, stage: "group", match_date: "2026-06-27", city: "Atlanta",          venue: "Mercedes-Benz Stadium",           group_name: "K", team1: "DR Congo",                team2: "Uzbekistan",           team1_ref: null, team2_ref: null },

  // ──────────────── Round of 32 (73-88) ────────────────
  { game_number: 73, stage: "r32",   match_date: "2026-06-28", city: "Inglewood",        venue: "SoFi Stadium",                    group_name: null, team1: null, team2: null, team1_ref: "2A", team2_ref: "2B" },
  { game_number: 74, stage: "r32",   match_date: "2026-06-29", city: "Foxborough",       venue: "Gillette Stadium",                group_name: null, team1: null, team2: null, team1_ref: "1E", team2_ref: "3A/B/C/D/F" },
  { game_number: 75, stage: "r32",   match_date: "2026-06-29", city: "Monterrey",        venue: "Estadio BBVA",                    group_name: null, team1: null, team2: null, team1_ref: "1F", team2_ref: "2C" },
  { game_number: 76, stage: "r32",   match_date: "2026-06-29", city: "Houston",          venue: "NRG Stadium",                     group_name: null, team1: null, team2: null, team1_ref: "1C", team2_ref: "2F" },
  { game_number: 77, stage: "r32",   match_date: "2026-06-30", city: "East Rutherford",  venue: "MetLife Stadium",                 group_name: null, team1: null, team2: null, team1_ref: "1I", team2_ref: "3C/D/F/G/H" },
  { game_number: 78, stage: "r32",   match_date: "2026-06-30", city: "Arlington",        venue: "AT&T Stadium",                    group_name: null, team1: null, team2: null, team1_ref: "2E", team2_ref: "2I" },
  { game_number: 79, stage: "r32",   match_date: "2026-06-30", city: "Mexico City",      venue: "Estadio Azteca",                  group_name: null, team1: null, team2: null, team1_ref: "1A", team2_ref: "3C/E/F/H/I" },
  { game_number: 80, stage: "r32",   match_date: "2026-07-01", city: "Atlanta",          venue: "Mercedes-Benz Stadium",           group_name: null, team1: null, team2: null, team1_ref: "1L", team2_ref: "3E/H/I/J/K" },
  { game_number: 81, stage: "r32",   match_date: "2026-07-01", city: "Santa Clara",      venue: "Levi's Stadium",                  group_name: null, team1: null, team2: null, team1_ref: "1D", team2_ref: "3B/E/F/I/J" },
  { game_number: 82, stage: "r32",   match_date: "2026-07-01", city: "Seattle",          venue: "Lumen Field",                     group_name: null, team1: null, team2: null, team1_ref: "1G", team2_ref: "3A/E/H/I/J" },
  { game_number: 83, stage: "r32",   match_date: "2026-07-02", city: "Toronto",          venue: "BMO Field",                       group_name: null, team1: null, team2: null, team1_ref: "2K", team2_ref: "2L" },
  { game_number: 84, stage: "r32",   match_date: "2026-07-02", city: "Inglewood",        venue: "SoFi Stadium",                    group_name: null, team1: null, team2: null, team1_ref: "1H", team2_ref: "2J" },
  { game_number: 85, stage: "r32",   match_date: "2026-07-02", city: "Vancouver",        venue: "BC Place",                        group_name: null, team1: null, team2: null, team1_ref: "1B", team2_ref: "3E/F/G/I/J" },
  { game_number: 86, stage: "r32",   match_date: "2026-07-03", city: "Miami",            venue: "Hard Rock Stadium",               group_name: null, team1: null, team2: null, team1_ref: "1J", team2_ref: "2H" },
  { game_number: 87, stage: "r32",   match_date: "2026-07-03", city: "Kansas City",      venue: "GEHA Field at Arrowhead Stadium", group_name: null, team1: null, team2: null, team1_ref: "1K", team2_ref: "3D/E/I/J/L" },
  { game_number: 88, stage: "r32",   match_date: "2026-07-03", city: "Arlington",        venue: "AT&T Stadium",                    group_name: null, team1: null, team2: null, team1_ref: "2D", team2_ref: "2G" },

  // ──────────────── Round of 16 (89-96) ────────────────
  { game_number: 89, stage: "r16",   match_date: "2026-07-04", city: "Philadelphia",     venue: "Lincoln Financial Field",         group_name: null, team1: null, team2: null, team1_ref: "W74", team2_ref: "W77" },
  { game_number: 90, stage: "r16",   match_date: "2026-07-04", city: "Houston",          venue: "NRG Stadium",                     group_name: null, team1: null, team2: null, team1_ref: "W73", team2_ref: "W75" },
  { game_number: 91, stage: "r16",   match_date: "2026-07-05", city: "East Rutherford",  venue: "MetLife Stadium",                 group_name: null, team1: null, team2: null, team1_ref: "W76", team2_ref: "W78" },
  { game_number: 92, stage: "r16",   match_date: "2026-07-05", city: "Mexico City",      venue: "Estadio Azteca",                  group_name: null, team1: null, team2: null, team1_ref: "W79", team2_ref: "W80" },
  { game_number: 93, stage: "r16",   match_date: "2026-07-06", city: "Arlington",        venue: "AT&T Stadium",                    group_name: null, team1: null, team2: null, team1_ref: "W83", team2_ref: "W84" },
  { game_number: 94, stage: "r16",   match_date: "2026-07-06", city: "Seattle",          venue: "Lumen Field",                     group_name: null, team1: null, team2: null, team1_ref: "W81", team2_ref: "W82" },
  { game_number: 95, stage: "r16",   match_date: "2026-07-07", city: "Atlanta",          venue: "Mercedes-Benz Stadium",           group_name: null, team1: null, team2: null, team1_ref: "W86", team2_ref: "W88" },
  { game_number: 96, stage: "r16",   match_date: "2026-07-07", city: "Vancouver",        venue: "BC Place",                        group_name: null, team1: null, team2: null, team1_ref: "W85", team2_ref: "W87" },

  // ──────────────── Quarter-finals (97-100) ────────────────
  { game_number: 97,  stage: "qf",   match_date: "2026-07-09", city: "Foxborough",       venue: "Gillette Stadium",                group_name: null, team1: null, team2: null, team1_ref: "W89", team2_ref: "W90" },
  { game_number: 98,  stage: "qf",   match_date: "2026-07-10", city: "Inglewood",        venue: "SoFi Stadium",                    group_name: null, team1: null, team2: null, team1_ref: "W93", team2_ref: "W94" },
  { game_number: 99,  stage: "qf",   match_date: "2026-07-11", city: "Miami",            venue: "Hard Rock Stadium",               group_name: null, team1: null, team2: null, team1_ref: "W91", team2_ref: "W92" },
  { game_number: 100, stage: "qf",   match_date: "2026-07-11", city: "Kansas City",      venue: "GEHA Field at Arrowhead Stadium", group_name: null, team1: null, team2: null, team1_ref: "W95", team2_ref: "W96" },

  // ──────────────── Semi-finals (101-102) ────────────────
  { game_number: 101, stage: "sf",     match_date: "2026-07-14", city: "Arlington",       venue: "AT&T Stadium",                    group_name: null, team1: null, team2: null, team1_ref: "W97",  team2_ref: "W98" },
  { game_number: 102, stage: "sf",     match_date: "2026-07-15", city: "Atlanta",         venue: "Mercedes-Benz Stadium",           group_name: null, team1: null, team2: null, team1_ref: "W99",  team2_ref: "W100" },

  // ──────────────── Third-place + Final (103-104) ────────────────
  { game_number: 103, stage: "bronze", match_date: "2026-07-18", city: "Miami",           venue: "Hard Rock Stadium",               group_name: null, team1: null, team2: null, team1_ref: "L101", team2_ref: "L102" },
  { game_number: 104, stage: "final",  match_date: "2026-07-19", city: "East Rutherford", venue: "MetLife Stadium",                 group_name: null, team1: null, team2: null, team1_ref: "W101", team2_ref: "W102" },
];
