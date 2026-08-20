export type UserRole = 
  | 'kepala_sekolah' 
  | 'kepala_tu' 
  | 'staf_persuratan' 
  | 'staf_keuangan' 
  | 'staf_kesiswaan'
  | 'waka_guru';

export interface UserPermission {
  module: 'persuratan' | 'kesiswaan' | 'keuangan' | 'kepegawaian' | 'inventaris' | 'laporan';
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: UserRole;
  level: 1 | 2 | 3 | 4 | 5; // 1: Kepala Sekolah, 2: Kepala TU, 3: Bendahara, 4: Staf Persuratan/Kesiswaan, 5: Guru
  levelName: string;
  title?: string;
  roleTitle: string;
  nip?: string;
  avatar: string;
  email: string;
  allowedModules: string[];
  permissionsDescription: string;
}

export type SifatSurat = 'Sangat Segera' | 'Segera' | 'Biasa' | 'Rahasia';
export type StatusSuratMasuk = 'Diterima TU' | 'Menunggu Disposisi' | 'Terdisposisi' | 'Dalam Proses' | 'Selesai' | 'Diarsipkan';
export type StatusSuratKeluar = 'Draft' | 'Menunggu Persetujuan' | 'Disetujui Kepsek' | 'Ditolak' | 'Terkirim' | 'Diarsipkan';

export interface DisposisiAction {
  id: string;
  instruksi: string; // misal: "Tindak Lanjuti", "Hadiri / Wakili", "Pelajari & Laporkan", "Arsipkan", dll
  diteruskanKepada: string[]; // nama/jabatan staf misal: ["Waka Kurikulum", "Guru BK"]
  catatanKepsek: string;
  batasWaktu?: string;
  tanggalDisposisi: string;
  pemberiDisposisi: string; // Biasanya Kepala Sekolah
  tindakLanjut?: {
    pelaksana: string;
    tanggalLaporan: string;
    catatanHasil: string;
    status: 'Dalam Proses' | 'Selesai';
    lampiranBukti?: string;
  };
}

export interface SuratMasuk {
  id: string;
  noAgenda: string;
  noSuratAsal: string;
  pengirim: string;
  instansiPengirim: string;
  tanggalSurat: string;
  tanggalTerima: string;
  perihal: string;
  ringkasan: string;
  sifat: SifatSurat;
  kategori: string;
  status: StatusSuratMasuk;
  statusDisposisi?: 'Belum Disposisi' | 'Sedang Diproses' | 'Selesai';
  fileUrl?: string;
  fileName?: string;
  disposisiList: DisposisiAction[];
  catatanTU?: string;
}

export interface SuratKeluar {
  id: string;
  noSurat: string;
  kodeKlasifikasi: string; // e.g. 421.3 (Kesiswaan), 800 (Kepegawaian), 005 (Undangan)
  tujuan: string;
  instansiTujuan: string;
  perihal: string;
  tanggalSurat: string;
  isiRingkas: string;
  penandatangan: string;
  status: StatusSuratKeluar;
  sifat: SifatSurat;
  templateType?: 'tugas' | 'undangan' | 'sppd' | 'suket_aktif' | 'mutasi' | 'manual';
  fileAttachment?: string;
}

export interface TemplateSuratData {
  id: string;
  type: 'tugas' | 'undangan' | 'sppd' | 'suket_aktif' | 'mutasi';
  title: string;
  nomorSurat: string;
  tanggalSurat: string;
  dasarTugas?: string;
  namaPetugas?: string[];
  jabatanPetugas?: string[];
  tujuanTugas?: string;
  lokasiTugas?: string;
  tanggalPelaksanaan?: string;
  acaraUndangan?: string;
  hariTanggalUndangan?: string;
  waktuUndangan?: string;
  tempatUndangan?: string;
  agendaUndangan?: string;
  namaSiswa?: string;
  nisnSiswa?: string;
  kelasSiswa?: string;
  keperluanSuket?: string;
  bebanAnggaran?: string;
  mataAnggaran?: string;
  kendaraan?: string;
}

export interface Siswa {
  id: string;
  nis: string;
  nisn: string;
  nik: string;
  nama: string;
  jenisKelamin: 'L' | 'P';
  kelas: string;
  tempatLahir: string;
  tanggalLahir: string;
  namaWali: string;
  noHpWali: string;
  alamat: string;
  jalurPendaftaran: 'Zonasi' | 'Afirmasi' | 'Prestasi' | 'Perpindahan Tugas';
  status: 'Aktif' | 'Mutasi Keluar' | 'Mutasi Masuk' | 'Lulus' | 'Non-Aktif';
  tanggalMutasi?: string;
  sekolahAsalTujuan?: string;
  alasanMutasi?: string;
  syncDapodik: boolean;
  fotoUrl?: string;
}

export interface Pegawai {
  id: string;
  nip?: string;
  nuptk?: string;
  nama: string;
  gelar?: string;
  jenisKelamin?: 'L' | 'P';
  jabatan: string;
  golongan?: string;
  statusKepegawaian: 'PNS' | 'PPPK' | 'GTT' | 'PTT' | 'Honorer';
  tmt?: string;
  tmtKerja?: string;
  pendidikanTerakhir: string;
  noHp: string;
  email: string;
  isSertifikasi?: boolean;
  jamMengajar?: number;
  statusPresensiHariIni?: 'Hadir' | 'Izin' | 'Sakit' | 'Dinas Luar' | 'Belum Presensi';
  berkasList?: {
    id: string;
    namaBerkas: string;
    kategori: 'SK CPNS/PNS' | 'SK Kenaikan Pangkat' | 'Sertifikat Pendidik' | 'SK Pembagian Tugas' | 'Lainnya';
    tahun: string;
    fileUrl?: string;
  }[];
}

export interface PengajuanCuti {
  id: string;
  pegawaiId: string;
  namaPegawai: string;
  nip: string;
  jenisCuti: 'Cuti Tahunan' | 'Cuti Sakit' | 'Cuti Melahirkan' | 'Cuti Alasan Penting' | 'Cuti Besar';
  tanggalMulai: string;
  tanggalSelesai: string;
  durasiHari: number;
  alasan: string;
  status: 'Menunggu Persetujuan' | 'Disetujui' | 'Ditolak';
  tanggalPengajuan: string;
}

export interface PembayaranSPP {
  id: string;
  siswaId: string;
  namaSiswa: string;
  kelas: string;
  bulan: string;
  posBayar: 'SPP / Iuran Rutin' | 'Komite Sekolah' | 'Uang Seragam & Atribut' | 'DSP / Gedung' | 'Kegiatan Ekstrakurikuler';
  nominal: number;
  tanggalBayar: string;
  metodePembayaran: 'Tunai di Kasir TU' | 'Transfer Bank' | 'QRIS' | 'Virtual Account';
  status: 'Lunas' | 'Belum Lunas' | 'Tertunda';
  noKuitansi: string;
  penerimaStaf: string;
}

export interface TransaksiKas {
  id: string;
  tanggal: string;
  tipe: 'Pemasukan' | 'Pengeluaran';
  kategori: string;
  deskripsi: string;
  nominal: number;
  saldoAkhir: number;
  penanggungJawab: string;
  buktiUrl?: string;
}

export interface BarangInventaris {
  id: string;
  kodeBarang: string;
  namaBarang: string;
  kategori: string;
  merkModel?: string;
  jumlah: number;
  satuan: string;
  ruangan: string;
  kondisi: 'Baik' | 'Rusak Ringan' | 'Rusak Berat';
  tahunPerolehan: number;
  sumberDana: string;
  nilaiAset: number;
  hargaSatuan?: number;
  terakhirDicek?: string;
}

export type InventarisBarang = BarangInventaris;

export interface AuditLog {
  id: string;
  timestamp: string;
  actor?: string;
  userNama?: string;
  role?: string;
  action: string;
  module: 'Persuratan' | 'Kesiswaan' | 'Keuangan' | 'Kepegawaian' | 'Inventaris' | 'Sistem';
  details: string;
}

export interface SchoolProfile {
  namaSekolah: string;
  npsn: string;
  akreditasi: string;
  dinas: string;
  pemerintahDaerah: string;
  alamat: string;
  kelurahanKecamatan: string;
  kotaKabupaten: string;
  provinsi: string;
  kodePos: string;
  telepon: string;
  email: string;
  website: string;
  kepalaSekolahNama: string;
  kepalaSekolahNip: string;
  kepalaTUNama: string;
  kepalaTUNip: string;
  bendaharaNama: string;
  bendaharaNip: string;
}
