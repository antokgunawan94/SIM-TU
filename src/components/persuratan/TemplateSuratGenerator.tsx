import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { OfficialKopHeader } from '../common/OfficialKopHeader';
import { TemplateSuratData } from '../../types';
import { 
  FileText, 
  Printer, 
  Sparkles, 
  Save, 
  UserCheck, 
  Calendar, 
  MapPin, 
  FileSignature, 
  X,
  Layers
} from 'lucide-react';

interface TemplateSuratGeneratorProps {
  initialType?: TemplateSuratData['type'];
  onClose?: () => void;
  onSavedToSuratKeluar?: () => void;
}

export const TemplateSuratGenerator: React.FC<TemplateSuratGeneratorProps> = ({ 
  initialType = 'tugas', 
  onClose,
  onSavedToSuratKeluar
}) => {
  const { schoolProfile, addSuratKeluar, pegawaiList, siswaList } = useSchool();

  const [activeType, setActiveType] = useState<TemplateSuratData['type']>(initialType);

  // Common Fields
  const [nomorSurat, setNomorSurat] = useState('421.3/095/SMP.01/TU/VIII/2026');
  const [tanggalSurat, setTanggalSurat] = useState(new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }));
  const [penandatangan, setPenandatangan] = useState(schoolProfile.kepalaSekolahNama);
  const [penandatanganNip, setPenandatanganNip] = useState(schoolProfile.kepalaSekolahNip);

  // Surat Tugas Fields
  const [dasarTugas, setDasarTugas] = useState('Surat Undangan Kepala Dinas Pendidikan Kab. Nusantara No. 421.2/1082/Disdik-SMP/VIII/2026 perihal Koordinasi ANBK.');
  const [petugasNama, setPetugasNama] = useState('Nurul Aini, M.Pd.');
  const [petugasNip, setPetugasNip] = useState('19791104 200604 2 012');
  const [petugasJabatan, setPetugasJabatan] = useState('Waka Kurikulum / Guru Madya');
  const [tujuanTugas, setTujuanTugas] = useState('Mengikuti Rapat Koordinasi dan Bimbingan Teknis Pelaksanaan ANBK SMP Tahun 2026.');
  const [lokasiTugas, setLokasiTugas] = useState('Aula Utama Dinas Pendidikan Kab. Nusantara');
  const [waktuPelaksanaan, setWaktuPelaksanaan] = useState('Sabtu, 22 Agustus 2026 (Pukul 08.00 WIB s.d. Selesai)');

  // Undangan Fields
  const [tujuanUndangan, setTujuanUndangan] = useState('Bapak/Ibu Orang Tua / Wali Murid Kelas 7');
  const [perihalUndangan, setPerihalUndangan] = useState('Undangan Sosialisasi Kurikulum Merdeka & Musyawarah Komite');
  const [hariTanggalUndangan, setHariTanggalUndangan] = useState('Sabtu, 29 Agustus 2026');
  const [waktuUndangan, setWaktuUndangan] = useState('08.30 - 11.30 WIB');
  const [tempatUndangan, setTempatUndangan] = useState('Aula Serbaguna SMP Negeri 1 Nusantara');
  const [agendaUndangan, setAgendaUndangan] = useState('1. Pemaparan Program Kurikulum Merdeka & Ekstrakurikuler\n2. Musyawarah Rencana Kerja Komite Sekolah TP 2026/2027');

  // Suket Siswa Aktif Fields
  const [siswaNama, setSiswaNama] = useState('Aditya Pratama Putra');
  const [siswaNis, setSiswaNis] = useState('242507001');
  const [siswaNisn, setSiswaNisn] = useState('0098412034');
  const [siswaKelas, setSiswaKelas] = useState('7A');
  const [siswaAlamat, setSiswaAlamat] = useState('Jl. Melati No. 12, Kel. Sukamaju');
  const [keperluanSuket, setKeperluanSuket] = useState('Kelengkapan Berkas Pencairan Beasiswa Program Indonesia Pintar (PIP) di Bank Penyalur.');

  // Mutasi Siswa Fields
  const [mutasiSekolahTujuan, setMutasiSekolahTujuan] = useState('SMP Negeri 3 Kota Bandung');
  const [mutasiAlasan, setMutasiAlasan] = useState('Mengikuti perpindahan tugas kedinasan orang tua.');

  // Helper Auto Select Teacher
  const handleSelectPegawai = (pegawaiId: string) => {
    const p = pegawaiList.find(item => item.id === pegawaiId);
    if (p) {
      setPetugasNama(p.nama);
      setPetugasNip(p.nip || '-');
      setPetugasJabatan(p.jabatan);
    }
  };

  // Helper Auto Select Student
  const handleSelectSiswa = (siswaId: string) => {
    const s = siswaList.find(item => item.id === siswaId);
    if (s) {
      setSiswaNama(s.nama);
      setSiswaNis(s.nis);
      setSiswaNisn(s.nisn);
      setSiswaKelas(s.kelas);
      setSiswaAlamat(s.alamat);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveToSuratKeluar = () => {
    let perihal = '';
    let tujuan = '';
    let kodeKlasifikasi = '421.3';

    if (activeType === 'tugas') {
      perihal = `Surat Tugas a.n. ${petugasNama}`;
      tujuan = petugasNama;
      kodeKlasifikasi = '800';
    } else if (activeType === 'undangan') {
      perihal = perihalUndangan;
      tujuan = tujuanUndangan;
      kodeKlasifikasi = '005';
    } else if (activeType === 'suket_aktif') {
      perihal = `Surat Keterangan Siswa Aktif a.n. ${siswaNama}`;
      tujuan = `Wali Siswa / ${siswaNama}`;
      kodeKlasifikasi = '421.2';
    } else if (activeType === 'mutasi') {
      perihal = `Surat Keterangan Pindah Sekolah (Mutasi) a.n. ${siswaNama}`;
      tujuan = mutasiSekolahTujuan;
      kodeKlasifikasi = '422.1';
    }

    addSuratKeluar({
      kodeKlasifikasi,
      tujuan,
      instansiTujuan: tujuanUndangan || 'Internal / Eksternal',
      perihal,
      tanggalSurat: new Date().toISOString().slice(0, 10),
      isiRingkas: `Dibuat melalui Generator Template Surat Resmi (${activeType.toUpperCase()})`,
      penandatangan: schoolProfile.kepalaSekolahNama,
      sifat: 'Biasa',
      templateType: activeType
    });

    alert('Surat resmi berhasil di-generate dan disimpan ke daftar Buku Register Surat Keluar!');
    if (onSavedToSuratKeluar) onSavedToSuratKeluar();
  };

  return (
    <div className="space-y-6">
      
      {/* Template Chooser Bar (Hidden in Print) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 text-indigo-800 rounded-xl">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">Generator & Pembuat Template Surat Dinas Resmi</h3>
            <p className="text-xs text-slate-500">Pilih format template standar Kemendikbudristek & Pemerintah Daerah</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'tugas', label: '1. Surat Perintah Tugas (ST)' },
            { id: 'undangan', label: '2. Surat Undangan Rapat' },
            { id: 'suket_aktif', label: '3. Suket Siswa Aktif / PIP' },
            { id: 'mutasi', label: '4. Suket Pindah / Mutasi' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveType(tab.id as TemplateSuratData['type'])}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeType === tab.id
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Controls (Form Input) + Right Document Paper Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Dynamic Form Configuration (Hidden in Print) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs print:hidden">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <FileSignature className="w-4 h-4 text-blue-700" />
              Parameter Format Dokumen
            </h4>
            <span className="text-[11px] font-mono text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded-sm">
              Tipe: {activeType.toUpperCase()}
            </span>
          </div>

          {/* Form Fields: Surat Tugas */}
          {activeType === 'tugas' && (
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih Cepat Guru/Tendik yang Ditugaskan:</label>
                <select
                  onChange={(e) => handleSelectPegawai(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 font-medium"
                >
                  <option value="">-- Pilih dari Database Pegawai --</option>
                  {pegawaiList.map(p => (
                    <option key={p.id} value={p.id}>{p.nama} ({p.jabatan})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Petugas / Yang Ditugaskan *</label>
                <input
                  type="text"
                  value={petugasNama}
                  onChange={(e) => setPetugasNama(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl bg-white font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">NIP Petugas</label>
                  <input
                    type="text"
                    value={petugasNip}
                    onChange={(e) => setPetugasNip(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xl bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jabatan / Golongan</label>
                  <input
                    type="text"
                    value={petugasJabatan}
                    onChange={(e) => setPetugasJabatan(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xl bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Dasar Penugasan</label>
                <textarea
                  rows={2}
                  value={dasarTugas}
                  onChange={(e) => setDasarTugas(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tujuan & Maksud Penugasan *</label>
                <textarea
                  rows={2}
                  value={tujuanTugas}
                  onChange={(e) => setTujuanTugas(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Waktu & Tempat Pelaksanaan</label>
                <input
                  type="text"
                  value={waktuPelaksanaan}
                  onChange={(e) => setWaktuPelaksanaan(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl bg-white mb-2"
                />
                <input
                  type="text"
                  value={lokasiTugas}
                  onChange={(e) => setLokasiTugas(e.target.value)}
                  placeholder="Lokasi tempat tugas"
                  className="w-full p-2 border border-slate-300 rounded-xl bg-white"
                />
              </div>
            </div>
          )}

          {/* Form Fields: Undangan */}
          {activeType === 'undangan' && (
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kepada Yth (Tujuan Undangan) *</label>
                <input
                  type="text"
                  value={tujuanUndangan}
                  onChange={(e) => setTujuanUndangan(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl bg-white font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Perihal Undangan</label>
                <input
                  type="text"
                  value={perihalUndangan}
                  onChange={(e) => setPerihalUndangan(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hari & Tanggal</label>
                  <input
                    type="text"
                    value={hariTanggalUndangan}
                    onChange={(e) => setHariTanggalUndangan(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Waktu / Pukul</label>
                  <input
                    type="text"
                    value={waktuUndangan}
                    onChange={(e) => setWaktuUndangan(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xl bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tempat Acara</label>
                <input
                  type="text"
                  value={tempatUndangan}
                  onChange={(e) => setTempatUndangan(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Susunan Agenda Rapat</label>
                <textarea
                  rows={3}
                  value={agendaUndangan}
                  onChange={(e) => setAgendaUndangan(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl bg-white font-mono text-[11px]"
                />
              </div>
            </div>
          )}

          {/* Form Fields: Suket Siswa */}
          {activeType === 'suket_aktif' && (
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih Cepat dari Database Siswa:</label>
                <select
                  onChange={(e) => handleSelectSiswa(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 font-medium"
                >
                  <option value="">-- Pilih Siswa Terdaftar --</option>
                  {siswaList.map(s => (
                    <option key={s.id} value={s.id}>{s.nama} ({s.kelas} - NISN: {s.nisn})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Siswa *</label>
                <input
                  type="text"
                  value={siswaNama}
                  onChange={(e) => setSiswaNama(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl bg-white font-semibold"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">NIS</label>
                  <input
                    type="text"
                    value={siswaNis}
                    onChange={(e) => setSiswaNis(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xl bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">NISN</label>
                  <input
                    type="text"
                    value={siswaNisn}
                    onChange={(e) => setSiswaNisn(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xl bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kelas</label>
                  <input
                    type="text"
                    value={siswaKelas}
                    onChange={(e) => setSiswaKelas(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xl bg-white font-bold text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Keperluan Penerbitan Suket</label>
                <textarea
                  rows={2}
                  value={keperluanSuket}
                  onChange={(e) => setKeperluanSuket(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl bg-white"
                />
              </div>
            </div>
          )}

          {/* Form Fields: Mutasi */}
          {activeType === 'mutasi' && (
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih Siswa yang Mutasi:</label>
                <select
                  onChange={(e) => handleSelectSiswa(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 font-medium"
                >
                  <option value="">-- Pilih Siswa --</option>
                  {siswaList.map(s => (
                    <option key={s.id} value={s.id}>{s.nama} ({s.kelas})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Siswa *</label>
                <input
                  type="text"
                  value={siswaNama}
                  onChange={(e) => setSiswaNama(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl bg-white font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Sekolah Tujuan Mutasi *</label>
                <input
                  type="text"
                  value={mutasiSekolahTujuan}
                  onChange={(e) => setMutasiSekolahTujuan(e.target.value)}
                  placeholder="Contoh: SMP Negeri 3 Kota Bandung"
                  className="w-full p-2 border border-slate-300 rounded-xl bg-white font-bold text-blue-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Alasan Kepindahan</label>
                <textarea
                  rows={2}
                  value={mutasiAlasan}
                  onChange={(e) => setMutasiAlasan(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl bg-white"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handlePrint}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold shadow-md shadow-blue-700/20 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Cetak Dokumen (Print / PDF)
            </button>
            <button
              type="button"
              onClick={handleSaveToSuratKeluar}
              className="w-full inline-flex items-center justify-center gap-2 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Simpan ke Register Surat Keluar
            </button>
          </div>

        </div>

        {/* Right Side: Live Printable Sheet (A4 Layout Paper) */}
        <div className="lg:col-span-7 bg-slate-300/40 p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-inner flex justify-center print:p-0 print:bg-white print:border-none print:shadow-none print:w-full print:block">
          
          <div className="bg-white p-8 sm:p-10 rounded-sm shadow-xl max-w-[210mm] w-full min-h-[297mm] text-gray-900 font-serif text-xs leading-relaxed print:shadow-none print:p-0 print:border-none">
            
            {/* Official Letterhead */}
            <OfficialKopHeader />

            {/* Content: SURAT PERINTAH TUGAS */}
            {activeType === 'tugas' && (
              <div className="mt-4 space-y-4">
                <div className="text-center">
                  <h3 className="text-base font-extrabold uppercase tracking-widest text-black border-b-2 border-black inline-block pb-0.5">
                    SURAT PERINTAH TUGAS
                  </h3>
                  <p className="font-sans text-[11px] font-medium text-gray-700 mt-1">
                    Nomor: {nomorSurat}
                  </p>
                </div>

                <div className="space-y-3 font-sans text-xs">
                  <div className="flex items-start">
                    <span className="w-24 font-bold text-gray-800 flex-shrink-0">Dasar</span>
                    <span className="mr-2">:</span>
                    <span className="flex-1 text-gray-800">{dasarTugas}</span>
                  </div>

                  <div className="text-center my-3 font-serif font-bold tracking-widest">
                    MEMERINTAHKAN:
                  </div>

                  <div className="flex items-start">
                    <span className="w-24 font-bold text-gray-800 flex-shrink-0">Kepada</span>
                    <span className="mr-2">:</span>
                    <div className="flex-1 space-y-1">
                      <div className="flex">
                        <span className="w-24 text-gray-600">Nama</span>
                        <span className="mr-1">:</span>
                        <span className="font-bold text-gray-900">{petugasNama}</span>
                      </div>
                      <div className="flex">
                        <span className="w-24 text-gray-600">NIP</span>
                        <span className="mr-1">:</span>
                        <span className="font-mono text-gray-900">{petugasNip}</span>
                      </div>
                      <div className="flex">
                        <span className="w-24 text-gray-600">Jabatan</span>
                        <span className="mr-1">:</span>
                        <span className="text-gray-900">{petugasJabatan}</span>
                      </div>
                      <div className="flex">
                        <span className="w-24 text-gray-600">Unit Kerja</span>
                        <span className="mr-1">:</span>
                        <span className="text-gray-900">{schoolProfile.namaSekolah}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start pt-2">
                    <span className="w-24 font-bold text-gray-800 flex-shrink-0">Untuk</span>
                    <span className="mr-2">:</span>
                    <div className="flex-1 space-y-1 text-gray-900">
                      <p>1. {tujuanTugas}</p>
                      <p>2. Waktu: {waktuPelaksanaan}</p>
                      <p>3. Tempat: {lokasiTugas}</p>
                      <p>4. Melaporkan hasil pelaksanaan tugas kepada Kepala Sekolah setelah kegiatan selesai.</p>
                    </div>
                  </div>

                  <p className="pt-2 text-gray-800 leading-normal">
                    Demikian Surat Perintah Tugas ini dibuat untuk dilaksanakan dengan penuh tanggung jawab dan dedikasi.
                  </p>
                </div>
              </div>
            )}

            {/* Content: SURAT UNDANGAN */}
            {activeType === 'undangan' && (
              <div className="mt-4 space-y-4">
                <div className="flex justify-between items-start font-sans text-xs">
                  <div className="space-y-1">
                    <div className="flex">
                      <span className="w-20 font-semibold text-gray-700">Nomor</span>
                      <span className="mr-1">:</span>
                      <span className="font-mono text-gray-900">{nomorSurat}</span>
                    </div>
                    <div className="flex">
                      <span className="w-20 font-semibold text-gray-700">Lampiran</span>
                      <span className="mr-1">:</span>
                      <span>-</span>
                    </div>
                    <div className="flex">
                      <span className="w-20 font-semibold text-gray-700">Perihal</span>
                      <span className="mr-1">:</span>
                      <span className="font-bold text-gray-900">{perihalUndangan}</span>
                    </div>
                  </div>

                  <div className="text-right font-sans text-xs">
                    <p className="text-gray-800">Nusantara, {tanggalSurat}</p>
                    <p className="font-bold text-gray-900 mt-2 text-left">Kepada Yth.</p>
                    <p className="text-gray-900 text-left font-semibold">{tujuanUndangan}</p>
                    <p className="text-gray-700 text-left">di Tempat</p>
                  </div>
                </div>

                <div className="space-y-3 font-sans text-xs text-gray-900 pt-2">
                  <p>Dengan hormat,</p>
                  <p className="leading-relaxed">
                    Sehubungan dengan pelaksanaan program kerja tahun ajaran baru serta guna mempererat silaturahmi dan koordinasi antara pihak sekolah dengan orang tua/wali murid, kami mengharap kehadiran Bapak/Ibu pada:
                  </p>

                  <div className="pl-6 space-y-1 py-1 font-medium bg-slate-50/70 p-3 border-l-2 border-blue-900">
                    <div className="flex">
                      <span className="w-28 text-gray-600">Hari, Tanggal</span>
                      <span className="mr-2">:</span>
                      <span className="font-bold text-gray-900">{hariTanggalUndangan}</span>
                    </div>
                    <div className="flex">
                      <span className="w-28 text-gray-600">Waktu</span>
                      <span className="mr-2">:</span>
                      <span className="font-bold text-gray-900">{waktuUndangan}</span>
                    </div>
                    <div className="flex">
                      <span className="w-28 text-gray-600">Tempat</span>
                      <span className="mr-2">:</span>
                      <span className="text-gray-900">{tempatUndangan}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="w-28 text-gray-600">Agenda</span>
                      <span className="mr-2">:</span>
                      <span className="text-gray-900 whitespace-pre-line">{agendaUndangan}</span>
                    </div>
                  </div>

                  <p className="leading-relaxed">
                    Mengingat pentingnya acara tersebut, kami sangat mengharapkan kehadiran Bapak/Ibu tepat pada waktunya. Atas perhatian dan kerja sama yang baik, kami ucapkan terima kasih.
                  </p>
                </div>
              </div>
            )}

            {/* Content: SUKET SISWA AKTIF */}
            {activeType === 'suket_aktif' && (
              <div className="mt-4 space-y-4">
                <div className="text-center">
                  <h3 className="text-base font-extrabold uppercase tracking-widest text-black border-b-2 border-black inline-block pb-0.5">
                    SURAT KETERANGAN SISWA AKTIF
                  </h3>
                  <p className="font-sans text-[11px] font-medium text-gray-700 mt-1">
                    Nomor: {nomorSurat}
                  </p>
                </div>

                <div className="space-y-3 font-sans text-xs text-gray-900">
                  <p>Yang bertanda tangan di bawah ini:</p>
                  
                  <div className="pl-6 space-y-1">
                    <div className="flex">
                      <span className="w-32 text-gray-600">Nama</span>
                      <span className="mr-2">:</span>
                      <span className="font-bold">{schoolProfile.kepalaSekolahNama}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-gray-600">NIP</span>
                      <span className="mr-2">:</span>
                      <span className="font-mono">{schoolProfile.kepalaSekolahNip}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-gray-600">Jabatan</span>
                      <span className="mr-2">:</span>
                      <span>Kepala {schoolProfile.namaSekolah}</span>
                    </div>
                  </div>

                  <p className="pt-1">Dengan ini menerangkan bahwa:</p>

                  <div className="pl-6 space-y-1 bg-slate-50/80 p-3 border border-slate-200 rounded-sm">
                    <div className="flex">
                      <span className="w-32 text-gray-600">Nama Siswa</span>
                      <span className="mr-2">:</span>
                      <span className="font-bold text-gray-950 uppercase">{siswaNama}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-gray-600">Nomor Induk Siswa (NIS)</span>
                      <span className="mr-2">:</span>
                      <span className="font-mono font-semibold">{siswaNis}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-gray-600">NISN</span>
                      <span className="mr-2">:</span>
                      <span className="font-mono font-bold text-blue-900">{siswaNisn}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-gray-600">Kelas</span>
                      <span className="mr-2">:</span>
                      <span className="font-bold">{siswaKelas} (Tujuh)</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-gray-600">Alamat</span>
                      <span className="mr-2">:</span>
                      <span>{siswaAlamat}</span>
                    </div>
                  </div>

                  <p className="leading-relaxed pt-1">
                    Adalah benar-benar siswa yang terdaftar aktif mengikuti proses belajar mengajar pada Semester Ganjil Tahun Ajaran 2026/2027 di {schoolProfile.namaSekolah}.
                  </p>
                  <p className="leading-relaxed">
                    Surat Keterangan ini diterbitkan untuk dipergunakan sebagai: <span className="font-semibold">{keperluanSuket}</span>
                  </p>
                  <p>
                    Demikian surat keterangan ini kami buat dengan sebenarnya agar dapat dipergunakan sebagaimana mestinya.
                  </p>
                </div>
              </div>
            )}

            {/* Content: MUTASI SISWA */}
            {activeType === 'mutasi' && (
              <div className="mt-4 space-y-4">
                <div className="text-center">
                  <h3 className="text-base font-extrabold uppercase tracking-widest text-black border-b-2 border-black inline-block pb-0.5">
                    SURAT KETERANGAN PINDAH SEKOLAH (MUTASI)
                  </h3>
                  <p className="font-sans text-[11px] font-medium text-gray-700 mt-1">
                    Nomor: {nomorSurat}
                  </p>
                </div>

                <div className="space-y-3 font-sans text-xs text-gray-900">
                  <p>Yang bertanda tangan di bawah ini Kepala {schoolProfile.namaSekolah}, menerangkan bahwa:</p>
                  
                  <div className="pl-6 space-y-1 bg-slate-50/80 p-3 border border-slate-200">
                    <div className="flex">
                      <span className="w-32 text-gray-600">Nama Siswa</span>
                      <span className="mr-2">:</span>
                      <span className="font-bold text-gray-950 uppercase">{siswaNama}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-gray-600">NIS / NISN</span>
                      <span className="mr-2">:</span>
                      <span className="font-mono">{siswaNis} / {siswaNisn}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-gray-600">Tingkat / Kelas</span>
                      <span className="mr-2">:</span>
                      <span className="font-bold">{siswaKelas}</span>
                    </div>
                  </div>

                  <p className="leading-relaxed">
                    Telah resmi pindah / mutasi keluar dari {schoolProfile.namaSekolah} ke:
                  </p>

                  <div className="pl-6 space-y-1 font-semibold text-blue-950 bg-blue-50/50 p-2.5 border border-blue-200">
                    <div className="flex">
                      <span className="w-32 text-gray-600">Sekolah Tujuan</span>
                      <span className="mr-2">:</span>
                      <span className="font-bold">{mutasiSekolahTujuan}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-gray-600">Alasan Pindah</span>
                      <span className="mr-2">:</span>
                      <span>{mutasiAlasan}</span>
                    </div>
                  </div>

                  <p className="leading-relaxed pt-1">
                    Surat mutasi ini disertai dengan Buku Laporan Hasil Belajar (Rapor) dan Surat Permohonan Orang Tua/Wali Murid yang bersangkutan.
                  </p>
                </div>
              </div>
            )}

            {/* Bottom Signature & QR Code Official Verification */}
            <div className="mt-8 pt-4 grid grid-cols-2 font-sans text-xs">
              <div className="flex items-end">
                <div className="flex items-center gap-2">
                  <div className="w-14 h-14 border border-gray-400 p-1 flex items-center justify-center bg-gray-50">
                    <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center text-[7px] text-white text-center font-mono">
                      <span>BSRE</span>
                      <span>DIGI-SIGN</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-500">
                    <p className="font-semibold text-gray-700">Validasi Sertifikasi BSrE / TTE</p>
                    <p>Dokumen Resmi SMPN 1 Nusantara</p>
                    <p className="font-mono">ID: DOC-2026-VIII</p>
                  </div>
                </div>
              </div>

              <div className="text-center space-y-1">
                <p className="text-gray-700">Nusantara, {tanggalSurat}</p>
                <p className="font-bold text-gray-900">Kepala Sekolah,</p>
                
                {/* Stamp & Signature Box */}
                <div className="py-2">
                  <div className="inline-block px-3 py-1 bg-blue-50 border border-blue-300 text-blue-900 text-[10px] font-mono font-bold rounded-sm">
                    [ TANDATANGAN ELEKTRONIK SAH ]
                  </div>
                </div>

                <p className="font-bold text-gray-900 underline text-sm">{schoolProfile.kepalaSekolahNama}</p>
                <p className="text-gray-600 font-mono text-[11px]">NIP. {schoolProfile.kepalaSekolahNip}</p>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
