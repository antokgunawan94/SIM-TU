import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  SuratMasuk, 
  SuratKeluar, 
  Siswa, 
  Pegawai, 
  PengajuanCuti,
  PembayaranSPP, 
  TransaksiKas, 
  BarangInventaris, 
  AuditLog, 
  SchoolProfile,
  UserProfile,
  UserRole,
  DisposisiAction
} from '../types';
import {
  initialSchoolProfile,
  sampleUsers,
  initialSuratMasuk,
  initialSuratKeluar,
  initialSiswa,
  initialPegawai,
  initialPembayaranSPP,
  initialTransaksiKas,
  initialBarangInventaris,
  initialAuditLogs
} from '../data/mockData';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs,
  writeBatch
} from 'firebase/firestore';

const initialCutiList: PengajuanCuti[] = [
  {
    id: 'CUTI-001',
    pegawaiId: 'PEG-002',
    namaPegawai: 'Nurul Aini, M.Pd.',
    nip: '19791104 200604 2 012',
    jenisCuti: 'Cuti Tahunan',
    tanggalMulai: '2026-08-25',
    tanggalSelesai: '2026-08-27',
    durasiHari: 3,
    alasan: 'Keperluan keluarga mendesak ke luar kota.',
    status: 'Menunggu Persetujuan',
    tanggalPengajuan: '2026-08-18'
  },
  {
    id: 'CUTI-002',
    pegawaiId: 'PEG-003',
    namaPegawai: 'Budi Santoso, S.Kom.',
    nip: '19850612 201101 1 007',
    jenisCuti: 'Cuti Sakit',
    tanggalMulai: '2026-08-10',
    tanggalSelesai: '2026-08-11',
    durasiHari: 2,
    alasan: 'Rawat jalan dokter (Surat Keterangan Sakit terlampir).',
    status: 'Disetujui',
    tanggalPengajuan: '2026-08-09'
  }
];

interface SchoolContextType {
  // Authentication & Multilevel Roles
  isAuthenticated: boolean;
  login: (usernameOrEmail: string, password?: string) => { success: boolean; message: string };
  loginAsUser: (userId: string) => void;
  logout: () => void;
  canAccessModule: (moduleId: string) => boolean;

  // Profile & User
  schoolProfile: SchoolProfile;
  updateSchoolProfile: (profile: Partial<SchoolProfile>) => void;
  currentUser: UserProfile;
  setCurrentUserRole: (role: UserRole) => void;
  switchUserRole: (userId: string) => void;
  availableUsers: UserProfile[];
  userOptions: UserProfile[];

  // Persuratan - Surat Masuk
  suratMasukList: SuratMasuk[];
  addSuratMasuk: (surat: Omit<SuratMasuk, 'id' | 'noAgenda' | 'disposisiList' | 'status'>) => SuratMasuk;
  updateSuratMasuk: (id: string, updates: Partial<SuratMasuk>) => void;
  deleteSuratMasuk: (id: string) => void;
  addDisposisiToSurat: (suratId: string, disposisiData: Omit<DisposisiAction, 'id' | 'tanggalDisposisi' | 'pemberiDisposisi'>) => void;
  updateTindakLanjutDisposisi: (suratId: string, disposisiId: string, data: { pelaksana: string; catatanHasil: string; status: 'Dalam Proses' | 'Selesai'; lampiranBukti?: string }) => void;
  forwardSuratToKepsek: (suratId: string) => void;
  archiveSuratMasuk: (suratId: string) => void;

  // Persuratan - Surat Keluar
  suratKeluarList: SuratKeluar[];
  addSuratKeluar: (surat: Omit<SuratKeluar, 'id' | 'noSurat' | 'status'>) => SuratKeluar;
  updateSuratKeluar: (id: string, updates: Partial<SuratKeluar>) => void;
  deleteSuratKeluar: (id: string) => void;
  approveSuratKeluar: (id: string) => void;
  sendSuratKeluar: (id: string) => void;

  // Kesiswaan
  siswaList: Siswa[];
  addSiswa: (siswa: Omit<Siswa, 'id' | 'syncDapodik'>) => void;
  updateSiswa: (id: string, updates: Partial<Siswa>) => void;
  deleteSiswa: (id: string) => void;
  processMutasiSiswa: (siswaId: string, type: 'Mutasi Keluar' | 'Mutasi Masuk' | 'Lulus', payload: { tanggal: string; sekolahAsalTujuan: string; alasan: string }) => void;

  // Kepegawaian & Cuti
  pegawaiList: Pegawai[];
  addPegawai: (pegawai: Omit<Pegawai, 'id'>) => void;
  updatePegawai: (id: string, updates: Partial<Pegawai>) => void;
  deletePegawai: (id: string) => void;
  updatePresensiPegawai: (id: string, status: Pegawai['statusPresensiHariIni']) => void;
  cutiList: PengajuanCuti[];
  addPengajuanCuti: (cuti: Omit<PengajuanCuti, 'id' | 'status' | 'tanggalPengajuan'>) => void;
  approvePengajuanCuti: (id: string) => void;

  // Keuangan
  pembayaranList: PembayaranSPP[];
  addPembayaranSPP: (data: Omit<PembayaranSPP, 'id' | 'noKuitansi' | 'status' | 'penerimaStaf'>) => PembayaranSPP;
  transaksiKasList: TransaksiKas[];
  addTransaksiKas: (data: Omit<TransaksiKas, 'id' | 'saldoAkhir'>) => void;

  // Inventaris
  inventarisList: BarangInventaris[];
  addInventaris: (item: Omit<BarangInventaris, 'id' | 'kodeBarang'> & { kodeBarang?: string }) => void;
  updateInventaris: (id: string, updates: Partial<BarangInventaris>) => void;
  deleteInventaris: (id: string) => void;

  // Audit Logs
  auditLogs: AuditLog[];
  addAuditLog: (action: string, module: AuditLog['module'], details: string) => void;

  // Utilities
  resetToDefaultData: () => void;
  isCloudSynced: boolean;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('simtu_auth');
    return saved === 'true';
  });

  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);

  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(() => {
    const saved = localStorage.getItem('simtu_profile');
    return saved ? JSON.parse(saved) : initialSchoolProfile;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const savedUserId = localStorage.getItem('simtu_current_user_id');
    const matched = sampleUsers.find(u => u.id === savedUserId);
    const u = matched || sampleUsers[0];
    return { ...u, title: u.roleTitle };
  });

  const [suratMasukList, setSuratMasukList] = useState<SuratMasuk[]>(() => {
    const saved = localStorage.getItem('simtu_surat_masuk');
    const list: SuratMasuk[] = saved ? JSON.parse(saved) : initialSuratMasuk;
    return list.map(s => {
      let statusDisp: 'Belum Disposisi' | 'Sedang Diproses' | 'Selesai' = 'Belum Disposisi';
      if (s.status === 'Terdisposisi' || s.status === 'Dalam Proses') {
        statusDisp = 'Sedang Diproses';
      } else if (s.status === 'Selesai' || s.status === 'Diarsipkan') {
        statusDisp = 'Selesai';
      }
      return { ...s, statusDisposisi: statusDisp };
    });
  });

  const [suratKeluarList, setSuratKeluarList] = useState<SuratKeluar[]>(() => {
    const saved = localStorage.getItem('simtu_surat_keluar');
    return saved ? JSON.parse(saved) : initialSuratKeluar;
  });

  const [siswaList, setSiswaList] = useState<Siswa[]>(() => {
    const saved = localStorage.getItem('simtu_siswa');
    return saved ? JSON.parse(saved) : initialSiswa;
  });

  const [pegawaiList, setPegawaiList] = useState<Pegawai[]>(() => {
    const saved = localStorage.getItem('simtu_pegawai');
    const raw = saved ? JSON.parse(saved) : initialPegawai;
    return raw.map((p: any) => ({
      ...p,
      tmtKerja: p.tmtKerja || p.tmt || '2019-01-01',
      isSertifikasi: p.isSertifikasi ?? true,
      jamMengajar: p.jamMengajar ?? 24
    }));
  });

  const [cutiList, setCutiList] = useState<PengajuanCuti[]>(() => {
    const saved = localStorage.getItem('simtu_cuti');
    return saved ? JSON.parse(saved) : initialCutiList;
  });

  const [pembayaranList, setPembayaranList] = useState<PembayaranSPP[]>(() => {
    const saved = localStorage.getItem('simtu_pembayaran');
    return saved ? JSON.parse(saved) : initialPembayaranSPP;
  });

  const [transaksiKasList, setTransaksiKasList] = useState<TransaksiKas[]>(() => {
    const saved = localStorage.getItem('simtu_kas');
    return saved ? JSON.parse(saved) : initialTransaksiKas;
  });

  const [inventarisList, setInventarisList] = useState<BarangInventaris[]>(() => {
    const saved = localStorage.getItem('simtu_inventaris');
    const raw = saved ? JSON.parse(saved) : initialBarangInventaris;
    return raw.map((b: any) => ({
      ...b,
      merkModel: b.merkModel || b.namaBarang,
      nilaiAset: b.nilaiAset || (b.hargaSatuan ? b.hargaSatuan * b.jumlah : 2500000)
    }));
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('simtu_logs');
    const list: AuditLog[] = saved ? JSON.parse(saved) : initialAuditLogs;
    return list.map(l => ({
      ...l,
      userNama: l.userNama || l.actor || 'Staf TU'
    }));
  });

  // LocalStorage Synchronization
  useEffect(() => {
    localStorage.setItem('simtu_auth', String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('simtu_current_user_id', currentUser.id);
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('simtu_profile', JSON.stringify(schoolProfile));
  }, [schoolProfile]);

  useEffect(() => {
    localStorage.setItem('simtu_surat_masuk', JSON.stringify(suratMasukList));
  }, [suratMasukList]);

  useEffect(() => {
    localStorage.setItem('simtu_surat_keluar', JSON.stringify(suratKeluarList));
  }, [suratKeluarList]);

  useEffect(() => {
    localStorage.setItem('simtu_siswa', JSON.stringify(siswaList));
  }, [siswaList]);

  useEffect(() => {
    localStorage.setItem('simtu_pegawai', JSON.stringify(pegawaiList));
  }, [pegawaiList]);

  useEffect(() => {
    localStorage.setItem('simtu_cuti', JSON.stringify(cutiList));
  }, [cutiList]);

  useEffect(() => {
    localStorage.setItem('simtu_pembayaran', JSON.stringify(pembayaranList));
  }, [pembayaranList]);

  useEffect(() => {
    localStorage.setItem('simtu_kas', JSON.stringify(transaksiKasList));
  }, [transaksiKasList]);

  useEffect(() => {
    localStorage.setItem('simtu_inventaris', JSON.stringify(inventarisList));
  }, [inventarisList]);

  useEffect(() => {
    localStorage.setItem('simtu_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Firestore Real-Time Subscriptions & Initialization
  useEffect(() => {
    let unsubSuratMasuk: (() => void) | undefined;
    let unsubSuratKeluar: (() => void) | undefined;
    let unsubSiswa: (() => void) | undefined;
    let unsubPegawai: (() => void) | undefined;
    let unsubCuti: (() => void) | undefined;
    let unsubPembayaran: (() => void) | undefined;
    let unsubKas: (() => void) | undefined;
    let unsubInventaris: (() => void) | undefined;
    let unsubLogs: (() => void) | undefined;
    let unsubProfile: (() => void) | undefined;

    try {
      // 1. Surat Masuk
      const smRef = collection(db, 'surat_masuk');
      unsubSuratMasuk = onSnapshot(smRef, (snapshot) => {
        if (!snapshot.empty) {
          const items: SuratMasuk[] = [];
          snapshot.forEach(docSnap => items.push(docSnap.data() as SuratMasuk));
          setSuratMasukList(items);
          setIsCloudSynced(true);
        }
      }, (err) => handleFirestoreError(err, OperationType.GET, 'surat_masuk'));

      // 2. Surat Keluar
      const skRef = collection(db, 'surat_keluar');
      unsubSuratKeluar = onSnapshot(skRef, (snapshot) => {
        if (!snapshot.empty) {
          const items: SuratKeluar[] = [];
          snapshot.forEach(docSnap => items.push(docSnap.data() as SuratKeluar));
          setSuratKeluarList(items);
          setIsCloudSynced(true);
        }
      }, (err) => handleFirestoreError(err, OperationType.GET, 'surat_keluar'));

      // 3. Siswa
      const siswaRef = collection(db, 'siswa');
      unsubSiswa = onSnapshot(siswaRef, (snapshot) => {
        if (!snapshot.empty) {
          const items: Siswa[] = [];
          snapshot.forEach(docSnap => items.push(docSnap.data() as Siswa));
          setSiswaList(items);
          setIsCloudSynced(true);
        }
      }, (err) => handleFirestoreError(err, OperationType.GET, 'siswa'));

      // 4. Pegawai
      const pegRef = collection(db, 'pegawai');
      unsubPegawai = onSnapshot(pegRef, (snapshot) => {
        if (!snapshot.empty) {
          const items: Pegawai[] = [];
          snapshot.forEach(docSnap => items.push(docSnap.data() as Pegawai));
          setPegawaiList(items);
          setIsCloudSynced(true);
        }
      }, (err) => handleFirestoreError(err, OperationType.GET, 'pegawai'));

      // 5. Pengajuan Cuti
      const cutiRef = collection(db, 'pengajuan_cuti');
      unsubCuti = onSnapshot(cutiRef, (snapshot) => {
        if (!snapshot.empty) {
          const items: PengajuanCuti[] = [];
          snapshot.forEach(docSnap => items.push(docSnap.data() as PengajuanCuti));
          setCutiList(items);
          setIsCloudSynced(true);
        }
      }, (err) => handleFirestoreError(err, OperationType.GET, 'pengajuan_cuti'));

      // 6. Pembayaran SPP
      const payRef = collection(db, 'pembayaran_spp');
      unsubPembayaran = onSnapshot(payRef, (snapshot) => {
        if (!snapshot.empty) {
          const items: PembayaranSPP[] = [];
          snapshot.forEach(docSnap => items.push(docSnap.data() as PembayaranSPP));
          setPembayaranList(items);
          setIsCloudSynced(true);
        }
      }, (err) => handleFirestoreError(err, OperationType.GET, 'pembayaran_spp'));

      // 7. Transaksi Kas
      const kasRef = collection(db, 'transaksi_kas');
      unsubKas = onSnapshot(kasRef, (snapshot) => {
        if (!snapshot.empty) {
          const items: TransaksiKas[] = [];
          snapshot.forEach(docSnap => items.push(docSnap.data() as TransaksiKas));
          setTransaksiKasList(items);
          setIsCloudSynced(true);
        }
      }, (err) => handleFirestoreError(err, OperationType.GET, 'transaksi_kas'));

      // 8. Inventaris
      const invRef = collection(db, 'inventaris');
      unsubInventaris = onSnapshot(invRef, (snapshot) => {
        if (!snapshot.empty) {
          const items: BarangInventaris[] = [];
          snapshot.forEach(docSnap => items.push(docSnap.data() as BarangInventaris));
          setInventarisList(items);
          setIsCloudSynced(true);
        }
      }, (err) => handleFirestoreError(err, OperationType.GET, 'inventaris'));

      // 9. Audit Logs
      const logsRef = collection(db, 'audit_logs');
      unsubLogs = onSnapshot(logsRef, (snapshot) => {
        if (!snapshot.empty) {
          const items: AuditLog[] = [];
          snapshot.forEach(docSnap => items.push(docSnap.data() as AuditLog));
          setAuditLogs(items);
          setIsCloudSynced(true);
        }
      }, (err) => handleFirestoreError(err, OperationType.GET, 'audit_logs'));

      // 10. School Profile
      const profRef = doc(db, 'school_profile', 'config');
      unsubProfile = onSnapshot(profRef, (docSnap) => {
        if (docSnap.exists()) {
          setSchoolProfile(docSnap.data() as SchoolProfile);
          setIsCloudSynced(true);
        }
      }, (err) => handleFirestoreError(err, OperationType.GET, 'school_profile/config'));

    } catch (e) {
      console.warn('Firestore subscription initialized in local fallback mode:', e);
    }

    return () => {
      unsubSuratMasuk?.();
      unsubSuratKeluar?.();
      unsubSiswa?.();
      unsubPegawai?.();
      unsubCuti?.();
      unsubPembayaran?.();
      unsubKas?.();
      unsubInventaris?.();
      unsubLogs?.();
      unsubProfile?.();
    };
  }, []);

  const addAuditLog = (action: string, module: AuditLog['module'], details: string) => {
    const newLog: AuditLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'medium' }),
      actor: currentUser.name,
      userNama: currentUser.name,
      role: currentUser.roleTitle,
      action,
      module,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);

    // Save to Firestore
    try {
      setDoc(doc(db, 'audit_logs', newLog.id), newLog).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `audit_logs/${newLog.id}`);
      });
    } catch (e) {
      // safe fallback
    }
  };

  // Multilevel Auth Functions
  const login = (usernameOrEmail: string, password?: string): { success: boolean; message: string } => {
    const query = usernameOrEmail.trim().toLowerCase();
    const matched = sampleUsers.find(
      u => u.username.toLowerCase() === query || 
           u.email.toLowerCase() === query || 
           (u.nip && u.nip.replace(/\s+/g, '') === query.replace(/\s+/g, ''))
    );

    if (!matched) {
      return { 
        success: false, 
        message: 'Username, Email, atau NIP tidak terdaftar dalam sistem sekolah.' 
      };
    }

    if (password && matched.password && password !== matched.password && password !== '123' && password !== 'admin123') {
      return { 
        success: false, 
        message: 'Kata sandi tidak valid. Gunakan kata sandi akun atau preset 123.' 
      };
    }

    setCurrentUser({ ...matched, title: matched.roleTitle });
    setIsAuthenticated(true);
    addAuditLog('Login Pengguna Berhasil', 'Sistem', `Pengguna ${matched.name} (${matched.levelName}) berhasil masuk ke portal SIM-TU.`);
    return { success: true, message: `Selamat datang, ${matched.name}` };
  };

  const loginAsUser = (userId: string) => {
    const found = sampleUsers.find(u => u.id === userId);
    if (found) {
      setCurrentUser({ ...found, title: found.roleTitle });
      setIsAuthenticated(true);
      addAuditLog('Login Cepat Multilevel', 'Sistem', `Masuk sebagai ${found.name} (${found.roleTitle})`);
    }
  };

  const logout = () => {
    addAuditLog('Logout Pengguna', 'Sistem', `Pengguna ${currentUser.name} telah keluar dari sesi.`);
    setIsAuthenticated(false);
  };

  const canAccessModule = (moduleId: string): boolean => {
    if (!currentUser.allowedModules) return true;
    return currentUser.allowedModules.includes(moduleId) || moduleId === 'dashboard';
  };

  const setCurrentUserRole = (role: UserRole) => {
    const found = sampleUsers.find(u => u.role === role);
    if (found) {
      setCurrentUser({ ...found, title: found.roleTitle });
      addAuditLog(`Beralih Peran ke ${found.roleTitle}`, 'Sistem', `Sesi pengguna dialihkan ke profil ${found.name} (${found.roleTitle})`);
    }
  };

  const switchUserRole = (userId: string) => {
    const found = sampleUsers.find(u => u.id === userId);
    if (found) {
      setCurrentUser({ ...found, title: found.roleTitle });
      addAuditLog(`Beralih Peran ke ${found.roleTitle}`, 'Sistem', `Sesi pengguna dialihkan ke profil ${found.name} (${found.roleTitle})`);
    }
  };

  const updateSchoolProfile = (profile: Partial<SchoolProfile>) => {
    const updated = { ...schoolProfile, ...profile };
    setSchoolProfile(updated);
    addAuditLog('Memperbarui Profil Sekolah', 'Sistem', 'Data identitas instansi sekolah diperbarui');
    try {
      setDoc(doc(db, 'school_profile', 'config'), updated).catch(err => {
        handleFirestoreError(err, OperationType.WRITE, 'school_profile/config');
      });
    } catch (e) {}
  };

  // Surat Masuk Methods
  const addSuratMasuk = (surat: Omit<SuratMasuk, 'id' | 'noAgenda' | 'disposisiList' | 'status'>) => {
    const nextNum = suratMasukList.length + 90;
    const formattedNum = String(nextNum).padStart(3, '0');
    const noAgenda = `AG/${formattedNum}/TU/${new Date().getFullYear()}`;
    const newId = `SM-${new Date().getFullYear()}-${formattedNum}`;
    
    const newSurat: SuratMasuk = {
      ...surat,
      id: newId,
      noAgenda,
      status: 'Diterima TU',
      statusDisposisi: 'Belum Disposisi',
      disposisiList: []
    };

    setSuratMasukList(prev => [newSurat, ...prev]);
    addAuditLog('Mencatat Surat Masuk Baru', 'Persuratan', `Surat dari ${surat.pengirim} perihal "${surat.perihal}" dicatat dengan No. Agenda ${noAgenda}`);

    try {
      setDoc(doc(db, 'surat_masuk', newId), newSurat).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `surat_masuk/${newId}`);
      });
    } catch (e) {}

    return newSurat;
  };

  const updateSuratMasuk = (id: string, updates: Partial<SuratMasuk>) => {
    setSuratMasukList(prev => {
      const next = prev.map(s => s.id === id ? { ...s, ...updates } : s);
      const target = next.find(s => s.id === id);
      if (target) {
        try {
          setDoc(doc(db, 'surat_masuk', id), target).catch(err => {
            handleFirestoreError(err, OperationType.UPDATE, `surat_masuk/${id}`);
          });
        } catch (e) {}
      }
      return next;
    });
    addAuditLog('Memperbarui Data Surat Masuk', 'Persuratan', `Data surat ID ${id} telah dimodifikasi`);
  };

  const deleteSuratMasuk = (id: string) => {
    const target = suratMasukList.find(s => s.id === id);
    setSuratMasukList(prev => prev.filter(s => s.id !== id));
    try {
      deleteDoc(doc(db, 'surat_masuk', id)).catch(err => {
        handleFirestoreError(err, OperationType.DELETE, `surat_masuk/${id}`);
      });
    } catch (e) {}
    if (target) {
      addAuditLog('Menghapus Surat Masuk', 'Persuratan', `Surat No. Agenda ${target.noAgenda} telah dihapus dari sistem`);
    }
  };

  const forwardSuratToKepsek = (suratId: string) => {
    updateSuratMasuk(suratId, { status: 'Menunggu Disposisi', statusDisposisi: 'Belum Disposisi' });
    const target = suratMasukList.find(s => s.id === suratId);
    addAuditLog('Meneruskan Surat ke Kepala Sekolah', 'Persuratan', `Surat Agenda ${target?.noAgenda} diteruskan ke Kepala Sekolah untuk lembar disposisi`);
  };

  const addDisposisiToSurat = (
    suratId: string, 
    disposisiData: Omit<DisposisiAction, 'id' | 'tanggalDisposisi' | 'pemberiDisposisi'>
  ) => {
    const newDisposisi: DisposisiAction = {
      ...disposisiData,
      id: `DISP-${Date.now().toString().slice(-4)}`,
      tanggalDisposisi: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
      pemberiDisposisi: currentUser.name
    };

    const target = suratMasukList.find(s => s.id === suratId);
    if (target) {
      const updatedList = [newDisposisi, ...target.disposisiList];
      updateSuratMasuk(suratId, {
        status: 'Terdisposisi',
        statusDisposisi: 'Sedang Diproses',
        disposisiList: updatedList
      });
      addAuditLog(
        'Memberikan Lembar Disposisi Digital', 
        'Persuratan', 
        `Disposisi untuk Surat Agenda ${target.noAgenda}: "${disposisiData.instruksi}" kepada ${disposisiData.diteruskanKepada.join(', ')}`
      );
    }
  };

  const updateTindakLanjutDisposisi = (
    suratId: string, 
    disposisiId: string, 
    data: { pelaksana: string; catatanHasil: string; status: 'Dalam Proses' | 'Selesai'; lampiranBukti?: string }
  ) => {
    const target = suratMasukList.find(s => s.id === suratId);
    if (target) {
      const updatedDisp = target.disposisiList.map(d => {
        if (d.id === disposisiId) {
          return {
            ...d,
            tindakLanjut: {
              pelaksana: data.pelaksana,
              tanggalLaporan: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
              catatanHasil: data.catatanHasil,
              status: data.status,
              lampiranBukti: data.lampiranBukti
            }
          };
        }
        return d;
      });

      const isCompleted = data.status === 'Selesai';
      updateSuratMasuk(suratId, {
        status: isCompleted ? 'Selesai' : 'Dalam Proses',
        statusDisposisi: isCompleted ? 'Selesai' : 'Sedang Diproses',
        disposisiList: updatedDisp
      });

      addAuditLog(
        'Mengisi Tindak Lanjut Disposisi',
        'Persuratan',
        `Laporan tindak lanjut oleh ${data.pelaksana} dengan status: ${data.status}`
      );
    }
  };

  const archiveSuratMasuk = (suratId: string) => {
    updateSuratMasuk(suratId, { status: 'Diarsipkan', statusDisposisi: 'Selesai' });
    addAuditLog('Mengarsipkan Surat Masuk', 'Persuratan', `Surat ID ${suratId} telah dipindahkan ke arsip digital permanen`);
  };

  // Surat Keluar Methods
  const addSuratKeluar = (surat: Omit<SuratKeluar, 'id' | 'noSurat' | 'status'>) => {
    const nextNum = suratKeluarList.length + 85;
    const formattedNum = String(nextNum).padStart(3, '0');
    const romanMonth = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][new Date().getMonth()];
    const noSurat = `${surat.kodeKlasifikasi || '421.3'}/${formattedNum}/SMP.01/TU/${romanMonth}/${new Date().getFullYear()}`;
    const newId = `SK-${new Date().getFullYear()}-${formattedNum}`;

    const newSurat: SuratKeluar = {
      ...surat,
      id: newId,
      noSurat,
      status: currentUser.role === 'kepala_sekolah' ? 'Disetujui Kepsek' : 'Menunggu Persetujuan'
    };

    setSuratKeluarList(prev => [newSurat, ...prev]);
    addAuditLog('Membuat Draf Surat Keluar', 'Persuratan', `Draf Surat Keluar No ${noSurat} perihal "${surat.perihal}" ditujukan kepada ${surat.tujuan}`);

    try {
      setDoc(doc(db, 'surat_keluar', newId), newSurat).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `surat_keluar/${newId}`);
      });
    } catch (e) {}

    return newSurat;
  };

  const updateSuratKeluar = (id: string, updates: Partial<SuratKeluar>) => {
    setSuratKeluarList(prev => {
      const next = prev.map(s => s.id === id ? { ...s, ...updates } : s);
      const target = next.find(s => s.id === id);
      if (target) {
        try {
          setDoc(doc(db, 'surat_keluar', id), target).catch(err => {
            handleFirestoreError(err, OperationType.UPDATE, `surat_keluar/${id}`);
          });
        } catch (e) {}
      }
      return next;
    });
    addAuditLog('Memperbarui Surat Keluar', 'Persuratan', `Data surat keluar ID ${id} diperbarui`);
  };

  const deleteSuratKeluar = (id: string) => {
    const target = suratKeluarList.find(s => s.id === id);
    setSuratKeluarList(prev => prev.filter(s => s.id !== id));
    try {
      deleteDoc(doc(db, 'surat_keluar', id)).catch(err => {
        handleFirestoreError(err, OperationType.DELETE, `surat_keluar/${id}`);
      });
    } catch (e) {}
    if (target) {
      addAuditLog('Menghapus Surat Keluar', 'Persuratan', `Surat Keluar ${target.noSurat} telah dihapus`);
    }
  };

  const approveSuratKeluar = (id: string) => {
    updateSuratKeluar(id, { status: 'Disetujui Kepsek' });
    const target = suratKeluarList.find(s => s.id === id);
    addAuditLog('Menyetujui Surat Keluar (Approval Kepsek)', 'Persuratan', `Kepala Sekolah menyetujui Surat Keluar No ${target?.noSurat}`);
  };

  const sendSuratKeluar = (id: string) => {
    updateSuratKeluar(id, { status: 'Terkirim' });
    const target = suratKeluarList.find(s => s.id === id);
    addAuditLog('Mengirim Surat Keluar', 'Persuratan', `Surat Keluar No ${target?.noSurat} telah dikirim ke tujuan`);
  };

  // Kesiswaan Methods
  const addSiswa = (siswa: Omit<Siswa, 'id' | 'syncDapodik'>) => {
    const newSiswa: Siswa = {
      ...siswa,
      id: `SIS-${Date.now().toString().slice(-4)}`,
      syncDapodik: true
    };
    setSiswaList(prev => [newSiswa, ...prev]);
    addAuditLog('Menambahkan Data Siswa', 'Kesiswaan', `Data siswa baru ${siswa.nama} (NISN: ${siswa.nisn}, Kelas: ${siswa.kelas}) ditambahkan`);

    try {
      setDoc(doc(db, 'siswa', newSiswa.id), newSiswa).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `siswa/${newSiswa.id}`);
      });
    } catch (e) {}
  };

  const updateSiswa = (id: string, updates: Partial<Siswa>) => {
    setSiswaList(prev => {
      const next = prev.map(s => s.id === id ? { ...s, ...updates } : s);
      const target = next.find(s => s.id === id);
      if (target) {
        try {
          setDoc(doc(db, 'siswa', id), target).catch(err => {
            handleFirestoreError(err, OperationType.UPDATE, `siswa/${id}`);
          });
        } catch (e) {}
      }
      return next;
    });
    addAuditLog('Memperbarui Data Siswa', 'Kesiswaan', `Data siswa ID ${id} telah disinkronkan`);
  };

  const deleteSiswa = (id: string) => {
    const target = siswaList.find(s => s.id === id);
    setSiswaList(prev => prev.filter(s => s.id !== id));
    try {
      deleteDoc(doc(db, 'siswa', id)).catch(err => {
        handleFirestoreError(err, OperationType.DELETE, `siswa/${id}`);
      });
    } catch (e) {}
    if (target) {
      addAuditLog('Menghapus Data Siswa', 'Kesiswaan', `Data siswa ${target.nama} (NIS: ${target.nis}) telah dihapus`);
    }
  };

  const processMutasiSiswa = (
    siswaId: string, 
    type: 'Mutasi Keluar' | 'Mutasi Masuk' | 'Lulus', 
    payload: { tanggal: string; sekolahAsalTujuan: string; alasan: string }
  ) => {
    updateSiswa(siswaId, {
      status: type,
      tanggalMutasi: payload.tanggal,
      sekolahAsalTujuan: payload.sekolahAsalTujuan,
      alasanMutasi: payload.alasan
    });

    const target = siswaList.find(s => s.id === siswaId);
    addAuditLog(
      `Pencatatan ${type} Siswa`, 
      'Kesiswaan', 
      `Siswa ${target?.nama} (${target?.kelas}) status diubah menjadi ${type}. Sekolah tujuan/asal: ${payload.sekolahAsalTujuan}`
    );
  };

  // Kepegawaian & Cuti Methods
  const addPegawai = (pegawai: Omit<Pegawai, 'id'>) => {
    const newPegawai: Pegawai = {
      ...pegawai,
      id: `PEG-${Date.now().toString().slice(-4)}`
    };
    setPegawaiList(prev => [...prev, newPegawai]);
    addAuditLog('Menambahkan Data Pegawai GTK', 'Kepegawaian', `Data pegawai baru ${pegawai.nama} (${pegawai.jabatan}) ditambahkan`);

    try {
      setDoc(doc(db, 'pegawai', newPegawai.id), newPegawai).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `pegawai/${newPegawai.id}`);
      });
    } catch (e) {}
  };

  const updatePegawai = (id: string, updates: Partial<Pegawai>) => {
    setPegawaiList(prev => {
      const next = prev.map(p => p.id === id ? { ...p, ...updates } : p);
      const target = next.find(p => p.id === id);
      if (target) {
        try {
          setDoc(doc(db, 'pegawai', id), target).catch(err => {
            handleFirestoreError(err, OperationType.UPDATE, `pegawai/${id}`);
          });
        } catch (e) {}
      }
      return next;
    });
    addAuditLog('Memperbarui Data Pegawai', 'Kepegawaian', `Data pegawai ID ${id} diperbarui`);
  };

  const deletePegawai = (id: string) => {
    const target = pegawaiList.find(p => p.id === id);
    setPegawaiList(prev => prev.filter(p => p.id !== id));
    try {
      deleteDoc(doc(db, 'pegawai', id)).catch(err => {
        handleFirestoreError(err, OperationType.DELETE, `pegawai/${id}`);
      });
    } catch (e) {}
    if (target) {
      addAuditLog('Menghapus Data Pegawai', 'Kepegawaian', `Data pegawai ${target.nama} telah dihapus`);
    }
  };

  const updatePresensiPegawai = (id: string, status: Pegawai['statusPresensiHariIni']) => {
    updatePegawai(id, { statusPresensiHariIni: status });
    const target = pegawaiList.find(p => p.id === id);
    addAuditLog('Update Presensi Guru/Staf', 'Kepegawaian', `Presensi ${target?.nama} hari ini diset: ${status}`);
  };

  const addPengajuanCuti = (cuti: Omit<PengajuanCuti, 'id' | 'status' | 'tanggalPengajuan'>) => {
    const newCuti: PengajuanCuti = {
      ...cuti,
      id: `CUTI-${Date.now().toString().slice(-4)}`,
      status: 'Menunggu Persetujuan',
      tanggalPengajuan: new Date().toISOString().slice(0, 10)
    };
    setCutiList(prev => [newCuti, ...prev]);
    addAuditLog('Mengajukan Cuti Pegawai', 'Kepegawaian', `Pengajuan ${cuti.jenisCuti} (${cuti.durasiHari} hari) oleh ${cuti.namaPegawai} diteruskan ke Kepala Sekolah.`);

    try {
      setDoc(doc(db, 'pengajuan_cuti', newCuti.id), newCuti).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `pengajuan_cuti/${newCuti.id}`);
      });
    } catch (e) {}
  };

  const approvePengajuanCuti = (id: string) => {
    setCutiList(prev => {
      const next = prev.map(c => c.id === id ? { ...c, status: 'Disetujui' as const } : c);
      const target = next.find(c => c.id === id);
      if (target) {
        try {
          setDoc(doc(db, 'pengajuan_cuti', id), target).catch(err => {
            handleFirestoreError(err, OperationType.UPDATE, `pengajuan_cuti/${id}`);
          });
        } catch (e) {}
      }
      return next;
    });
    const target = cutiList.find(c => c.id === id);
    addAuditLog('Menyetujui Pengajuan Cuti', 'Kepegawaian', `Kepala Sekolah menyetujui ${target?.jenisCuti} a.n. ${target?.namaPegawai}`);
  };

  // Keuangan Methods
  const addPembayaranSPP = (data: Omit<PembayaranSPP, 'id' | 'noKuitansi' | 'status' | 'penerimaStaf'>) => {
    const nextReceiptNum = pembayaranList.length + 45;
    const formatted = String(nextReceiptNum).padStart(3, '0');
    const monthNum = String(new Date().getMonth() + 1).padStart(2, '0');
    const noKuitansi = `KW/TU/${new Date().getFullYear()}/${monthNum}/${formatted}`;

    const newPayment: PembayaranSPP = {
      ...data,
      id: `PAY-${Date.now()}`,
      noKuitansi,
      status: 'Lunas',
      penerimaStaf: currentUser.name
    };

    setPembayaranList(prev => [newPayment, ...prev]);

    // Add to Kas
    const latestSaldo = transaksiKasList[transaksiKasList.length - 1]?.saldoAkhir || 0;
    const newKas: TransaksiKas = {
      id: `KAS-${Date.now()}`,
      tanggal: data.tanggalBayar,
      tipe: 'Pemasukan',
      kategori: `Iuran ${data.posBayar}`,
      deskripsi: `Setoran kasir TU a.n. ${data.namaSiswa} (${data.kelas}) - ${data.bulan} [${data.metodePembayaran}]`,
      nominal: data.nominal,
      saldoAkhir: latestSaldo + data.nominal,
      penanggungJawab: currentUser.name
    };

    setTransaksiKasList(prev => [...prev, newKas]);

    addAuditLog(
      'Mencatat Pembayaran Keuangan', 
      'Keuangan', 
      `Diterima Rp ${data.nominal.toLocaleString('id-ID')} dari ${data.namaSiswa} (${data.kelas}) untuk ${data.posBayar} ${data.bulan} - No Kuitansi: ${noKuitansi}`
    );

    try {
      setDoc(doc(db, 'pembayaran_spp', newPayment.id), newPayment).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `pembayaran_spp/${newPayment.id}`);
      });
      setDoc(doc(db, 'transaksi_kas', newKas.id), newKas).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `transaksi_kas/${newKas.id}`);
      });
    } catch (e) {}

    return newPayment;
  };

  const addTransaksiKas = (data: Omit<TransaksiKas, 'id' | 'saldoAkhir'>) => {
    const latestSaldo = transaksiKasList[transaksiKasList.length - 1]?.saldoAkhir || 0;
    const newSaldo = data.tipe === 'Pemasukan' ? latestSaldo + data.nominal : latestSaldo - data.nominal;

    const newKas: TransaksiKas = {
      ...data,
      id: `KAS-${Date.now()}`,
      saldoAkhir: newSaldo
    };

    setTransaksiKasList(prev => [...prev, newKas]);
    addAuditLog(
      `Mencatat Transaksi Kas (${data.tipe})`,
      'Keuangan',
      `${data.kategori}: Rp ${data.nominal.toLocaleString('id-ID')} - ${data.deskripsi}`
    );

    try {
      setDoc(doc(db, 'transaksi_kas', newKas.id), newKas).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `transaksi_kas/${newKas.id}`);
      });
    } catch (e) {}
  };

  // Inventaris Methods
  const addInventaris = (item: Omit<BarangInventaris, 'id' | 'kodeBarang'> & { kodeBarang?: string }) => {
    const nextNum = inventarisList.length + 1;
    const kodeBarang = item.kodeBarang || `BMN/2026/${item.ruangan.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7)}/${String(nextNum).padStart(3, '0')}`;
    
    const newItem: BarangInventaris = {
      ...item,
      id: `INV-${Date.now().toString().slice(-4)}`,
      kodeBarang
    };
    setInventarisList(prev => [...prev, newItem]);
    addAuditLog('Menambahkan Aset Inventaris', 'Inventaris', `Aset baru ${item.namaBarang} (${item.jumlah} ${item.satuan}) di ${item.ruangan} tercatat.`);

    try {
      setDoc(doc(db, 'inventaris', newItem.id), newItem).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `inventaris/${newItem.id}`);
      });
    } catch (e) {}
  };

  const updateInventaris = (id: string, updates: Partial<BarangInventaris>) => {
    setInventarisList(prev => {
      const next = prev.map(i => i.id === id ? { ...i, ...updates } : i);
      const target = next.find(i => i.id === id);
      if (target) {
        try {
          setDoc(doc(db, 'inventaris', id), target).catch(err => {
            handleFirestoreError(err, OperationType.UPDATE, `inventaris/${id}`);
          });
        } catch (e) {}
      }
      return next;
    });
    addAuditLog('Memperbarui Aset Inventaris', 'Inventaris', `Data aset inventaris ID ${id} diperbarui`);
  };

  const deleteInventaris = (id: string) => {
    const target = inventarisList.find(i => i.id === id);
    setInventarisList(prev => prev.filter(i => i.id !== id));
    try {
      deleteDoc(doc(db, 'inventaris', id)).catch(err => {
        handleFirestoreError(err, OperationType.DELETE, `inventaris/${id}`);
      });
    } catch (e) {}
    if (target) {
      addAuditLog('Menghapus Aset Inventaris', 'Inventaris', `Aset ${target.namaBarang} (${target.kodeBarang}) telah dihapus`);
    }
  };

  const resetToDefaultData = () => {
    localStorage.clear();
    setSchoolProfile(initialSchoolProfile);
    setCurrentUser(sampleUsers[0]);
    setIsAuthenticated(true);
    setSuratMasukList(initialSuratMasuk);
    setSuratKeluarList(initialSuratKeluar);
    setSiswaList(initialSiswa);
    setPegawaiList(initialPegawai);
    setCutiList(initialCutiList);
    setPembayaranList(initialPembayaranSPP);
    setTransaksiKasList(initialTransaksiKas);
    setInventarisList(initialBarangInventaris);
    setAuditLogs(initialAuditLogs);
    addAuditLog('Reset Data Sistem', 'Sistem', 'Semua data telah dikembalikan ke data simulasi awal.');
  };

  const userOptions = sampleUsers.map(u => ({ ...u, title: u.roleTitle }));

  return (
    <SchoolContext.Provider
      value={{
        isAuthenticated,
        login,
        loginAsUser,
        logout,
        canAccessModule,

        schoolProfile,
        updateSchoolProfile,
        currentUser,
        setCurrentUserRole,
        switchUserRole,
        availableUsers: sampleUsers,
        userOptions,

        suratMasukList,
        addSuratMasuk,
        updateSuratMasuk,
        deleteSuratMasuk,
        addDisposisiToSurat,
        updateTindakLanjutDisposisi,
        forwardSuratToKepsek,
        archiveSuratMasuk,

        suratKeluarList,
        addSuratKeluar,
        updateSuratKeluar,
        deleteSuratKeluar,
        approveSuratKeluar,
        sendSuratKeluar,

        siswaList,
        addSiswa,
        updateSiswa,
        deleteSiswa,
        processMutasiSiswa,

        pegawaiList,
        addPegawai,
        updatePegawai,
        deletePegawai,
        updatePresensiPegawai,
        cutiList,
        addPengajuanCuti,
        approvePengajuanCuti,

        pembayaranList,
        addPembayaranSPP,
        transaksiKasList,
        addTransaksiKas,

        inventarisList,
        addInventaris,
        updateInventaris,
        deleteInventaris,

        auditLogs,
        addAuditLog,

        resetToDefaultData,
        isCloudSynced
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
