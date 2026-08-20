import React, { useState } from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { Navbar } from './components/layout/Navbar';
import { LoginPage } from './components/auth/LoginPage';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { SuratMasukList } from './components/persuratan/SuratMasukList';
import { SuratKeluarList } from './components/persuratan/SuratKeluarList';
import { TemplateSuratGenerator } from './components/persuratan/TemplateSuratGenerator';
import { SiswaList } from './components/kesiswaan/SiswaList';
import { KeuanganDashboard } from './components/keuangan/KeuanganDashboard';
import { PegawaiList } from './components/kepegawaian/PegawaiList';
import { InventarisList } from './components/inventaris/InventarisList';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const MainContent: React.FC = () => {
  const { isAuthenticated, currentUser, canAccessModule } = useSchool();
  const [activeModule, setActiveModule] = useState<string>('dashboard');

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const hasAccess = canAccessModule(activeModule);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navbar with Multilevel Badges & Logout */}
      <Navbar activeModule={activeModule} onSelectModule={setActiveModule} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Access Restricted Warning Screen (RBAC Protection) */}
        {!hasAccess && (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center max-w-lg mx-auto shadow-sm space-y-4 my-8">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-200">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900">Akses Modul Terbatas</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Peran akun Anda saat ini sebagai <span className="font-bold text-slate-800">{currentUser.name} ({currentUser.title || currentUser.roleTitle})</span> tidak memiliki otorisasi untuk mengelola modul ini.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl text-left text-xs space-y-1 border border-slate-100">
              <span className="font-bold text-slate-700 block">Hak Akses Peran Anda:</span>
              <p className="text-slate-500 text-[11px]">{currentUser.permissionsDescription}</p>
            </div>
            <button
              onClick={() => setActiveModule('dashboard')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20 cursor-pointer inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Dashboard Utama</span>
            </button>
          </div>
        )}

        {hasAccess && (
          <>
            {activeModule === 'dashboard' && (
              <OverviewDashboard onNavigate={(mod) => setActiveModule(mod)} />
            )}

            {activeModule === 'persuratan-masuk' && (
              <SuratMasukList />
            )}

            {activeModule === 'persuratan-keluar' && (
              <SuratKeluarList />
            )}

            {activeModule === 'generator-surat' && (
              <TemplateSuratGenerator />
            )}

            {activeModule === 'kesiswaan' && (
              <SiswaList />
            )}

            {activeModule === 'keuangan' && (
              <KeuanganDashboard />
            )}

            {activeModule === 'kepegawaian' && (
              <PegawaiList />
            )}

            {activeModule === 'inventaris' && (
              <InventarisList />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-semibold text-slate-700">
            Sistem Informasi Tata Usaha (SIM-TU) SMP Negeri 1 Nusantara • Tahun Ajaran 2026/2027
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Format Standar Penomoran & Disposisi Persuratan Dinas Kemendikbudristek RI
          </p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <SchoolProvider>
      <MainContent />
    </SchoolProvider>
  );
}
