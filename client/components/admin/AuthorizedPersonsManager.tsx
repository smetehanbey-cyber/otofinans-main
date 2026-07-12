import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { UserPlus, Edit2, Trash2, Shield, User, Lock, Unlock, Check, X, RefreshCw } from "lucide-react";

interface AuthorizedPerson {
  id: number;
  name: string;
  pin: string;
  role: string;
  is_admin: boolean;
  created_at: string;
  profile_id?: string | null;
}

export default function AuthorizedPersonsManager() {
  const [persons, setPersons] = useState<AuthorizedPerson[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Edit states
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editPin, setEditPin] = useState("");
  const [editIsAdmin, setEditIsAdmin] = useState(false);

  // Fetch all authorized persons
  const fetchPersons = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("authorized_persons")
        .select("*")
        .order("id", { ascending: true });

      if (error) throw error;
      setPersons(data || []);
    } catch (err) {
      console.error("Error fetching authorized persons:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersons();
  }, []);

  // Check if user is disabled
  const isUserDisabled = (person: AuthorizedPerson) => {
    return person.role ? person.role.startsWith("disabled") : false;
  };

  // Add new person
  const handleAddPerson = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!name.trim() || !pin.trim()) {
      setErrorMsg("Lütfen tüm alanları doldurun.");
      return;
    }

    if (pin.length !== 6 || !/^\d+$/.test(pin)) {
      setErrorMsg("PIN kodu tam olarak 6 haneli bir sayı olmalıdır.");
      return;
    }

    // Check if PIN is already in use
    const pinExists = persons.some((p) => p.pin === pin);
    if (pinExists) {
      setErrorMsg("Bu PIN kodu zaten başka bir yetkili tarafından kullanılıyor.");
      return;
    }

    const determinedRole = isAdmin ? "admin" : "staff";

    try {
      const { error } = await supabase
        .from("authorized_persons")
        .insert([
          {
            name: name.trim(),
            pin: pin.trim(),
            is_admin: isAdmin,
            role: determinedRole,
          },
        ]);

      if (error) throw error;

      setSuccessMsg("Yeni yetkili başarıyla eklendi.");
      setName("");
      setPin("");
      setIsAdmin(false);
      setShowAddForm(false);
      fetchPersons();
    } catch (err: any) {
      console.error("Error adding person:", err);
      setErrorMsg("Hata: Yetkili eklenemedi. " + (err.message || ""));
    }
  };

  // Save edits
  const handleSaveEdit = async (id: number) => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!editName.trim() || !editPin.trim()) {
      setErrorMsg("Lütfen tüm alanları doldurun.");
      return;
    }

    if (editPin.length !== 6 || !/^\d+$/.test(editPin)) {
      setErrorMsg("PIN kodu tam olarak 6 haneli bir sayı olmalıdır.");
      return;
    }

    // Check if PIN is used by another person
    const pinExists = persons.some((p) => p.pin === editPin && p.id !== id);
    if (pinExists) {
      setErrorMsg("Bu PIN kodu zaten başka bir yetkili tarafından kullanılıyor.");
      return;
    }

    // Retrieve original record to determine status
    const currentPerson = persons.find((p) => p.id === id);
    if (!currentPerson) return;

    if (currentPerson.pin === "100900") {
      if (editPin !== "100900" || !editIsAdmin) {
        alert("Mete (100900) yöneticisinin PIN kodu veya Admin yetkisi değiştirilemez!");
        return;
      }
    }

    const isDisabled = isUserDisabled(currentPerson);
    let finalRole = editIsAdmin ? "admin" : "staff";
    if (isDisabled) {
      finalRole = editIsAdmin ? "disabled_admin" : "disabled_staff";
    }

    try {
      const { error } = await supabase
        .from("authorized_persons")
        .update({
          name: editName.trim(),
          pin: editPin.trim(),
          is_admin: editIsAdmin,
          role: finalRole,
        })
        .eq("id", id);

      if (error) throw error;

      setSuccessMsg("Yetkili bilgileri güncellendi.");
      setEditingId(null);
      fetchPersons();
    } catch (err: any) {
      console.error("Error updating person:", err);
      setErrorMsg("Hata: Güncelleme yapılamadı. " + (err.message || ""));
    }
  };

  // Toggle active/passive status
  const handleToggleStatus = async (person: AuthorizedPerson) => {
    setErrorMsg("");
    setSuccessMsg("");

    if (person.pin === "100900") {
      alert("Mete (100900) yöneticisinin giriş yetkisi devre dışı bırakılamaz!");
      return;
    }

    const currentlyDisabled = isUserDisabled(person);
    let newRole = "";
    
    if (currentlyDisabled) {
      // Enable: disabled_admin -> admin, disabled_staff -> staff
      newRole = person.is_admin ? "admin" : "staff";
    } else {
      // Disable: admin -> disabled_admin, staff -> disabled_staff
      newRole = person.is_admin ? "disabled_admin" : "disabled_staff";
    }

    // Confirmation dialog
    const statusText = currentlyDisabled ? "aktif hale getirmek" : "pasif hale getirmek (girişini engellemek)";
    if (!confirm(`Bu yetkiliyi ${statusText} istediğinize emin misiniz?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("authorized_persons")
        .update({ role: newRole })
        .eq("id", person.id);

      if (error) throw error;

      setSuccessMsg(`Yetkili başarıyla ${currentlyDisabled ? "aktif" : "pasif"} yapıldı.`);
      fetchPersons();
    } catch (err: any) {
      console.error("Error toggling status:", err);
      setErrorMsg("Hata: Durum değiştirilemedi.");
    }
  };

  // Delete person
  const handleDeletePerson = async (person: AuthorizedPerson) => {
    setErrorMsg("");
    setSuccessMsg("");

    // Prevent anyone from deleting Mete to avoid lockouts!
    if (person.pin === "100900") {
      alert("Mete (100900) yöneticisi sistem koruması altındadır ve asla silinemez!");
      return;
    }

    if (!confirm(`${person.name} isimli yetkiliyi tamamen silmek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("authorized_persons")
        .delete()
        .eq("id", person.id);

      if (error) throw error;

      setSuccessMsg("Yetkili tamamen silindi.");
      fetchPersons();
    } catch (err: any) {
      console.error("Error deleting person:", err);
      setErrorMsg("Hata: Yetkili silinemedi.");
    }
  };

  const startEditing = (person: AuthorizedPerson) => {
    setEditingId(person.id);
    setEditName(person.name);
    setEditPin(person.pin);
    setEditIsAdmin(person.is_admin);
  };

  return (
    <div className="p-6">
      {/* Top Banner and Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Yetkili Yönetimi</h2>
          <p className="text-sm text-gray-500">Sisteme giriş yapabilen yetkili personellerin listesi ve izinleri</p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setErrorMsg("");
            setSuccessMsg("");
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow"
        >
          <UserPlus className="h-5 w-5" />
          {showAddForm ? "Vazgeç" : "Yeni Yetkili Ekle"}
        </button>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          {successMsg}
        </div>
      )}

      {/* Add New Authorized Person Form */}
      {showAddForm && (
        <div className="mb-6 p-5 border border-gray-200 rounded-xl bg-gray-50 shadow-inner">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-blue-600" />
            Yeni Yetkili Personel Bilgileri
          </h3>
          <form onSubmit={handleAddPerson} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn: Beyza"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PIN Kodu (6 Hane)</label>
              <input
                type="text"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="Örn: 900860"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white tracking-widest font-mono text-center font-bold"
                required
              />
            </div>
            <div className="flex items-center pb-2 h-10">
              <label className="inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-700">Yönetici (Admin) Yetkisi</span>
              </label>
            </div>
            <div>
              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition shadow"
              >
                Kaydet
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Authorized Persons List Table */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="h-8 w-8 text-blue-500 animate-spin mr-2" />
          <span className="text-gray-500 font-medium">Yükleniyor...</span>
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ad Soyad</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Giriş PIN Kodu</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rol Yetkisi</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Giriş Durumu</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {persons.map((person) => {
                const disabled = isUserDisabled(person);
                const isEditing = editingId === person.id;

                return (
                  <tr key={person.id} className={`hover:bg-gray-50 transition ${disabled ? "bg-red-50/30" : ""}`}>
                    {/* Name */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-800">{person.name}</span>
                        </div>
                      )}
                    </td>

                    {/* PIN */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="text"
                          maxLength={6}
                          value={editPin}
                          onChange={(e) => setEditPin(e.target.value.replace(/[^0-9]/g, ""))}
                          className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 font-mono tracking-widest text-center w-24 font-semibold"
                        />
                      ) : (
                        <span className="font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded select-all font-semibold">
                          {person.pin}
                        </span>
                      )}
                    </td>

                    {/* Role */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <label className="inline-flex items-center cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={editIsAdmin}
                            onChange={(e) => setEditIsAdmin(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                          <span className="ms-2 text-xs font-semibold text-gray-700">Yönetici</span>
                        </label>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          {person.is_admin ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                              <Shield className="h-3 w-3" />
                              Yönetici
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold bg-gray-50 text-gray-600 border border-gray-200">
                              <User className="h-3 w-3" />
                              Personel
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Status (Active / Passive) */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      {disabled ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                          <Lock className="h-3.5 w-3.5" />
                          Giriş Engelli
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          <Unlock className="h-3.5 w-3.5" />
                          Aktif (Girebilir)
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center items-center gap-3">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(person.id)}
                              className="text-green-600 hover:text-green-800 p-1 bg-green-50 rounded hover:bg-green-100 transition"
                              title="Kaydet"
                            >
                              <Check className="h-4.5 w-4.5" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-gray-500 hover:text-gray-700 p-1 bg-gray-100 rounded hover:bg-gray-200 transition"
                              title="Vazgeç"
                            >
                              <X className="h-4.5 w-4.5" />
                            </button>
                          </>
                        ) : (
                          <>
                            {/* Toggle login block */}
                            <button
                              onClick={() => handleToggleStatus(person)}
                              className={`p-1.5 rounded transition ${
                                disabled
                                  ? "text-green-600 bg-green-50 hover:bg-green-100"
                                  : "text-amber-600 bg-amber-50 hover:bg-amber-100"
                              }`}
                              title={disabled ? "Girişi Aktif Yap" : "Girişi Engelle"}
                            >
                              {disabled ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => startEditing(person)}
                              className="text-blue-600 hover:text-blue-800 p-1.5 bg-blue-50 rounded hover:bg-blue-100 transition"
                              title="Düzenle"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeletePerson(person)}
                              className="text-red-600 hover:text-red-800 p-1.5 bg-red-50 rounded hover:bg-red-100 transition"
                              title="Sil"
                              disabled={person.pin === "100900"}
                              style={{ opacity: person.pin === "100900" ? 0.4 : 1 }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
