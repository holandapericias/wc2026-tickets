// Secret slug for Roberto's public access link. Anyone with this URL can view
// Roberto's tickets without a password. To rotate access, change this value
// and redeploy — old links stop working immediately.
//
// Override via ROBERTO_ACCESS_SLUG env var in Vercel for easy rotation
// without a code change.
export const ROBERTO_ACCESS_SLUG =
  process.env.ROBERTO_ACCESS_SLUG || "roberto-Xq8nLp5kRzW2bV7m";
