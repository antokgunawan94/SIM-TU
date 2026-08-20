import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { 
  Building2, 
  Mail, 
  Send, 
  FileText, 
  Users, 
  Wallet, 
  Award, 
  Package, 
  Home, 
  UserCheck, 
  ChevronDown,
  Layers,
  Sparkles,
  LogOut,
  ShieldCheck,
  Lock
} from 'lucide-react';

interface NavbarProps {
  activeModule: string;
  onSelectModule: (mod: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeModule, onSelectModule }) => {
  const { 
    schoolProfile, 
    currentUser, 
    switchUserRole, 
    userOptions, 
    suratMasukList, 
    suratKeluarList, 
    logout,
    canAccessModule 
  } = useSchool();

  const pendingMasuk = suratMasukList.filter(s => s.statusDisposisi === 'Belum Disposisi').length;
  const pendingKeluar = suratKeluarList.filter(s => s.status === 'Menunggu Persetujuan').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Utama', icon: Home },
    { id: 'persuratan-masuk', label: 'Surat Masuk & Disposisi', icon: Mail, badge: pendingMasuk > 0 ? pendingMasuk : null },
    { id: 'persuratan-keluar', label: 'Surat Keluar & Pengesahan', icon: Send, badge: pendingKeluar > 0 ? pendingKeluar : null },
    { id: 'generator-surat', label: 'Template Surat Dinas', icon: FileText },
    { id: 'kesiswaan', label: 'Kesiswaan & Dapodik', icon: Users },
    { id: 'keuangan', label: 'Kasir SPP & Kas BOS', icon: Wallet },
    { id: 'kepegawaian', label: 'Kepegawaian & GTK', icon: Award },
    { id: 'inventaris', label: 'Sarpras & KIR Aset', icon: Package }
  ];

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-lg">
      
      {/* Top Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & School Name */}
          <div 
            onClick={() => onSelectModule('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center text-white font-black text-sm shadow-md group-hover:bg-blue-600 transition-colors">
              TU
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-wide text-white group-hover:text-blue-300 transition-colors">
                  {schoolProfile.namaSekolah}
                </span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 font-mono px-1.5 py-0.2 rounded-sm border border-blue-400/20">
                  SIM-TU
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Sistem Tata Usaha Terintegrasi • NPSN: {schoolProfile.npsn}
              </p>
            </div>
          </div>

          {/* User Role Switcher Dropdown & Logout Button */}
          <div className="flex items-center gap-3">
            
            {/* User Level Badge & Info */}
            <div className="hidden md:flex items-center gap-2.5 bg-slate-800/80 pl-2 pr-3 py-1.5 rounded-xl border border-slate-700/80">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover border border-slate-600"
              />
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-200 line-clamp-1">{currentUser.name}</span>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-md">
                    L{currentUser.level || 1}
                  </span>
                </div>
                <span className="text-[10px] text-blue-300 font-semibold">{currentUser.title || currentUser.roleTitle}</span>
              </div>
            </div>

            {/* Quick Switch Dropdown */}
            <div className="relative">
              <select
                value={currentUser.id}
                onChange={(e) => switchUserRole(e.target.value)}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2 px-3 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                title="Ganti Peran Akun Multilevel"
              >
                {userOptions.map((user) => (
                  <option key={user.id} value={user.id}>
                    [Level {user.level || 1}] {user.name} ({user.title})
                  </option>
                ))}
              </select>
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={logout}
              className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-red-200 border border-red-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              title="Keluar / Ganti Akun Login"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              <span className="hidden sm:inline">Keluar</span>
            </button>

          </div>

        </div>
      </div>

      {/* Sub-Navigation Bar (Horizontal Module Tabs with RBAC indicator) */}
      <div className="bg-slate-950/80 border-t border-slate-800/80 backdrop-blur-xs overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 py-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              const hasAccess = canAccessModule(item.id);

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectModule(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-700 text-white shadow-md shadow-blue-700/30'
                      : hasAccess
                      ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      : 'text-slate-500 hover:bg-slate-900/60 hover:text-slate-400 opacity-75'
                  }`}
                  title={!hasAccess ? `Peran ${currentUser.roleTitle} memiliki akses terbatas pada modul ini` : item.label}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : hasAccess ? 'text-slate-400' : 'text-slate-600'}`} />
                  <span>{item.label}</span>
                  {!hasAccess && (
                    <Lock className="w-2.5 h-2.5 text-slate-500 ml-0.5" />
                  )}
                  {item.badge && (
                    <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 font-black text-[10px] rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

    </header>
  );
};
