import { useState, useEffect } from "react";
import { supabase, Customer } from "@/lib/supabase";
import { Archive, Edit2, Plus, ChevronUp, ChevronDown } from "lucide-react";

export default function CustomerRecords() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<Partial<Customer>>({});
  const [showForm, setShowForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    process: "Beklemede" as "Beklemede" | "Onaylandı"
  });
  const [sortField, setSortField] = useState<keyof Customer>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Fetch active customers only
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("status", "active")
        .order(sortField, { ascending: sortOrder === "asc" });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [sortField, sortOrder]);

  // Add new customer
  const handleAddCustomer = async () => {
    if (!newCustomer.name || !newCustomer.email) {
      alert("Ad ve Email zorunludur!");
      return;
    }

    try {
      const { error } = await supabase.from("customers").insert([
        {
          ...newCustomer,
          status: "active"
        }
      ]);

      if (error) throw error;

      setNewCustomer({ name: "", email: "", phone: "", message: "", process: "Beklemede" });
      setShowForm(false);
      fetchCustomers();
    } catch (error) {
      console.error("Error adding customer:", error);
      alert("Hata: Müşteri eklenemedi");
    }
  };

  // Update customer
  const handleUpdateCustomer = async (id: number) => {
    if (!editingData.name || !editingData.email) {
      alert("Ad ve Email zorunludur!");
      return;
    }

    try {
      const { error } = await supabase
        .from("customers")
        .update(editingData)
        .eq("id", id);

      if (error) throw error;

      setEditingId(null);
      setEditingData({});
      fetchCustomers();
    } catch (error) {
      console.error("Error updating customer:", error);
      alert("Hata: Müşteri güncellenemedi");
    }
  };

  // Archive customer
  const handleArchiveCustomer = async (id: number) => {
    if (!confirm("Bu müşteri kaydını arşive taşımak istediğinize emin misiniz?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("customers")
        .update({ status: "archived" })
        .eq("id", id);

      if (error) throw error;
      fetchCustomers();
    } catch (error) {
      console.error("Error archiving customer:", error);
      alert("Hata: Müşteri arşivlenemedi");
    }
  };

  // Update process status
  const handleUpdateProcess = async (id: number, process: "Beklemede" | "Onaylandı") => {
    try {
      const { error } = await supabase
        .from("customers")
        .update({ process })
        .eq("id", id);

      if (error) throw error;
      fetchCustomers();
    } catch (error) {
      console.error("Error updating process:", error);
      alert("Hata: Durum güncellenemedi");
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
      {/* Add Customer Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Yeni Müşteri Ekle
        </button>
      )}

      {/* Add Customer Form */}
      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="font-bold text-gray-800 mb-4">Yeni Müşteri Ekle</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Ad Soyad"
              value={newCustomer.name}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, name: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <input
              type="email"
              placeholder="Email"
              value={newCustomer.email}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, email: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <input
              type="tel"
              placeholder="Telefon"
              value={newCustomer.phone}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, phone: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <select
              value={newCustomer.process}
              onChange={(e) =>
                setNewCustomer({
                  ...newCustomer,
                  process: e.target.value as "Beklemede" | "Onaylandı"
                })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="Beklemede">Beklemede</option>
              <option value="Onaylandı">Onaylandı</option>
            </select>
            <textarea
              placeholder="Mesaj"
              value={newCustomer.message}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, message: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 col-span-2"
              rows={2}
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddCustomer}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Kaydet
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setNewCustomer({ name: "", email: "", phone: "", message: "", process: "Beklemede" });
              }}
              className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
            >
              İptal
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      ) : customers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Aktif müşteri kaydı bulunamadı</p>
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
                    Email <SortIcon field="email" />
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
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    {editingId === customer.id ? (
                      <input
                        type="text"
                        value={editingData.name || ""}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            name: e.target.value
                          })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    ) : (
                      <span className="text-gray-800">{customer.name}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === customer.id ? (
                      <input
                        type="email"
                        value={editingData.email || ""}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            email: e.target.value
                          })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    ) : (
                      <span className="text-gray-800">{customer.email}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === customer.id ? (
                      <input
                        type="tel"
                        value={editingData.phone || ""}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            phone: e.target.value
                          })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    ) : (
                      <span className="text-gray-800">{customer.phone}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 max-w-xs truncate">
                    {editingId === customer.id ? (
                      <textarea
                        value={editingData.message || ""}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            message: e.target.value
                          })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        rows={2}
                      />
                    ) : (
                      <span className="text-gray-700 text-sm">
                        {customer.message || "-"}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === customer.id ? (
                      <select
                        value={editingData.process || "Beklemede"}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            process: e.target.value as "Beklemede" | "Onaylandı"
                          })
                        }
                        className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="Beklemede">Beklemede</option>
                        <option value="Onaylandı">Onaylandı</option>
                      </select>
                    ) : (
                      <span
                        className={`inline-block px-3 py-1 rounded-full font-semibold text-sm ${
                          customer.process === "Beklemede"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {customer.process}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-sm">
                    {new Date(customer.created_at).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      {editingId === customer.id ? (
                        <>
                          <button
                            onClick={() => handleUpdateCustomer(customer.id)}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm transition-colors"
                          >
                            Kaydet
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditingData({});
                            }}
                            className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 text-sm transition-colors"
                          >
                            İptal
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingId(customer.id);
                              setEditingData(customer);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Düzenle"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleArchiveCustomer(customer.id)}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                            title="Arşive Taşı"
                          >
                            <Archive className="h-4 w-4" />
                          </button>
                        </>
                      )}
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
        Toplam: <span className="font-semibold">{customers.length}</span> aktif müşteri
      </div>
    </div>
  );
}
