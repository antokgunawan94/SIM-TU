import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { SuratMasuk, SifatSurat, StatusSuratMasuk } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { SuratMasukDetailModal } from './SuratMasukDetailModal';
import { DisposisiModal } from './DisposisiModal';
import { 
  Plus, 
  Search, 
  Filter, 
  Inbox, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Download,
  Eye,
  Trash2,
  FileSpreadsheet
} from 'lucide-react';

export const SuratMasukList: React.FC = () => {
  const { 
    suratMasukList, 
    addSuratMasuk, 
    deleteSuratMasuk, 
    currentUser,
    forwardSuratToKepsek 
  } = useSchool();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterSifat, setFilterSifat] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterKategori, setFilterKategori] = useState<string>('all');

  // Modals state
  const [showInputModal, setShowInputModal] = useState(false);
  const [selectedSuratForDetail, setSelectedSuratForDetail] = useState<SuratMasuk | null>(null);
  const [selectedSuratForDisposisi, setSelectedSuratForDisposisi] = useState<SuratMasuk | null>(null);

  // Filtered List
  const filteredSurat = suratMasukList.filter(s => {
    const matchSearch = 
      s.noAgenda.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.noSuratAsal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.pengirim.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.instansiPengirim.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.perihal.toLowerCase().includes(searchQuery.toLowerCase());

    const matchSifat = filterSifat === 'all' || s.sifat === filterSifat;
    const matchStatus = filterStatus === 'all' || s.status === filterStatus;
    const matchKategori = filterKategori === 'all' || s.kategori === filterKategori;

    return matchSearch && matchSifat && matchStatus && matchKategori;
  });

  // Export Agenda to CSV
  const handleExportCSV = () => {
    const headers = ['No Agenda', 'No Surat Asal', 'Pengirim', 'Instansi', 'Tgl Surat', 'Tgl Terima', 'Perihal', 'Sifat', 'Status'];
    const rows = filteredSurat.map(s => [
      `"${s.noAgenda}"`,
      `"${s.noSuratAsal}"`,
      `"${s.pengirim}"`,
      `"${s.instansiPengirim}"`,
      `"${s.tanggalSurat}"`,
      `"${s.tanggalTerima}"`,
      `"${s.perihal.replace(/"/g, '""')}"`,
      `"${s.sifat}"`,
      `"${s.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Buku_Agenda_Surat_Masuk_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isKepsek = currentUser.role === 'kepala_sekolah';

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Heading */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-blue-500/30 text-blue-200 text-xs font-semibold rounded-md border border-blue-400/20">
                Modul e-Surat & Disposisi
              </span>
              <span className="text-xs text-blue-200/80">Tata Usaha SMP</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Buku Agenda Surat Masuk & Disposisi Digital
            </h1>
            <p className="text-xs text-blue-100/80 mt-1 max-w-2xl leading-relaxed">
              Registrasi berkas dinas masuk, penomoran agenda otomatis, pelacakan instruksi pimpinan secara multi-level, hingga laporan hasil tindak lanjut pelaksana.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-xs border border-white/10 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              Ekspor Buku Agenda
            </button>
            <button
              onClick={() => setShowInputModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-yellow-500/20 transition-all transform hover:scale-[1.02] cursor-pointer"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              + Catat Surat Masuk Baru
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
            <Inbox className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Surat Masuk</p>
            <h3 className="text-xl font-bold text-slate-900">{suratMasukList.length}</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Menunggu Disposisi</p>
            <h3 className="text-xl font-bold text-amber-800">
              {suratMasukList.filter(s => s.status === 'Menunggu Disposisi' || s.status === 'Diterima TU').length}
            </h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-indigo-200 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-700 rounded-xl">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Sedang Ditindaklanjuti</p>
            <h3 className="text-xl font-bold text-indigo-800">
              {suratMasukList.filter(s => s.status === 'Terdisposisi' || s.status === 'Dalam Proses').length}
            </h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Tuntas & Selesai</p>
            <h3 className="text-xl font-bold text-emerald-800">
              {suratMasukList.filter(s => s.status === 'Selesai' || s.status === 'Diarsipkan').length}
            </h3>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari No Agenda, No Surat Asal, Pengirim, atau Perihal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua Status Disposisi</option>
              <option value="Diterima TU">Diterima TU</option>
              <option value="Menunggu Disposisi">Menunggu Disposisi</option>
              <option value="Terdisposisi">Terdisposisi</option>
              <option value="Dalam Proses">Dalam Proses</option>
              <option value="Selesai">Selesai</option>
              <option value="Diarsipkan">Diarsipkan</option>
            </select>

            <select
              value={filterSifat}
              onChange={(e) => setFilterSifat(e.target.value)}
              className="text-xs px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua Sifat Surat</option>
              <option value="Sangat Segera">Sangat Segera</option>
              <option value="Segera">Segera</option>
              <option value="Biasa">Biasa</option>
              <option value="Rahasia">Rahasia</option>
            </select>

            <select
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="text-xs px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua Kategori Instansi</option>
              <option value="Dinas Pendidikan">Dinas Pendidikan</option>
              <option value="Kementerian / Pusat">Kementerian / Pusat</option>
              <option value="Kepegawaian">Kepegawaian</option>
              <option value="Orang Tua / Komite">Orang Tua / Komite</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 uppercase tracking-wider font-semibold text-[11px]">
              <tr>
                <th className="py-3 px-4">No. Agenda / Tgl Terima</th>
                <th className="py-3 px-4">Surat Dari / No. Asal</th>
                <th className="py-3 px-4">Perihal & Ringkasan</th>
                <th className="py-3 px-4">Sifat & Kategori</th>
                <th className="py-3 px-4">Status & Disposisi</th>
                <th className="py-3 px-4 text-center">Aksi / Tindak Lanjut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSurat.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Inbox className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-medium text-slate-600">Tidak ada surat masuk yang sesuai filter atau pencarian.</p>
                  </td>
                </tr>
              ) : (
                filteredSurat.map((surat) => {
                  const hasDisposisi = surat.disposisiList.length > 0;
                  const latestDisp = surat.disposisiList[0];

                  return (
                    <tr key={surat.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* No Agenda */}
                      <td className="py-3.5 px-4 align-top">
                        <span className="font-mono font-bold text-blue-900 block">{surat.noAgenda}</span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          Terima: {surat.tanggalTerima}
                        </span>
                      </td>

                      {/* Surat Dari */}
                      <td className="py-3.5 px-4 align-top">
                        <span className="font-bold text-slate-900 block">{surat.instansiPengirim}</span>
                        <span className="text-slate-600 text-[11px] block">{surat.pengirim}</span>
                        <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                          No: {surat.noSuratAsal}
                        </span>
                      </td>

                      {/* Perihal */}
                      <td className="py-3.5 px-4 align-top max-w-xs">
                        <p className="font-semibold text-slate-900 line-clamp-2 leading-snug">
                          {surat.perihal}
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-1 italic mt-0.5">
                          {surat.ringkasan}
                        </p>
                        {surat.fileName && (
                          <span className="inline-block mt-1 text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded-xs border border-indigo-100">
                            📎 {surat.fileName}
                          </span>
                        )}
                      </td>

                      {/* Sifat & Kategori */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="space-y-1">
                          <StatusBadge sifat={surat.sifat} type="sifat" />
                          <span className="block text-[10px] text-slate-600 font-medium">
                            {surat.kategori}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="space-y-1">
                          <StatusBadge status={surat.status} />
                          {hasDisposisi && (
                            <div className="text-[10px] text-slate-600 bg-slate-100 p-1.5 rounded-md border border-slate-200 mt-1">
                              <span className="font-bold text-indigo-900 block">
                                ➔ Kepada: {latestDisp.diteruskanKepada[0]}
                              </span>
                              <span className="italic text-slate-700 line-clamp-1">"{latestDisp.instruksi}"</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 align-top text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* View Detail / Timeline */}
                          <button
                            onClick={() => setSelectedSuratForDetail(surat)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                            title="Buka Detail & Timeline Disposisi"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Quick Disposisi for Kepsek */}
                          {isKepsek && surat.status !== 'Selesai' && surat.status !== 'Diarsipkan' && (
                            <button
                              onClick={() => setSelectedSuratForDisposisi(surat)}
                              className="px-2.5 py-1 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                              title="Beri Disposisi"
                            >
                              Disposisi
                            </button>
                          )}

                          {/* Forward to Kepsek if freshly registered */}
                          {surat.status === 'Diterima TU' && !isKepsek && (
                            <button
                              onClick={() => forwardSuratToKepsek(surat.id)}
                              className="px-2.5 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                              title="Teruskan ke Meja Kepala Sekolah"
                            >
                              Ke Kepsek
                            </button>
                          )}

                          {/* Delete for Admin / KTU */}
                          {currentUser.role === 'kepala_tu' && (
                            <button
                              onClick={() => {
                                if (confirm(`Hapus surat masuk No Agenda ${surat.noAgenda}?`)) {
                                  deleteSuratMasuk(surat.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Hapus Surat"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Input Surat Masuk Baru */}
      {showInputModal && (
        <SuratMasukInputModal onClose={() => setShowInputModal(false)} />
      )}

      {/* Modal Detail & Timeline */}
      {selectedSuratForDetail && (
        <SuratMasukDetailModal
          surat={selectedSuratForDetail}
          onClose={() => setSelectedSuratForDetail(null)}
        />
      )}

      {/* Modal Disposisi Triggered Directly */}
      {selectedSuratForDisposisi && (
        <DisposisiModal
          surat={selectedSuratForDisposisi}
          onClose={() => setSelectedSuratForDisposisi(null)}
        />
      )}

    </div>
  );
};

// Sub-component for registering incoming letter
const SuratMasukInputModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { addSuratMasuk } = useSchool();

  const [noSuratAsal, setNoSuratAsal] = useState('');
  const [pengirim, setPengirim] = useState('');
  const [instansiPengirim, setInstansiPengirim] = useState('Dinas Pendidikan & Kebudayaan Kab. Nusantara');
  const [tanggalSurat, setTanggalSurat] = useState(new Date().toISOString().slice(0, 10));
  const [tanggalTerima, setTanggalTerima] = useState(new Date().toISOString().slice(0, 10));
  const [perihal, setPerihal] = useState('');
  const [ringkasan, setRingkasan] = useState('');
  const [sifat, setSifat] = useState<SifatSurat>('Biasa');
  const [kategori, setKategori] = useState('Dinas Pendidikan');
  const [catatanTU, setCatatanTU] = useState('');
  const [fileName, setFileName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noSuratAsal || !pengirim || !perihal) {
      alert('Mohon lengkapi No Surat Asal, Pengirim, dan Perihal.');
      return;
    }

    addSuratMasuk({
      noSuratAsal,
      pengirim,
      instansiPengirim,
      tanggalSurat,
      tanggalTerima,
      perihal,
      ringkasan: ringkasan || perihal,
      sifat,
      kategori,
      catatanTU: catatanTU || undefined,
      fileName: fileName || 'Dokumen_Surat_Masuk.pdf'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
        <div className="bg-blue-900 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base">Registrasi Surat Masuk Baru</h3>
            <p className="text-xs text-blue-200">Nomor Agenda TU akan di-generate otomatis oleh sistem</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nomor Surat Pengirim / Asal *</label>
              <input
                type="text"
                required
                value={noSuratAsal}
                onChange={(e) => setNoSuratAsal(e.target.value)}
                placeholder="Contoh: 421.2/1082/Disdik/2026"
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Kategori Instansi Pengirim</label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="Dinas Pendidikan">Dinas Pendidikan</option>
                <option value="Kementerian / Pusat">Kementerian / Pusat (Kemendikbud)</option>
                <option value="Kepegawaian">Kepegawaian / BKPSDM</option>
                <option value="Orang Tua / Komite">Orang Tua / Komite Sekolah</option>
                <option value="Puskesmas / Kesehatan">Puskesmas / Dinas Kesehatan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Instansi Pengirim *</label>
              <input
                type="text"
                required
                value={instansiPengirim}
                onChange={(e) => setInstansiPengirim(e.target.value)}
                placeholder="Nama dinas / instansi / lembaga"
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama / Jabatan Pengirim *</label>
              <input
                type="text"
                required
                value={pengirim}
                onChange={(e) => setPengirim(e.target.value)}
                placeholder="Contoh: Kepala Dinas Pendidikan"
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tanggal Surat Asal</label>
              <input
                type="date"
                value={tanggalSurat}
                onChange={(e) => setTanggalSurat(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tanggal Diterima TU</label>
              <input
                type="date"
                value={tanggalTerima}
                onChange={(e) => setTanggalTerima(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Sifat / Urgensi Surat</label>
              <select
                value={sifat}
                onChange={(e) => setSifat(e.target.value as SifatSurat)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 font-semibold"
              >
                <option value="Biasa">Biasa</option>
                <option value="Segera">Segera</option>
                <option value="Sangat Segera">Sangat Segera</option>
                <option value="Rahasia">Rahasia</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Perihal Pokok Surat *</label>
            <input
              type="text"
              required
              value={perihal}
              onChange={(e) => setPerihal(e.target.value)}
              placeholder="Contoh: Undangan Rapat Koordinasi ANBK SMP Tahun 2026"
              className="w-full p-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Ringkasan Isi / Catatan Surat</label>
            <textarea
              rows={3}
              value={ringkasan}
              onChange={(e) => setRingkasan(e.target.value)}
              placeholder="Tuliskan uraian ringkas substansi surat untuk mempermudah telaah pimpinan..."
              className="w-full p-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Catatan Awal Verifikator TU</label>
            <input
              type="text"
              value={catatanTU}
              onChange={(e) => setCatatanTU(e.target.value)}
              placeholder="Contoh: Perlu penunjukan proktor & teknisi lab komputer..."
              className="w-full p-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Simulasi File Scan / PDF Surat</label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Nama file lampiran scan, misal: Surat_Dinas_Pendidikan_14Agst.pdf"
              className="w-full p-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 font-mono text-[11px]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 text-xs font-semibold rounded-xl hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-800 hover:bg-blue-900 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer"
            >
              Simpan & Daftarkan ke Buku Agenda
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
