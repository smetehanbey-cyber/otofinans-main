// Supabase client stub - waiting for package installation
// TODO: Replace with actual Supabase client once @supabase/supabase-js is installed

const supabaseUrl = "https://fqevluscuzzvzgkzmrrj.supabase.co";
const supabaseKey = "sb_publishable_pzSebwhZQoSJyUrhx8glxw_TkoSECw2";

// Temporary stub with proper method chaining
const createQueryBuilder = () => ({
  select: () => ({
    order: () => Promise.resolve({ data: [], error: null }),
    then: (callback: any) => Promise.resolve({ data: [], error: null }).then(callback),
  }),
  insert: () => Promise.resolve({ data: [], error: null }),
  update: () => ({
    eq: () => Promise.resolve({ data: [], error: null }),
  }),
  delete: () => ({
    eq: () => Promise.resolve({ data: [], error: null }),
  }),
  order: (field: string, options: any) => Promise.resolve({ data: [], error: null }),
});

export const supabase = {
  from: (table: string) => createQueryBuilder()
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
