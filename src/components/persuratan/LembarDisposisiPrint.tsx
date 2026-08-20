import React from 'react';
import { SuratMasuk, DisposisiAction } from '../../types';
import { OfficialKopHeader } from '../common/OfficialKopHeader';
import { useSchool } from '../../context/SchoolContext';
import { Printer, X, ShieldCheck } from 'lucide-react';

interface LembarDisposisiPrintProps {
  surat: SuratMasuk;
  disposisi?: DisposisiAction;
  onClose: () => void;
}

const INSTRUKSI_CHECKLIST = [
  'Tindak lanjuti segera',
  'Hadiri & wakili Kepala Sekolah',
  'Koordinasikan dengan pihak terkait',
  'Pelajari & buat telaah / resume',
  'Siapkan bahan / laporan / data',
  'Edarkan / umumkan kepada dewan guru / siswa',
  'Jadwalkan kegiatan dalam kalender akademik',
  'Arsipkan / simpan untuk diketahui'
];

export const LembarDisposisiPrint: React.FC<LembarDisposisiPrintProps> = ({ surat, disposisi, onClose }) => {
  const { schoolProfile } = useSchool();

  const handlePrint = () => {
    window.print();
  };

  const activeDisposisi = disposisi || surat.disposisiList[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] flex flex-col print:shadow-none print:max-w-none print:w-full print:rounded-none">
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-slate-50 rounded-t-xl print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-800" />
            <h3 className="font-bold text-gray-800 text-sm">Preview Dokumen: Lembar Disposisi Resmi</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Cetak Dokumen (Print)
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Area (A4 layout styling) */}
        <div className="p-8 overflow-y-auto print:p-0 print:overflow-visible text-gray-900 bg-white font-serif">
          <div className="max-w-[210mm] mx-auto p-4 border border-gray-300 print:border-none shadow-xs print:shadow-none bg-white">
            
            {/* Kop Surat Resmi */}
            <OfficialKopHeader />

            {/* Document Title */}
            <div className="text-center my-4">
              <h2 className="text-lg font-extrabold uppercase tracking-wider text-black border-b-2 border-black inline-block pb-0.5">
                LEMBAR DISPOSISI
              </h2>
            </div>

            {/* Metadata Table */}
            <div className="border-2 border-gray-900 text-xs font-sans mb-4">
              <div className="grid grid-cols-2 border-b border-gray-900">
                <div className="p-2.5 border-r border-gray-900 space-y-1">
                  <div className="flex">
                    <span className="w-28 font-semibold text-gray-700">Surat Dari</span>
                    <span className="mr-1">:</span>
                    <span className="font-bold text-gray-900 flex-1">{surat.pengirim} ({surat.instansiPengirim})</span>
                  </div>
                  <div className="flex">
                    <span className="w-28 font-semibold text-gray-700">No. Surat Asal</span>
                    <span className="mr-1">:</span>
                    <span className="font-medium text-gray-900 flex-1">{surat.noSuratAsal}</span>
                  </div>
                  <div className="flex">
                    <span className="w-28 font-semibold text-gray-700">Tgl. Surat Asal</span>
                    <span className="mr-1">:</span>
                    <span className="font-medium text-gray-900">{surat.tanggalSurat}</span>
                  </div>
                </div>

                <div className="p-2.5 space-y-1">
                  <div className="flex">
                    <span className="w-28 font-semibold text-gray-700">No. Agenda TU</span>
                    <span className="mr-1">:</span>
                    <span className="font-bold text-blue-900 flex-1">{surat.noAgenda}</span>
                  </div>
                  <div className="flex">
                    <span className="w-28 font-semibold text-gray-700">Diterima Tgl</span>
                    <span className="mr-1">:</span>
                    <span className="font-medium text-gray-900 flex-1">{surat.tanggalTerima}</span>
                  </div>
                  <div className="flex">
                    <span className="w-28 font-semibold text-gray-700">Sifat Surat</span>
                    <span className="mr-1">:</span>
                    <span className="font-bold uppercase text-red-700">{surat.sifat}</span>
                  </div>
                </div>
              </div>

              {/* Perihal & Ringkasan */}
              <div className="p-2.5 border-b border-gray-900 bg-slate-50/50">
                <div className="flex items-start">
                  <span className="w-28 font-semibold text-gray-800 flex-shrink-0">Perihal</span>
                  <span className="mr-1">:</span>
                  <span className="font-bold text-gray-900 flex-1 leading-snug">{surat.perihal}</span>
                </div>
                <div className="flex items-start mt-1.5 text-gray-700 text-[11px]">
                  <span className="w-28 font-medium text-gray-600 flex-shrink-0">Isi Ringkas</span>
                  <span className="mr-1">:</span>
                  <span className="flex-1 italic">{surat.ringkasan}</span>
                </div>
              </div>

              {/* Disposisi Section: Diteruskan Kepada & Instruksi Checklist */}
              <div className="grid grid-cols-12 border-b border-gray-900">
                
                {/* Column 1: Diteruskan Kepada */}
                <div className="col-span-5 p-2.5 border-r border-gray-900">
                  <p className="font-bold uppercase tracking-wider text-gray-900 mb-2 border-b border-gray-300 pb-1">
                    Diteruskan Kepada Yth:
                  </p>
                  <ul className="space-y-1.5 text-[11px]">
                    {[
                      'Waka Kurikulum',
                      'Waka Kesiswaan',
                      'Waka Sarana & Prasarana',
                      'Waka Hubungan Masyarakat',
                      'Kepala Tata Usaha (KTU)',
                      'Kepala Lab Komputer / IPA',
                      'Koordinator Guru BK',
                      'Bendahara / Pengelola Keuangan',
                      'Pembina OSIS & Kesiswaan',
                      'Dewan Guru / Staf Terkait'
                    ].map((jabatan, idx) => {
                      const isAssigned = activeDisposisi?.diteruskanKepada?.some(d => 
                        d.toLowerCase().includes(jabatan.toLowerCase()) || jabatan.toLowerCase().includes(d.toLowerCase())
                      );
                      return (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className={`w-3.5 h-3.5 inline-flex items-center justify-center border border-gray-800 rounded-xs text-[10px] ${isAssigned ? 'bg-black text-white font-bold' : 'bg-white'}`}>
                            {isAssigned ? '✓' : ''}
                          </span>
                          <span className={isAssigned ? 'font-bold text-black' : 'text-gray-700'}>
                            {jabatan}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Column 2: Instruksi / Petunjuk Disposisi */}
                <div className="col-span-7 p-2.5">
                  <p className="font-bold uppercase tracking-wider text-gray-900 mb-2 border-b border-gray-300 pb-1">
                    Instruksi / Petunjuk Tindak Lanjut:
                  </p>
                  <div className="grid grid-cols-1 gap-1 text-[11px]">
                    {INSTRUKSI_CHECKLIST.map((item, idx) => {
                      const isChecked = activeDisposisi?.instruksi?.toLowerCase().includes(item.toLowerCase()) ||
                        (activeDisposisi && activeDisposisi.instruksi.includes(item.slice(0, 10)));
                      return (
                        <div key={idx} className="flex items-center gap-1.5 py-0.5">
                          <span className={`w-3.5 h-3.5 inline-flex items-center justify-center border border-gray-800 rounded-xs text-[10px] ${isChecked ? 'bg-black text-white font-bold' : 'bg-white'}`}>
                            {isChecked ? '✓' : ''}
                          </span>
                          <span className={isChecked ? 'font-bold text-black' : 'text-gray-700'}>
                            {item}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Catatan Khusus & Batas Waktu */}
              <div className="p-3 border-b border-gray-900 bg-white">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <p className="font-bold uppercase text-gray-800 mb-1">Catatan Khusus Kepala Sekolah / Pejabat:</p>
                    <div className="p-2 border border-dashed border-gray-400 bg-amber-50/40 rounded-sm min-h-[48px] text-[12px] font-sans font-medium text-gray-900">
                      {activeDisposisi?.catatanKepsek || 'Tolong dipelajari segera dan laporkan hasil koordinasi sebelum batas waktu.'}
                    </div>
                  </div>
                  {activeDisposisi?.batasWaktu && (
                    <div className="text-right border-l border-gray-300 pl-4">
                      <span className="block text-[10px] uppercase font-bold text-gray-500">Target Selesai</span>
                      <span className="text-xs font-bold text-red-600 border border-red-300 bg-red-50 px-2 py-0.5 rounded-sm">
                        {activeDisposisi.batasWaktu}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tanda Tangan & QR Verifikasi */}
              <div className="p-4 grid grid-cols-2">
                <div className="flex flex-col justify-end text-[10px] text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 border border-gray-400 p-1 flex items-center justify-center bg-gray-50">
                      <div className="w-full h-full bg-gray-900 flex items-center justify-center text-[7px] text-white text-center font-mono">
                        QR-VERIF
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Validasi Sistem e-Disposisi</p>
                      <p>ID: {activeDisposisi?.id || 'DISP-SYS'}</p>
                      <p>Waktu: {activeDisposisi?.tanggalDisposisi || new Date().toLocaleDateString('id-ID')}</p>
                    </div>
                  </div>
                </div>

                <div className="text-center font-sans text-xs">
                  <p className="text-gray-700">Nusantara, {activeDisposisi?.tanggalDisposisi?.split(' ')[0] || surat.tanggalTerima}</p>
                  <p className="font-bold text-gray-900 mt-0.5">Kepala Sekolah,</p>
                  
                  {/* Digital Signature Simulated Box */}
                  <div className="my-2 py-1 text-center">
                    <span className="inline-block px-3 py-1 bg-blue-50 border border-blue-200 text-blue-900 text-[10px] font-mono font-bold rounded-sm">
                      [ TERVERIFIKASI ELEKTRONIK ]
                    </span>
                  </div>

                  <p className="font-bold text-gray-900 underline">{schoolProfile.kepalaSekolahNama}</p>
                  <p className="text-[11px] text-gray-600">NIP. {schoolProfile.kepalaSekolahNip}</p>
                </div>
              </div>
            </div>

            {/* Riwayat / Feedback Pelaksanaan Tindak Lanjut (Jika ada) */}
            {activeDisposisi?.tindakLanjut && (
              <div className="border border-emerald-600 rounded-sm p-3 bg-emerald-50/50 text-xs font-sans mb-4">
                <div className="flex items-center justify-between border-b border-emerald-300 pb-1 mb-1.5">
                  <span className="font-bold text-emerald-900 uppercase">
                    Laporan Hasil Tindak Lanjut Pelaksana
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-700 text-white rounded-xs text-[10px] font-bold">
                    STATUS: {activeDisposisi.tindakLanjut.status}
                  </span>
                </div>
                <p className="text-gray-800">
                  <span className="font-semibold">Oleh:</span> {activeDisposisi.tindakLanjut.pelaksana} ({activeDisposisi.tindakLanjut.tanggalLaporan})
                </p>
                <p className="text-gray-800 mt-1">
                  <span className="font-semibold">Catatan Hasil:</span> {activeDisposisi.tindakLanjut.catatanHasil}
                </p>
              </div>
            )}

            <div className="text-[10px] text-gray-400 text-center font-sans border-t border-gray-200 pt-1">
              Dokumen resmi SIM-TU SMP Negeri 1 Nusantara • Lembar disposisi ini merupakan bagian tak terpisahkan dari berkas surat masuk fisik & digital.
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
