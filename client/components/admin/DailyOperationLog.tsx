import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2, Plus } from "lucide-react";

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
  author_name: string;
  date: string;
}

export default function DailyOperationLog({ loggedInUser }: { loggedInUser: LoggedInUser | null }) {
  const [operations, setOperations] = useState<DailyOperation[]>([]);
  const [taskDescription, setTaskDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

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

  // Load operations from localStorage
  useEffect(() => {
    const savedOperations = localStorage.getItem(`operations_${loggedInUser?.name}_${selectedDate}`);
    if (savedOperations) {
      try {
        setOperations(JSON.parse(savedOperations));
      } catch (error) {
        console.error("Error loading operations:", error);
        setOperations([]);
      }
    } else {
      setOperations([]);
    }
  }, [selectedDate, loggedInUser?.name]);

  // Save operations to localStorage whenever they change
  useEffect(() => {
    if (loggedInUser?.name && operations.length > 0) {
      localStorage.setItem(
        `operations_${loggedInUser.name}_${selectedDate}`,
        JSON.stringify(operations)
      );
    }
  }, [operations, selectedDate, loggedInUser?.name]);

  // Add new operation
  const handleAddOperation = () => {
    if (!taskDescription.trim()) {
      alert("Lütfen rapor açıklaması giriniz");
      return;
    }

    const newOperation: DailyOperation = {
      id: `${Date.now()}-${Math.random()}`,
      task_description: taskDescription,
      timestamp: new Date().toLocaleTimeString("tr-TR"),
      author_name: loggedInUser?.name || "Bilinmeyen",
      date: selectedDate,
    };

    setOperations([...operations, newOperation]);
    setTaskDescription("");
  };

  // Delete operation
  const handleDeleteOperation = (id: string | undefined) => {
    if (id) {
      setOperations(operations.filter(op => op.id !== id));
    }
  };


  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Rapor</h2>
        <p className="text-gray-600">
          {loggedInUser?.name} - {getTodayFormatted()}
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-4">
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
          />
        </div>

        {/* Add Button */}
        <button
          onClick={handleAddOperation}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="h-5 w-5" />
          + Rapor
        </button>
      </div>

      {/* Summary Section */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <p className="text-sm text-gray-600 mb-2">Toplam Rapor</p>
        <p className="text-3xl font-bold text-blue-600">{operations.length}</p>
      </div>

      {/* Operations Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {operations.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 text-lg">Henüz rapor eklenmemiş</p>
            <p className="text-gray-400 text-sm mt-2">Yukarıdan rapor ekleyerek başlayın</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ backgroundColor: "#0f367e", color: "#ffffff" }}>
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold">
                    Saat
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold">
                    Rapor
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-center font-semibold min-w-[60px]">
                    İşlem
                  </th>
                </tr>
              </thead>
              <tbody>
                {operations.map((operation, idx) => (
                  <tr
                    key={operation.id}
                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-800 font-medium">
                      {operation.timestamp}
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-800">
                      {operation.task_description}
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-center">
                      <button
                        onClick={() => handleDeleteOperation(operation.id)}
                        className="inline-flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer Note */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          💡 <strong>Not:</strong> Tüm görevler sadece size özel olarak bu cihazda kaydedilir. 
          Başka cihazdan giriş yaptığınızda farklı görevleri görebilirsiniz.
        </p>
      </div>
    </div>
  );
}
