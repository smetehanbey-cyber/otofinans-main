import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Edit2, ChevronDown, X } from "lucide-react";

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
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [showInputForm, setShowInputForm] = useState(false);
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [filterAuthor, setFilterAuthor] = useState("");
  const [allAuthors, setAllAuthors] = useState<string[]>([]);
  const [selectedOperation, setSelectedOperation] = useState<DailyOperation | null>(null);

  // Get today's date in Turkish format
  const getTodayFormatted = () => {
    const date = new Date();
    return date.toLocaleDateString("tr-TR", { 
      weekday: "long", 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
  };

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

  // Edit operation
  const handleEditOperation = (operation: DailyOperation) => {
    setSelectedOperation(operation);
  };

  // Delete operation from detail view
  const handleDeleteOperation = () => {
    if (!selectedOperation || !selectedOperation.id) return;

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

  // Filter operations based on date range and author
  const filteredOperations = operations.filter(op => {
    if (filterStartDate && op.date < filterStartDate) return false;
    if (filterEndDate && op.date > filterEndDate) return false;
    if (filterAuthor && op.author_name !== filterAuthor) return false;
    return true;
  });


  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-2xl font-bold text-gray-800">Rapor</h2>
          <button
            onClick={() => setShowInputForm(!showInputForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
            title="Rapor Ekle"
          >
            <span>+</span>
            <ChevronDown
              className="h-5 w-5 transition-transform"
              style={{ transform: showInputForm ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </button>
        </div>
        <p className="text-gray-600 mt-2">
          Toplam Rapor: <span className="font-bold text-blue-600">{filteredOperations.length}</span>
        </p>
      </div>

      {/* Input Section - Collapsible */}
      {showInputForm && (
        <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-4 mb-6">
          {/* Task Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rapor Açıklaması
            </label>
            <input
              type="text"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddOperation();
                }
              }}
              placeholder="Bugün yaptığınız işi yazınız..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
              autoFocus
            />
          </div>

          {/* Add Button */}
          <button
            onClick={handleAddOperation}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
          >
            Rapor Ekle
          </button>
        </div>
      )}

      {/* Filter Section */}
      <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-3 mb-6">
        <h3 className="font-semibold text-gray-800 text-sm">Filtreleme</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Start Date Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Başlangıç Tarihi
            </label>
            <input
              type="date"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          {/* End Date Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Bitiş Tarihi
            </label>
            <input
              type="date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          {/* Author Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Yetkili Kişi
            </label>
            <select
              value={filterAuthor}
              onChange={(e) => setFilterAuthor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
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

      {/* Operations Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filteredOperations.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 text-lg">Rapor bulunamadı</p>
            <p className="text-gray-400 text-sm mt-2">
              {operations.length === 0
                ? "Yukarıdan rapor ekleyerek başlayın"
                : "Seçtiğiniz filtrelere uygun rapor yoktur"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ tableLayout: "fixed" }}>
              <thead>
                <tr style={{ backgroundColor: "#0f367e", color: "#ffffff" }}>
                  <th className="border border-gray-200 px-2 py-2 text-left font-semibold text-sm" style={{ width: "55%" }}>
                    Rapor
                  </th>
                  <th className="border border-gray-200 px-0.5 py-2 text-left font-semibold text-xs" style={{ width: "15%" }}>
                    Tarih - Saat
                  </th>
                  <th className="border border-gray-200 px-0.5 py-2 text-left font-semibold text-xs" style={{ width: "18%" }}>
                    Yetkili Kişi
                  </th>
                  <th className="border border-gray-200 px-0.5 py-2 text-center font-semibold text-xs" style={{ width: "12%" }}>
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
                    <td className="border border-gray-200 px-2 py-1 text-sm text-gray-800 truncate" title={operation.task_description}>
                      {operation.task_description}
                    </td>
                    <td className="border border-gray-200 px-0.5 py-1 text-xs text-gray-800" style={{ whiteSpace: "normal" }}>
                      <div>{operation.date}</div>
                      <div className="text-gray-600 text-xs">{operation.timestamp}</div>
                    </td>
                    <td className="border border-gray-200 px-0.5 py-1 text-xs text-gray-800 font-medium overflow-hidden text-ellipsis" style={{ whiteSpace: "normal" }}>
                      {operation.author_name}
                    </td>
                    <td className="border border-gray-200 px-0.5 py-1 text-center flex items-center justify-center h-full">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditOperation(operation);
                        }}
                        className="inline-flex items-center justify-center p-0.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Düzenle"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedOperation && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedOperation(null)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-blue-600 text-white p-6 flex items-center justify-between border-b border-blue-700">
              <h2 className="text-2xl font-bold">Rapor Detayı</h2>
              <button
                onClick={() => setSelectedOperation(null)}
                className="p-1 hover:bg-blue-700 rounded transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Rapor */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Rapor Açıklaması</h3>
                <p className="text-base text-gray-800 p-4 bg-gray-50 rounded-lg break-words">
                  {selectedOperation.task_description}
                </p>
              </div>

              {/* Bilgiler */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Tarih</h3>
                  <p className="text-base text-gray-800">{selectedOperation.date}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Saat</h3>
                  <p className="text-base text-gray-800">{selectedOperation.timestamp}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Yetkili Kişi</h3>
                  <p className="text-base text-gray-800">{selectedOperation.author_name}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setSelectedOperation(null)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2.5 px-4 rounded-lg transition-colors"
                >
                  Kapat
                </button>
                <button
                  onClick={handleDeleteOperation}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Note */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
        <p className="text-sm text-yellow-800">
          💡 <strong>Not:</strong> Tüm raporlar bu cihazda kaydedilir.
          Farklı cihazdan giriş yaptığınızda farklı raporları görebilirsiniz.
        </p>
      </div>
    </div>
  );
}
