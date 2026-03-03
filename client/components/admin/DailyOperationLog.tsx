import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Edit2, X } from "lucide-react";

interface LoggedInUser {
  id: number;
  name: string;
  pin: string;
  is_admin: boolean;
}

interface DailyOperation {
  id?: string;
  task_description: string;
  timestamp: string;
  date: string;
  author_name: string;
}

export default function DailyOperationLog({ loggedInUser }: { loggedInUser: LoggedInUser | null }) {
  const [operations, setOperations] = useState<DailyOperation[]>([]);
  const [taskDescription, setTaskDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInputForm, setShowInputForm] = useState(false);
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [filterAuthor, setFilterAuthor] = useState("");
  const [allAuthors, setAllAuthors] = useState<string[]>([]);
  const [selectedOperation, setSelectedOperation] = useState<DailyOperation | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingText, setEditingText] = useState("");

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load all operations from localStorage
  useEffect(() => {
    const loadAllOperations = () => {
      const allOps: DailyOperation[] = [];
      const authors = new Set<string>();

      // Get all stored keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('operations_')) {
          try {
            const data = localStorage.getItem(key);
            if (data) {
              const parsed = JSON.parse(data);
              allOps.push(...parsed);
              parsed.forEach((op: DailyOperation) => authors.add(op.author_name));
            }
          } catch (error) {
            console.error("Error loading operations:", error);
          }
        }
      }

      setOperations(allOps);
      setAllAuthors(Array.from(authors).sort());
    };

    loadAllOperations();
  }, []);

  // Add new operation
  const handleAddOperation = () => {
    if (!taskDescription.trim()) {
      alert("Lütfen rapor açıklaması giriniz");
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const newOperation: DailyOperation = {
      id: `${Date.now()}-${Math.random()}`,
      task_description: taskDescription,
      timestamp: new Date().toLocaleTimeString("tr-TR"),
      date: today,
      author_name: loggedInUser?.name || "Bilinmeyen",
    };

    // Add to beginning of array
    const updatedOperations = [newOperation, ...operations];
    setOperations(updatedOperations);

    // Save to localStorage
    const key = `operations_${loggedInUser?.name}_${today}`;
    const existing = localStorage.getItem(key);
    const existingOps = existing ? JSON.parse(existing) : [];
    localStorage.setItem(key, JSON.stringify([newOperation, ...existingOps]));

    // Add author to list if not already there
    if (!allAuthors.includes(loggedInUser?.name || "")) {
      setAllAuthors([...allAuthors, loggedInUser?.name || ""].sort());
    }

    setTaskDescription("");
    setShowInputForm(false);
  };

  // Open operation detail card
  const handleEditOperation = (operation: DailyOperation) => {
    setSelectedOperation(operation);
    setEditingText(operation.task_description);
    setIsEditMode(false);
  };

  // Enter edit mode
  const handleStartEdit = () => {
    setIsEditMode(true);
  };

  // Save edited report
  const handleSaveEdit = () => {
    if (!selectedOperation || !editingText.trim()) {
      alert("Rapor açıklaması boş olamaz");
      return;
    }

    // Check if user is the owner
    if (loggedInUser?.name !== selectedOperation.author_name) {
      alert("Sadece raporun sahibi tarafından düzenlenebilir");
      return;
    }

    // Update in memory
    const updatedOperation = { ...selectedOperation, task_description: editingText.trim() };
    setSelectedOperation(updatedOperation);
    setOperations(prev =>
      prev.map(op => op.id === selectedOperation.id ? updatedOperation : op)
    );

    // Update in localStorage
    const key = `operations_${selectedOperation.author_name}_${selectedOperation.date}`;
    const existing = localStorage.getItem(key);
    if (existing) {
      const parsed = JSON.parse(existing);
      const updated = parsed.map((op: DailyOperation) =>
        op.id === selectedOperation.id ? updatedOperation : op
      );
      localStorage.setItem(key, JSON.stringify(updated));
    }

    setIsEditMode(false);
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditingText(selectedOperation?.task_description || "");
  };

  // Delete operation from detail view
  const handleDeleteOperation = () => {
    if (!selectedOperation || !selectedOperation.id) return;

    // Check if user is the owner
    if (loggedInUser?.name !== selectedOperation.author_name) {
      alert("Sadece raporun sahibi tarafından silinebilir");
      return;
    }

    const filtered = operations.filter(op => op.id !== selectedOperation.id);
    setOperations(filtered);

    // Update localStorage
    const key = `operations_${selectedOperation.author_name}_${selectedOperation.date}`;
    const existing = localStorage.getItem(key);
    if (existing) {
      const parsed = JSON.parse(existing);
      const updated = parsed.filter((op: DailyOperation) => op.id !== selectedOperation.id);
      if (updated.length > 0) {
        localStorage.setItem(key, JSON.stringify(updated));
      } else {
        localStorage.removeItem(key);
      }
    }

    setSelectedOperation(null);
  };

  // Share card
  const handleShareCard = async () => {
    if (!selectedOperation) return;

    const text = `Rapor Detayı:\n\nAçıklama: ${selectedOperation.task_description}\nTarih: ${selectedOperation.date}\nSaat: ${selectedOperation.timestamp}\nYetkili Kişi: ${selectedOperation.author_name}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Rapor Detayı",
          text: text
        });
      } catch (error) {
        console.log("Share cancelled or failed");
      }
    } else {
      // Fallback for browsers that don't support share API
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  // Filter operations based on date range and author
  const filteredOperations = operations.filter(op => {
    if (filterStartDate && op.date < filterStartDate) return false;
    if (filterEndDate && op.date > filterEndDate) return false;
    if (filterAuthor && op.author_name !== filterAuthor) return false;
    return true;
  });

  return (
    <div className={`${isMobile ? "p-3" : "p-6"}`}>
      <style>{`
        @keyframes slideInAndFade {
          0% {
            opacity: 0;
            transform: translateY(-8px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .tooltip-animate {
          animation: slideInAndFade 0.3s ease-out;
        }
      `}</style>

      {/* Add Rapor Button and Filters */}
      {!showInputForm && (
        <div className={`mb-6 flex flex-col gap-2 ${isMobile ? "" : "sm:flex-row sm:gap-3"}`}>
          <button
            onClick={() => setShowInputForm(true)}
            className={`flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${isMobile ? "w-full sm:w-auto" : ""}`}
          >
            <span>+</span>
            {isMobile ? "Rapor" : "Rapor Ekle"}
          </button>

          {/* Filter Controls */}
          <div className={`flex flex-col gap-2 ${isMobile ? "" : "sm:flex-row sm:gap-3 flex-1"}`}>
            {/* Start Date Filter */}
            <div className={isMobile ? "" : "flex-1"}>
              <input
                type="date"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 ${isMobile ? "" : ""}`}
              />
            </div>

            {/* End Date Filter */}
            <div className={isMobile ? "" : "flex-1"}>
              <input
                type="date"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 ${isMobile ? "" : ""}`}
              />
            </div>

            {/* Author Filter */}
            <div className={isMobile ? "" : "flex-1"}>
              <select
                value={filterAuthor}
                onChange={(e) => setFilterAuthor(e.target.value)}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 ${isMobile ? "" : ""}`}
              >
                <option value="">Hepsi</option>
                {allAuthors.map((author) => (
                  <option key={author} value={author}>
                    {author}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Add Rapor Form */}
      {showInputForm && (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="font-bold text-gray-800 mb-4">Rapor Ekle</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Rapor açıklaması yazınız..."
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddOperation();
                }
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 w-full"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddOperation}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                + Rapor
              </button>
              <button
                onClick={() => {
                  setShowInputForm(false);
                  setTaskDescription("");
                }}
                className="flex-1 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors font-medium"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      ) : operations.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Rapor kaydı bulunamadı</p>
        </div>
      ) : filteredOperations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-6">Arama kriterlerine uygun rapor bulunamadı</p>
          <button
            onClick={() => {
              setFilterStartDate("");
              setFilterEndDate("");
              setFilterAuthor("");
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            ← Geri (Filtreleri Temizle)
          </button>
        </div>
      ) : (
        <div className={`${isMobile ? "overflow-x-auto" : "overflow-x-auto"} min-h-[600px] relative`}>
          <table className={`w-full border-collapse ${isMobile ? "text-xs" : ""}`}>
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-300">
                <th className={`px-2 py-2 text-left font-semibold text-gray-700 whitespace-nowrap`} style={{fontSize: isMobile ? '12px' : '15px', width: '60%'}}>
                  Rapor
                </th>
                <th className={`px-2 py-2 text-left font-semibold text-gray-700 whitespace-nowrap`} style={{fontSize: isMobile ? '12px' : '15px', width: '18%'}}>
                  Tarih - Saat
                </th>
                <th className={`px-2 py-2 text-left font-semibold text-gray-700 whitespace-nowrap`} style={{fontSize: isMobile ? '12px' : '15px', width: '12%'}}>
                  Yetkili Kişi
                </th>
                <th className={`px-2 py-2 text-center font-semibold text-gray-700 whitespace-nowrap`} style={{fontSize: isMobile ? '12px' : '15px', width: '10%'}}>
                  İşlem
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOperations.map((operation, idx) => (
                <tr
                  key={operation.id}
                  className={`border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td
                    className="px-2 py-2 text-sm text-gray-800 truncate cursor-pointer hover:text-blue-600"
                    title={operation.task_description}
                    onClick={() => handleEditOperation(operation)}
                  >
                    {operation.task_description}
                  </td>
                  <td className="px-2 py-2 text-sm text-gray-800">
                    <div>{operation.date}</div>
                    <div className="text-gray-600 text-xs">{operation.timestamp}</div>
                  </td>
                  <td className="px-2 py-2 text-sm text-gray-800 font-medium truncate" title={operation.author_name}>
                    {operation.author_name}
                  </td>
                  <td className="px-2 py-2 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditOperation(operation);
                      }}
                      className="inline-flex items-center justify-center p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Düzenle"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Card - Full Screen Card View */}
      {selectedOperation && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedOperation(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Rapor</h2>
                <button
                  onClick={() => setSelectedOperation(null)}
                  className="p-1 hover:bg-blue-700 rounded-lg transition-colors"
                  title="Kapat"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <p className="text-blue-100 text-sm">Detaylı Rapor Bilgisi</p>
            </div>

            {/* Card Content */}
            <div className="p-6 space-y-5">
              {/* Rapor Açıklaması */}
              <div className="border-l-4 border-blue-500 pl-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Rapor Açıklaması</p>
                  {loggedInUser?.name === selectedOperation.author_name && !isEditMode && (
                    <button
                      onClick={handleStartEdit}
                      className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      title="Düzenle"
                    >
                      Düzenle
                    </button>
                  )}
                </div>
                {isEditMode ? (
                  <textarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-base"
                    rows={4}
                    autoFocus
                  />
                ) : (
                  <p className="text-lg font-semibold text-gray-800 break-words">
                    {selectedOperation.task_description}
                  </p>
                )}
                {loggedInUser?.name !== selectedOperation.author_name && !isEditMode && (
                  <p className="text-xs text-gray-500 mt-2 italic">
                    🔒 Sadece raporun sahibi tarafından düzenlenebilir
                  </p>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-200"></div>

              {/* Tarih */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Tarih</p>
                <p className="text-base text-gray-800 font-medium">{selectedOperation.date}</p>
              </div>

              {/* Saat */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Saat</p>
                <p className="text-base text-gray-800 font-medium">{selectedOperation.timestamp}</p>
              </div>

              {/* Yetkili Kişi */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Yetkili Kişi</p>
                <p className="text-base text-gray-800 font-medium">{selectedOperation.author_name}</p>
              </div>

              {/* Actions */}
              {isEditMode ? (
                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    title="Kaydet"
                  >
                    Kaydet
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 px-4 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors font-medium"
                    title="İptal"
                  >
                    İptal
                  </button>
                </div>
              ) : (
                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleShareCard}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    title="WhatsApp'ta Paylaş"
                  >
                    Paylaş
                  </button>
                  <button
                    onClick={handleDeleteOperation}
                    disabled={loggedInUser?.name !== selectedOperation.author_name}
                    className={`flex-1 px-4 py-3 rounded-lg transition-colors font-medium ${
                      loggedInUser?.name === selectedOperation.author_name
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    title={loggedInUser?.name === selectedOperation.author_name ? "Sil" : "Sadece raporun sahibi silebilir"}
                  >
                    Sil
                  </button>
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={() => setSelectedOperation(null)}
                className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
