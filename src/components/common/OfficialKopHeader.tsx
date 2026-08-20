import React from 'react';
import { useSchool } from '../../context/SchoolContext';

interface OfficialKopHeaderProps {
  minimal?: boolean;
}

export const OfficialKopHeader: React.FC<OfficialKopHeaderProps> = ({ minimal = false }) => {
  const { schoolProfile } = useSchool();

  return (
    <div className="w-full text-black font-serif pb-2 border-b-4 border-double border-gray-900 select-text">
      <div className="flex items-center justify-between gap-4">
        {/* Logo Lambang Tut Wuri Handayani / Pemda */}
        <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-2 border-blue-900 flex flex-col items-center justify-center p-1 text-center bg-blue-50/50">
            <span className="text-[10px] font-bold text-blue-900 leading-tight">TUT WURI</span>
            <div className="w-6 h-0.5 bg-yellow-600 my-0.5" />
            <span className="text-[9px] font-bold text-blue-900 leading-tight">HANDAYANI</span>
          </div>
        </div>

        {/* Center Text Header */}
        <div className="flex-1 text-center">
          <h4 className="text-sm font-semibold tracking-wider uppercase text-gray-800">
            {schoolProfile.pemerintahDaerah}
          </h4>
          <h3 className="text-base font-bold tracking-wide uppercase text-gray-900">
            {schoolProfile.dinas}
          </h3>
          <h2 className="text-xl font-extrabold tracking-wider uppercase text-blue-950">
            {schoolProfile.namaSekolah}
          </h2>
          <p className="text-xs font-sans text-gray-700 mt-0.5">
            {schoolProfile.alamat}, {schoolProfile.kelurahanKecamatan}, {schoolProfile.kotaKabupaten} {schoolProfile.kodePos}
          </p>
          <p className="text-[11px] font-sans text-gray-600">
            Telp: {schoolProfile.telepon} | Email: {schoolProfile.email} | Web: {schoolProfile.website}
          </p>
          {!minimal && (
            <div className="flex items-center justify-center gap-4 text-[10px] font-sans font-medium text-gray-500 mt-0.5">
              <span>NPSN: {schoolProfile.npsn}</span>
              <span>•</span>
              <span>AKREDITASI: {schoolProfile.akreditasi}</span>
            </div>
          )}
        </div>

        {/* Right Logo (Sekolah / Prestasi) */}
        <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-2 border-emerald-800 flex flex-col items-center justify-center p-1 text-center bg-emerald-50/50">
            <span className="text-[9px] font-bold text-emerald-900 leading-tight">SMPN 1</span>
            <span className="text-[12px] font-extrabold text-blue-900 leading-none my-0.5">★</span>
            <span className="text-[8px] font-bold text-emerald-800 uppercase leading-tight">UNGGUL</span>
          </div>
        </div>
      </div>
    </div>
  );
};
