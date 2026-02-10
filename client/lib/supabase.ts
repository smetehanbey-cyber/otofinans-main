// localStorage-based database solution
// This will be replaced with real Supabase once @supabase/supabase-js is installed

const STORAGE_KEY = "oto_finans_customers";

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
  updated_at: string;
}

// Initialize localStorage with empty array if needed
const initializeStorage = () => {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }
};

// Get all customers from localStorage
const getCustomers = (): Customer[] => {
  if (typeof window === "undefined") return [];
  initializeStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

// Save customers to localStorage
const saveCustomers = (customers: Customer[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
};

// Mock Supabase client using localStorage
export const supabase = {
  from: (table: string) => ({
    select: (columns: string = "*") => ({
      order: (field: keyof Customer, options?: { ascending: boolean }) => {
        return Promise.resolve({
          data: getCustomers().sort((a, b) => {
            const aVal = a[field];
            const bVal = b[field];
            const isAscending = options?.ascending !== false;

            if (typeof aVal === "string") {
              return isAscending
                ? (aVal as string).localeCompare(bVal as string)
                : (bVal as string).localeCompare(aVal as string);
            }

            return isAscending
              ? (aVal as any) - (bVal as any)
              : (bVal as any) - (aVal as any);
          }),
          error: null,
        });
      },
      then: (callback: any) => {
        return Promise.resolve({
          data: getCustomers(),
          error: null,
        }).then(callback);
      },
    }),
    insert: (data: any) => {
      return Promise.resolve().then(() => {
        const customers = getCustomers();
        const newCustomer: Customer = {
          id: Math.max(...customers.map(c => c.id), 0) + 1,
          name: data.name,
          email: data.email,
          phone: data.phone || "",
          message: data.message || "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        customers.push(newCustomer);
        saveCustomers(customers);
        return { data: [newCustomer], error: null };
      });
    },
    update: (data: any) => ({
      eq: (field: string, value: any) => {
        return Promise.resolve().then(() => {
          const customers = getCustomers();
          const index = customers.findIndex(c => (c as any)[field] === value);
          if (index !== -1) {
            customers[index] = {
              ...customers[index],
              ...data,
              updated_at: new Date().toISOString(),
            };
            saveCustomers(customers);
            return { data: [customers[index]], error: null };
          }
          return { data: null, error: { message: "Not found" } };
        });
      },
    }),
    delete: () => ({
      eq: (field: string, value: any) => {
        return Promise.resolve().then(() => {
          const customers = getCustomers();
          const filteredCustomers = customers.filter(c => (c as any)[field] !== value);
          saveCustomers(filteredCustomers);
          return { data: null, error: null };
        });
      },
    }),
  })
};
