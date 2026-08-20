import React, { useState } from 'react';
import { SuratMasuk } from '../../types';
import { useSchool } from '../../context/SchoolContext';
import { Send, CheckSquare, Clock, UserCheck, Sparkles, AlertCircle, X } from 'lucide-react';

interface DisposisiModalProps {
  surat: SuratMasuk;
  onClose: () => void;
}

const DAFTAR_PEJABAT = [
  'Waka Kurikulum (Nurul Aini, M.Pd.)',
  'Waka Kesiswaan',
  'Waka Sarana & Prasarana',
  'Waka Humas',
  'Kepala Tata Usaha (Siti Rahmawati, S.AP.)',
  'Kepala Lab Komputer / Proktor (Fajar Ramadhan, S.Kom.)',
  'Koordinator Guru BK (Dewi Lestari, S.Pd.)',
  'Bendahara Sekolah (Agus Setiawan, S.E.)',
  'Pembina OSIS',
  'Kepala Perpustakaan'
];

const PRESET_INSTRUKSI = [
  'Tindak lanjuti segera',
  'Hadiri & wakili Kepala Sekolah',
  'Koordinasikan dengan tim terkait',
  'Pelajari & siapkan bahan telaah',
  'Siapkan laporan / data dukung',
  'Edarkan ke dewan guru & wali kelas',
  'Jadwalkan dalam agenda sekolah',
  'Arsipkan & catat untuk diketahui'
];

export const DisposisiModal: React.FC<DisposisiModalProps> = ({ surat, onClose }) => {
  const { addDisposisiToSurat, currentUser } = useSchool();

  const [selectedInstruksi, setSelectedInstruksi] = useState<string[]>(['Tindak lanjuti segera']);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [catatanKepsek, setCatatanKepsek] = useState('');
  const [batasWaktu, setBatasWaktu] = useState('');

  const toggleInstruksi = (item: string) => {
    setSelectedInstruksi(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const toggleRecipient = (recipient: string) => {
    setSelectedRecipients(prev => 
      prev.includes(recipient) ? prev.filter(r => r !== recipient) : [...prev, recipient]
    );
  };

  const handleApplyAISuggestion = () => {
    // Smart auto-fill based on letter category
    if (surat.kategori.includes('Dinas') || surat.perihal.toLowerCase().includes('anbk') || surat.perihal.toLowerCase().includes('kurikulum')) {
      setSelectedInstruksi(['Tindak lanjuti segera', 'Hadiri & wakili Kepala Sekolah', 'Koordinasikan dengan tim terkait']);
      setSelectedRecipients(['Waka Kurikulum (Nurul Aini, M.Pd.)', 'Kepala Lab Komputer / Proktor (Fajar Ramadhan, S.Kom.)']);
      setCatatanKepsek(`Mohon Waka Kurikulum dan Proktor menghadiri rakor dan siapkan kelengkapan data kesiapan teknis sekolah.`);
      setBatasWaktu('2026-08-21');
    } else if (surat.perihal.toLowerCase().includes('osn') || surat.perihal.toLowerCase().includes('lomba') || surat.kategori.includes('Kementerian')) {
      setSelectedInstruksi(['Tindak lanjuti segera', 'Koordinasikan dengan tim terkait']);
      setSelectedRecipients(['Waka Kesiswaan', 'Pembina OSIS']);
      setCatatanKepsek(`Tolong siapkan pembimbingan intensif dan dispensasi belajar bagi siswa yang lolos seleksi.`);
      setBatasWaktu('2026-08-25');
    } else {
      setSelectedInstruksi(['Pelajari & siapkan bahan telaah', 'Koordinasikan dengan tim terkait']);
      setSelectedRecipients(['Kepala Tata Usaha (Siti Rahmawati, S.AP.)']);
      setCatatanKepsek(`Pelajari ketentuan surat dan buat konsep tindak lanjut untuk dilaporkan ke pimpinan.`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRecipients.length === 0) {
      alert('Pilih minimal satu pejabat/staf penerima disposisi.');
      return;
    }

    addDisposisiToSurat(surat.id, {
      instruksi: selectedInstruksi.join(', ') || 'Tindak lanjuti',
      diteruskanKepada: selectedRecipients,
      catatanKepsek: catatanKepsek || 'Harap segera dikoordinasikan dan ditindaklanjuti sesuai petunjuk.',
      batasWaktu: batasWaktu || undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200">
        
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <CheckSquare className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Formulir e-Disposisi Digital Kepala Sekolah</h3>
              <p className="text-xs text-blue-200">Surat Masuk No. Agenda: <span className="font-semibold text-yellow-300">{surat.noAgenda}</span></p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ringkasan Surat */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex-1">
            <p className="font-semibold text-slate-800 line-clamp-1">{surat.perihal}</p>
            <p className="text-slate-500">Dari: <span className="font-medium text-slate-700">{surat.pengirim}</span> ({surat.instansiPengirim})</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleApplyAISuggestion}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Saran AI Otomatis
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Instruksi Checklist */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              1. Pilih Instruksi / Petunjuk Tindak Lanjut:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_INSTRUKSI.map((item, idx) => {
                const checked = selectedInstruksi.includes(item);
                return (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => toggleInstruksi(item)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                      checked 
                        ? 'bg-blue-50/80 border-blue-600 text-blue-950 font-semibold shadow-xs' 
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-xs border flex items-center justify-center text-[10px] ${
                      checked ? 'bg-blue-600 border-blue-600 text-white font-bold' : 'border-slate-400 bg-white'
                    }`}>
                      {checked ? '✓' : ''}
                    </div>
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Diteruskan Kepada (Multi Selection) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              2. Diteruskan Kepada Yth (Pilih Pejabat / Staf Pelaksana):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DAFTAR_PEJABAT.map((pejabat, idx) => {
                const checked = selectedRecipients.includes(pejabat);
                return (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => toggleRecipient(pejabat)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                      checked 
                        ? 'bg-emerald-50/80 border-emerald-600 text-emerald-950 font-semibold shadow-xs' 
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <UserCheck className={`w-4 h-4 ${checked ? 'text-emerald-700' : 'text-slate-400'}`} />
                    <span className="truncate">{pejabat}</span>
                  </button>
                );
              })}
            </div>
            {selectedRecipients.length === 0 && (
              <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Wajib memilih minimal satu penerima disposisi.
              </p>
            )}
          </div>

          {/* Catatan Khusus & Target Waktu */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                3. Catatan Khusus Kepala Sekolah:
              </label>
              <textarea
                rows={3}
                value={catatanKepsek}
                onChange={(e) => setCatatanKepsek(e.target.value)}
                placeholder="Tuliskan arahan spesifik, penugasan teknis, atau catatan tambahan..."
                className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                4. Batas Waktu / Target Selesai:
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={batasWaktu}
                  onChange={(e) => setBatasWaktu(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                Opsional untuk surat berbatas waktu.
              </p>
            </div>
          </div>

          {/* User Sign Info */}
          <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-blue-900">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Pemberi Disposisi:</span>
              <span>{currentUser.name} ({currentUser.roleTitle})</span>
            </div>
            <span className="text-[11px] text-blue-700 font-mono">Tervalidasi Digital</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 text-xs font-medium rounded-xl hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-800 hover:bg-blue-900 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-900/20 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Kirim Disposisi Digital
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
