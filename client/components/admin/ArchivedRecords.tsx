import { useState, useEffect } from "react";
import { supabase, Customer } from "@/lib/supabase";
import { RotateCcw, ChevronUp, ChevronDown } from "lucide-react";

export default function ArchivedRecords() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<keyof Customer>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Fetch archived customers only
  const fetchArchivedCustomers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("status", "archived")
        .order(sortField, { ascending: sortOrder === "asc" });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error("Error fetching archived customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchivedCustomers();
  }, [sortField, sortOrder]);

  // Restore customer from archive
  const handleRestoreCustomer = async (id: number) => {
    if (!confirm("Bu müşteri kaydını geri yüklemek istediğinize emin misiniz?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("customers")
        .update({ status: "active" })
        .eq("id", id);

      if (error) throw error;
      fetchArchivedCustomers();
    } catch (error) {
      console.error("Error restoring customer:", error);
      alert("Hata: Müşteri geri yüklenemedi");
    }
  };

  const handleSort = (field: keyof Customer) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const SortIcon = ({ field }: { field: keyof Customer }) => {
    if (sortField !== field) return <ChevronUp className="h-4 w-4 text-gray-300" />;
    return sortOrder === "asc" ? (
      <ChevronUp className="h-4 w-4 text-blue-600" />
    ) : (
      <ChevronDown className="h-4 w-4 text-blue-600" />
    );
  };

  return (
    <div className="p-6">
      {/* Info Banner */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Not:</strong> Arşivlenen kayıtlar burada saklanır. Gerekirse "Geri Yükle" butonuyla aktif hale getirebilirsiniz.
        </p>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      ) : customers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Arşivlenen müşteri kaydı bulunamadı</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-300">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center gap-2 hover:text-blue-600"
                  >
                    Ad Soyad <SortIcon field="name" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  <button
                    onClick={() => handleSort("email")}
                    className="flex items-center gap-2 hover:text-blue-600"
                  >
                    TC <SortIcon field="email" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  <button
                    onClick={() => handleSort("phone")}
                    className="flex items-center gap-2 hover:text-blue-600"
                  >
                    Telefon <SortIcon field="phone" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  <button
                    onClick={() => handleSort("message")}
                    className="flex items-center gap-2 hover:text-blue-600"
                  >
                    Mesaj <SortIcon field="message" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  <button
                    onClick={() => handleSort("process")}
                    className="flex items-center gap-2 hover:text-blue-600"
                  >
                    Süreci <SortIcon field="process" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  <button
                    onClick={() => handleSort("created_at")}
                    className="flex items-center gap-2 hover:text-blue-600"
                  >
                    Tarih <SortIcon field="created_at" />
                  </button>
                </th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors opacity-75"
                >
                  <td className="px-4 py-3">
                    <span className="text-gray-700">{customer.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-700">{customer.email}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-700">{customer.phone}</span>
                  </td>
                  <td className="px-4 py-3 max-w-xs truncate">
                    <span className="text-gray-600 text-sm">
                      {customer.message || "-"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full font-semibold text-sm ${
                        customer.process === "Beklemede"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {customer.process}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-sm">
                    {new Date(customer.created_at).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleRestoreCustomer(customer.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Geri Yükle"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Total Count */}
      <div className="mt-4 text-sm text-gray-600">
        Toplam: <span className="font-semibold">{customers.length}</span> arşivlenen müşteri
      </div>
    </div>
  );
}
