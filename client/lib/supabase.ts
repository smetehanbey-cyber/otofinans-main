import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fqevluscuzzvzgkzmrrj.supabase.co";
const supabaseKey = "sb_publishable_pzSebwhZQoSJyUrhx8glxw_TkoSECw2";

export const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize anonymous session
supabase.auth.signInAnonymously().catch((err) => {
  console.log("Anonymous sign-in (may already be signed in):", err.message);
});

export interface Customer {
  id: number;
  name: string;
  tc: string;
  phone: string;
  message: string;
  created_at: string;
  updated_at: string;
  status: "active" | "archived";
  process: "Beklemede" | "Onaylandı";
}
