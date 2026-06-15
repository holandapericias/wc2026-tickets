// FIFA WC2026 group composition. 12 groups, 4 teams each.
// Source: FIFA Final Draw (Dec 2025) — cross-verified against Wikipedia
// 2026_FIFA_World_Cup_Group_{A..L} pages.
export const GROUPS: Record<string, string[]> = {
  A: ["Mexico", "South Korea", "South Africa", "Czechia"],
  B: ["Canada", "Switzerland", "Qatar", "Bosnia and Herzegovina"],
  C: ["Brazil", "Morocco", "Scotland", "Haiti"],
  D: ["United States", "Australia", "Paraguay", "Turkey"],
  E: ["Germany", "Ecuador", "Ivory Coast", "Curacao"],
  F: ["Netherlands", "Japan", "Tunisia", "Sweden"],
  G: ["Belgium", "Iran", "Egypt", "New Zealand"],
  H: ["Spain", "Uruguay", "Saudi Arabia", "Cape Verde"],
  I: ["France", "Senegal", "Norway", "Iraq"],
  J: ["Argentina", "Austria", "Algeria", "Jordan"],
  K: ["Portugal", "Colombia", "Uzbekistan", "DR Congo"],
  L: ["England", "Croatia", "Panama", "Ghana"],
};

export const GROUP_LETTERS = Object.keys(GROUPS) as Array<keyof typeof GROUPS>;

// Reverse lookup: team name -> group letter
export const TEAM_TO_GROUP: Record<string, string> = Object.fromEntries(
  Object.entries(GROUPS).flatMap(([letter, teams]) =>
    teams.map((t) => [t, letter]),
  ),
);
