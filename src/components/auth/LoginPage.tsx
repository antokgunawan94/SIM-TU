import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { 
  ShieldCheck, 
  UserCheck, 
  Lock, 
  Mail, 
  KeyRound, 
  LogIn, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Building2, 
  FileText, 
  Users, 
  Wallet, 
  Award, 
  Package, 
  Eye, 
  EyeOff, 
  ArrowRight,
  GraduationCap
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { schoolProfile, availableUsers, login, loginAsUser } = useSchool();
  
  const [activeTab, setActiveTab] = useState<'cards' | 'form'>('cards');
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedUserForForm, setSelectedUserForForm] = useState<string>('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const res = login(usernameInput, passwordInput);
      setIsLoading(false);
      if (!res.success) {
        setErrorMessage(res.message);
      }
    }, 400);
  };

  const handleQuickLogin = (userId: string) => {
    setIsLoading(true);
    setTimeout(() => {
      loginAsUser(userId);
      setIsLoading(false);
    }, 250);
  };

  const handleFillCredentials = (username: string, pass: string = '123') => {
    setUsernameInput(username);
    setPasswordInput(pass);
    setActiveTab('form');
    setErrorMessage('');
  };

  const handleBelajarIdLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      // Find belajar.id account or default to Antok Gunawan
      const belajarUser = availableUsers.find(u => u.email.includes('belajar.id')) || availableUsers[availableUsers.length - 1];
      loginAsUser(belajarUser.id);
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      
      {/* Background Decorative Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-500/20">
              TU
            </div>
            <div>
              <h1 className="text-sm font-black text-white tracking-wide flex items-center gap-2">
                {schoolProfile.namaSekolah}
                <span className="text-[10px] bg-blue-500/20 text-blue-300 font-mono px-2 py-0.5 rounded-full border border-blue-400/30">
                  SIM-TU Multilevel
                </span>
              </h1>
              <p className="text-[11px] text-slate-400">
                Portal Layanan Administrasi Tata Usaha & Kesiswaan Terpadu
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Autentikasi Hak Akses Bertingkat (RBAC Level 1-5)</span>
          </div>
        </div>
      </header>

      {/* Main Login Content */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col items-center justify-center">
        
        <div className="w-full max-w-5xl space-y-6">
          
          {/* Headline & Description */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-300 rounded-full border border-blue-500/20 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>Sistem Tata Usaha SMP Terstandar Nasional</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Masuk ke Portal SIM-TU Sekolah
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
              Silakan pilih profil peran untuk simulasi cepat alur kerja bertingkat, atau masuk menggunakan kredensial NIP/Username/Akun belajar.id.
            </p>
          </div>

          {/* Tab Selection */}
          <div className="flex justify-center">
            <div className="bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 inline-flex gap-1.5 shadow-xl">
              <button
                type="button"
                onClick={() => setActiveTab('cards')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'cards'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Pilih Berdasarkan Peran (6 Level)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('form')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'form'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>Form Login Mandiri & belajar.id</span>
              </button>
            </div>
          </div>

          {/* TAB 1: Multilevel Quick Role Cards */}
          {activeTab === 'cards' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              
              <div className="text-center">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Klik peran untuk langsung masuk dengan hak akses yang disesuaikan
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableUsers.map((user) => {
                  const isKepsek = user.role === 'kepala_sekolah';
                  const isKTU = user.role === 'kepala_tu';
                  const isKeuangan = user.role === 'staf_keuangan';
                  const isSurat = user.role === 'staf_persuratan';
                  const isKesiswaan = user.role === 'staf_kesiswaan';
                  const isGuru = user.role === 'waka_guru';

                  let badgeColor = 'bg-blue-500/20 text-blue-300 border-blue-400/30';
                  let iconBg = 'bg-blue-600';
                  let RoleIcon = UserCheck;

                  if (isKepsek) {
                    badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-400/30';
                    iconBg = 'bg-amber-600';
                    RoleIcon = Award;
                  } else if (isKTU) {
                    badgeColor = 'bg-purple-500/20 text-purple-300 border-purple-400/30';
                    iconBg = 'bg-purple-600';
                    RoleIcon = Building2;
                  } else if (isKeuangan) {
                    badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30';
                    iconBg = 'bg-emerald-600';
                    RoleIcon = Wallet;
                  } else if (isSurat) {
                    badgeColor = 'bg-teal-500/20 text-teal-300 border-teal-400/30';
                    iconBg = 'bg-teal-600';
                    RoleIcon = FileText;
                  } else if (isKesiswaan) {
                    badgeColor = 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30';
                    iconBg = 'bg-cyan-600';
                    RoleIcon = Users;
                  } else if (isGuru) {
                    badgeColor = 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30';
                    iconBg = 'bg-indigo-600';
                    RoleIcon = GraduationCap;
                  }

                  return (
                    <div
                      key={user.id}
                      className="bg-slate-900/90 border border-slate-800 hover:border-slate-600 hover:bg-slate-850 rounded-2xl p-5 transition-all shadow-lg flex flex-col justify-between group hover:shadow-blue-500/5"
                    >
                      <div className="space-y-3">
                        {/* Header: Level & Avatar */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow-sm"
                            />
                            <div>
                              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor} mb-1`}>
                                Level {user.level}
                              </span>
                              <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                                {user.name}
                              </h3>
                              <p className="text-[11px] text-yellow-400/90 font-medium">
                                {user.roleTitle}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* NIP and Email */}
                        <div className="text-[10px] font-mono text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 space-y-0.5">
                          {user.nip && <div>NIP: <span className="text-slate-300">{user.nip}</span></div>}
                          <div>Akun: <span className="text-blue-400">{user.email}</span></div>
                          <div>User: <span className="text-slate-300 font-bold">{user.username}</span> (Pass: <span className="text-emerald-400">123</span>)</div>
                        </div>

                        {/* Scope of Permissions */}
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {user.permissionsDescription}
                        </p>
                      </div>

                      {/* Action Button */}
                      <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleQuickLogin(user.id)}
                          disabled={isLoading}
                          className="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20 cursor-pointer flex items-center justify-center gap-2"
                        >
                          <LogIn className="w-3.5 h-3.5" />
                          <span>Masuk Akun Ini</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFillCredentials(user.username, user.password || '123')}
                          title="Isi ke Form Login"
                          className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition-colors cursor-pointer"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 2: Form Login & belajar.id */}
          {activeTab === 'form' && (
            <div className="max-w-md mx-auto animate-in fade-in duration-300 space-y-4">
              
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
                
                <div className="space-y-1 text-center">
                  <h3 className="text-lg font-bold text-white">Autentikasi Akun SIM-TU</h3>
                  <p className="text-xs text-slate-400">
                    Masukkan Username, NIP, atau Email terdaftar
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-start gap-2.5 animate-in shake">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  
                  {/* Username / NIP */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span>Username / NIP / Email</span>
                      <span className="text-[10px] text-slate-500">contoh: kepsek, ktu, bendahara</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        placeholder="Masukkan username atau NIP..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span>Kata Sandi (Password)</span>
                      <span className="text-[10px] text-emerald-400">Preset demo: 123</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Quick autofill helper chips */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-slate-500 block">Pilih cepat autofill kredensial:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {availableUsers.map((u) => (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => handleFillCredentials(u.username, u.password || '123')}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] rounded-lg border border-slate-700/60 transition-colors cursor-pointer"
                        >
                          {u.username}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
                  >
                    {isLoading ? (
                      <span>Memverifikasi Sesi...</span>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        <span>Masuk ke Dashboard TU</span>
                      </>
                    )}
                  </button>

                </form>

                {/* Divider */}
                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-800"></div>
                  <span className="flex-shrink mx-3 text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    Atau Masuk Terintegrasi
                  </span>
                  <div className="flex-grow border-t border-slate-800"></div>
                </div>

                {/* SSO Belajar.id Button */}
                <button
                  type="button"
                  onClick={handleBelajarIdLogin}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700/80 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2.5 shadow-sm hover:border-blue-500/50"
                >
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-[10px]">
                    b
                  </div>
                  <span>Masuk dengan Akun belajar.id</span>
                </button>

              </div>

            </div>
          )}

          {/* Role Hierarchy Matrix Reference */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 text-xs text-slate-400 space-y-3">
            <h4 className="font-bold text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Struktur Tingkatan Hak Akses (Role-Based Access Control) SIM-TU:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-[11px]">
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/60">
                <span className="font-bold text-amber-400 block">Level 1: Kepala Sekolah</span>
                Persetujuan disposisi, TTE surat keluar, persetujuan cuti GTK, & monitoring kas.
              </div>
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/60">
                <span className="font-bold text-purple-400 block">Level 2: Kepala Tata Usaha</span>
                Verifikasi seluruh alur berkas, agenda surat, kesiswaan Dapodik, dan sarpras.
              </div>
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/60">
                <span className="font-bold text-emerald-400 block">Level 3: Bendahara Sekolah</span>
                Otoritas loket kasir SPP/iuran, cetak kuitansi resmi, dan pembukuan kas BOS.
              </div>
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/60">
                <span className="font-bold text-teal-400 block">Level 4: Staf Persuratan</span>
                Registrasi surat masuk/keluar, penomoran kode klasifikasi, & generator surat dinas.
              </div>
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/60">
                <span className="font-bold text-cyan-400 block">Level 4: Staf Kesiswaan</span>
                Pengelolaan database siswa, mutasi sekolah, kartu pelajar, & ekspor Dapodik.
              </div>
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/60">
                <span className="font-bold text-indigo-400 block">Level 5: Guru & Tendik</span>
                Menerima disposisi tugas kepala sekolah, tindak lanjut disposisi, & pengajuan cuti.
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950 px-4 py-4 text-center text-xs text-slate-500">
        <p className="font-medium text-slate-400">
          {schoolProfile.namaSekolah} • NPSN {schoolProfile.npsn}
        </p>
        <p className="text-[10px] text-slate-600 mt-0.5">
          Sistem Informasi Tata Usaha (SIM-TU) Terpadu • Kemendikbudristek RI
        </p>
      </footer>

    </div>
  );
};
