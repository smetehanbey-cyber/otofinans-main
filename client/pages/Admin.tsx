import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, LogOut, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import CustomerRecords from "@/components/admin/CustomerRecords";

export default function Admin() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("customer-records");

  const menuItems = [
    {
      id: "customer-records",
      label: "Gelen Talep",
      icon: "📋",
      component: CustomerRecords
    },
    // İleride eklenecek menüler
    // {
    //   id: "reports",
    //   label: "Raporlar",
    //   icon: "📊",
    // },
    // {
    //   id: "settings",
    //   label: "Ayarlar",
    //   icon: "⚙️",
    // }
  ];

  const activeMenuItem = menuItems.find(item => item.id === activeMenu);
  const ActiveComponent = activeMenuItem?.component || CustomerRecords;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="flex h-[calc(100vh-200px)]">
        {/* Sidebar */}
        <div
          className={`bg-white shadow-lg transition-all duration-300 ${
            sidebarOpen ? "w-64" : "w-20"
          } flex flex-col border-r border-gray-200`}
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
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeMenu === item.id
                    ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left font-medium">
                      {item.label}
                    </span>
                    {activeMenu === item.id && (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </>
                )}
              </button>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200">
            <Link
              to="/"
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-all"
            >
              <LogOut className="h-5 w-5" />
              {sidebarOpen && <span className="font-medium">Çıkış</span>}
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800">
                {activeMenuItem?.label}
              </h1>
              <p className="text-gray-600 mt-1">
                Müşteri talep ve kayıtlarını yönetin
              </p>
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <ActiveComponent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
