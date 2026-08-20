import React, { useState } from 'react';
import { SuratMasuk } from '../../types';
import { useSchool } from '../../context/SchoolContext';
import { StatusBadge } from '../common/StatusBadge';
import { LembarDisposisiPrint } from './LembarDisposisiPrint';
import { DisposisiModal } from './DisposisiModal';
import { 
  FileText, 
  Send, 
  Printer, 
  Clock, 
  Building, 
  User, 
  Calendar, 
  CheckCircle2, 
  X, 
  ArrowRight, 
  PlusCircle,
  UploadCloud,
  FileCheck
} from 'lucide-react';

interface SuratMasukDetailModalProps {
  surat: SuratMasuk;
  onClose: () => void;
}

export const SuratMasukDetailModal: React.FC<SuratMasukDetailModalProps> = ({ surat, onClose }) => {
  const { 
    currentUser, 
    forwardSuratToKepsek, 
    updateTindakLanjutDisposisi,
    archiveSuratMasuk 
  } = useSchool();

  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showDisposisiModal, setShowDisposisiModal] = useState(false);

  // State for Follow-up reporting form (Tindak Lanjut Pelaksana)
  const [activeTindakLanjutDispId, setActiveTindakLanjutDispId] = useState<string | null>(null);
  const [catatanHasil, setCatatanHasil] = useState('');
  const [tindakLanjutStatus, setTindakLanjutStatus] = useState<'Dalam Proses' | 'Selesai'>('Selesai');
  const [lampiranBukti, setLampiranBukti] = useState('');

  const handleSaveTindakLanjut = (dispId: string) => {
    if (!catatanHasil.trim()) {
      alert('Mohon isi uraian hasil tindak lanjut.');
      return;
    }

    updateTindakLanjutDisposisi(surat.id, dispId, {
      pelaksana: currentUser.name,
      catatanHasil,
      status: tindakLanjutStatus,
      lampiranBukti: lampiranBukti || 'Laporan_Tindak_Lanjut_Dokumen.pdf'
    });

    setActiveTindakLanjutDispId(null);
    setCatatanHasil('');
  };

  const isKepsek = currentUser.role === 'kepala_sekolah';
  const isKTU = currentUser.role === 'kepala_tu';
  const isStaffPersuratan = currentUser.role === 'staf_persuratan';

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
          
          {/* Header */}
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-600/30 rounded-xl border border-blue-400/30">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-sm">
                    {surat.noAgenda}
                  </span>
                  <StatusBadge status={surat.status} />
                  <StatusBadge sifat={surat.sifat} type="sifat" />
                </div>
                <h2 className="text-base font-bold text-white mt-1 line-clamp-1">{surat.perihal}</h2>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-sm">
            
            {/* Top Details Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Building className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-xs text-slate-500 block">Instansi & Pengirim:</span>
                    <span className="font-semibold text-slate-900">{surat.instansiPengirim}</span>
                    <p className="text-xs text-slate-600">{surat.pengirim}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <FileText className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-xs text-slate-500 block">Nomor Surat Asal:</span>
                    <span className="font-mono text-xs font-semibold text-slate-800">{surat.noSuratAsal}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-xs text-slate-500 block">Tanggal Surat & Diterima:</span>
                    <span className="font-medium text-slate-800">Tgl Surat: {surat.tanggalSurat}</span>
                    <span className="text-xs text-slate-500 block">Diterima TU: {surat.tanggalTerima}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <User className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-xs text-slate-500 block">Kategori & Berkas Lampiran:</span>
                    <span className="inline-block text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-sm border border-indigo-100 mr-2">
                      {surat.kategori}
                    </span>
                    {surat.fileName && (
                      <span className="text-xs text-blue-700 font-mono underline cursor-pointer hover:text-blue-900">
                        📎 {surat.fileName}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Isi Ringkas & Catatan TU */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">Ringkasan Isi Surat:</h4>
              <div className="p-3.5 bg-white border border-slate-200 rounded-xl text-slate-700 leading-relaxed">
                {surat.ringkasan}
              </div>
              {surat.catatanTU && (
                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-950">
                  <span className="font-bold">Catatan Verifikator TU:</span> {surat.catatanTU}
                </div>
              )}
            </div>

            {/* SECTION: Riwayat & Alur Disposisi Digital */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div>
                  <h4 className="font-bold text-sm text-slate-900">Alur Disposisi Digital Kepala Sekolah</h4>
                </div>

                <div className="flex items-center gap-2">
                  {surat.disposisiList.length > 0 && (
                    <button
                      onClick={() => setShowPrintModal(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-600" />
                      Cetak Lembar Disposisi
                    </button>
                  )}

                  {(isKepsek || isKTU) && (
                    <button
                      onClick={() => setShowDisposisiModal(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      + Beri Lembar Disposisi
                    </button>
                  )}
                </div>
              </div>

              {/* Disposisi List Container */}
              {surat.disposisiList.length === 0 ? (
                <div className="p-6 border-2 border-dashed border-slate-200 rounded-xl text-center space-y-2 bg-slate-50/50">
                  <Clock className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-sm font-medium text-slate-600">Surat belum memiliki lembar disposisi dari Kepala Sekolah.</p>
                  
                  {surat.status === 'Diterima TU' && (
                    <button
                      onClick={() => forwardSuratToKepsek(surat.id)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Teruskan Surat ke Meja Kepala Sekolah
                    </button>
                  )}
                  {surat.status === 'Menunggu Disposisi' && isKepsek && (
                    <button
                      onClick={() => setShowDisposisiModal(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      Buka & Isi Lembar Disposisi Sekarang
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {surat.disposisiList.map((disp, index) => (
                    <div key={disp.id} className="p-4 bg-white border border-indigo-200 rounded-xl shadow-xs space-y-3">
                      
                      {/* Top Disposisi Info */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-900 font-bold text-[11px] rounded-md font-mono">
                            DISPOSISI #{index + 1}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">Oleh: {disp.pemberiDisposisi}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{disp.tanggalDisposisi}</span>
                          {disp.batasWaktu && (
                            <span className="font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-sm border border-rose-200">
                              Deadline: {disp.batasWaktu}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Recipients & Instructions */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="font-bold text-slate-700 block mb-1">Diteruskan Kepada:</span>
                          <div className="flex flex-wrap gap-1">
                            {disp.diteruskanKepada.map((rec, i) => (
                              <span key={i} className="inline-block bg-slate-100 text-slate-800 px-2 py-1 rounded-md font-medium border border-slate-200">
                                👤 {rec}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className="font-bold text-slate-700 block mb-1">Instruksi Pokok:</span>
                          <p className="bg-amber-50 text-amber-950 font-semibold p-2 rounded-lg border border-amber-200">
                            {disp.instruksi}
                          </p>
                        </div>
                      </div>

                      {/* Catatan Kepsek */}
                      <div className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        <span className="font-bold text-slate-700 block mb-0.5">Catatan Arahan Pimpinan:</span>
                        <p className="text-slate-800 italic">"{disp.catatanKepsek}"</p>
                      </div>

                      {/* Feedback Tindak Lanjut Pelaksana Section */}
                      <div className="pt-2 border-t border-slate-100">
                        {disp.tindakLanjut ? (
                          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                Laporan Hasil Tindak Lanjut ({disp.tindakLanjut.pelaksana})
                              </span>
                              <span className="text-[11px] text-emerald-800 font-medium">
                                {disp.tindakLanjut.tanggalLaporan}
                              </span>
                            </div>
                            <p className="text-slate-800 pt-1">{disp.tindakLanjut.catatanHasil}</p>
                            {disp.tindakLanjut.lampiranBukti && (
                              <p className="text-xs text-emerald-700 font-mono pt-1">
                                📎 Bukti: {disp.tindakLanjut.lampiranBukti}
                              </p>
                            )}
                          </div>
                        ) : activeTindakLanjutDispId === disp.id ? (
                          <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl space-y-3">
                            <div className="flex items-center justify-between">
                              <h5 className="font-bold text-xs text-blue-950">Form Laporan Hasil Tindak Lanjut</h5>
                              <button 
                                onClick={() => setActiveTindakLanjutDispId(null)}
                                className="text-slate-400 hover:text-slate-700 text-xs"
                              >
                                Batal
                              </button>
                            </div>
                            <textarea
                              rows={2}
                              value={catatanHasil}
                              onChange={(e) => setCatatanHasil(e.target.value)}
                              placeholder="Tuliskan hasil pelaksanaan tugas, laporan koordinasi, atau progres kegiatan..."
                              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                            />
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-3 text-xs">
                                <label className="flex items-center gap-1 text-slate-700 font-medium">
                                  <input 
                                    type="radio" 
                                    checked={tindakLanjutStatus === 'Selesai'} 
                                    onChange={() => setTindakLanjutStatus('Selesai')} 
                                  />
                                  Selesai 100%
                                </label>
                                <label className="flex items-center gap-1 text-slate-700 font-medium">
                                  <input 
                                    type="radio" 
                                    checked={tindakLanjutStatus === 'Dalam Proses'} 
                                    onChange={() => setTindakLanjutStatus('Dalam Proses')} 
                                  />
                                  Masih Dalam Proses
                                </label>
                              </div>

                              <button
                                onClick={() => handleSaveTindakLanjut(disp.id)}
                                className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                              >
                                Simpan Laporan Tindak Lanjut
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-500 italic">Belum ada feedback laporan tindak lanjut.</span>
                            <button
                              onClick={() => setActiveTindakLanjutDispId(disp.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                            >
                              <FileCheck className="w-3.5 h-3.5" />
                              Laporkan Progres Tindak Lanjut
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Footer Controls */}
          <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
            <div className="flex items-center gap-2">
              {surat.status !== 'Diarsipkan' && (
                <button
                  onClick={() => {
                    archiveSuratMasuk(surat.id);
                    onClose();
                  }}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Pindahkan ke Arsip Permanen
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Disposisi Modal */}
      {showDisposisiModal && (
        <DisposisiModal
          surat={surat}
          onClose={() => setShowDisposisiModal(false)}
        />
      )}

      {/* Printable Sheet */}
      {showPrintModal && (
        <LembarDisposisiPrint
          surat={surat}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </>
  );
};
