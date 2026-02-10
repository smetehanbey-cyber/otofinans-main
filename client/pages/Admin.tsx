import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, LogOut, ChevronRight, ChevronDown } from "lucide-react";
import Header from "@/components/Header";
import CustomerRecords from "@/components/admin/CustomerRecords";
import ArchivedRecords from "@/components/admin/ArchivedRecords";

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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("customer-records");
  const [expandedGroup, setExpandedGroup] = useState("gelen-talep");

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
                          onClick={() => setActiveMenu(item.id)}
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
