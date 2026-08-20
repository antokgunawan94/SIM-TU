import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { SuratKeluar, SifatSurat } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { TemplateSuratGenerator } from './TemplateSuratGenerator';
import { 
  Plus, 
  Search, 
  Send, 
  CheckCircle, 
  Printer, 
  FileText, 
  Trash2, 
  Layers, 
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

export const SuratKeluarList: React.FC = () => {
  const { 
    suratKeluarList, 
    addSuratKeluar, 
    deleteSuratKeluar, 
    approveSuratKeluar, 
    sendSuratKeluar,
    currentUser 
  } = useSchool();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterKlasifikasi, setFilterKlasifikasi] = useState<string>('all');

  // Modals / sub views
  const [showManualModal, setShowManualModal] = useState(false);
  const [showGeneratorView, setShowGeneratorView] = useState(false);

  const isKepsek = currentUser.role === 'kepala_sekolah';

  const filteredSurat = suratKeluarList.filter(s => {
    const matchSearch = 
      s.noSurat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tujuan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.perihal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.instansiTujuan.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = filterStatus === 'all' || s.status === filterStatus;
    const matchKlasifikasi = filterKlasifikasi === 'all' || s.kodeKlasifikasi === filterKlasifikasi;

    return matchSearch && matchStatus && matchKlasifikasi;
  });

  const handleExportCSV = () => {
    const headers = ['No Surat', 'Kode Klasifikasi', 'Tujuan', 'Instansi', 'Perihal', 'Tgl Surat', 'Penandatangan', 'Status'];
    const rows = filteredSurat.map(s => [
      `"${s.noSurat}"`,
      `"${s.kodeKlasifikasi}"`,
      `"${s.tujuan}"`,
      `"${s.instansiTujuan}"`,
      `"${s.perihal.replace(/"/g, '""')}"`,
      `"${s.tanggalSurat}"`,
      `"${s.penandatangan}"`,
      `"${s.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Buku_Agenda_Surat_Keluar_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (showGeneratorView) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowGeneratorView(false)}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            ← Kembali ke Buku Agenda Surat Keluar
          </button>
        </div>
        <TemplateSuratGenerator onSavedToSuratKeluar={() => setShowGeneratorView(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-emerald-500/30 text-emerald-200 text-xs font-semibold rounded-md border border-emerald-400/20">
              Modul e-Surat Keluar
            </span>
            <span className="text-xs text-emerald-200/80">Tata Usaha SMP</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Buku Register Surat Keluar & Pengesahan Dokumen
          </h1>
          <p className="text-xs text-emerald-100/80 mt-1 max-w-2xl leading-relaxed">
            Penomoran otomatis dengan kode klasifikasi dinas (Kesiswaan 421, Kepegawaian 800, Undangan 005), alur persetujuan Kepala Sekolah, serta generator cetak surat.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-xs border border-white/10 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
            Ekspor Register
          </button>
          <button
            onClick={() => setShowGeneratorView(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-[1.02] cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            Buka Template Generator
          </button>
          <button
            onClick={() => setShowManualModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            + Draf Manual
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari Nomor Surat, Tujuan, atau Perihal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50/50"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-700"
            >
              <option value="all">Semua Status</option>
              <option value="Draft">Draft</option>
              <option value="Menunggu Persetujuan">Menunggu Persetujuan</option>
              <option value="Disetujui Kepsek">Disetujui Kepsek</option>
              <option value="Terkirim">Terkirim</option>
            </select>

            <select
              value={filterKlasifikasi}
              onChange={(e) => setFilterKlasifikasi(e.target.value)}
              className="text-xs px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-700"
            >
              <option value="all">Semua Kode Klasifikasi</option>
              <option value="421.3">421.3 - Kesiswaan / Akademik</option>
              <option value="800">800 - Kepegawaian & Tugas</option>
              <option value="005">005 - Undangan & Acara</option>
              <option value="422.1">422.1 - Mutasi / Pindah</option>
              <option value="421.2">421.2 - Keterangan Siswa</option>
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
                <th className="py-3 px-4">No. Surat Keluar / Klasifikasi</th>
                <th className="py-3 px-4">Tujuan / Instansi</th>
                <th className="py-3 px-4">Perihal & Ringkasan</th>
                <th className="py-3 px-4">Tgl Surat & Penandatangan</th>
                <th className="py-3 px-4">Status Persetujuan</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSurat.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-medium text-slate-600">Tidak ada surat keluar yang sesuai kriteria.</p>
                  </td>
                </tr>
              ) : (
                filteredSurat.map((surat) => (
                  <tr key={surat.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* No Surat */}
                    <td className="py-3.5 px-4 align-top">
                      <span className="font-mono font-bold text-emerald-950 block">{surat.noSurat}</span>
                      <span className="inline-block mt-1 text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded-sm border border-slate-200">
                        Kode: {surat.kodeKlasifikasi}
                      </span>
                    </td>

                    {/* Tujuan */}
                    <td className="py-3.5 px-4 align-top">
                      <span className="font-bold text-slate-900 block">{surat.tujuan}</span>
                      <span className="text-slate-500 text-[11px] block">{surat.instansiTujuan}</span>
                    </td>

                    {/* Perihal */}
                    <td className="py-3.5 px-4 align-top max-w-xs">
                      <p className="font-semibold text-slate-900 line-clamp-2 leading-snug">
                        {surat.perihal}
                      </p>
                      <p className="text-[11px] text-slate-500 line-clamp-1 italic mt-0.5">
                        {surat.isiRingkas}
                      </p>
                    </td>

                    {/* Tanggal & Penandatangan */}
                    <td className="py-3.5 px-4 align-top">
                      <span className="font-medium text-slate-800 block">{surat.tanggalSurat}</span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">{surat.penandatangan}</span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 align-top">
                      <StatusBadge status={surat.status} />
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 align-top text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        
                        {/* Approval for Kepala Sekolah */}
                        {isKepsek && surat.status === 'Menunggu Persetujuan' && (
                          <button
                            onClick={() => approveSuratKeluar(surat.id)}
                            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                            title="Setujui Surat Keluar (Approval)"
                          >
                            ✓ Setujui
                          </button>
                        )}

                        {/* Send Action */}
                        {surat.status === 'Disetujui Kepsek' && (
                          <button
                            onClick={() => sendSuratKeluar(surat.id)}
                            className="px-2.5 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                            title="Tandai Telah Dikirim"
                          >
                            Kirim
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setShowGeneratorView(true);
                          }}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                          title="Lihat / Cetak Ulang Template"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Hapus surat keluar No: ${surat.noSurat}?`)) {
                              deleteSuratKeluar(surat.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Surat"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Draf Modal */}
      {showManualModal && (
        <SuratKeluarManualModal onClose={() => setShowManualModal(false)} />
      )}

    </div>
  );
};

// Sub-component for manual draft
const SuratKeluarManualModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { addSuratKeluar, schoolProfile } = useSchool();

  const [kodeKlasifikasi, setKodeKlasifikasi] = useState('421.3');
  const [tujuan, setTujuan] = useState('');
  const [instansiTujuan, setInstansiTujuan] = useState('');
  const [perihal, setPerihal] = useState('');
  const [isiRingkas, setIsiRingkas] = useState('');
  const [tanggalSurat, setTanggalSurat] = useState(new Date().toISOString().slice(0, 10));
  const [sifat, setSifat] = useState<SifatSurat>('Biasa');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tujuan || !perihal) {
      alert('Mohon isi Tujuan dan Perihal Surat.');
      return;
    }

    addSuratKeluar({
      kodeKlasifikasi,
      tujuan,
      instansiTujuan: instansiTujuan || tujuan,
      perihal,
      tanggalSurat,
      isiRingkas,
      penandatangan: schoolProfile.kepalaSekolahNama,
      sifat,
      templateType: 'manual'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 text-xs">
        <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base">Buat Draf Surat Keluar Manual</h3>
            <p className="text-xs text-emerald-200">Nomor surat resmi akan di-generate otomatis</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kode Klasifikasi Dinas *</label>
              <select
                value={kodeKlasifikasi}
                onChange={(e) => setKodeKlasifikasi(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
              >
                <option value="421.3">421.3 - Kesiswaan / Kurikulum</option>
                <option value="800">800 - Kepegawaian & Tugas</option>
                <option value="005">005 - Undangan & Kerjasama</option>
                <option value="422.1">422.1 - Mutasi Siswa</option>
                <option value="421.2">421.2 - Keterangan Siswa</option>
                <option value="900">900 - Keuangan & Anggaran</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Sifat Surat</label>
              <select
                value={sifat}
                onChange={(e) => setSifat(e.target.value as SifatSurat)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
              >
                <option value="Biasa">Biasa</option>
                <option value="Segera">Segera</option>
                <option value="Sangat Segera">Sangat Segera</option>
                <option value="Rahasia">Rahasia</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Tujuan / Penerima Surat *</label>
            <input
              type="text"
              required
              value={tujuan}
              onChange={(e) => setTujuan(e.target.value)}
              placeholder="Contoh: Kepala Dinas Pendidikan Kab. Nusantara"
              className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Perihal Surat *</label>
            <input
              type="text"
              required
              value={perihal}
              onChange={(e) => setPerihal(e.target.value)}
              placeholder="Perihal pokok surat dinas"
              className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Ringkasan / Catatan Isi Surat</label>
            <textarea
              rows={3}
              value={isiRingkas}
              onChange={(e) => setIsiRingkas(e.target.value)}
              placeholder="Uraian isi surat..."
              className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 text-xs font-semibold rounded-xl hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer"
            >
              Simpan Draf Surat Keluar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
