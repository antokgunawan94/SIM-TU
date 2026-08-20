import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { PembayaranSPP, TransaksiKas } from '../../types';
import { OfficialKopHeader } from '../common/OfficialKopHeader';
import { 
  Wallet, 
  Search, 
  Plus, 
  Printer, 
  FileSpreadsheet, 
  ArrowUpRight, 
  ArrowDownRight, 
  CreditCard, 
  DollarSign, 
  CheckCircle2, 
  Receipt, 
  X,
  Building,
  QrCode
} from 'lucide-react';

export const KeuanganDashboard: React.FC = () => {
  const { 
    pembayaranList, 
    transaksiKasList, 
    addPembayaranSPP, 
    addTransaksiKas, 
    siswaList, 
    currentUser,
    schoolProfile 
  } = useSchool();

  const [activeTab, setActiveTab] = useState<'pembayaran' | 'kas'>('pembayaran');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBulan, setFilterBulan] = useState('all');

  // Modals
  const [showBayarModal, setShowBayarModal] = useState(false);
  const [showKasModal, setShowKasModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<PembayaranSPP | null>(null);

  // Stats calculation
  const totalPemasukan = transaksiKasList.filter(t => t.tipe === 'Pemasukan').reduce((acc, c) => acc + c.nominal, 0);
  const totalPengeluaran = transaksiKasList.filter(t => t.tipe === 'Pengeluaran').reduce((acc, c) => acc + c.nominal, 0);
  const saldoAkhir = transaksiKasList[transaksiKasList.length - 1]?.saldoAkhir || (totalPemasukan - totalPengeluaran);
  const totalSPPBulanIni = pembayaranList.reduce((acc, c) => acc + c.nominal, 0);

  const filteredPembayaran = pembayaranList.filter(p => {
    const matchSearch = 
      p.namaSiswa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.kelas.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.noKuitansi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchBulan = filterBulan === 'all' || p.bulan.includes(filterBulan);
    return matchSearch && matchBulan;
  });

  const handleExportCSV = () => {
    if (activeTab === 'pembayaran') {
      const headers = ['No Kuitansi', 'Nama Siswa', 'Kelas', 'Bulan', 'Pos Pembayaran', 'Nominal', 'Tgl Bayar', 'Metode', 'Petugas TU'];
      const rows = filteredPembayaran.map(p => [
        `"${p.noKuitansi}"`,
        `"${p.namaSiswa}"`,
        `"${p.kelas}"`,
        `"${p.bulan}"`,
        `"${p.posBayar}"`,
        p.nominal,
        `"${p.tanggalBayar}"`,
        `"${p.metodePembayaran}"`,
        `"${p.penerimaStaf}"`
      ]);
      const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const uri = encodeURI(csv);
      const link = document.createElement('a');
      link.setAttribute('href', uri);
      link.setAttribute('download', `Rekap_Pembayaran_SPP_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const headers = ['Tanggal', 'Tipe', 'Kategori', 'Uraian Transaksi', 'Nominal (Rp)', 'Saldo Akhir (Rp)', 'Penanggung Jawab'];
      const rows = transaksiKasList.map(t => [
        `"${t.tanggal}"`,
        `"${t.tipe}"`,
        `"${t.kategori}"`,
        `"${t.deskripsi.replace(/"/g, '""')}"`,
        t.nominal,
        t.saldoAkhir,
        `"${t.penanggungJawab}"`
      ]);
      const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const uri = encodeURI(csv);
      const link = document.createElement('a');
      link.setAttribute('href', uri);
      link.setAttribute('download', `Buku_Kas_Umum_TU_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-amber-500/30 text-amber-200 text-xs font-semibold rounded-md border border-amber-400/20">
              Modul Administrasi Keuangan
            </span>
            <span className="text-xs text-amber-200/80">Tata Usaha SMP</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Kasir SPP, Iuran Komite & Buku Kas Pembantu
          </h1>
          <p className="text-xs text-amber-100/80 mt-1 max-w-2xl leading-relaxed">
            Pencatatan setoran siswa, generator kuitansi resmi, rekonsiliasi kas BOS & komite sekolah, dan integrasi metode pembayaran multi-channel.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-xs border border-white/10 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
            Ekspor Laporan
          </button>
          <button
            onClick={() => setShowBayarModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-all transform hover:scale-[1.02] cursor-pointer"
          >
            <Receipt className="w-4 h-4 text-slate-950" />
            + Bayar SPP di Kasir
          </button>
          <button
            onClick={() => setShowKasModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            + Catat Kas Masuk/Keluar
          </button>
        </div>
      </div>

      {/* Metric Cards Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Kas Masuk (YTD)</p>
            <h3 className="text-xl font-extrabold text-emerald-700 mt-1">
              Rp {totalPemasukan.toLocaleString('id-ID')}
            </h3>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Termasuk BOS & Setoran Komite</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
            <ArrowDownRight className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Pengeluaran Kas</p>
            <h3 className="text-xl font-extrabold text-rose-700 mt-1">
              Rp {totalPengeluaran.toLocaleString('id-ID')}
            </h3>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Belanja ATK, Internet & Sarpras</span>
          </div>
          <div className="p-3 bg-rose-50 text-rose-700 rounded-xl">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-xs flex items-center justify-between bg-blue-50/20">
          <div>
            <p className="text-xs text-blue-900 font-semibold uppercase tracking-wider">Saldo Kas Riil TU</p>
            <h3 className="text-xl font-black text-blue-950 mt-1">
              Rp {saldoAkhir.toLocaleString('id-ID')}
            </h3>
            <span className="text-[11px] text-blue-700 font-medium mt-0.5 block">Status: Kas Siap Operasional</span>
          </div>
          <div className="p-3 bg-blue-900 text-white rounded-xl shadow-sm">
            <Wallet className="w-6 h-6 text-yellow-300" />
          </div>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('pembayaran')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'pembayaran'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            📋 Riwayat Pembayaran SPP & Iuran Siswa ({pembayaranList.length})
          </button>
          <button
            onClick={() => setActiveTab('kas')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'kas'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            📊 Buku Kas Pembantu Umum ({transaksiKasList.length})
          </button>
        </div>

        {activeTab === 'pembayaran' && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari Siswa / No Kuitansi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-slate-50"
              />
            </div>
            <select
              value={filterBulan}
              onChange={(e) => setFilterBulan(e.target.value)}
              className="text-xs px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-slate-700"
            >
              <option value="all">Semua Bulan</option>
              <option value="Agustus">Agustus 2026</option>
              <option value="Juli">Juli 2026</option>
            </select>
          </div>
        )}
      </div>

      {/* TAB 1: PEMBAYARAN SPP TABLE */}
      {activeTab === 'pembayaran' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 uppercase tracking-wider font-semibold text-[11px]">
                <tr>
                  <th className="py-3 px-4">No. Kuitansi</th>
                  <th className="py-3 px-4">Nama Siswa & Kelas</th>
                  <th className="py-3 px-4">Pos Iuran / Bulan</th>
                  <th className="py-3 px-4">Nominal</th>
                  <th className="py-3 px-4">Tgl & Metode</th>
                  <th className="py-3 px-4 text-center">Cetak Kuitansi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPembayaran.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <Receipt className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                      <p className="font-medium text-slate-600">Belum ada transaksi pembayaran sesuai filter.</p>
                    </td>
                  </tr>
                ) : (
                  filteredPembayaran.map((pembayaran) => (
                    <tr key={pembayaran.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-900">
                        {pembayaran.noKuitansi}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">{pembayaran.namaSiswa}</span>
                        <span className="text-[11px] text-slate-500 font-medium">Kelas {pembayaran.kelas}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800 block">{pembayaran.posBayar}</span>
                        <span className="text-[10px] text-slate-500">{pembayaran.bulan}</span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-800 font-mono text-sm">
                        Rp {pembayaran.nominal.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-slate-800 font-medium block">{pembayaran.tanggalBayar}</span>
                        <span className="inline-block mt-0.5 text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-sm font-semibold">
                          {pembayaran.metodePembayaran}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setSelectedReceipt(pembayaran)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          Kuitansi
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: BUKU KAS PEMBANTU */}
      {activeTab === 'kas' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 uppercase tracking-wider font-semibold text-[11px]">
                <tr>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Tipe</th>
                  <th className="py-3 px-4">Kategori & Uraian</th>
                  <th className="py-3 px-4 text-right">Debet / Masuk</th>
                  <th className="py-3 px-4 text-right">Kredit / Keluar</th>
                  <th className="py-3 px-4 text-right">Saldo Kas</th>
                  <th className="py-3 px-4">PJ Staf</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {transaksiKasList.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-sans text-slate-700">{t.tanggal}</td>
                    <td className="py-3 px-4 font-sans">
                      <span className={`inline-block px-2 py-0.5 rounded-sm text-[10px] font-bold ${
                        t.tipe === 'Pemasukan' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {t.tipe}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-sans max-w-sm">
                      <span className="font-bold text-slate-900 block text-xs">{t.kategori}</span>
                      <span className="text-[11px] text-slate-500 block">{t.deskripsi}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-700">
                      {t.tipe === 'Pemasukan' ? `Rp ${t.nominal.toLocaleString('id-ID')}` : '-'}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-rose-700">
                      {t.tipe === 'Pengeluaran' ? `Rp ${t.nominal.toLocaleString('id-ID')}` : '-'}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-blue-950">
                      Rp {t.saldoAkhir.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 font-sans text-[11px] text-slate-600">
                      {t.penanggungJawab}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Bayar SPP Kasir */}
      {showBayarModal && (
        <KasirBayarModal onClose={() => setShowBayarModal(false)} />
      )}

      {/* Modal Input Kas */}
      {showKasModal && (
        <KasInputModal onClose={() => setShowKasModal(false)} />
      )}

      {/* Modal Print Kuitansi */}
      {selectedReceipt && (
        <KuitansiPrintModal
          pembayaran={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}

    </div>
  );
};

// Sub-component for cashier payment
const KasirBayarModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { addPembayaranSPP, siswaList } = useSchool();

  const [siswaId, setSiswaId] = useState(siswaList[0]?.id || '');
  const [posBayar, setPosBayar] = useState<PembayaranSPP['posBayar']>('SPP / Iuran Rutin');
  const [bulan, setBulan] = useState('Agustus 2026');
  const [nominal, setNominal] = useState(150000);
  const [metodePembayaran, setMetodePembayaran] = useState<PembayaranSPP['metodePembayaran']>('Tunai di Kasir TU');
  const [tanggalBayar, setTanggalBayar] = useState(new Date().toISOString().slice(0, 10));

  const selectedSiswa = siswaList.find(s => s.id === siswaId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSiswa) {
      alert('Pilih siswa yang membayar.');
      return;
    }

    addPembayaranSPP({
      siswaId: selectedSiswa.id,
      namaSiswa: selectedSiswa.nama,
      kelas: selectedSiswa.kelas,
      bulan,
      posBayar,
      nominal: Number(nominal),
      tanggalBayar,
      metodePembayaran
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 text-xs">
        <div className="bg-amber-950 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-base">Loket Kasir Pembayaran SPP / Iuran TU</h3>
              <p className="text-xs text-amber-200">Kuitansi resmi akan di-generate otomatis</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block font-bold text-slate-700 mb-1">Pilih Siswa Penyetor *</label>
            <select
              value={siswaId}
              onChange={(e) => setSiswaId(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-semibold text-slate-900"
            >
              {siswaList.map(s => (
                <option key={s.id} value={s.id}>{s.nama} ({s.kelas} - NISN: {s.nisn})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Pos Pembayaran *</label>
              <select
                value={posBayar}
                onChange={(e) => setPosBayar(e.target.value as any)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
              >
                <option value="SPP / Iuran Rutin">SPP / Iuran Rutin</option>
                <option value="Komite Sekolah">Komite Sekolah</option>
                <option value="Uang Seragam & Atribut">Uang Seragam & Atribut</option>
                <option value="DSP / Gedung">DSP / Gedung</option>
                <option value="Kegiatan Ekstrakurikuler">Kegiatan Ekstrakurikuler</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Periode Bulan *</label>
              <select
                value={bulan}
                onChange={(e) => setBulan(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
              >
                <option value="Juli 2026">Juli 2026</option>
                <option value="Agustus 2026">Agustus 2026</option>
                <option value="September 2026">September 2026</option>
                <option value="Oktober 2026">Oktober 2026</option>
                <option value="November 2026">November 2026</option>
                <option value="Desember 2026">Desember 2026</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nominal Pembayaran (Rp) *</label>
              <input
                type="number"
                required
                value={nominal}
                onChange={(e) => setNominal(Number(e.target.value))}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-mono font-bold text-emerald-800 text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Metode Pembayaran</label>
              <select
                value={metodePembayaran}
                onChange={(e) => setMetodePembayaran(e.target.value as any)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-semibold"
              >
                <option value="Tunai di Kasir TU">Tunai di Kasir TU</option>
                <option value="QRIS">QRIS / E-Wallet</option>
                <option value="Transfer Bank">Transfer Bank (BJB / BRI)</option>
                <option value="Virtual Account">Virtual Account</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Tanggal Transaksi</label>
            <input
              type="date"
              value={tanggalBayar}
              onChange={(e) => setTanggalBayar(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold rounded-xl hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
            >
              Terima & Cetak Bukti Bayar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

// Sub-component for generic cash ledger entry
const KasInputModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { addTransaksiKas, currentUser } = useSchool();

  const [tipe, setTipe] = useState<'Pemasukan' | 'Pengeluaran'>('Pengeluaran');
  const [kategori, setKategori] = useState('Belanja Operasional & ATK');
  const [deskripsi, setDeskripsi] = useState('');
  const [nominal, setNominal] = useState(500000);
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deskripsi) {
      alert('Mohon isi uraian transaksi kas.');
      return;
    }

    addTransaksiKas({
      tanggal,
      tipe,
      kategori,
      deskripsi,
      nominal: Number(nominal),
      penanggungJawab: currentUser.name
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto text-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <h3 className="font-bold text-base">Catat Transaksi Buku Kas Pembantu</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tipe Transaksi *</label>
              <select
                value={tipe}
                onChange={(e) => setTipe(e.target.value as any)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-bold"
              >
                <option value="Pengeluaran">Pengeluaran (Kredit)</option>
                <option value="Pemasukan">Pemasukan (Debet)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kategori Anggaran</label>
              <input
                type="text"
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Uraian / Keterangan Transaksi *</label>
            <textarea
              rows={2}
              required
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Contoh: Pembelian 10 Rim Kertas HVS untuk Ujian Semester..."
              className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nominal (Rp) *</label>
              <input
                type="number"
                required
                value={nominal}
                onChange={(e) => setNominal(Number(e.target.value))}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-mono font-bold text-sm"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tanggal</label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold rounded-xl hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-800 hover:bg-blue-900 text-white font-bold rounded-xl shadow-md cursor-pointer"
            >
              Simpan ke Buku Kas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Sub-component for printable official receipt
const KuitansiPrintModal: React.FC<{ pembayaran: PembayaranSPP; onClose: () => void }> = ({ pembayaran, onClose }) => {
  const { schoolProfile } = useSchool();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 print:shadow-none print:border-none">
        
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-slate-50 print:hidden">
          <h3 className="font-bold text-gray-800 text-sm">Cetak Bukti Pembayaran (Kuitansi Resmi)</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Cetak Kuitansi
            </button>
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700">✕</button>
          </div>
        </div>

        {/* Printable Paper Area */}
        <div className="p-8 text-gray-900 font-serif text-xs leading-relaxed bg-white print:p-0">
          <div className="border-2 border-double border-gray-900 p-6 rounded-sm bg-amber-50/10">
            
            {/* Header */}
            <OfficialKopHeader minimal />

            <div className="text-center my-3">
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-black border-b border-black inline-block pb-0.5">
                KUITANSI BUKTI PEMBAYARAN RESMI
              </h2>
              <p className="font-mono text-[11px] font-bold text-blue-900 mt-0.5">
                No: {pembayaran.noKuitansi}
              </p>
            </div>

            {/* Receipt Body */}
            <div className="space-y-2.5 font-sans text-xs pt-2">
              <div className="flex">
                <span className="w-36 text-gray-700">Telah Diterima Dari</span>
                <span className="mr-2">:</span>
                <span className="font-bold text-gray-950 uppercase">{pembayaran.namaSiswa}</span>
              </div>

              <div className="flex">
                <span className="w-36 text-gray-700">Tingkat / Kelas</span>
                <span className="mr-2">:</span>
                <span className="font-bold text-gray-900">{pembayaran.kelas}</span>
              </div>

              <div className="flex">
                <span className="w-36 text-gray-700">Untuk Pembayaran</span>
                <span className="mr-2">:</span>
                <span className="font-semibold text-blue-950">{pembayaran.posBayar} ({pembayaran.bulan})</span>
              </div>

              <div className="flex">
                <span className="w-36 text-gray-700">Metode Pembayaran</span>
                <span className="mr-2">:</span>
                <span className="text-gray-800">{pembayaran.metodePembayaran}</span>
              </div>

              <div className="flex items-center my-3 p-2.5 bg-slate-100 border border-slate-300 rounded-sm font-mono text-sm">
                <span className="w-36 font-sans text-xs font-bold text-gray-800">Jumlah Uang</span>
                <span className="mr-2">:</span>
                <span className="font-extrabold text-emerald-900 text-base">
                  Rp {pembayaran.nominal.toLocaleString('id-ID')} ,-
                </span>
                <span className="ml-auto px-2 py-0.5 bg-emerald-700 text-white text-[10px] font-bold font-sans rounded-xs">
                  [ LUNAS ]
                </span>
              </div>
            </div>

            {/* Signature */}
            <div className="grid grid-cols-2 pt-4 font-sans text-xs">
              <div className="flex items-end text-[10px] text-gray-500 font-mono">
                Status: Verified in SIM-TU Database
              </div>
              <div className="text-center">
                <p className="text-gray-700">Nusantara, {pembayaran.tanggalBayar}</p>
                <p className="font-bold text-gray-900 mt-0.5">Petugas Bendahara TU,</p>
                <div className="my-3 py-1">
                  <span className="text-[10px] text-blue-900 font-mono font-bold border border-blue-200 px-2 py-0.5 bg-blue-50">
                    [ TANDA TANGAN SAH ]
                  </span>
                </div>
                <p className="font-bold text-gray-900 underline">{pembayaran.penerimaStaf}</p>
                <p className="text-[10px] text-gray-600">NIP. {schoolProfile.bendaharaNip}</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
