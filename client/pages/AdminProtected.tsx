import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Admin from "./Admin";
import { Lock, Eye, EyeOff } from "lucide-react";

const ADMIN_PASSWORD = "703697";

export default function AdminProtected() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Check if already authenticated in session
  useEffect(() => {
    const isAuth = sessionStorage.getItem("adminAuthenticated");
    if (isAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError("");
      sessionStorage.setItem("adminAuthenticated", "true");
      setPassword("");
    } else {
      setError("Şifre yanlış! Lütfen tekrar deneyin.");
      setPassword("");
    }
  };

  if (isAuthenticated) {
    return <Admin />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Password Protected Screen */}
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full">
                <Lock className="h-8 w-8 text-white" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
              Admin Paneli
            </h1>
            <p className="text-center text-gray-600 mb-8">
              Erişim için şifrenizi giriniz
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şifre
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Şifrenizi giriniz..."
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Gir
              </button>
            </form>

            {/* Footer Message */}
            <p className="text-center text-xs text-gray-500 mt-8">
              Bu alan yasal olarak korunmaktadır.
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              © 2025 Oto Finans Global Admin Panel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
