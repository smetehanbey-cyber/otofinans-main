// Supabase client stub - waiting for package installation
// TODO: Replace with actual Supabase client once @supabase/supabase-js is installed

const supabaseUrl = "https://fqevluscuzzvzgkzmrrj.supabase.co";
const supabaseKey = "sb_publishable_pzSebwhZQoSJyUrhx8glxw_TkoSECw2";

// Temporary stub with proper method chaining
export const supabase = {
  from: (table: string) => ({
    select: (columns: string) => ({
      order: (field: string, options?: any) => Promise.resolve({ data: [], error: null }),
      then: (callback: any) => Promise.resolve({ data: [], error: null }).then(callback),
    }),
    insert: (data: any) => Promise.resolve({ data: null, error: null }),
    update: (data: any) => ({
      eq: (field: string, value: any) => Promise.resolve({ data: null, error: null }),
    }),
    delete: () => ({
      eq: (field: string, value: any) => Promise.resolve({ data: null, error: null }),
    }),
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
