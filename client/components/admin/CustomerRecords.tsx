import { useState, useEffect } from "react";
import { supabase, Customer } from "@/lib/supabase";
import { Archive, Edit2, Plus, ChevronUp, ChevronDown, FileText, Smartphone } from "lucide-react";
import DocumentUploadModal from "./DocumentUploadModal";

interface LoggedInUser {
  id: number;
  name: string;
  pin: string;
  is_admin: boolean;
}

// Authorized persons list
const AUTHORIZED_PERSONS = ["Beyza", "Duygu", "Erkut", "Gökhan", "Mete"];

// Turkish-aware uppercase function
const toTurkishUpperCase = (str: string): string => {
  const turkishMap: { [key: string]: string } = {
    'i': 'İ',
    'ş': 'Ş',
    'ğ': 'Ğ',
    'ü': 'Ü',
    'ö': 'Ö',
    'ç': 'Ç'
  };

  return str
    .split('')
    .map(char => turkishMap[char] || char.toUpperCase())
    .join('');
};

export default function CustomerRecords({ loggedInUser }: { loggedInUser: LoggedInUser | null }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<Customer | Partial<Customer>>({});
  const [showForm, setShowForm] = useState(false);
  const [archiveConfirmId, setArchiveConfirmId] = useState<number | null>(null);
  const [hoveredMessageId, setHoveredMessageId] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const [closeMessageTooltipTimeout, setCloseMessageTooltipTimeout] = useState<NodeJS.Timeout | null>(null);
  const [selectedCustomerForDocs, setSelectedCustomerForDocs] = useState<number | null>(null);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    tc: "",
    phone: "",
    message: "",
    process: "Beklemede" as "Beklemede" | "Aracını Buluyor" | "Onaylandı" | "Kredi Onayda" | "Kullandırıldı" | "Red/İade"
  });
  const [sortField, setSortField] = useState<keyof Customer>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAuthorizedPerson, setSelectedAuthorizedPerson] = useState<string | null>(null);
  const [showAuthorizedPersonDropdown, setShowAuthorizedPersonDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [animatingIds, setAnimatingIds] = useState<Set<number>>(new Set());
  const [newNoteText, setNewNoteText] = useState("");
  const [expandedNotesId, setExpandedNotesId] = useState<number | null>(null);
  const [hoveredProcessId, setHoveredProcessId] = useState<number | null>(null);
  const [processTooltipPos, setProcessTooltipPos] = useState({ top: 0, left: 0 });
  const [showNoteInputId, setShowNoteInputId] = useState<number | null>(null);
  const [newNoteInputText, setNewNoteInputText] = useState("");
  const [addingNoteFromHoverId, setAddingNoteFromHoverId] = useState<number | null>(null);
  const [hoverNoteInputText, setHoverNoteInputText] = useState("");
  const [closeTooltipTimeout, setCloseTooltipTimeout] = useState<NodeJS.Timeout | null>(null);

  // Fetch active customers only
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("customers")
        .select("*, added_by")
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

  // Initial fetch on mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Fetch when sort changes
  useEffect(() => {
    fetchCustomers();
  }, [sortField, sortOrder]);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Real-time subscription to customers table
  useEffect(() => {
    let channel: any;

    const setupRealtime = () => {
      try {
        channel = supabase
          .channel("customers-updates")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "customers" },
            (payload) => {
              // Only refresh if the changed record is active
              if (payload.new?.status === "active" || payload.old?.status === "active") {
                fetchCustomers();
              }
            }
          )
          .subscribe();
      } catch (error) {
        console.error("Error setting up realtime subscription:", error);
      }
    };

    setupRealtime();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  // Add new customer
  const handleAddCustomer = async () => {
    if (!newCustomer.name || !newCustomer.tc) {
      alert("Ad ve TC zorunludur!");
      return;
    }

    try {
      // Check if phone number already exists
      if (newCustomer.phone) {
        const { data: existingCustomer, error: checkError } = await supabase
          .from("customers")
          .select("id, phone")
          .eq("phone", newCustomer.phone)
          .eq("status", "active")
          .single();

        if (existingCustomer) {
          alert("Bu telefon numarasında kayıt zaten mevcut!");
          return;
        }
      }

      const { error } = await supabase.from("customers").insert([
        {
          name: newCustomer.name,
          tc: newCustomer.tc,
          phone: newCustomer.phone || "",
          message: newCustomer.message || "",
          process: newCustomer.process,
          status: "active",
          added_by: loggedInUser?.name || "Bilinmeyen"
        }
      ]);

      if (error) throw error;

      setNewCustomer({ name: "", tc: "", phone: "", message: "", process: "Beklemede" });
      setShowForm(false);
      fetchCustomers();
    } catch (error) {
      console.error("Error adding customer:", error);
      alert("Hata: Müşteri eklenemedi. Lütfen formu kontrol edin.");
    }
  };

  // Update customer
  const handleUpdateCustomer = async (id: number) => {
    if (!editingData.name || !editingData.tc) {
      alert("Ad ve TC zorunludur!");
      return;
    }

    try {
      // Only send the fields that have changed
      const updateData: any = {
        name: editingData.name,
        tc: editingData.tc,
        phone: editingData.phone || "",
        message: editingData.message || "",
        process: editingData.process || "Beklemede"
      };

      // Handle notes updates - only include if notes exist
      if (editingData.notes !== undefined && editingData.notes.length > 0) {
        updateData.notes = editingData.notes;
      }

      // Only allow admins to update added_by field
      if (loggedInUser?.is_admin) {
        updateData.added_by = editingData.added_by || "";
      }

      const { error } = await supabase
        .from("customers")
        .update(updateData)
        .eq("id", id);

      if (error) {
        console.error("Supabase error details:", error);

        // If error is about notes column not existing, try again without notes
        if (error.message && error.message.includes("notes")) {
          console.log("Notes column not found, updating without notes...");
          delete updateData.notes;

          const { error: retryError } = await supabase
            .from("customers")
            .update(updateData)
            .eq("id", id);

          if (retryError) throw retryError;
        } else {
          throw error;
        }
      }

      setEditingId(null);
      setEditingData({});
      fetchCustomers();
    } catch (error) {
      console.error("Error updating customer:", error);
      alert("Hata: Müşteri güncellenemedi. Lütfen formu kontrol edin.");
    }
  };

  // Archive customer
  const handleArchiveCustomer = async () => {
    if (archiveConfirmId === null) return;

    try {
      const { error } = await supabase
        .from("customers")
        .update({ status: "archived" })
        .eq("id", archiveConfirmId);

      if (error) throw error;
      setArchiveConfirmId(null);
      fetchCustomers();
    } catch (error) {
      console.error("Error archiving customer:", error);
      alert("Hata: Müşteri arşivlenemedi");
      setArchiveConfirmId(null);
    }
  };

  // Update process status
  const handleUpdateProcess = async (id: number, process: "Beklemede" | "Onaylandı" | "Kredi Onayda") => {
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

  // Add a new note to a customer
  const handleAddNote = (customerId: number, noteText: string) => {
    if (!noteText.trim()) return;

    const timestamp = new Date().toLocaleString("tr-TR");
    const newNote = {
      text: noteText.trim(),
      timestamp,
      author: loggedInUser?.name || "Bilinmeyen"
    };

    const currentNotes = editingData.notes || [];
    setEditingData({
      ...editingData,
      notes: [...currentNotes, newNote]
    });

    setNewNoteInputText("");
    setShowNoteInputId(null);
  };

  // Add a new note directly from the hover tooltip (no edit mode needed)
  const handleAddNoteFromHover = async (customerId: number, noteText: string) => {
    if (!noteText.trim()) return;

    try {
      const timestamp = new Date().toLocaleString("tr-TR");
      const newNote = {
        text: noteText.trim(),
        timestamp,
        author: loggedInUser?.name || "Bilinmeyen"
      };

      const customer = customers.find(c => c.id === customerId);
      const currentNotes = customer?.notes || [];
      const updatedNotes = [...currentNotes, newNote];

      // Update local state immediately (optimistic update)
      setCustomers(customers.map(c =>
        c.id === customerId
          ? { ...c, notes: updatedNotes }
          : c
      ));

      // Clear input
      setHoverNoteInputText("");

      // Update in database (async, in background)
      const { error } = await supabase
        .from("customers")
        .update({ notes: updatedNotes })
        .eq("id", customerId);

      if (error) {
        console.error("Error saving note to database:", error);
        // If notes column doesn't exist, show helpful message
        if (error.message && error.message.includes("notes")) {
          alert("Not: Supabase veritabanında 'notes' sütunu eklenmelidir. Lütfen yöneticiyle iletişime geçiniz.");
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error("Error adding note from hover:", error);
      alert("Not eklenirken hata oluştu: " + (error instanceof Error ? error.message : "Bilinmeyen hata"));
    }
  };

  // Delete a note from a customer
  const handleDeleteNote = async (customerId: number, noteIndex: number) => {
    try {
      const customer = customers.find(c => c.id === customerId);
      const currentNotes = customer?.notes || [];
      const updatedNotes = currentNotes.filter((_, idx) => idx !== noteIndex);

      // Update in database
      const { error } = await supabase
        .from("customers")
        .update({ notes: updatedNotes })
        .eq("id", customerId);

      if (error) {
        if (error.message && !error.message.includes("notes")) {
          throw error;
        }
        console.log("Notes column not yet available in database");
      } else {
        // Update local state
        setCustomers(customers.map(c =>
          c.id === customerId
            ? { ...c, notes: updatedNotes }
            : c
        ));
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("Not silinirken hata oluştu");
    }
  };

  // Handle process cell mouse enter with tooltip delay
  const handleProcessMouseEnter = (customerId: number, e: React.MouseEvent) => {
    // Clear any pending timeout
    if (closeTooltipTimeout) {
      clearTimeout(closeTooltipTimeout);
      setCloseTooltipTimeout(null);
    }

    setHoveredProcessId(customerId);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setProcessTooltipPos({
      top: rect.bottom + 5,
      left: rect.left
    });
  };

  // Handle process cell and tooltip mouse leave with delay
  const handleProcessMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredProcessId(null);
      setHoverNoteInputText("");
    }, 300); // 300ms delay before closing
    setCloseTooltipTimeout(timeout);
  };

  // Handle tooltip mouse enter to prevent closing
  const handleTooltipMouseEnter = () => {
    if (closeTooltipTimeout) {
      clearTimeout(closeTooltipTimeout);
      setCloseTooltipTimeout(null);
    }
  };

  // Handle message cell mouse enter
  const handleMessageMouseEnter = (customerId: number, e: React.MouseEvent) => {
    if (closeMessageTooltipTimeout) {
      clearTimeout(closeMessageTooltipTimeout);
      setCloseMessageTooltipTimeout(null);
    }

    setHoveredMessageId(customerId);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltipPos({
      top: rect.bottom + 5,
      left: rect.left
    });
  };

  // Handle message cell and tooltip mouse leave with delay
  const handleMessageMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredMessageId(null);
    }, 300); // 300ms delay before closing
    setCloseMessageTooltipTimeout(timeout);
  };

  // Handle message tooltip mouse enter to prevent closing
  const handleMessageTooltipMouseEnter = () => {
    if (closeMessageTooltipTimeout) {
      clearTimeout(closeMessageTooltipTimeout);
      setCloseMessageTooltipTimeout(null);
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

  // Get unique authorized persons
  const uniqueAuthorizedPersons = Array.from(
    new Set(customers.map((c) => c.added_by).filter((name) => name))
  ).sort();

  // Filter customers based on search query and selected authorized person
  const filteredCustomers = customers.filter((customer) => {
    // Filter by selected authorized person
    if (selectedAuthorizedPerson && customer.added_by !== selectedAuthorizedPerson) {
      return false;
    }

    const query = searchQuery.toLowerCase().trim();

    // If search query is empty, show all (after authorized person filter)
    if (!query) return true;

    // Search by name
    if (customer.name.toLowerCase().includes(query)) return true;

    // Search by full TC or last 9 digits of TC
    if (customer.tc.includes(query)) return true;
    const tcLast9 = customer.tc.slice(-9);
    if (tcLast9.includes(query)) return true;

    // Search by full phone or last 9 digits of phone
    if (customer.phone.includes(query)) return true;
    const phoneLast9 = customer.phone.slice(-9);
    if (phoneLast9.includes(query)) return true;

    return false;
  });

  return (
    <div className={`${isMobile ? "p-3" : "p-6"}`}>
      <style>{`
        @keyframes rowUpdate {
          0% {
            background-color: rgb(191 219 254);
          }
          100% {
            background-color: transparent;
          }
        }
        .row-animate {
          animation: rowUpdate 0.8s ease-out;
        }
      `}</style>

      {/* Add Customer Button and Search */}
      {!showForm && (
        <div className={`mb-6 flex flex-col gap-2 ${isMobile ? "" : "sm:flex-row sm:gap-3"}`}>
          <button
            onClick={() => setShowForm(true)}
            className={`flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${isMobile ? "w-full sm:w-auto" : ""}`}
          >
            <Plus className={isMobile ? "h-4 w-4" : "h-5 w-5"} />
            {isMobile ? "Ekle" : "Yeni Müşteri Ekle"}
          </button>
          <input
            type="text"
            placeholder={isMobile ? "Ara..." : "TC, Ad veya Telefon ile ara..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm ${isMobile ? "w-full" : "flex-1"}`}
          />
        </div>
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
                setNewCustomer({ ...newCustomer, name: toTurkishUpperCase(e.target.value) })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <input
              type="text"
              placeholder="TC"
              value={newCustomer.tc}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, tc: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <div className="relative flex items-center">
              <span className="absolute left-3 font-semibold text-gray-700 pointer-events-none" style={{fontSize: '15px'}}>+90</span>
              <input
                type="tel"
                inputMode="numeric"
                placeholder="5XX XXX XX XX"
                value={newCustomer.phone.replace(/^\+90/, "")}
                onChange={(e) => {
                  const digits = e.target.value.replace(/[^0-9]/g, "");
                  const formattedPhone = digits ? `+90${digits.slice(0, 10)}` : "";
                  setNewCustomer({ ...newCustomer, phone: formattedPhone })
                }}
                maxLength="10"
                className="pl-12 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 w-full"
                style={{letterSpacing: '0.5px'}}
              />
            </div>
            <select
              value={newCustomer.process}
              onChange={(e) =>
                setNewCustomer({
                  ...newCustomer,
                  process: e.target.value as "Beklemede" | "Aracını Buluyor" | "Onaylandı" | "Kredi Onayda" | "Kullandırıldı" | "Red/İade"
                })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="Beklemede">Beklemede</option>
              <option value="Aracını Buluyor">Aracını Buluyor</option>
              <option value="Onaylandı">Onaylandı</option>
              <option value="Kredi Onayda">Kredi Onayda</option>
              <option value="Kullandırıldı">Kullandırıldı</option>
              <option value="Red/İade">Red/İade</option>
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
                setNewCustomer({ name: "", tc: "", phone: "", message: "", process: "Beklemede" });
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
      ) : filteredCustomers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Arama kriterlerine uygun müşteri bulunamadı</p>
        </div>
      ) : (
        <div className={`${isMobile ? "overflow-x-auto" : "overflow-x-auto"}`}>
          <table className={`w-full border-collapse ${isMobile ? "text-xs" : ""}`}>
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-300">
                <th className={`px-2 py-2 text-left font-semibold text-gray-700 whitespace-nowrap`} style={{fontSize: isMobile ? '12px' : '15px'}}>
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center gap-2 hover:text-blue-600"
                  >
                    Ad {!isMobile && "Soyad"} <SortIcon field="name" />
                  </button>
                </th>
                <th className={`px-2 py-2 text-left font-semibold text-gray-700 whitespace-nowrap`} style={{fontSize: isMobile ? '12px' : '15px'}}>
                  <button
                    onClick={() => handleSort("tc")}
                    className="flex items-center gap-2 hover:text-blue-600"
                  >
                    TC <SortIcon field="tc" />
                  </button>
                </th>
                <th className={`px-2 py-2 text-left font-semibold text-gray-700 whitespace-nowrap`} style={{fontSize: isMobile ? '12px' : '15px'}}>
                  <button
                    onClick={() => handleSort("phone")}
                    className="flex items-center gap-2 hover:text-blue-600"
                  >
                    Telefon <SortIcon field="phone" />
                  </button>
                </th>
                {!isMobile && (
                  <th className="px-2 py-2 text-left font-semibold text-gray-700 whitespace-nowrap" style={{fontSize: '15px'}}>
                    <button
                      onClick={() => handleSort("message")}
                      className="flex items-center gap-2 hover:text-blue-600"
                    >
                      Mesaj <SortIcon field="message" />
                    </button>
                  </th>
                )}
                <th className={`px-2 py-2 text-left font-semibold text-gray-700 whitespace-nowrap`} style={{fontSize: isMobile ? '12px' : '15px'}}>
                  <button
                    onClick={() => handleSort("process")}
                    className="flex items-center gap-2 hover:text-blue-600"
                  >
                    Süreci <SortIcon field="process" />
                  </button>
                </th>
                {!isMobile && (
                  <th className="px-2 py-2 text-left font-semibold text-gray-700 whitespace-nowrap" style={{fontSize: '15px'}}>
                    <button
                      onClick={() => handleSort("created_at")}
                      className="flex items-center gap-2 hover:text-blue-600"
                    >
                      Tarih <SortIcon field="created_at" />
                    </button>
                  </th>
                )}
                <th className={`px-2 py-2 text-left font-semibold text-gray-700 relative whitespace-nowrap`} style={{fontSize: isMobile ? '12px' : '15px'}}>
                  <button
                    onClick={() => setShowAuthorizedPersonDropdown(!showAuthorizedPersonDropdown)}
                    className="flex items-center gap-2 hover:text-blue-600 cursor-pointer"
                  >
                    {isMobile ? "Y.K" : "Yetkili Kişi"} {selectedAuthorizedPerson && <span className={`text-white px-1 py-0.5 rounded-full ${isMobile ? "text-xs" : "text-xs"}`} style={{fontSize: '10px', backgroundColor: '#2563eb'}}>✓</span>}
                  </button>
                  {showAuthorizedPersonDropdown && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 min-w-max">
                      <button
                        onClick={() => {
                          setSelectedAuthorizedPerson(null);
                          setShowAuthorizedPersonDropdown(false);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm font-medium border-b"
                      >
                        Tüm Yetkili Kişiler
                      </button>
                      {uniqueAuthorizedPersons.map((person) => (
                        <button
                          key={person}
                          onClick={() => {
                            setSelectedAuthorizedPerson(person);
                            setShowAuthorizedPersonDropdown(false);
                          }}
                          className={`block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm ${
                            selectedAuthorizedPerson === person ? 'bg-blue-100 font-semibold text-blue-700' : ''
                          }`}
                        >
                          {person}
                        </button>
                      ))}
                    </div>
                  )}
                </th>
                <th className="px-2 py-2 text-center font-semibold text-gray-700" style={{fontSize: '15px'}}>
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                    animatingIds.has(customer.id) ? "row-animate" : ""
                  }`}
                >
                  <td className="px-2 py-2" style={{fontSize: isMobile ? '12px' : '15px'}}>
                    {editingId === customer.id ? (
                      <input
                        type="text"
                        value={editingData.name || ""}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            name: toTurkishUpperCase(e.target.value)
                          })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        style={{fontSize: isMobile ? '12px' : '15px'}}
                      />
                    ) : (
                      <span className="text-gray-800 block">{toTurkishUpperCase(customer.name)}</span>
                    )}
                  </td>
                  <td className="px-2 py-2" style={{fontSize: isMobile ? '12px' : '15px'}}>
                    {editingId === customer.id ? (
                      <input
                        type="text"
                        value={editingData.tc || ""}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            tc: e.target.value
                          })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        style={{fontSize: isMobile ? '12px' : '15px'}}
                      />
                    ) : (
                      <span className="text-gray-800 block max-w-[100px] truncate">{isMobile ? customer.tc.slice(-9) : customer.tc}</span>
                    )}
                  </td>
                  <td className="px-2 py-2" style={{fontSize: isMobile ? '12px' : '15px'}}>
                    {editingId === customer.id ? (
                      <div className="relative flex items-center">
                        <span className="absolute left-1 font-semibold text-gray-700 pointer-events-none" style={{fontSize: isMobile ? '10px' : '13px'}}>+90</span>
                        <input
                          type="tel"
                          inputMode="numeric"
                          placeholder="5XX XXX XX XX"
                          value={(editingData.phone || "").replace(/^\+90/, "")}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/[^0-9]/g, "");
                            const formattedPhone = digits ? `+90${digits.slice(0, 10)}` : "";
                            setEditingData({
                              ...editingData,
                              phone: formattedPhone
                            })
                          }}
                          maxLength="10"
                          className="pl-7 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 w-full"
                          style={{fontSize: isMobile ? '12px' : '15px', letterSpacing: '0.5px'}}
                        />
                      </div>
                    ) : (
                      <a
                        href={`https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-800 hover:text-gray-800 active:text-gray-800 block no-underline"
                        style={{
                          fontSize: isMobile ? '12px' : '15px',
                          textDecoration: 'none',
                          color: 'inherit',
                          wordSpacing: '1px'
                        }}
                        onCopy={(e) => {
                          e.preventDefault();
                          const phoneClean = customer.phone.replace(/[^0-9]/g, '');
                          e.clipboardData?.setData('text/plain', phoneClean);
                        }}
                      >
                        <span style={{fontSize: isMobile ? '10px' : '13px'}}>+90</span>
                        <span> </span>
                        {customer.phone.slice(3, 6)} {customer.phone.slice(6, 9)} {customer.phone.slice(9, 11)} {customer.phone.slice(11, 13)}
                      </a>
                    )}
                  </td>
                  {!isMobile && (
                    <td className="px-2 py-2 max-w-[150px]" style={{fontSize: '14px'}}>
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
                          style={{fontSize: '14px'}}
                          rows={2}
                        />
                      ) : (
                        <div className="relative">
                          <span
                            className="text-gray-700 block truncate cursor-pointer select-none"
                            style={{
                              fontSize: '14px',
                              WebkitUserSelect: 'none',
                              MozUserSelect: 'none',
                              userSelect: 'none'
                            }}
                            onMouseEnter={(e) => handleMessageMouseEnter(customer.id, e)}
                            onMouseLeave={() => handleMessageMouseLeave()}
                          >
                            {customer.message || "-"}
                          </span>
                          {hoveredMessageId === customer.id && customer.message && (
                            <div
                              className="fixed bg-gray-900 text-white rounded shadow-2xl z-[9999] border border-gray-700 min-w-[280px] max-w-sm"
                              style={{
                                top: `${tooltipPos.top}px`,
                                left: `${tooltipPos.left}px`,
                                fontSize: '13px',
                                padding: '12px'
                              }}
                              onMouseEnter={() => handleMessageTooltipMouseEnter()}
                              onMouseLeave={() => handleMessageMouseLeave()}
                            >
                              {customer.message}
                              <div className="absolute bottom-full left-4 w-2 h-2 bg-gray-900 border-t border-l border-gray-700" style={{transform: 'rotate(45deg)'}}></div>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  )}
                  <td className="px-2 py-2 relative" style={{fontSize: isMobile ? '12px' : '14px'}}>
                    {editingId === customer.id ? (
                      <select
                        value={editingData.process || "Beklemede"}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            process: e.target.value as "Beklemede" | "Aracını Buluyor" | "Onaylandı" | "Kredi Onayda" | "Kullandırıldı" | "Red/İade"
                          })
                        }
                        className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 w-full"
                        style={{fontSize: isMobile ? '12px' : '14px'}}
                      >
                        <option value="Beklemede">Beklemede</option>
                        <option value="Aracını Buluyor">Aracını Buluyor</option>
                        <option value="Onaylandı">Onaylandı</option>
                        <option value="Kredi Onayda">Kredi Onayda</option>
                        <option value="Kullandırıldı">Kullandırıldı</option>
                        <option value="Red/İade">Red/İade</option>
                      </select>
                    ) : (
                      <div className="relative">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full font-semibold whitespace-nowrap cursor-pointer ${
                            customer.process === "Beklemede" || customer.process === "Aracını Buluyor"
                              ? "bg-yellow-100 text-yellow-800"
                              : customer.process === "Kredi Onayda"
                              ? "bg-blue-100 text-blue-800"
                              : customer.process === "Onaylandı"
                              ? "bg-green-100 text-green-800"
                              : customer.process === "Kullandırıldı"
                              ? "bg-green-800 text-white"
                              : "bg-pink-100 text-pink-800"
                          }`}
                          style={{fontSize: isMobile ? '11px' : '13px'}}
                          onMouseEnter={(e) => handleProcessMouseEnter(customer.id, e)}
                          onMouseLeave={() => handleProcessMouseLeave()}
                        >
                          {isMobile ? (customer.process === "Beklemede" ? "B" : customer.process === "Onaylandı" ? "O" : customer.process === "Kredi Onayda" ? "K" : customer.process === "Kullandırıldı" ? "U" : "R") : customer.process}
                        </span>

                        {/* Hover Tooltip with Notes - Stay open and interactive */}
                        {hoveredProcessId === customer.id && (
                          <div
                            className="fixed bg-white border border-gray-300 rounded shadow-2xl z-[9999] min-w-[340px] max-w-sm overflow-hidden flex flex-col"
                            style={{
                              top: `${processTooltipPos.top}px`,
                              left: `${processTooltipPos.left}px`,
                              maxHeight: '500px'
                            }}
                            onMouseEnter={() => handleTooltipMouseEnter()}
                            onMouseLeave={() => handleProcessMouseLeave()}
                          >
                            {/* Header with close button */}
                            <div className="flex justify-between items-center bg-gray-50 px-3 py-2 border-b border-gray-200">
                              <p className="text-xs font-semibold text-gray-700">Notlar</p>
                              <button
                                onClick={() => {
                                  setHoveredProcessId(null);
                                  setHoverNoteInputText("");
                                }}
                                className="text-gray-500 hover:text-gray-700 text-lg leading-none"
                              >
                                ✕
                              </button>
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 overflow-y-auto p-3">
                              {/* Existing Notes */}
                              {customer.notes && customer.notes.length > 0 && (
                                <div className="space-y-2 mb-3">
                                  {customer.notes.map((note, idx) => (
                                    <div key={idx} className="text-xs bg-gray-50 p-2 rounded border border-gray-200 flex justify-between items-start gap-2 group">
                                      <div className="flex-1">
                                        <p className="text-gray-900 break-words font-medium">{note.text}</p>
                                        <p className="text-gray-500 text-xs mt-1">{note.author} • {note.timestamp}</p>
                                      </div>
                                      <button
                                        onClick={() => handleDeleteNote(customer.id, idx)}
                                        className="flex-shrink-0 text-red-600 hover:text-red-800 hover:bg-red-50 p-1 rounded transition-colors opacity-0 group-hover:opacity-100"
                                        title="Sil"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {customer.notes && customer.notes.length === 0 && (
                                <p className="text-xs text-gray-500 mb-3 italic">Henüz not yok</p>
                              )}
                            </div>

                            {/* Add Note Form - Fixed at bottom */}
                            <div className="border-t border-gray-200 bg-gray-50 p-3 space-y-2">
                              <textarea
                                value={hoverNoteInputText}
                                onChange={(e) => setHoverNoteInputText(e.target.value)}
                                placeholder="Not yazınız..."
                                className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                                rows={2}
                              />
                              <button
                                onClick={() => handleAddNoteFromHover(customer.id, hoverNoteInputText)}
                                className="w-full px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors font-medium"
                              >
                                + Not Ekle
                              </button>
                            </div>

                            <div className="absolute bottom-full left-6 w-2 h-2 bg-white border-t border-l border-gray-300" style={{transform: 'rotate(45deg)'}}></div>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  {!isMobile && (
                    <td className="px-2 py-2 text-gray-600" style={{fontSize: '14px'}}>
                      {new Date(customer.created_at).toLocaleDateString("tr-TR")}
                    </td>
                  )}
                  <td className="px-2 py-2" style={{fontSize: isMobile ? '12px' : '14px'}}>
                    {editingId === customer.id && loggedInUser?.is_admin ? (
                      <select
                        value={editingData.added_by || ""}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            added_by: e.target.value
                          })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        style={{fontSize: isMobile ? '12px' : '14px'}}
                      >
                        <option value="">Seçiniz...</option>
                        {AUTHORIZED_PERSONS.map((person) => (
                          <option key={person} value={person}>{person}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="inline-block px-2 py-0.5 rounded-full font-semibold bg-blue-100 text-blue-800 whitespace-nowrap" style={{fontSize: isMobile ? '11px' : '13px'}}>
                        {customer.added_by || "-"}
                      </span>
                    )}
                  </td>
                  <td className="px-2 py-2">
                    <div className={`flex justify-center gap-1`}>
                      {editingId === customer.id ? (
                        <>
                          <button
                            onClick={() => handleUpdateCustomer(customer.id)}
                            className={`text-white rounded hover:opacity-80 transition-opacity ${isMobile ? "px-1 py-0.5 text-xs" : "px-2 py-1 text-xs"}`}
                            style={{backgroundColor: '#16a34a', fontSize: isMobile ? '11px' : '13px'}}
                          >
                            {isMobile ? "K" : "Kaydet"}
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditingData({});
                            }}
                            className={`bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors ${isMobile ? "px-1 py-0.5 text-xs" : "px-2 py-1 text-xs"}`}
                            style={{fontSize: isMobile ? '11px' : '13px'}}
                          >
                            {isMobile ? "✕" : "İptal"}
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingId(customer.id);
                              setEditingData(customer);
                            }}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Düzenle"
                          >
                            <Edit2 className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
                          </button>
                          <button
                            onClick={() => setSelectedCustomerForDocs(customer.id)}
                            className="p-1 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                            title="Dosyalar"
                          >
                            <FileText className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
                          </button>
                          <button
                            onClick={() => setArchiveConfirmId(customer.id)}
                            className="p-1 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                            title="Arşive Taşı"
                          >
                            <Archive className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
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
      <div className={`mt-4 text-gray-600 ${isMobile ? "text-xs" : "text-sm"}`}>
        {selectedAuthorizedPerson ? (
          <>
            <span className="font-semibold">{selectedAuthorizedPerson}</span> tarafından eklenen: <span className="font-semibold">{filteredCustomers.length}</span> / Toplam: <span className="font-semibold">{customers.length}</span> müşteri
          </>
        ) : searchQuery ? (
          <>
            Bulunan: <span className="font-semibold">{filteredCustomers.length}</span> / Toplam: <span className="font-semibold">{customers.length}</span> müşteri
          </>
        ) : (
          <>
            Toplam: <span className="font-semibold">{customers.length}</span> aktif müşteri
          </>
        )}
      </div>

      {/* Document Upload Modal */}
      {selectedCustomerForDocs !== null && (
        <DocumentUploadModal
          customerId={selectedCustomerForDocs}
          isOpen={selectedCustomerForDocs !== null}
          onClose={() => setSelectedCustomerForDocs(null)}
        />
      )}

      {/* Archive Confirmation Modal */}
      {archiveConfirmId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4 rounded-t-lg">
              <h2 className="text-lg font-bold">Arşive Taşı</h2>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <p className="text-gray-700 text-base leading-relaxed mb-6">
                <span className="font-semibold">Emin misin?</span>
                <br />
                Bu kayıt arşive taşınacak ve arşivde görünmeye başlayacak.
              </p>

              {/* Modal Actions */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setArchiveConfirmId(null)}
                  className="px-6 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hayır
                </button>
                <button
                  onClick={handleArchiveCustomer}
                  className="px-6 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Evet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
