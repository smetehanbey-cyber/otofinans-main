import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Upload, X, FileText, Download, Trash2 } from "lucide-react";

interface Document {
  id: number;
  customer_id: number;
  file_name: string;
  file_url: string;
  file_type: string;
  created_at: string;
}

interface DocumentUploadModalProps {
  customerId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function DocumentUploadModal({
  customerId,
  isOpen,
  onClose
}: DocumentUploadModalProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch documents for this customer
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("documents")
        .select("*")
        .eq("customer_id", customerId);

      if (fetchError) throw fetchError;
      setDocuments(data || []);
    } catch (err) {
      console.error("Error fetching documents:", err);
      setError("Dosyalar yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDocuments();
      setError(null);
    }
  }, [isOpen, customerId]);

  // Handle file upload
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setError(null);

    for (const file of Array.from(files)) {
      // Validate file type
      const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        setError("Sadece PDF, PNG ve JPG dosyaları yüklenebilir");
        continue;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Dosya boyutu 5MB'dan küçük olmalıdır");
        continue;
      }

      try {
        setUploading(true);

        // Create unique file name
        const timestamp = Date.now();
        const fileExt = file.name.split(".").pop();
        const fileName = `${customerId}/${timestamp}_${file.name}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from("documents")
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data } = supabase.storage
          .from("documents")
          .getPublicUrl(fileName);

        // Save to database
        const { error: dbError } = await supabase.from("documents").insert([
          {
            customer_id: customerId,
            file_name: file.name,
            file_url: data.publicUrl,
            file_type: fileExt?.toLowerCase()
          }
        ]);

        if (dbError) throw dbError;

        // Refresh documents list
        fetchDocuments();
      } catch (err) {
        console.error("Error uploading file:", err);
        setError(`Dosya yükleme hatası: ${file.name}`);
      } finally {
        setUploading(false);
      }
    }
  };

  // Delete document
  const handleDeleteDocument = async (docId: number, fileUrl: string) => {
    if (!confirm("Bu dosyayı silmek istediğinize emin misiniz?")) return;

    try {
      // Extract file path from URL
      const filePath = fileUrl.split("/").slice(-2).join("/");

      // Delete from storage
      const { error: deleteStorageError } = await supabase.storage
        .from("documents")
        .remove([filePath]);

      if (deleteStorageError) throw deleteStorageError;

      // Delete from database
      const { error: deleteDbError } = await supabase
        .from("documents")
        .delete()
        .eq("id", docId);

      if (deleteDbError) throw deleteDbError;

      // Refresh documents list
      fetchDocuments();
    } catch (err) {
      console.error("Error deleting document:", err);
      setError("Dosya silinemedi");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6" />
            <h2 className="text-xl font-bold">Müşteri Dosyaları</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Drag-Drop Area */}
          <div
            onDragEnter={() => setDragActive(true)}
            onDragLeave={() => setDragActive(false)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              handleFileUpload(e.dataTransfer.files);
            }}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800 mb-1">
              Dosyaları Sürükle ve Bırak
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              veya aşağıdan seç
            </p>
            <label className="inline-block">
              <input
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
              />
              <span className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer font-medium">
                Dosya Seç
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-3">
              PDF, PNG, JPG (Max 5MB)
            </p>
          </div>

          {/* Documents List */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">
              Yüklenen Dosyalar ({documents.length})
            </h3>

            {loading ? (
              <p className="text-center text-gray-600">Yükleniyor...</p>
            ) : documents.length === 0 ? (
              <p className="text-center text-gray-500 text-sm">
                Henüz dosya yüklenedi
              </p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {doc.file_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(doc.created_at).toLocaleDateString("tr-TR")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="İndir"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                      <button
                        onClick={() => handleDeleteDocument(doc.id, doc.file_url)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors font-medium"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
