import { 
  SuratMasuk, 
  SuratKeluar, 
  Siswa, 
  Pegawai, 
  PembayaranSPP, 
  TransaksiKas, 
  BarangInventaris, 
  AuditLog, 
  SchoolProfile,
  UserProfile
} from '../types';

export const initialSchoolProfile: SchoolProfile = {
  namaSekolah: 'SMP NEGERI 1 NUSANTARA',
  npsn: '20104589',
  akreditasi: 'A (Unggul)',
  dinas: 'DINAS PENDIDIKAN DAN KEBUDAYAAN',
  pemerintahDaerah: 'PEMERINTAH KABUPATEN NUSANTARA',
  alamat: 'Jl. Merdeka Belajar No. 45, Kompleks Pendidikan',
  kelurahanKecamatan: 'Kec. Nusantara Pusat',
  kotaKabupaten: 'Kabupaten Nusantara',
  provinsi: 'Provinsi Jawa Barat',
  kodePos: '40115',
  telepon: '(022) 7564-8901',
  email: 'smpn1nusantara@pendidikan.go.id',
  website: 'smpn1nusantara.sch.id',
  kepalaSekolahNama: 'Drs. H. Bambang Sudirman, M.Pd.',
  kepalaSekolahNip: '19680512 199403 1 004',
  kepalaTUNama: 'Siti Rahmawati, S.AP.',
  kepalaTUNip: '19760315 200212 2 003',
  bendaharaNama: 'Agus Setiawan, S.E.',
  bendaharaNip: '19830820 200902 1 005'
};

export const sampleUsers: UserProfile[] = [
  {
    id: 'user-kepsek',
    username: 'kepsek',
    password: '123',
    name: 'Drs. H. Bambang Sudirman, M.Pd.',
    role: 'kepala_sekolah',
    level: 1,
    levelName: 'Level 1 - Kepala Sekolah (Super Admin / Approval)',
    roleTitle: 'Kepala Sekolah',
    nip: '19680512 199403 1 004',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    email: 'bambang.sudirman@smpn1nusantara.sch.id',
    allowedModules: ['dashboard', 'persuratan-masuk', 'persuratan-keluar', 'generator-surat', 'kesiswaan', 'keuangan', 'kepegawaian', 'inventaris'],
    permissionsDescription: 'Hak Akses Penuh: Persetujuan Disposisi, Pengesahan TTE Surat Keluar, Approval Cuti GTK, & Monitoring Seluruh Modul'
  },
  {
    id: 'user-ktu',
    username: 'ktu',
    password: '123',
    name: 'Siti Rahmawati, S.AP.',
    role: 'kepala_tu',
    level: 2,
    levelName: 'Level 2 - Kepala Tata Usaha (Koordinator Administrasi)',
    roleTitle: 'Kepala Tata Usaha (KTU)',
    nip: '19760315 200212 2 003',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    email: 'siti.rahmawati@tu.smpn1nusantara.sch.id',
    allowedModules: ['dashboard', 'persuratan-masuk', 'persuratan-keluar', 'generator-surat', 'kesiswaan', 'keuangan', 'kepegawaian', 'inventaris'],
    permissionsDescription: 'Manajemen Operasional TU: Verifikasi Persuratan, Validasi Data Siswa Dapodik, Rekap Kepegawaian & Inventaris Sarpras'
  },
  {
    id: 'user-keuangan',
    username: 'bendahara',
    password: '123',
    name: 'Agus Setiawan, S.E.',
    role: 'staf_keuangan',
    level: 3,
    levelName: 'Level 3 - Bendahara Sekolah (Keuangan & SPP)',
    roleTitle: 'Bendahara Sekolah / Kasir TU',
    nip: '19830820 200902 1 005',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    email: 'agus.bendahara@smpn1nusantara.sch.id',
    allowedModules: ['dashboard', 'keuangan', 'kesiswaan'],
    permissionsDescription: 'Otoritas Keuangan: Loket Kasir SPP/Komite, Penerbitan Kuitansi Resmi, Pembukuan Kas BOS & Laporan Keuangan'
  },
  {
    id: 'user-surat',
    username: 'persuratan',
    password: '123',
    name: 'Rian Hidayat, A.Md.',
    role: 'staf_persuratan',
    level: 4,
    levelName: 'Level 4 - Staf Persuratan & Arsiparis',
    roleTitle: 'Staf Administrasi Persuratan',
    nip: '19920410 201903 1 008',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    email: 'rian.persuratan@smpn1nusantara.sch.id',
    allowedModules: ['dashboard', 'persuratan-masuk', 'persuratan-keluar', 'generator-surat'],
    permissionsDescription: 'Administrasi Persuratan: Pencatatan Agenda Surat Masuk, Cetak Lembar Disposisi, Draf Surat Keluar, & Generator Template Dinas'
  },
  {
    id: 'user-kesiswaan',
    username: 'kesiswaan',
    password: '123',
    name: 'Budi Santoso, S.Kom.',
    role: 'staf_kesiswaan',
    level: 4,
    levelName: 'Level 4 - Staf Kesiswaan & Operator Dapodik',
    roleTitle: 'Staf Kesiswaan & Dapodik',
    nip: '19850612 201101 1 007',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    email: 'budi.dapodik@smpn1nusantara.sch.id',
    allowedModules: ['dashboard', 'kesiswaan', 'inventaris'],
    permissionsDescription: 'Administrasi Kesiswaan: Pengelolaan Database Siswa, Sinkronisasi Dapodik, Mutasi Siswa, & Cetak Kartu Pelajar Digital'
  },
  {
    id: 'user-belajarid',
    username: 'antokgunawan94',
    password: '123',
    name: 'Antok Gunawan, S.Pd.',
    role: 'waka_guru',
    level: 5,
    levelName: 'Level 5 - Guru & Tendik (Akun belajar.id)',
    roleTitle: 'Guru / Tenaga Pendidik',
    nip: '19940812 202203 1 009',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    email: 'antokgunawan94@guru.smp.belajar.id',
    allowedModules: ['dashboard', 'persuratan-masuk', 'generator-surat', 'kepegawaian'],
    permissionsDescription: 'Portal Guru & Tendik: Menerima Disposisi Tugas, Tindak Lanjut Surat Masuk, Pengajuan Cuti, & Surat Keterangan'
  }
];

export const initialSuratMasuk: SuratMasuk[] = [
  {
    id: 'SM-2026-001',
    noAgenda: 'AG/089/TU/2026',
    noSuratAsal: '421.2/1082/Disdik-SMP/VIII/2026',
    pengirim: 'Kepala Dinas Pendidikan Kab. Nusantara',
    instansiPengirim: 'Dinas Pendidikan & Kebudayaan Kab. Nusantara',
    tanggalSurat: '2026-08-14',
    tanggalTerima: '2026-08-16',
    perihal: 'Undangan Rapat Koordinasi Persiapan Asesmen Nasional Berbasis Komputer (ANBK) SMP Tahun 2026',
    ringkasan: 'Permohonan kehadiran Kepala Sekolah dan Proktor/Teknisi ANBK dalam rakor persiapan simulasi ANBK tingkat Kabupaten pada tanggal 22 Agustus 2026 di Aula Disdik.',
    sifat: 'Sangat Segera',
    kategori: 'Dinas Pendidikan',
    status: 'Terdisposisi',
    fileName: 'Surat_Undangan_ANBK_2026_Disdik.pdf',
    catatanTU: 'Sudah dicatat di buku agenda. Memerlukan penunjukan Proktor & Teknisi Lab Komputer.',
    disposisiList: [
      {
        id: 'DISP-001',
        instruksi: 'Hadiri & Koordinasikan Segera',
        diteruskanKepada: ['Waka Kurikulum', 'Kepala Lab Komputer / Proktor'],
        catatanKepsek: 'Tolong Bu Nurul (Waka Kurikulum) dan Mas Fajar (Proktor) menghadiri rakor ini. Siapkan laporan kesiapan 40 unit Chromebook dan bandwidth Lab Komputer.',
        batasWaktu: '2026-08-20',
        tanggalDisposisi: '2026-08-17 09:30',
        pemberiDisposisi: 'Drs. H. Bambang Sudirman, M.Pd.',
        tindakLanjut: {
          pelaksana: 'Nurul Aini, M.Pd. (Waka Kurikulum)',
          tanggalLaporan: '2026-08-18 14:15',
          catatanHasil: 'Telah dikoordinasikan dengan Proktor Lab Komputer. Surat tugas delegasi telah diajukan ke TU dan berkas kesiapan server selesai 100%.',
          status: 'Selesai',
          lampiranBukti: 'Laporan_Kesiapan_Lab_ANBK_2026.pdf'
        }
      }
    ]
  },
  {
    id: 'SM-2026-002',
    noAgenda: 'AG/090/TU/2026',
    noSuratAsal: '005/741/OSN-SMP/VIII/2026',
    pengirim: 'Balai Pengembangan Talenta Indonesia (BPTI)',
    instansiPengirim: 'Kementerian Pendidikan Dasar dan Menengah RI',
    tanggalSurat: '2026-08-15',
    tanggalTerima: '2026-08-17',
    perihal: 'Pemberitahuan Lolos Seleksi Olimpiade Sains Nasional (OSN) Tingkat Provinsi Bidang IPA & Matematika',
    ringkasan: 'Pengumuman 2 (dua) siswa SMPN 1 Nusantara lolos ke OSN Tingkat Provinsi dan jadwal pembimbingan daring.',
    sifat: 'Segera',
    kategori: 'Kementerian / Pusat',
    status: 'Menunggu Disposisi',
    fileName: 'Pengumuman_Lolos_OSN_Provinsi.pdf',
    catatanTU: 'Perlu dispensasi belajar bagi 2 siswa dan penunjukan guru pembimbing intensif.',
    disposisiList: []
  },
  {
    id: 'SM-2026-003',
    noAgenda: 'AG/091/TU/2026',
    noSuratAsal: '028/KOMITE-SMP1/VIII/2026',
    pengirim: 'H. Suryadi, S.E. (Ketua Komite)',
    instansiPengirim: 'Pengurus Komite Sekolah SMPN 1 Nusantara',
    tanggalSurat: '2026-08-16',
    tanggalTerima: '2026-08-18',
    perihal: 'Permohonan Penggunaan Aula Sekolah untuk Musyawarah Tahunan Rencana Kerja Anggaran Komite',
    ringkasan: 'Komite sekolah memohon izin pemakaian Aula dan fasilitas audio pada Sabtu, 29 Agustus 2026 pukul 08.30 WIB bersama perwakilan wali murid kelas 7.',
    sifat: 'Biasa',
    kategori: 'Orang Tua / Komite',
    status: 'Diterima TU',
    fileName: 'Surat_Permohonan_Aula_Komite.pdf',
    catatanTU: 'Jadwal aula pada tanggal tersebut kosong. Menunggu persetujuan Kepsek.',
    disposisiList: []
  },
  {
    id: 'SM-2026-004',
    noAgenda: 'AG/088/TU/2026',
    noSuratAsal: '800/412/BKPSDM/VII/2026',
    pengirim: 'Kepala BKPSDM Kabupaten Nusantara',
    instansiPengirim: 'Badan Kepegawaian & PSDM Daerah',
    tanggalSurat: '2026-07-28',
    tanggalTerima: '2026-07-30',
    perihal: 'Penyampaian SK Kenaikan Pangkat Periode Oktober 2026 untuk 4 Orang Guru PNS',
    ringkasan: 'Pengiriman petikan SK Kenaikan Pangkat Golongan III/c ke III/d bagi 4 orang guru SMP Negeri 1 Nusantara.',
    sifat: 'Biasa',
    kategori: 'Kepegawaian',
    status: 'Selesai',
    fileName: 'Petikan_SK_Pangkat_4_Guru.pdf',
    catatanTU: 'SK telah diserahkan dan diarsipkan ke buku induk kepegawaian.',
    disposisiList: [
      {
        id: 'DISP-002',
        instruksi: 'Arsipkan & Serahkan Petikan SK ke Pegawai Terkait',
        diteruskanKepada: ['Kepala Tata Usaha', 'Staf Kepegawaian'],
        catatanKepsek: 'Tolong data simpeg diperbarui dan buat tanda terima berkas untuk 4 bapak/ibu guru yang naik pangkat.',
        batasWaktu: '2026-08-05',
        tanggalDisposisi: '2026-07-31 08:00',
        pemberiDisposisi: 'Drs. H. Bambang Sudirman, M.Pd.',
        tindakLanjut: {
          pelaksana: 'Siti Rahmawati, S.AP. (Kepala TU)',
          tanggalLaporan: '2026-08-03 11:00',
          catatanHasil: 'SK telah diserahkan secara resmi saat apel pagi dan berkas fisik disimpan di lemari arsip kepegawaian.',
          status: 'Selesai'
        }
      }
    ]
  }
];

export const initialSuratKeluar: SuratKeluar[] = [
  {
    id: 'SK-2026-001',
    noSurat: '421.3/084/SMP.01/TU/VIII/2026',
    kodeKlasifikasi: '421.3',
    tujuan: 'Nurul Aini, M.Pd. dan Fajar Ramadhan, S.Kom.',
    instansiTujuan: 'Internal SMP Negeri 1 Nusantara',
    perihal: 'Surat Perintah Tugas Mengikuti Rapat Koordinasi ANBK 2026 di Dinas Pendidikan',
    tanggalSurat: '2026-08-18',
    isiRingkas: 'Penugasan Waka Kurikulum dan Proktor Lab Komputer untuk menghadiri Rapat Koordinasi Persiapan ANBK di Dinas Pendidikan Kab. Nusantara pada tanggal 22 Agustus 2026.',
    penandatangan: 'Drs. H. Bambang Sudirman, M.Pd. (Kepala Sekolah)',
    status: 'Disetujui Kepsek',
    sifat: 'Segera',
    templateType: 'tugas'
  },
  {
    id: 'SK-2026-002',
    noSurat: '005/085/SMP.01/TU/VIII/2026',
    kodeKlasifikasi: '005',
    tujuan: 'Bapak/Ibu Orang Tua / Wali Murid Kelas 7A - 7F',
    instansiTujuan: 'Wali Murid SMPN 1 Nusantara',
    perihal: 'Undangan Sosialisasi Kurikulum Merdeka & Program Penguatan Karakter Profil Pelajar Pancasila',
    tanggalSurat: '2026-08-17',
    isiRingkas: 'Mengundang kehadiran seluruh wali murid kelas 7 dalam rangka pemaparan program kurikulum baru tahun ajaran 2026/2027 pada Sabtu, 29 Agustus 2026.',
    penandatangan: 'Drs. H. Bambang Sudirman, M.Pd. (Kepala Sekolah)',
    status: 'Terkirim',
    sifat: 'Biasa',
    templateType: 'undangan'
  },
  {
    id: 'SK-2026-003',
    noSurat: '422.1/086/SMP.01/TU/VIII/2026',
    kodeKlasifikasi: '422.1',
    tujuan: 'Kepala SMP Negeri 3 Kota Bandung',
    instansiTujuan: 'SMP Negeri 3 Kota Bandung',
    perihal: 'Surat Keterangan Pindah Sekolah (Mutasi Keluar) a.n. Muhammad Rizky Pratama',
    tanggalSurat: '2026-08-18',
    isiRingkas: 'Surat keterangan pindah sekolah kelas 8D dikarenakan orang tua berpindah tugas dinas kerja ke Bandung.',
    penandatangan: 'Drs. H. Bambang Sudirman, M.Pd. (Kepala Sekolah)',
    status: 'Disetujui Kepsek',
    sifat: 'Biasa',
    templateType: 'mutasi'
  },
  {
    id: 'SK-2026-004',
    noSurat: '421.2/087/SMP.01/TU/VIII/2026',
    kodeKlasifikasi: '421.2',
    tujuan: 'Bank BJB Cabang Nusantara',
    instansiTujuan: 'Pimpinan Bank BJB',
    perihal: 'Surat Keterangan Siswa Aktif Penerima Program Indonesia Pintar (PIP) 2026',
    tanggalSurat: '2026-08-19',
    isiRingkas: 'Menerangkan bahwa siswa yang bersangkutan benar-benar terdaftar aktif sebagai dasar pencairan beasiswa PIP di bank penyalur.',
    penandatangan: 'Drs. H. Bambang Sudirman, M.Pd. (Kepala Sekolah)',
    status: 'Draft',
    sifat: 'Biasa',
    templateType: 'suket_aktif'
  }
];

export const initialSiswa: Siswa[] = [
  {
    id: 'SIS-001',
    nis: '242507001',
    nisn: '0098412034',
    nik: '3204112304090001',
    nama: 'Aditya Pratama Putra',
    jenisKelamin: 'L',
    kelas: '7A',
    tempatLahir: 'Nusantara',
    tanggalLahir: '2012-04-14',
    namaWali: 'Budi Santoso',
    noHpWali: '0812-3456-7890',
    alamat: 'Jl. Melati No. 12, Kel. Sukamaju',
    jalurPendaftaran: 'Zonasi',
    status: 'Aktif',
    syncDapodik: true,
    fotoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'SIS-002',
    nis: '242507002',
    nisn: '0098412035',
    nik: '3204115408090002',
    nama: 'Alya Salsabila Putri',
    jenisKelamin: 'P',
    kelas: '7A',
    tempatLahir: 'Bandung',
    tanggalLahir: '2012-08-20',
    namaWali: 'Hendra Gunawan',
    noHpWali: '0813-9876-5432',
    alamat: 'Komplek Permata Hijau Blok C-4',
    jalurPendaftaran: 'Prestasi',
    status: 'Aktif',
    syncDapodik: true,
    fotoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'SIS-003',
    nis: '232408015',
    nisn: '0087612089',
    nik: '3204111201080003',
    nama: 'Muhammad Rizky Pratama',
    jenisKelamin: 'L',
    kelas: '8D',
    tempatLahir: 'Nusantara',
    tanggalLahir: '2011-01-12',
    namaWali: 'Ir. Ahmad Zulkarnain',
    noHpWali: '0821-4455-6677',
    alamat: 'Jl. Gandawijaya No. 88',
    jalurPendaftaran: 'Zonasi',
    status: 'Mutasi Keluar',
    tanggalMutasi: '2026-08-18',
    sekolahAsalTujuan: 'SMP Negeri 3 Kota Bandung',
    alasanMutasi: 'Mengikuti mutasi kedinasan orang tua ke Kota Bandung',
    syncDapodik: true,
    fotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'SIS-004',
    nis: '232408044',
    nisn: '0085431102',
    nik: '3204116509080004',
    nama: 'Nabila Zahra Ramadhani',
    jenisKelamin: 'P',
    kelas: '8B',
    tempatLahir: 'Jakarta',
    tanggalLahir: '2011-09-25',
    namaWali: 'Dedi Mulyadi',
    noHpWali: '0857-1122-3344',
    alamat: 'Jl. Kenanga Raya No. 3',
    jalurPendaftaran: 'Afirmasi',
    status: 'Aktif',
    syncDapodik: true,
    fotoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'SIS-005',
    nis: '222309001',
    nisn: '0074321908',
    nik: '3204110303070005',
    nama: 'Fahri Alamsyah',
    jenisKelamin: 'L',
    kelas: '9C',
    tempatLahir: 'Nusantara',
    tanggalLahir: '2010-03-03',
    namaWali: 'Kuswanto',
    noHpWali: '0812-7788-9900',
    alamat: 'Kp. Babakan RT 02/RW 05',
    jalurPendaftaran: 'Zonasi',
    status: 'Aktif',
    syncDapodik: true,
    fotoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'SIS-006',
    nis: '242507089',
    nisn: '0091234567',
    nik: '3204114405090006',
    nama: 'Zaskia Nurhaliza',
    jenisKelamin: 'P',
    kelas: '7B',
    tempatLahir: 'Bogor',
    tanggalLahir: '2012-05-19',
    namaWali: 'Wahyu Hidayat',
    noHpWali: '0878-9900-1122',
    alamat: 'Jl. Flamboyan Blok A-11',
    jalurPendaftaran: 'Perpindahan Tugas',
    status: 'Mutasi Masuk',
    tanggalMutasi: '2026-08-01',
    sekolahAsalTujuan: 'SMP IT Al-Hikmah Bogor',
    alasanMutasi: 'Pindah domisili keluarga ke Kab. Nusantara',
    syncDapodik: true,
    fotoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80'
  }
];

export const initialPegawai: Pegawai[] = [
  {
    id: 'PEG-001',
    nip: '19680512 199403 1 004',
    nuptk: '4534746648200023',
    nama: 'Drs. H. Bambang Sudirman, M.Pd.',
    gelar: 'Drs., M.Pd.',
    jenisKelamin: 'L',
    jabatan: 'Kepala Sekolah',
    golongan: 'IV/b (Pembina Tingkat I)',
    statusKepegawaian: 'PNS',
    tmt: '1994-03-01',
    pendidikanTerakhir: 'S2 Magister Manajemen Pendidikan',
    noHp: '0812-2345-6789',
    email: 'bambang.sudirman@smpn1nusantara.sch.id',
    statusPresensiHariIni: 'Hadir',
    berkasList: [
      { id: 'B-01', namaBerkas: 'SK Pengangkatan Kepala Sekolah', kategori: 'SK CPNS/PNS', tahun: '2022' },
      { id: 'B-02', namaBerkas: 'Sertifikat Pendidik Profesi Guru', kategori: 'Sertifikat Pendidik', tahun: '2010' }
    ]
  },
  {
    id: 'PEG-002',
    nip: '19760315 200212 2 003',
    nuptk: '8745754656300012',
    nama: 'Siti Rahmawati, S.AP.',
    gelar: 'S.AP.',
    jenisKelamin: 'P',
    jabatan: 'Kepala Tata Usaha (KTU)',
    golongan: 'III/d (Penata Tingkat I)',
    statusKepegawaian: 'PNS',
    tmt: '2002-12-01',
    pendidikanTerakhir: 'S1 Administrasi Publik',
    noHp: '0813-1122-3344',
    email: 'siti.rahmawati@tu.smpn1nusantara.sch.id',
    statusPresensiHariIni: 'Hadir',
    berkasList: [
      { id: 'B-03', namaBerkas: 'SK Kenaikan Pangkat Gol. III/d', kategori: 'SK Kenaikan Pangkat', tahun: '2023' }
    ]
  },
  {
    id: 'PEG-003',
    nip: '19791104 200604 2 012',
    nuptk: '1234757659300043',
    nama: 'Nurul Aini, M.Pd.',
    gelar: 'M.Pd.',
    jenisKelamin: 'P',
    jabatan: 'Waka Kurikulum & Guru IPA',
    golongan: 'IV/a (Pembina)',
    statusKepegawaian: 'PNS',
    tmt: '2006-04-01',
    pendidikanTerakhir: 'S2 Pendidikan Sains',
    noHp: '0812-9988-7766',
    email: 'nurul.kurikulum@smpn1nusantara.sch.id',
    statusPresensiHariIni: 'Hadir',
    berkasList: [
      { id: 'B-04', namaBerkas: 'SK Pembagian Tugas Mengajar 2026/2027', kategori: 'SK Pembagian Tugas', tahun: '2026' }
    ]
  },
  {
    id: 'PEG-004',
    nip: '19830820 200902 1 005',
    nuptk: '9876761663100021',
    nama: 'Agus Setiawan, S.E.',
    gelar: 'S.E.',
    jenisKelamin: 'L',
    jabatan: 'Bendahara / Pengelola Keuangan TU',
    golongan: 'III/c (Penata)',
    statusKepegawaian: 'PNS',
    tmt: '2009-02-01',
    pendidikanTerakhir: 'S1 Akuntansi',
    noHp: '0821-5566-7788',
    email: 'agus.bendahara@smpn1nusantara.sch.id',
    statusPresensiHariIni: 'Hadir',
    berkasList: [
      { id: 'B-05', namaBerkas: 'SK Bendahara Pengeluaran Pembantu BOS', kategori: 'SK Pembagian Tugas', tahun: '2026' }
    ]
  },
  {
    id: 'PEG-005',
    nip: '19950718 202421 1 007',
    nuptk: '3456773674130092',
    nama: 'Fajar Ramadhan, S.Kom.',
    gelar: 'S.Kom.',
    jenisKelamin: 'L',
    jabatan: 'Guru Informatika & Proktor ANBK',
    golongan: 'IX (PPPK)',
    statusKepegawaian: 'PPPK',
    tmt: '2024-03-01',
    pendidikanTerakhir: 'S1 Teknik Informatika',
    noHp: '0857-4433-2211',
    email: 'fajar.proktor@smpn1nusantara.sch.id',
    statusPresensiHariIni: 'Hadir',
    berkasList: [
      { id: 'B-06', namaBerkas: 'SK Pengangkatan PPPK Guru', kategori: 'SK CPNS/PNS', tahun: '2024' }
    ]
  },
  {
    id: 'PEG-006',
    nuptk: '2134768670230081',
    nama: 'Dewi Lestari, S.Pd.',
    gelar: 'S.Pd.',
    jenisKelamin: 'P',
    jabatan: 'Guru Bimbingan Konseling (BK)',
    statusKepegawaian: 'GTT',
    tmt: '2021-07-15',
    pendidikanTerakhir: 'S1 Bimbingan Konseling',
    noHp: '0813-8899-0011',
    email: 'dewi.bk@smpn1nusantara.sch.id',
    statusPresensiHariIni: 'Dinas Luar',
    berkasList: []
  }
];

export const initialPembayaranSPP: PembayaranSPP[] = [
  {
    id: 'PAY-2026-001',
    siswaId: 'SIS-001',
    namaSiswa: 'Aditya Pratama Putra',
    kelas: '7A',
    bulan: 'Agustus 2026',
    posBayar: 'SPP / Iuran Rutin',
    nominal: 150000,
    tanggalBayar: '2026-08-10',
    metodePembayaran: 'QRIS',
    status: 'Lunas',
    noKuitansi: 'KW/TU/2026/08/041',
    penerimaStaf: 'Agus Setiawan, S.E.'
  },
  {
    id: 'PAY-2026-002',
    siswaId: 'SIS-002',
    namaSiswa: 'Alya Salsabila Putri',
    kelas: '7A',
    bulan: 'Agustus 2026',
    posBayar: 'SPP / Iuran Rutin',
    nominal: 150000,
    tanggalBayar: '2026-08-12',
    metodePembayaran: 'Transfer Bank',
    status: 'Lunas',
    noKuitansi: 'KW/TU/2026/08/042',
    penerimaStaf: 'Agus Setiawan, S.E.'
  },
  {
    id: 'PAY-2026-003',
    siswaId: 'SIS-004',
    namaSiswa: 'Nabila Zahra Ramadhani',
    kelas: '8B',
    bulan: 'Agustus 2026',
    posBayar: 'Komite Sekolah',
    nominal: 100000,
    tanggalBayar: '2026-08-15',
    metodePembayaran: 'Tunai di Kasir TU',
    status: 'Lunas',
    noKuitansi: 'KW/TU/2026/08/043',
    penerimaStaf: 'Agus Setiawan, S.E.'
  },
  {
    id: 'PAY-2026-004',
    siswaId: 'SIS-005',
    namaSiswa: 'Fahri Alamsyah',
    kelas: '9C',
    bulan: 'Agustus 2026',
    posBayar: 'SPP / Iuran Rutin',
    nominal: 150000,
    tanggalBayar: '2026-08-17',
    metodePembayaran: 'Tunai di Kasir TU',
    status: 'Lunas',
    noKuitansi: 'KW/TU/2026/08/044',
    penerimaStaf: 'Agus Setiawan, S.E.'
  },
  {
    id: 'PAY-2026-005',
    siswaId: 'SIS-001',
    namaSiswa: 'Aditya Pratama Putra',
    kelas: '7A',
    bulan: 'Juli 2026',
    posBayar: 'Uang Seragam & Atribut',
    nominal: 450000,
    tanggalBayar: '2026-07-20',
    metodePembayaran: 'Tunai di Kasir TU',
    status: 'Lunas',
    noKuitansi: 'KW/TU/2026/07/012',
    penerimaStaf: 'Agus Setiawan, S.E.'
  }
];

export const initialTransaksiKas: TransaksiKas[] = [
  {
    id: 'KAS-001',
    tanggal: '2026-08-01',
    tipe: 'Pemasukan',
    kategori: 'Penerimaan Dana BOS Tahap II',
    deskripsi: 'Pencairan Dana BOS Reguler Tahap II Tahun Anggaran 2026',
    nominal: 145000000,
    saldoAkhir: 145000000,
    penanggungJawab: 'Drs. H. Bambang Sudirman, M.Pd.'
  },
  {
    id: 'KAS-002',
    tanggal: '2026-08-05',
    tipe: 'Pengeluaran',
    kategori: 'Belanja ATK & Kertas Administrasi TU',
    deskripsi: 'Pengadaan Kertas HVS F4/A4, Map Berkas, Tinta Printer Cetak Surat Ujian',
    nominal: 3850000,
    saldoAkhir: 141150000,
    penanggungJawab: 'Siti Rahmawati, S.AP.'
  },
  {
    id: 'KAS-003',
    tanggal: '2026-08-10',
    tipe: 'Pengeluaran',
    kategori: 'Pemeliharaan & Langganan Internet Sekolah',
    deskripsi: 'Pembayaran Bandwidth Dedicated Astinet Lab Komputer & Kantor TU',
    nominal: 2750000,
    saldoAkhir: 138400000,
    penanggungJawab: 'Agus Setiawan, S.E.'
  },
  {
    id: 'KAS-004',
    tanggal: '2026-08-15',
    tipe: 'Pemasukan',
    kategori: 'Penerimaan Iuran SPP / Komite Siswa',
    deskripsi: 'Rekapitulasi total setoran loket TU periode 1-15 Agustus 2026',
    nominal: 18450000,
    saldoAkhir: 156850000,
    penanggungJawab: 'Agus Setiawan, S.E.'
  }
];

export const initialBarangInventaris: BarangInventaris[] = [
  {
    id: 'INV-001',
    kodeBarang: 'BMN/2026/LAB-KOM/001',
    namaBarang: 'Laptop Chromebook Axioo 11.6 Inch',
    kategori: 'Elektronik & IT',
    jumlah: 40,
    satuan: 'Unit',
    ruangan: 'Lab Komputer 1',
    kondisi: 'Baik',
    tahunPerolehan: 2024,
    sumberDana: 'BOS Kinerja',
    hargaSatuan: 6500000,
    nilaiAset: 260000000,
    terakhirDicek: '2026-08-10'
  },
  {
    id: 'INV-002',
    kodeBarang: 'BMN/2025/TU/004',
    namaBarang: 'Printer Epson L3210 All-in-One InkTank',
    kategori: 'Elektronik & IT',
    jumlah: 3,
    satuan: 'Unit',
    ruangan: 'Ruang Tata Usaha',
    kondisi: 'Baik',
    tahunPerolehan: 2025,
    sumberDana: 'BOS Reguler',
    hargaSatuan: 2850000,
    nilaiAset: 8550000,
    terakhirDicek: '2026-08-15'
  },
  {
    id: 'INV-003',
    kodeBarang: 'BMN/2023/MEB/018',
    namaBarang: 'Meja & Kursi Siswa Kayu Jati Set',
    kategori: 'Mebel & Meubeler',
    jumlah: 180,
    satuan: 'Set',
    ruangan: 'Ruang Kelas 7A - 7F',
    kondisi: 'Baik',
    tahunPerolehan: 2023,
    sumberDana: 'DAK Fisik',
    hargaSatuan: 650000,
    nilaiAset: 117000000,
    terakhirDicek: '2026-07-28'
  },
  {
    id: 'INV-004',
    kodeBarang: 'BMN/2024/LAB-IPA/009',
    namaBarang: 'Mikroskop Monokuler Siswa 1000x',
    kategori: 'Alat Laboratorium',
    jumlah: 15,
    satuan: 'Unit',
    ruangan: 'Laboratorium IPA',
    kondisi: 'Rusak Ringan',
    tahunPerolehan: 2024,
    sumberDana: 'BOS Reguler',
    hargaSatuan: 1450000,
    nilaiAset: 21750000,
    terakhirDicek: '2026-08-04'
  },
  {
    id: 'INV-005',
    kodeBarang: 'BMN/2025/PUSTAKA/032',
    namaBarang: 'Buku Paket Siswa IPA Kurikulum Merdeka Kelas 8',
    kategori: 'Buku & Pustaka',
    jumlah: 240,
    satuan: 'Eks',
    ruangan: 'Perpustakaan',
    kondisi: 'Baik',
    tahunPerolehan: 2025,
    sumberDana: 'BOS Reguler',
    hargaSatuan: 68000,
    nilaiAset: 16320000,
    terakhirDicek: '2026-08-12'
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'LOG-001',
    timestamp: '2026-08-18 14:15:22',
    actor: 'Nurul Aini, M.Pd.',
    role: 'Waka Kurikulum',
    action: 'Menyelesaikan Tindak Lanjut Disposisi',
    module: 'Persuratan',
    details: 'Melaporkan kesiapan ANBK dan mengunggah berkas pada Surat Masuk No. Agenda AG/089/TU/2026.'
  },
  {
    id: 'LOG-002',
    timestamp: '2026-08-18 11:30:10',
    actor: 'Drs. H. Bambang Sudirman, M.Pd.',
    role: 'Kepala Sekolah',
    action: 'Memberikan Disposisi Digital',
    module: 'Persuratan',
    details: 'Mendisposisikan Surat Masuk ANBK ke Waka Kurikulum dan Proktor dengan instruksi "Hadiri & Koordinasikan Segera".'
  },
  {
    id: 'LOG-003',
    timestamp: '2026-08-18 10:05:44',
    actor: 'Siti Rahmawati, S.AP.',
    role: 'Kepala TU',
    action: 'Membuat Mutasi Siswa Keluar',
    module: 'Kesiswaan',
    details: 'Menerbitkan SK Mutasi Keluar a.n. Muhammad Rizky Pratama (NIS: 232408015) ke SMPN 3 Kota Bandung.'
  },
  {
    id: 'LOG-004',
    timestamp: '2026-08-17 13:40:19',
    actor: 'Agus Setiawan, S.E.',
    role: 'Bendahara TU',
    action: 'Mencatat Pembayaran SPP',
    module: 'Keuangan',
    details: 'Menerima pembayaran SPP Tunai Rp 150.000 a.n. Fahri Alamsyah (9C) No. Kuitansi: KW/TU/2026/08/044.'
  },
  {
    id: 'LOG-005',
    timestamp: '2026-08-17 08:20:00',
    actor: 'Rian Hidayat, A.Md.',
    role: 'Staf Persuratan',
    action: 'Input Surat Masuk Baru',
    module: 'Persuratan',
    details: 'Mencatat Surat Masuk OSN dari BPTI Pusat dengan No. Agenda AG/090/TU/2026.'
  }
];
