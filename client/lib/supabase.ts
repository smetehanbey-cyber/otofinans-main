// Supabase client stub - waiting for package installation
// TODO: Replace with actual Supabase client once @supabase/supabase-js is installed

const supabaseUrl = "https://fqevluscuzzvzgkzmrrj.supabase.co";
const supabaseKey = "sb_publishable_pzSebwhZQoSJyUrhx8glxw_TkoSECw2";

// Temporary stub
export const supabase = {
  from: (table: string) => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: [], error: null }),
    update: () => Promise.resolve({ data: [], error: null }),
    delete: () => Promise.resolve({ data: [], error: null }),
    order: () => Promise.resolve({ data: [], error: null }),
  })
};

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
  updated_at: string;
}
