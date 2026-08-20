import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { 
  Mail, 
  Send, 
  Users, 
  Wallet, 
  Package, 
  FileText, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Activity,
  Award,
  Sparkles,
  Printer
} from 'lucide-react';

interface OverviewDashboardProps {
  onNavigate: (module: string) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ onNavigate }) => {
  const { 
    schoolProfile, 
    currentUser, 
    suratMasukList, 
    suratKeluarList, 
    siswaList, 
    pegawaiList, 
    pembayaranList, 
    transaksiKasList, 
    inventarisList,
    auditLogs 
  } = useSchool();

  // Metrics
  const pendingDisposisi = suratMasukList.filter(s => s.statusDisposisi === 'Belum Disposisi').length;
  const inProgressDisposisi = suratMasukList.filter(s => s.statusDisposisi === 'Sedang Diproses').length;
  const pendingSuratKeluar = suratKeluarList.filter(s => s.status === 'Menunggu Persetujuan').length;
  const totalSiswaAktif = siswaList.filter(s => s.status === 'Aktif').length;
  const totalGtk = pegawaiList.length;
  const totalKasMasuk = transaksiKasList.filter(t => t.tipe === 'Pemasukan').reduce((a, b) => a + b.nominal, 0);
  const totalKasKeluar = transaksiKasList.filter(t => t.tipe === 'Pengeluaran').reduce((a, b) => a + b.nominal, 0);
  const saldoKas = totalKasMasuk - totalKasKeluar;

  return (
    <div className="space-y-6">
      
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Subtle geometric background */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-blue-200 text-xs font-semibold rounded-full border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>Sistem Informasi Tata Usaha (SIM-TU) Terpadu</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Selamat Datang, {currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/80 max-w-2xl leading-relaxed">
              Anda masuk sebagai <span className="font-bold text-yellow-300">{currentUser.title}</span>. Sistem siap melayani alur persuratan digital, kesiswaan Dapodik, bendahara SPP/BOS, dan aset sekolah secara terintegrasi.
            </p>
          </div>

          {/* Quick Action Grid */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigate('persuratan-masuk')}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-700/30 transition-all transform hover:scale-[1.02] cursor-pointer flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Surat Masuk ({pendingDisposisi} Pending)
            </button>
            <button
              onClick={() => onNavigate('generator-surat')}
              className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-semibold backdrop-blur-xs border border-white/10 transition-colors cursor-pointer flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-emerald-300" />
              Generator Surat Dinas
            </button>
          </div>
        </div>
      </div>

      {/* Priority Action Alerts (Especially for Kepala Sekolah / TU) */}
      {(pendingDisposisi > 0 || pendingSuratKeluar > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <h4 className="font-bold text-amber-900">Perhatian Memerlukan Tindak Lanjut:</h4>
            <div className="flex flex-wrap gap-4 mt-1 text-amber-800">
              {pendingDisposisi > 0 && (
                <button 
                  onClick={() => onNavigate('persuratan-masuk')} 
                  className="font-medium underline hover:text-amber-950 cursor-pointer"
                >
                  • {pendingDisposisi} Surat Masuk belum diberikan lembar disposisi digital.
                </button>
              )}
              {pendingSuratKeluar > 0 && (
                <button 
                  onClick={() => onNavigate('persuratan-keluar')} 
                  className="font-medium underline hover:text-amber-950 cursor-pointer"
                >
                  • {pendingSuratKeluar} Draf Surat Keluar menunggu persetujuan / TTE Kepala Sekolah.
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Primary KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Surat Masuk */}
        <div 
          onClick={() => onNavigate('persuratan-masuk')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Surat Masuk</span>
            <div className="p-2.5 bg-blue-50 text-blue-800 rounded-xl group-hover:bg-blue-800 group-hover:text-white transition-colors">
              <Mail className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-2">{suratMasukList.length}</h3>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
            <span className="text-blue-700 font-bold">{inProgressDisposisi} aktif</span> dalam proses disposisi
          </p>
        </div>

        {/* Card 2: Siswa Dapodik */}
        <div 
          onClick={() => onNavigate('kesiswaan')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Siswa Terdaftar</span>
            <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl group-hover:bg-emerald-800 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-2">{totalSiswaAktif}</h3>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Format Dapodik 100% Valid
          </p>
        </div>

        {/* Card 3: Kepegawaian */}
        <div 
          onClick={() => onNavigate('kepegawaian')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-purple-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Guru & Tendik</span>
            <div className="p-2.5 bg-purple-50 text-purple-800 rounded-xl group-hover:bg-purple-800 group-hover:text-white transition-colors">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-2">{totalGtk} GTK</h3>
          <p className="text-[11px] text-slate-500 mt-1 font-medium text-purple-900">
            PNS, PPPK & Honorer Aktif
          </p>
        </div>

        {/* Card 4: Saldo Kas */}
        <div 
          onClick={() => onNavigate('keuangan')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-amber-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Saldo Kas Riil</span>
            <div className="p-2.5 bg-amber-50 text-amber-800 rounded-xl group-hover:bg-amber-800 group-hover:text-white transition-colors">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-xl font-black text-slate-900 mt-2 font-mono">
            Rp {saldoKas.toLocaleString('id-ID')}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            Kas BOS & Iuran Komite
          </p>
        </div>

      </div>

      {/* Two Column Layout: Left (Recent Dispositions & Operations) + Right (Audit Trail Log) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Fast Module Launchpad & Disposisi Timeline */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Module Launchpad Cards */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 mb-4 flex items-center justify-between">
              <span>Modul Layanan Administrasi Tata Usaha</span>
              <span className="text-xs text-slate-400 font-normal">Pilih modul kerja</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              
              <div 
                onClick={() => onNavigate('persuratan-masuk')}
                className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer flex items-center gap-3"
              >
                <div className="p-2.5 bg-blue-900 text-white rounded-lg">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">1. Persuratan & Disposisi</h4>
                  <p className="text-[11px] text-slate-500">Surat Masuk & Lembar Disposisi</p>
                </div>
              </div>

              <div 
                onClick={() => onNavigate('generator-surat')}
                className="p-3.5 rounded-xl border border-teal-100 bg-teal-50/50 hover:bg-teal-50 hover:border-teal-300 transition-all cursor-pointer flex items-center gap-3"
              >
                <div className="p-2.5 bg-teal-800 text-white rounded-lg">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">2. Template Surat Dinas</h4>
                  <p className="text-[11px] text-slate-500">Surat Tugas, Undangan, Suket</p>
                </div>
              </div>

              <div 
                onClick={() => onNavigate('kesiswaan')}
                className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/50 hover:bg-emerald-50 hover:border-emerald-300 transition-all cursor-pointer flex items-center gap-3"
              >
                <div className="p-2.5 bg-emerald-800 text-white rounded-lg">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">3. Kesiswaan & Kartu Pelajar</h4>
                  <p className="text-[11px] text-slate-500">Mutasi, Kartu Digital, Dapodik</p>
                </div>
              </div>

              <div 
                onClick={() => onNavigate('keuangan')}
                className="p-3.5 rounded-xl border border-amber-100 bg-amber-50/50 hover:bg-amber-50 hover:border-amber-300 transition-all cursor-pointer flex items-center gap-3"
              >
                <div className="p-2.5 bg-amber-700 text-white rounded-lg">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">4. Kasir SPP & Kas BOS</h4>
                  <p className="text-[11px] text-slate-500">Kuitansi Resmi & Buku Kas</p>
                </div>
              </div>

              <div 
                onClick={() => onNavigate('kepegawaian')}
                className="p-3.5 rounded-xl border border-purple-100 bg-purple-50/50 hover:bg-purple-50 hover:border-purple-300 transition-all cursor-pointer flex items-center gap-3"
              >
                <div className="p-2.5 bg-purple-800 text-white rounded-lg">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">5. Kepegawaian & Cuti</h4>
                  <p className="text-[11px] text-slate-500">Data GTK, JJM & Izin Cuti</p>
                </div>
              </div>

              <div 
                onClick={() => onNavigate('inventaris')}
                className="p-3.5 rounded-xl border border-cyan-100 bg-cyan-50/50 hover:bg-cyan-50 hover:border-cyan-300 transition-all cursor-pointer flex items-center gap-3"
              >
                <div className="p-2.5 bg-cyan-800 text-white rounded-lg">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">6. Sarpras & KIR Aset</h4>
                  <p className="text-[11px] text-slate-500">Label Barcode Ruangan</p>
                </div>
              </div>

            </div>
          </div>

          {/* Incoming Dispositions Active Feed */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-900">Surat Masuk Aktif Terbaru</h3>
              <button 
                onClick={() => onNavigate('persuratan-masuk')}
                className="text-xs text-blue-700 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                Lihat Semua ({suratMasukList.length}) →
              </button>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {suratMasukList.slice(0, 3).map(surat => (
                <div key={surat.id} className="py-3 flex items-start justify-between gap-4">
                  <div>
                    <span className="font-mono text-[10px] text-slate-500 block">{surat.noSuratAsal}</span>
                    <h5 className="font-bold text-slate-900 mt-0.5">{surat.pengirim}</h5>
                    <p className="text-[11px] text-slate-600 line-clamp-1">{surat.perihal}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      surat.statusDisposisi === 'Selesai' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : surat.statusDisposisi === 'Sedang Diproses' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {surat.statusDisposisi}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1">{surat.tanggalTerima}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Realtime Audit Trail Activity Log */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-700" />
              <h3 className="font-bold text-sm text-slate-900">Buku Catatan Aktivitas TU (Audit Trail)</h3>
            </div>
            <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
              Real-time
            </span>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            Semua aktivitas disposisi, persuratan, transaksi kas, dan mutasi tercatat otomatis demi akuntabilitas sekolah.
          </p>

          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {auditLogs.map(log => (
              <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{log.userNama}</span>
                  <span className="font-mono text-[10px] text-slate-400">{log.timestamp}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-900 rounded-sm font-semibold text-[9px]">
                    {log.module}
                  </span>
                  <span className="font-medium text-slate-700 text-[11px]">{log.action}</span>
                </div>
                <p className="text-[11px] text-slate-500 italic">{log.details}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
