import React, { useState } from 'react';
import { Siswa } from '../../types';
import { useSchool } from '../../context/SchoolContext';
import { ArrowLeftRight, X, AlertCircle } from 'lucide-react';

interface MutasiSiswaModalProps {
  siswa: Siswa;
  onClose: () => void;
}

export const MutasiSiswaModal: React.FC<MutasiSiswaModalProps> = ({ siswa, onClose }) => {
  const { processMutasiSiswa } = useSchool();

  const [tipeMutasi, setTipeMutasi] = useState<'Mutasi Keluar' | 'Mutasi Masuk' | 'Lulus'>('Mutasi Keluar');
  const [sekolahAsalTujuan, setSekolahAsalTujuan] = useState(siswa.sekolahAsalTujuan || '');
  const [alasan, setAlasan] = useState(siswa.alasanMutasi || '');
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sekolahAsalTujuan && tipeMutasi !== 'Lulus') {
      alert('Mohon isi nama sekolah asal/tujuan mutasi.');
      return;
    }

    processMutasiSiswa(siswa.id, tipeMutasi, {
      tanggal,
      sekolahAsalTujuan: sekolahAsalTujuan || 'Kelulusan Resmi Tingkat SMP',
      alasan: alasan || 'Mengikuti alur mutasi administrasi sekolah'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 text-xs">
        
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-sm">Pencatatan Mutasi / Kelulusan Siswa</h3>
              <p className="text-[11px] text-slate-300">Siswa: {siswa.nama} ({siswa.kelas})</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Pilih Jenis Mutasi / Status *</label>
            <select
              value={tipeMutasi}
              onChange={(e) => setTipeMutasi(e.target.value as any)}
              className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-semibold text-slate-800"
            >
              <option value="Mutasi Keluar">Mutasi Keluar (Pindah ke Sekolah Lain)</option>
              <option value="Mutasi Masuk">Mutasi Masuk (Pindahan Masuk ke SMP Ini)</option>
              <option value="Lulus">Lulus / Alumni</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              {tipeMutasi === 'Mutasi Keluar' ? 'Sekolah Tujuan Pindah *' : tipeMutasi === 'Mutasi Masuk' ? 'Sekolah Asal Siswa *' : 'Keterangan Kelulusan'}
            </label>
            <input
              type="text"
              required={tipeMutasi !== 'Lulus'}
              value={sekolahAsalTujuan}
              onChange={(e) => setSekolahAsalTujuan(e.target.value)}
              placeholder="Contoh: SMP Negeri 3 Kota Bandung"
              className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Tanggal Efektif Mutasi *</label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Alasan Kepindahan / Catatan Mutasi</label>
            <textarea
              rows={3}
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
              placeholder="Tuliskan alasan mutasi, dokumen pendukung, nomor surat permohonan ortu..."
              className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
            />
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-start gap-2 text-[11px]">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>
              Perubahan status mutasi ini akan otomatis dicatat di Audit Log dan disinkronkan ke Format Dapodik Kesiswaan.
            </span>
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
              Simpan & Mutasikan Siswa
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
