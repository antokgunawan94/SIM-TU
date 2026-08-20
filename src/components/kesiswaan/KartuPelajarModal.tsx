import React from 'react';
import { Siswa } from '../../types';
import { useSchool } from '../../context/SchoolContext';
import { Printer, X, CreditCard, ShieldCheck } from 'lucide-react';

interface KartuPelajarModalProps {
  siswa: Siswa;
  onClose: () => void;
}

export const KartuPelajarModal: React.FC<KartuPelajarModalProps> = ({ siswa, onClose }) => {
  const { schoolProfile } = useSchool();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 print:border-none print:shadow-none">
        
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-slate-50 print:hidden">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-800" />
            <h3 className="font-bold text-gray-800 text-sm">Cetak Kartu Pelajar Digital</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print Kartu
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Card Area */}
        <div className="p-6 flex flex-col items-center justify-center bg-slate-100 print:bg-white print:p-0">
          
          {/* Card Dimensions: ~85.6mm x 54mm (Standard ID Card format) */}
          <div className="w-[360px] h-[225px] bg-gradient-to-br from-blue-950 via-indigo-900 to-blue-900 rounded-xl shadow-xl overflow-hidden text-white relative p-4 flex flex-col justify-between border-2 border-amber-400/40 print:shadow-none">
            
            {/* Background Hologram Effect */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

            {/* Card Header */}
            <div className="flex items-center gap-3 pb-2 border-b border-white/20 relative z-10">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-md">
                <span className="text-[9px] font-black text-blue-950 text-center leading-tight">SMPN 1</span>
              </div>
              <div className="flex-1">
                <h4 className="text-[11px] font-extrabold tracking-wider uppercase leading-tight text-yellow-300">
                  {schoolProfile.namaSekolah}
                </h4>
                <p className="text-[8px] text-blue-100 uppercase tracking-wide">
                  KARTU TANDA PELAJAR • TA 2026/2027
                </p>
                <p className="text-[7px] text-blue-200 line-clamp-1">NPSN: {schoolProfile.npsn} • {schoolProfile.kotaKabupaten}</p>
              </div>
            </div>

            {/* Card Body: Photo + Details */}
            <div className="flex items-center gap-3 py-1 relative z-10">
              {/* Photo Box */}
              <div className="w-20 h-24 rounded-lg bg-slate-200 border-2 border-white/80 overflow-hidden shadow-inner flex-shrink-0">
                {siswa.fotoUrl ? (
                  <img 
                    src={siswa.fotoUrl} 
                    alt={siswa.nama} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-800 text-xs font-bold text-white">
                    FOTO
                  </div>
                )}
              </div>

              {/* Student Details */}
              <div className="flex-1 text-[10px] space-y-0.5 font-sans">
                <div>
                  <span className="text-[8px] text-blue-200 block uppercase">Nama Siswa</span>
                  <span className="font-bold text-xs tracking-wide text-white block uppercase leading-snug">
                    {siswa.nama}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1 pt-0.5">
                  <div>
                    <span className="text-[8px] text-blue-200 block">NISN</span>
                    <span className="font-mono font-bold text-yellow-300 text-[11px]">{siswa.nisn}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-blue-200 block">NIS / KELAS</span>
                    <span className="font-mono font-bold text-white text-[11px]">{siswa.nis} / {siswa.kelas}</span>
                  </div>
                </div>

                <div className="pt-0.5">
                  <span className="text-[8px] text-blue-200 block">TTL / ALAMAT</span>
                  <span className="text-[9px] text-blue-100 line-clamp-1">{siswa.tempatLahir}, {siswa.tanggalLahir}</span>
                </div>
              </div>
            </div>

            {/* Card Footer: Barcode + Seal */}
            <div className="flex items-center justify-between pt-1 border-t border-white/20 text-[7px] text-blue-200 relative z-10">
              <div className="font-mono bg-white/10 px-2 py-0.5 rounded-xs tracking-widest text-[8px] text-white">
                |||| ||| ||||| |||||| {siswa.nisn}
              </div>
              <div className="text-right">
                <span className="text-amber-300 font-bold">KARTU RESMI TERA ELEKTRONIK</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
