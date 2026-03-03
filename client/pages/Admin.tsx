import { useState, useEffect } from "react";
import { LogOut, Smartphone } from "lucide-react";
import Header from "@/components/Header";
import CustomerRecords from "@/components/admin/CustomerRecords";
import ArchivedRecords from "@/components/admin/ArchivedRecords";
import DailyOperationLog from "@/components/admin/DailyOperationLog";
import { supabase } from "@/lib/supabase";

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<{ id: number; name: string; pin: string; is_admin: boolean } | null>(null);
  const [pin, setPin] = useState("");
  const [loginError, setLoginError] = useState("");
  const [shakeError, setShakeError] = useState(false);
  const [activeMenu, setActiveMenu] = useState("customer-records"); // Default to customer records within Müşteri Takip group
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


  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!pin.trim()) {
      setLoginError("PIN giriniz");
      return;
    }

    if (pin.length < 6) {
      setLoginError("PIN 6 haneli olmalıdır");
      return;
    }

    try {
      console.log("Logging in with PIN:", pin);

      const { data, error } = await supabase
        .from("authorized_persons")
        .select("id, name, pin, is_admin")
        .eq("pin", pin)
        .single();

      console.log("Query result - Data:", data, "Error:", error);

      if (error) {
        console.error("Supabase error:", error);
        setLoginError("Parolayı yanlış girdiniz!");
        setShakeError(true);
        setPin("");
        setTimeout(() => setShakeError(false), 600);
        return;
      }

      if (!data) {
        setLoginError("Parolayı yanlış girdiniz!");
        setShakeError(true);
        setPin("");
        setTimeout(() => setShakeError(false), 600);
        return;
      }

      console.log("Login successful:", data);
      setLoggedInUser(data as any);
      setIsLoggedIn(true);
      setPin("");
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Giriş başarısız. Lütfen tekrar deneyiniz.");
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
      id: "musteri-takip",
      label: "Müşteri Takip",
      icon: "📋",
      items: [
        {
          id: "customer-records",
          label: "Müşteri Takip",
          component: CustomerRecords
        },
        {
          id: "archived-records",
          label: "Arşive Bak",
          icon: "🗂️",
          component: ArchivedRecords
        },
        {
          id: "operasyon-rapor",
          label: "Operasyon",
          icon: "📊",
          component: () => <DailyOperationLog loggedInUser={loggedInUser} />
        }
      ]
    }
  ];

  // Flatten menu items to find active component
  const allMenuItems = menuGroups.flatMap(group => group.items);
  const activeMenuItem = allMenuItems.find(item => item.id === activeMenu);
  let ActiveComponent = activeMenuItem?.component || CustomerRecords;

  // Wrap components to pass loggedInUser where needed
  if (activeMenuItem?.id === "customer-records") {
    ActiveComponent = () => <CustomerRecords loggedInUser={loggedInUser} />;
  } else if (activeMenuItem?.id === "archived-records") {
    ActiveComponent = () => <ArchivedRecords />;
  } else if (activeMenuItem?.id === "operasyon-rapor") {
    ActiveComponent = () => <DailyOperationLog loggedInUser={loggedInUser} />;
  }

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', colorScheme: 'light', color: '#000000' }}>
        <style>{`
          * {
            background-color: #ffffff !important;
            color-scheme: light !important;
          }
          html, body {
            background-color: #ffffff !important;
            color-scheme: light !important;
            color: #000000 !important;
          }
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
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(0, 0, 0, 0.05) !important;
          }
          .login-card input,
          .login-card label,
          .login-card button {
            color-scheme: light;
          }
          /* Input styling fix for Android */
          .login-card input[type="text"] {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            background-color: #ffffff !important;
            color: #000000 !important;
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
          <div className="login-card rounded-lg p-8" style={{ backgroundColor: '#ffffff' }}>
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
                  inputMode="numeric"
                  placeholder=""
                  value={pin}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setPin(value.slice(0, 6));
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  style={{
                    backgroundColor: '#ffffff',
                    color: '#0f367e',
                    colorScheme: 'light',
                    WebkitAppearance: 'none',
                    appearance: 'none',
                    letterSpacing: '14px',
                    fontFamily: '"Courier New", monospace',
                    fontSize: '36px',
                    textAlign: 'center',
                    fontWeight: 'bold'
                  }}
                  maxLength="6"
                  autoFocus
                  autoComplete="off"
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
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#ffffff', colorScheme: 'light' }}>
      <Header />

      {/* Mobile Landscape Warning */}
      {isMobile && !isLandscape && (
        <div className="bg-yellow-400 text-yellow-900 p-3 text-center text-sm font-semibold flex items-center justify-center gap-2">
          <Smartphone className="h-5 w-5" />
          Cihazı yatay çevirerek daha iyi görüntü elde edebilirsiniz
        </div>
      )}

      {/* Main Content - with padding for bottom nav */}
      <div className="flex-1 overflow-auto flex flex-col pb-20">
        <div className={`${isMobile ? "p-3 sm:p-4" : "p-6"} flex-1 flex flex-col mx-auto w-full max-w-7xl`}>
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

      {/* Bottom Navigation Bar - Fixed */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg" style={{ backgroundColor: '#ffffff' }}>
        <div className="flex items-center justify-between h-20 px-4 max-w-7xl mx-auto w-full">
          {/* Menu Items */}
          <div className="flex items-center gap-2 flex-1">
            {menuGroups[0]?.items.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all flex-1 sm:flex-none"
                style={{
                  backgroundColor: activeMenu === item.id ? '#eff6ff' : '#ffffff',
                  color: activeMenu === item.id ? '#2563eb' : '#374151',
                  borderBottom: activeMenu === item.id ? '3px solid #2563eb' : 'none',
                }}
                title={item.label}
              >
                <span className="text-xl">{item.icon}</span>
                <span className={`font-medium text-sm ${isMobile ? 'hidden sm:inline' : 'inline'}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          {/* User Info and Logout */}
          <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
            <div className={`flex flex-col items-end ${isMobile ? 'hidden sm:flex' : 'flex'}`}>
              <p className="text-sm font-medium text-gray-800">{loggedInUser?.name}</p>
              <p className={`text-xs font-semibold ${loggedInUser?.is_admin ? 'text-green-700' : 'text-blue-700'}`}>
                {loggedInUser?.is_admin ? '👑 Admin' : '👤 Yetkili'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg transition-all"
              style={{ color: '#374151', backgroundColor: '#ffffff' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fef2f2';
                e.currentTarget.style.color = '#b91c1c';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.color = '#374151';
              }}
              title="Çıkış"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
