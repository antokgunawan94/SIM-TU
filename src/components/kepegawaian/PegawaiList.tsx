import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Pegawai, PengajuanCuti } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  UserCheck, 
  Search, 
  Plus, 
  Calendar, 
  FileSpreadsheet, 
  Trash2, 
  Award, 
  Clock, 
  Briefcase,
  AlertCircle,
  FileCheck2
} from 'lucide-react';

export const PegawaiList: React.FC = () => {
  const { 
    pegawaiList, 
    cutiList, 
    addPegawai, 
    deletePegawai, 
    addPengajuanCuti, 
    approvePengajuanCuti, 
    currentUser 
  } = useSchool();

  const [activeTab, setActiveTab] = useState<'pegawai' | 'cuti'>('pegawai');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modals
  const [showAddPegawaiModal, setShowAddPegawaiModal] = useState(false);
  const [showAjukanCutiModal, setShowAjukanCutiModal] = useState(false);

  const isKepsek = currentUser.role === 'kepala_sekolah';

  const filteredPegawai = pegawaiList.filter(p => {
    const matchSearch = 
      p.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.nip && p.nip.includes(searchQuery)) ||
      (p.nuptk && p.nuptk.includes(searchQuery)) ||
      p.jabatan.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'all' || p.statusKepegawaian === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleExportGTK = () => {
    const headers = ['NIP', 'NUPTK', 'Nama GTK', 'Jabatan', 'Status', 'Golongan', 'Pendidikan', 'TMT Kerja', 'Sertifikasi', 'JJM'];
    const rows = filteredPegawai.map(p => [
      `"${p.nip || '-'}"`,
      `"${p.nuptk || '-'}"`,
      `"${p.nama}"`,
      `"${p.jabatan}"`,
      `"${p.statusKepegawaian}"`,
      `"${p.golongan || '-'}"`,
      `"${p.pendidikanTerakhir}"`,
      `"${p.tmtKerja}"`,
      p.isSertifikasi ? 'Sudah Sertifikasi' : 'Belum',
      p.jamMengajar || 0
    ]);
    const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const uri = encodeURI(csv);
    const link = document.createElement('a');
    link.setAttribute('href', uri);
    link.setAttribute('download', `Database_GTK_SMP_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-purple-500/30 text-purple-200 text-xs font-semibold rounded-md border border-purple-400/20">
              Modul Kepegawaian & GTK
            </span>
            <span className="text-xs text-purple-200/80">Tata Usaha SMP</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Data GTK, Kenaikan Pangkat & Pengajuan Cuti
          </h1>
          <p className="text-xs text-purple-100/80 mt-1 max-w-2xl leading-relaxed">
            Database Guru & Tendik (PNS, PPPK, Honorer), monitoring NUPTK & Sertifikasi Pendidik, serta alur persetujuan cuti digital oleh Kepala Sekolah.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportGTK}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-xs border border-white/10 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
            Ekspor Data GTK
          </button>
          <button
            onClick={() => setShowAjukanCutiModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-500 hover:bg-purple-400 text-white font-bold rounded-xl text-xs shadow-lg shadow-purple-500/20 transition-all transform hover:scale-[1.02] cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            + Ajukan Cuti GTK
          </button>
          <button
            onClick={() => setShowAddPegawaiModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            + Tambah GTK Baru
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('pegawai')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'pegawai'
                ? 'bg-purple-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            👨‍🏫 Database Guru & Tenaga Kependidikan ({pegawaiList.length})
          </button>
          <button
            onClick={() => setActiveTab('cuti')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'cuti'
                ? 'bg-purple-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            📋 Pengajuan Cuti & Izin ({cutiList.length})
          </button>
        </div>

        {activeTab === 'pegawai' && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari NIP / Nama GTK..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-slate-50"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-slate-700 font-medium"
            >
              <option value="all">Semua Status GTK</option>
              <option value="PNS">PNS</option>
              <option value="PPPK">PPPK</option>
              <option value="Honorer">Honorer / GTT</option>
            </select>
          </div>
        )}
      </div>

      {/* TAB 1: PEGAWAI TABLE */}
      {activeTab === 'pegawai' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 uppercase tracking-wider font-semibold text-[11px]">
                <tr>
                  <th className="py-3 px-4">Nama GTK & Gelar</th>
                  <th className="py-3 px-4">NIP / NUPTK</th>
                  <th className="py-3 px-4">Jabatan & Golongan</th>
                  <th className="py-3 px-4">Status & Sertifikasi</th>
                  <th className="py-3 px-4">TMT & Masa Kerja</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPegawai.map((pegawai) => (
                  <tr key={pegawai.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Nama */}
                    <td className="py-3.5 px-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-900 font-bold flex items-center justify-center text-xs flex-shrink-0">
                          {pegawai.nama.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block text-xs">{pegawai.nama}</span>
                          <span className="text-[11px] text-slate-500">{pegawai.pendidikanTerakhir} • {pegawai.noHp}</span>
                        </div>
                      </div>
                    </td>

                    {/* NIP / NUPTK */}
                    <td className="py-3.5 px-4 align-middle">
                      <span className="font-mono font-bold text-slate-900 block text-xs">
                        {pegawai.nip ? `NIP: ${pegawai.nip}` : 'NIP: -'}
                      </span>
                      <span className="font-mono text-[11px] text-purple-900 block font-semibold">
                        NUPTK: {pegawai.nuptk || '-'}
                      </span>
                    </td>

                    {/* Jabatan & Golongan */}
                    <td className="py-3.5 px-4 align-middle">
                      <span className="font-bold text-slate-800 block">{pegawai.jabatan}</span>
                      <span className="inline-block mt-0.5 text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-sm font-mono font-semibold">
                        Gol: {pegawai.golongan || 'Non-PNS'}
                      </span>
                      {pegawai.jamMengajar ? (
                        <span className="text-[10px] text-slate-500 block mt-0.5 font-medium">
                          Beban: {pegawai.jamMengajar} Jam/Minggu
                        </span>
                      ) : null}
                    </td>

                    {/* Status & Sertifikasi */}
                    <td className="py-3.5 px-4 align-middle">
                      <div className="space-y-1">
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          pegawai.statusKepegawaian === 'PNS' 
                            ? 'bg-blue-100 text-blue-800' 
                            : pegawai.statusKepegawaian === 'PPPK' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {pegawai.statusKepegawaian}
                        </span>

                        {pegawai.isSertifikasi && (
                          <div className="flex items-center gap-1 text-[10px] text-amber-700 font-bold">
                            <Award className="w-3.5 h-3.5 text-amber-600" />
                            <span>Pendidik Tersertifikasi</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* TMT */}
                    <td className="py-3.5 px-4 align-middle font-medium text-slate-700">
                      <span>TMT: {pegawai.tmtKerja}</span>
                    </td>

                    {/* Aksi */}
                    <td className="py-3.5 px-4 align-middle text-center">
                      <button
                        onClick={() => {
                          if (confirm(`Hapus GTK ${pegawai.nama}?`)) {
                            deletePegawai(pegawai.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Hapus Data GTK"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CUTI TABLE */}
      {activeTab === 'cuti' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 uppercase tracking-wider font-semibold text-[11px]">
                <tr>
                  <th className="py-3 px-4">Nama Pegawai & NIP</th>
                  <th className="py-3 px-4">Jenis Cuti</th>
                  <th className="py-3 px-4">Rentang Tanggal & Durasi</th>
                  <th className="py-3 px-4">Alasan Cuti</th>
                  <th className="py-3 px-4">Status Pengesahan</th>
                  <th className="py-3 px-4 text-center">Aksi Approval</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cutiList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <Calendar className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                      <p className="font-medium text-slate-600">Belum ada permohonan cuti aktif.</p>
                    </td>
                  </tr>
                ) : (
                  cutiList.map((cuti) => (
                    <tr key={cuti.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {cuti.namaPegawai}
                        <span className="text-[10px] text-slate-500 font-mono block">NIP: {cuti.nip}</span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-purple-900">
                        {cuti.jenisCuti}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800 block">{cuti.tanggalMulai} s.d. {cuti.tanggalSelesai}</span>
                        <span className="text-[10px] text-slate-500 font-medium">{cuti.durasiHari} Hari Kerja</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 max-w-xs">
                        {cuti.alasan}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={cuti.status} />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {isKepsek && cuti.status === 'Menunggu Persetujuan' ? (
                          <button
                            onClick={() => approvePengajuanCuti(cuti.id)}
                            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            ✓ Setujui Cuti
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[11px]">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Tambah GTK */}
      {showAddPegawaiModal && (
        <PegawaiAddModal onClose={() => setShowAddPegawaiModal(false)} />
      )}

      {/* Modal Ajukan Cuti */}
      {showAjukanCutiModal && (
        <CutiAddModal onClose={() => setShowAjukanCutiModal(false)} />
      )}

    </div>
  );
};

// Sub-component for adding new GTK
const PegawaiAddModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { addPegawai } = useSchool();

  const [nama, setNama] = useState('');
  const [nip, setNip] = useState('');
  const [nuptk, setNuptk] = useState('');
  const [jabatan, setJabatan] = useState('Guru Mata Pelajaran');
  const [statusKepegawaian, setStatusKepegawaian] = useState<'PNS' | 'PPPK' | 'Honorer'>('PNS');
  const [golongan, setGolongan] = useState('III/a - Penata Muda');
  const [pendidikanTerakhir, setPendidikanTerakhir] = useState('S1 Pendidikan');
  const [tmtKerja, setTmtKerja] = useState('2020-01-02');
  const [noHp, setNoHp] = useState('0812-');
  const [isSertifikasi, setIsSertifikasi] = useState(true);
  const [jamMengajar, setJamMengajar] = useState(24);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama) {
      alert('Nama pegawai wajib diisi.');
      return;
    }

    addPegawai({
      nama,
      nip,
      nuptk,
      jabatan,
      statusKepegawaian,
      golongan: statusKepegawaian === 'Honorer' ? undefined : golongan,
      pendidikanTerakhir,
      tmtKerja,
      noHp,
      email: `${nama.toLowerCase().replace(/[^a-z]/g, '')}@smpn1nusantara.sch.id`,
      isSertifikasi,
      jamMengajar: Number(jamMengajar)
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto text-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
        <div className="bg-purple-950 text-white px-6 py-4 flex items-center justify-between">
          <h3 className="font-bold text-base">Tambah Data Guru & Tendik (GTK) Baru</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          <div>
            <label className="block font-bold text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
            <input
              type="text"
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Rahmat Hidayat, S.Pd., M.Si."
              className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">NIP (Kosongkan bila Honorer)</label>
              <input
                type="text"
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                placeholder="1980xxxx xxxxx x xxx"
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">NUPTK</label>
              <input
                type="text"
                value={nuptk}
                onChange={(e) => setNuptk(e.target.value)}
                placeholder="16 Digit NUPTK"
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Status GTK *</label>
              <select
                value={statusKepegawaian}
                onChange={(e) => setStatusKepegawaian(e.target.value as any)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-semibold"
              >
                <option value="PNS">PNS</option>
                <option value="PPPK">PPPK</option>
                <option value="Honorer">Honorer / GTT</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Golongan Ruang</label>
              <input
                type="text"
                value={golongan}
                onChange={(e) => setGolongan(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Pendidikan</label>
              <input
                type="text"
                value={pendidikanTerakhir}
                onChange={(e) => setPendidikanTerakhir(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Jabatan / Tugas Tambahan *</label>
              <input
                type="text"
                required
                value={jabatan}
                onChange={(e) => setJabatan(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Beban Mengajar (JJM)</label>
              <input
                type="number"
                value={jamMengajar}
                onChange={(e) => setJamMengajar(Number(e.target.value))}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">TMT Kerja</label>
              <input
                type="date"
                value={tmtKerja}
                onChange={(e) => setTmtKerja(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nomor Handphone / WA</label>
              <input
                type="text"
                value={noHp}
                onChange={(e) => setNoHp(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="sertifikasi"
              checked={isSertifikasi}
              onChange={(e) => setIsSertifikasi(e.target.checked)}
              className="w-4 h-4 text-purple-600 rounded"
            />
            <label htmlFor="sertifikasi" className="font-semibold text-slate-800">
              Sudah Lulus Sertifikasi Pendidik (Memiliki Sertifikat Pendidik / Sergur)
            </label>
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
              className="px-5 py-2.5 bg-purple-800 hover:bg-purple-900 text-white font-bold rounded-xl shadow-md cursor-pointer"
            >
              Simpan Data Pegawai
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

// Sub-component for applying leave
const CutiAddModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { pegawaiList, addPengajuanCuti } = useSchool();

  const [pegawaiId, setPegawaiId] = useState(pegawaiList[0]?.id || '');
  const [jenisCuti, setJenisCuti] = useState<PengajuanCuti['jenisCuti']>('Cuti Tahunan');
  const [tanggalMulai, setTanggalMulai] = useState(new Date().toISOString().slice(0, 10));
  const [tanggalSelesai, setTanggalSelesai] = useState(new Date().toISOString().slice(0, 10));
  const [durasiHari, setDurasiHari] = useState(3);
  const [alasan, setAlasan] = useState('');

  const selectedPegawai = pegawaiList.find(p => p.id === pegawaiId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPegawai || !alasan) {
      alert('Mohon pilih pegawai dan isi alasan permohonan cuti.');
      return;
    }

    addPengajuanCuti({
      pegawaiId: selectedPegawai.id,
      namaPegawai: selectedPegawai.nama,
      nip: selectedPegawai.nip || '-',
      jenisCuti,
      tanggalMulai,
      tanggalSelesai,
      durasiHari: Number(durasiHari),
      alasan
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto text-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        <div className="bg-purple-950 text-white px-6 py-4 flex items-center justify-between">
          <h3 className="font-bold text-base">Formulir Pengajuan Cuti Elektronik GTK</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Pilih Pegawai / GTK Pemohon *</label>
            <select
              value={pegawaiId}
              onChange={(e) => setPegawaiId(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-semibold text-slate-900"
            >
              {pegawaiList.map(p => (
                <option key={p.id} value={p.id}>{p.nama} ({p.jabatan})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Jenis Cuti Dinas *</label>
              <select
                value={jenisCuti}
                onChange={(e) => setJenisCuti(e.target.value as any)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
              >
                <option value="Cuti Tahunan">Cuti Tahunan</option>
                <option value="Cuti Sakit">Cuti Sakit</option>
                <option value="Cuti Melahirkan">Cuti Melahirkan</option>
                <option value="Cuti Alasan Penting">Cuti Alasan Penting</option>
                <option value="Cuti Besar">Cuti Besar</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Durasi (Hari Kerja)</label>
              <input
                type="number"
                value={durasiHari}
                onChange={(e) => setDurasiHari(Number(e.target.value))}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tanggal Mulai</label>
              <input
                type="date"
                value={tanggalMulai}
                onChange={(e) => setTanggalMulai(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tanggal Selesai</label>
              <input
                type="date"
                value={tanggalSelesai}
                onChange={(e) => setTanggalSelesai(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Alasan Permohonan Cuti *</label>
            <textarea
              rows={3}
              required
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
              placeholder="Jelaskan alasan cuti secara rinci..."
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
              className="px-5 py-2.5 bg-purple-800 hover:bg-purple-900 text-white font-bold rounded-xl shadow-md cursor-pointer"
            >
              Kirim ke Kepala Sekolah
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
