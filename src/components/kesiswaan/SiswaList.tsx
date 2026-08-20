import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Siswa } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { KartuPelajarModal } from './KartuPelajarModal';
import { MutasiSiswaModal } from './MutasiSiswaModal';
import { 
  Users, 
  Search, 
  Plus, 
  CreditCard, 
  ArrowLeftRight, 
  FileSpreadsheet, 
  Trash2, 
  Edit3,
  CheckCircle2,
  GraduationCap
} from 'lucide-react';

export const SiswaList: React.FC = () => {
  const { siswaList, addSiswa, deleteSiswa, updateSiswa } = useSchool();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterKelas, setFilterKelas] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedForCard, setSelectedForCard] = useState<Siswa | null>(null);
  const [selectedForMutasi, setSelectedForMutasi] = useState<Siswa | null>(null);

  const filteredSiswa = siswaList.filter(s => {
    const matchSearch = 
      s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nis.includes(searchQuery) ||
      s.nisn.includes(searchQuery) ||
      s.namaWali.toLowerCase().includes(searchQuery.toLowerCase());

    const matchKelas = filterKelas === 'all' || s.kelas.startsWith(filterKelas);
    const matchStatus = filterStatus === 'all' || s.status === filterStatus;

    return matchSearch && matchKelas && matchStatus;
  });

  const handleExportDapodik = () => {
    const headers = ['NIS', 'NISN', 'NIK', 'Nama Lengkap', 'JK', 'Kelas', 'Tempat Lahir', 'Tgl Lahir', 'Nama Wali', 'No HP Wali', 'Alamat', 'Jalur Pendaftaran', 'Status'];
    const rows = filteredSiswa.map(s => [
      `"${s.nis}"`,
      `"${s.nisn}"`,
      `"${s.nik}"`,
      `"${s.nama}"`,
      `"${s.jenisKelamin}"`,
      `"${s.kelas}"`,
      `"${s.tempatLahir}"`,
      `"${s.tanggalLahir}"`,
      `"${s.namaWali}"`,
      `"${s.noHpWali}"`,
      `"${s.alamat.replace(/"/g, '""')}"`,
      `"${s.jalurPendaftaran}"`,
      `"${s.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Database_Siswa_Format_Dapodik_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-blue-500/30 text-blue-200 text-xs font-semibold rounded-md border border-blue-400/20">
              Modul Kesiswaan & Kurikulum
            </span>
            <span className="text-xs text-blue-200/80">Tata Usaha SMP</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Data Pokok Siswa & Sinkronisasi Dapodik
          </h1>
          <p className="text-xs text-blue-100/80 mt-1 max-w-2xl leading-relaxed">
            Manajemen database siswa aktif & alumni, pencatatan mutasi masuk/keluar, penerbitan Kartu Tanda Pelajar digital ber-barcode, dan validasi data kependudukan (NIK/NISN).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportDapodik}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-xs border border-white/10 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
            Ekspor Format Dapodik
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-500/20 transition-all transform hover:scale-[1.02] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            + Tambah Siswa Baru
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
              placeholder="Cari Nama Siswa, NIS, NISN, atau Nama Wali Murid..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterKelas}
              onChange={(e) => setFilterKelas(e.target.value)}
              className="text-xs px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 font-medium"
            >
              <option value="all">Semua Tingkat Kelas</option>
              <option value="7">Tingkat 7 (Kelas 7A - 7F)</option>
              <option value="8">Tingkat 8 (Kelas 8A - 8F)</option>
              <option value="9">Tingkat 9 (Kelas 9A - 9F)</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 font-medium"
            >
              <option value="all">Semua Status Siswa</option>
              <option value="Aktif">Siswa Aktif</option>
              <option value="Mutasi Keluar">Mutasi Keluar</option>
              <option value="Mutasi Masuk">Mutasi Masuk</option>
              <option value="Lulus">Lulus / Alumni</option>
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
                <th className="py-3 px-4">Identitas Siswa</th>
                <th className="py-3 px-4">NIS / NISN</th>
                <th className="py-3 px-4">Kelas & JK</th>
                <th className="py-3 px-4">Wali & Kontak</th>
                <th className="py-3 px-4">Status & Dapodik</th>
                <th className="py-3 px-4 text-center">Cetak & Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSiswa.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-medium text-slate-600">Tidak ada siswa yang sesuai pencarian.</p>
                  </td>
                </tr>
              ) : (
                filteredSiswa.map((siswa) => (
                  <tr key={siswa.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Nama & Foto */}
                    <td className="py-3 px-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 border border-slate-300">
                          {siswa.fotoUrl ? (
                            <img src={siswa.fotoUrl} alt={siswa.nama} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-slate-500 text-[10px]">
                              {siswa.nama.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block text-xs">{siswa.nama}</span>
                          <span className="text-[10px] text-slate-500">{siswa.tempatLahir}, {siswa.tanggalLahir}</span>
                        </div>
                      </div>
                    </td>

                    {/* NIS & NISN */}
                    <td className="py-3 px-4 align-middle">
                      <span className="font-mono font-bold text-blue-900 block text-xs">{siswa.nisn}</span>
                      <span className="font-mono text-[11px] text-slate-500 block">NIS: {siswa.nis}</span>
                    </td>

                    {/* Kelas & JK */}
                    <td className="py-3 px-4 align-middle">
                      <span className="inline-block px-2.5 py-0.5 bg-blue-50 border border-blue-200 text-blue-900 font-extrabold rounded-md text-xs">
                        {siswa.kelas}
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        JK: {siswa.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                      </span>
                    </td>

                    {/* Wali & No HP */}
                    <td className="py-3 px-4 align-middle">
                      <span className="font-semibold text-slate-800 block text-xs">{siswa.namaWali}</span>
                      <span className="text-[11px] text-slate-500 font-mono block">{siswa.noHpWali}</span>
                    </td>

                    {/* Status & Dapodik */}
                    <td className="py-3 px-4 align-middle">
                      <div className="space-y-1">
                        <StatusBadge status={siswa.status} />
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Tersinkron Dapodik
                        </span>
                      </div>
                    </td>

                    {/* Aksi */}
                    <td className="py-3 px-4 align-middle text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        
                        {/* Kartu Pelajar */}
                        <button
                          onClick={() => setSelectedForCard(siswa)}
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors cursor-pointer"
                          title="Cetak Kartu Tanda Pelajar"
                        >
                          <CreditCard className="w-4 h-4" />
                        </button>

                        {/* Mutasi */}
                        <button
                          onClick={() => setSelectedForMutasi(siswa)}
                          className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition-colors cursor-pointer"
                          title="Catat Mutasi / Kelulusan"
                        >
                          <ArrowLeftRight className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => {
                            if (confirm(`Hapus data siswa ${siswa.nama}?`)) {
                              deleteSiswa(siswa.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Data"
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

      {/* Modal Kartu Pelajar */}
      {selectedForCard && (
        <KartuPelajarModal
          siswa={selectedForCard}
          onClose={() => setSelectedForCard(null)}
        />
      )}

      {/* Modal Mutasi */}
      {selectedForMutasi && (
        <MutasiSiswaModal
          siswa={selectedForMutasi}
          onClose={() => setSelectedForMutasi(null)}
        />
      )}

      {/* Modal Tambah Siswa */}
      {showAddModal && (
        <SiswaAddModal onClose={() => setShowAddModal(false)} />
      )}

    </div>
  );
};

// Sub-component for adding new student
const SiswaAddModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { addSiswa } = useSchool();

  const [nama, setNama] = useState('');
  const [nis, setNis] = useState('2425070' + Math.floor(10 + Math.random() * 89));
  const [nisn, setNisn] = useState('009' + Math.floor(1000000 + Math.random() * 8999999));
  const [nik, setNik] = useState('320411' + Math.floor(1000000000 + Math.random() * 8999999999));
  const [jenisKelamin, setJenisKelamin] = useState<'L' | 'P'>('L');
  const [kelas, setKelas] = useState('7A');
  const [tempatLahir, setTempatLahir] = useState('Nusantara');
  const [tanggalLahir, setTanggalLahir] = useState('2012-06-15');
  const [namaWali, setNamaWali] = useState('');
  const [noHpWali, setNoHpWali] = useState('');
  const [alamat, setAlamat] = useState('');
  const [jalurPendaftaran, setJalurPendaftaran] = useState<'Zonasi' | 'Afirmasi' | 'Prestasi' | 'Perpindahan Tugas'>('Zonasi');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !namaWali) {
      alert('Mohon lengkapi Nama Siswa dan Nama Wali Murid.');
      return;
    }

    addSiswa({
      nis,
      nisn,
      nik,
      nama,
      jenisKelamin,
      kelas,
      tempatLahir,
      tanggalLahir,
      namaWali,
      noHpWali: noHpWali || '0812-3344-5566',
      alamat: alamat || 'Jl. Pendidikan No. 10',
      jalurPendaftaran,
      status: 'Aktif',
      fotoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 text-xs">
        <div className="bg-blue-950 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base">Tambah Data Siswa Baru (Format Dapodik)</h3>
            <p className="text-xs text-blue-200">Validasi otomatis Nomor Induk Siswa & NIK</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          <div>
            <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Siswa *</label>
            <input
              type="text"
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Sesuai Akta Kelahiran"
              className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-semibold"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">NIS *</label>
              <input
                type="text"
                required
                value={nis}
                onChange={(e) => setNis(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">NISN (10 Digit) *</label>
              <input
                type="text"
                required
                value={nisn}
                onChange={(e) => setNisn(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-mono font-bold text-blue-900"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">NIK (KTP/KK) *</label>
              <input
                type="text"
                required
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Rombel / Kelas *</label>
              <select
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-bold"
              >
                <option value="7A">7A</option>
                <option value="7B">7B</option>
                <option value="7C">7C</option>
                <option value="8A">8A</option>
                <option value="8B">8B</option>
                <option value="9A">9A</option>
                <option value="9B">9B</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Jenis Kelamin</label>
              <select
                value={jenisKelamin}
                onChange={(e) => setJenisKelamin(e.target.value as 'L' | 'P')}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
              >
                <option value="L">Laki-laki (L)</option>
                <option value="P">Perempuan (P)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Jalur Masuk PPDB</label>
              <select
                value={jalurPendaftaran}
                onChange={(e) => setJalurPendaftaran(e.target.value as any)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
              >
                <option value="Zonasi">Zonasi</option>
                <option value="Prestasi">Prestasi</option>
                <option value="Afirmasi">Afirmasi</option>
                <option value="Perpindahan Tugas">Perpindahan Tugas</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tempat Lahir</label>
              <input
                type="text"
                value={tempatLahir}
                onChange={(e) => setTempatLahir(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tanggal Lahir</label>
              <input
                type="date"
                value={tanggalLahir}
                onChange={(e) => setTanggalLahir(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Orang Tua / Wali *</label>
              <input
                type="text"
                required
                value={namaWali}
                onChange={(e) => setNamaWali(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp / HP</label>
              <input
                type="text"
                value={noHpWali}
                onChange={(e) => setNoHpWali(e.target.value)}
                placeholder="0812-xxxx-xxxx"
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Alamat Tempat Tinggal</label>
            <input
              type="text"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              placeholder="Nama jalan, RT/RW, kelurahan"
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
              className="px-5 py-2.5 bg-blue-800 hover:bg-blue-900 text-white font-bold rounded-xl shadow-md cursor-pointer"
            >
              Simpan Data Siswa
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
