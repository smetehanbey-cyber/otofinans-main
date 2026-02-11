import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, LogOut, ChevronRight, ChevronDown, Smartphone } from "lucide-react";
import Header from "@/components/Header";
import CustomerRecords from "@/components/admin/CustomerRecords";
import ArchivedRecords from "@/components/admin/ArchivedRecords";
import { supabase } from "@/lib/supabase";

// Yetkili Bayiler (Authorized Dealers) Component
function AuthorizedDealers() {
  return (
    <div className="p-6 space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">Yetkili Bayiler Yönetimi</h2>
        <p className="text-blue-700">Yetkili bayi kaydı ve yönetim sistemi</p>
      </div>
      <div className="text-gray-500 text-center py-12">
        <p>Yetkili bayiler bölümü yakında aktif olacaktır</p>
      </div>
    </div>
  );
}

// Kredi Sorgula (Credit Query) Component
function CreditQuery() {
  return (
    <div className="p-6 space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-purple-900 mb-2">Kredi Sorgula</h2>
        <p className="text-purple-700">Müşteri kredi sorgulama ve kontrol sistemi</p>
      </div>
      <div className="text-gray-500 text-center py-12">
        <p>Kredi sorgula sistemi yakında aktif olacaktır</p>
      </div>
    </div>
  );
}

// Taşıt Stok (Vehicle Stock) Component
function VehicleStock() {
  return (
    <div className="p-6 space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-green-900 mb-2">Taşıt Stok</h2>
        <p className="text-green-700">Araç envanteri ve stok yönetim sistemi</p>
      </div>
      <div className="text-gray-500 text-center py-12">
        <p>Taşıt stok yönetim sistemi yakında aktif olacaktır</p>
      </div>
    </div>
  );
}

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<{ id: number; name: string; pin: string; is_admin: boolean } | null>(null);
  const [pin, setPin] = useState("");
  const [loginError, setLoginError] = useState("");
  const [shakeError, setShakeError] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("customer-records");
  const [expandedGroup, setExpandedGroup] = useState("gelen-talep");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLandscape, setIsLandscape] = useState(window.innerHeight < window.innerWidth);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsLandscape(window.innerHeight < window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!pin.trim()) {
      setLoginError("PIN giriniz");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("authorized_persons")
        .select("id, name, pin, is_admin")
        .eq("pin", pin)
        .single();

      if (error || !data) {
        setLoginError("Parolayı yanlış girdiniz!");
        setShakeError(true);
        setPin("");
        setTimeout(() => setShakeError(false), 600);
        return;
      }

      setLoggedInUser(data as any);
      setIsLoggedIn(true);
      setPin("");
    } catch (error) {
      setLoginError("Giriş başarısız");
      setPin("");
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoggedInUser(null);
    setPin("");
    setLoginError("");
  };

  const menuGroups = [
    {
      id: "gelen-talep",
      label: "Gelen Talep",
      icon: "📋",
      items: [
        {
          id: "customer-records",
          label: "Gelen Talep",
          component: CustomerRecords
        },
        {
          id: "archived-records",
          label: "Arşive Bak",
          icon: "🗂️",
          component: ArchivedRecords
        }
      ]
    },
    {
      id: "yetkili-bayiler",
      label: "Yetkili Bayiler",
      icon: "🏢",
      items: [
        {
          id: "dealers",
          label: "Yetkili Bayiler",
          component: AuthorizedDealers
        }
      ]
    },
    {
      id: "kredi-sorgula",
      label: "Kredi Sorgula",
      icon: "🔍",
      items: [
        {
          id: "credit-query",
          label: "Kredi Sorgula",
          component: CreditQuery
        }
      ]
    },
    {
      id: "tasit-stok",
      label: "Taşıt Stok",
      icon: "🚗",
      items: [
        {
          id: "vehicle-stock",
          label: "Taşıt Stok",
          component: VehicleStock
        }
      ]
    }
  ];

  // Flatten menu items to find active component
  const allMenuItems = menuGroups.flatMap(group => group.items);
  const activeMenuItem = allMenuItems.find(item => item.id === activeMenu);
  let ActiveComponent = activeMenuItem?.component || CustomerRecords;

  // Wrap CustomerRecords to pass loggedInUser
  if (activeMenuItem?.id === "customer-records") {
    ActiveComponent = () => <CustomerRecords loggedInUser={loggedInUser} />;
  } else if (activeMenuItem?.id === "archived-records") {
    ActiveComponent = () => <ArchivedRecords />;
  }

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center p-4" style={{ colorScheme: 'light' }}>
        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
            20%, 40%, 60%, 80% { transform: translateX(10px); }
          }
          .shake-animation {
            animation: shake 0.6s ease-in-out;
          }
          /* Force white backgrounds on Android */
          .login-card {
            background-color: #ffffff !important;
          }
          .login-card input,
          .login-card label,
          .login-card button {
            color-scheme: light;
          }
        `}</style>

        {/* Mobile Landscape Warning */}
        {isMobile && !isLandscape && (
          <div className="fixed top-4 left-4 right-4 bg-yellow-400 text-yellow-900 p-3 rounded-lg shadow-lg flex items-center gap-2 z-50">
            <Smartphone className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm font-semibold">Cihazı yatay çevirerek daha iyi görüntü elde edebilirsiniz</span>
          </div>
        )}

        <div className={`w-full max-w-md ${shakeError ? 'shake-animation' : ''}`}>
          <div className="login-card rounded-lg shadow-2xl p-8" style={{ backgroundColor: '#ffffff' }}>
            {/* Logo and Title */}
            <div className="text-center mb-8">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F4ab72f175d0542049f90dff7a3b5c790?format=webp&width=800&height=1200"
                alt="Oto Finans Global"
                className="h-12 w-auto mx-auto mb-4"
              />
              <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
              <p className="text-gray-600 text-sm mt-2">Yetkili Girişi</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PIN
                </label>
                <input
                  type="password"
                  placeholder="PIN giriniz"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  style={{ backgroundColor: '#ffffff', color: '#000000', colorScheme: 'light' }}
                  maxLength="6"
                  autoFocus
                />
              </div>

              {/* Error Message */}
              {loginError && (
                <div className="p-3 rounded-lg border border-red-200" style={{ backgroundColor: '#fef2f2' }}>
                  <p className="text-sm text-red-700">{loginError}</p>
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
              >
                Giriş Yap
              </button>
            </form>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />

      {/* Mobile Landscape Warning */}
      {isMobile && !isLandscape && (
        <div className="bg-yellow-400 text-yellow-900 p-3 text-center text-sm font-semibold flex items-center justify-center gap-2">
          <Smartphone className="h-5 w-5" />
          Cihazı yatay çevirerek daha iyi görüntü elde edebilirsiniz
        </div>
      )}

      <div className={`flex flex-1 overflow-hidden ${isMobile ? "h-auto" : "h-[calc(100vh-200px)]"}`}>
        {/* Sidebar */}
        <div
          className={`bg-white shadow-lg transition-all duration-300 ${
            sidebarOpen ? (isMobile ? "w-full fixed inset-0 top-[var(--header-height)]" : "w-64") : (isMobile ? "w-0" : "w-20")
          } flex flex-col border-r border-gray-200 ${isMobile && sidebarOpen ? "z-40" : ""}`}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            {sidebarOpen && (
              <h3 className="text-lg font-bold text-gray-800">Admin Panel</h3>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-2">
            {menuGroups.map((group) => {
              const isExpanded = expandedGroup === group.id;
              const hasActiveItem = group.items.some(item => item.id === activeMenu);

              return (
                <div key={group.id}>
                  {/* Group Header */}
                  <button
                    onClick={() => setExpandedGroup(isExpanded ? "" : group.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative ${
                      hasActiveItem
                        ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-l-4 hover:border-blue-600"
                    }`}
                  >
                    <span className="text-xl">{group.icon}</span>
                    {sidebarOpen && (
                      <>
                        <span className="flex-1 text-left font-medium">
                          {group.label}
                        </span>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </>
                    )}
                  </button>

                  {/* Sub Items */}
                  {isExpanded && sidebarOpen && (
                    <div className="ml-6 mt-1 space-y-1 border-l-2 border-gray-200 pl-4">
                      {group.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveMenu(item.id);
                            if (isMobile) setSidebarOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-all ${
                            activeMenu === item.id
                              ? "bg-blue-100 text-blue-700 font-medium"
                              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                          }`}
                        >
                          {item.icon && <span>{item.icon}</span>}
                          <span className="text-left">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 mb-3">
              {sidebarOpen && (
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{loggedInUser?.name}</p>
                  <p className="text-xs text-gray-500">{loggedInUser?.pin}</p>
                  <p className={`text-xs font-semibold mt-1 ${loggedInUser?.is_admin ? 'text-green-700' : 'text-blue-700'}`}>
                    {loggedInUser?.is_admin ? '👑 Admin' : '👤 Yetkili'}
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all"
            >
              <LogOut className="h-5 w-5" />
              {sidebarOpen && <span className="font-medium">Çıkış</span>}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex-1 overflow-auto flex flex-col ${isMobile && sidebarOpen ? "hidden" : ""}`}>
          <div className={`${isMobile ? "p-3 sm:p-4" : "p-6"} flex-1 flex flex-col`}>
            {/* Page Header */}
            <div className="mb-4 sm:mb-6">
              <h1 className={`font-bold text-gray-800 ${isMobile ? "text-xl" : "text-3xl"}`}>
                {activeMenuItem?.label}
              </h1>
              <p className="text-gray-600 mt-1 text-sm">
                Müşteri talep ve kayıtlarını yönetin
              </p>
            </div>

            {/* Content */}
            <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
              <div className="flex-1 overflow-auto">
                <ActiveComponent />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
