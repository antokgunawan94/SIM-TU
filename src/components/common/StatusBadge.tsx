import React from 'react';
import { SifatSurat, StatusSuratMasuk, StatusSuratKeluar } from '../../types';

interface StatusBadgeProps {
  status?: StatusSuratMasuk | StatusSuratKeluar | string;
  sifat?: SifatSurat;
  type?: 'status' | 'sifat' | 'kondisi' | 'kepegawaian' | 'bayar';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, sifat, type = 'status' }) => {
  if (type === 'sifat' && sifat) {
    switch (sifat) {
      case 'Sangat Segera':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mr-1.5 animate-pulse"></span>
            Sangat Segera
          </span>
        );
      case 'Segera':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
            Segera
          </span>
        );
      case 'Rahasia':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mr-1.5"></span>
            Rahasia
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            Biasa
          </span>
        );
    }
  }

  // General Status Handling
  switch (status) {
    case 'Diterima TU':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
          Diterima TU
        </span>
      );
    case 'Menunggu Disposisi':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mr-1.5 animate-ping"></span>
          Menunggu Disposisi
        </span>
      );
    case 'Terdisposisi':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
          Terdisposisi
        </span>
      );
    case 'Dalam Proses':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800 border border-cyan-200">
          Dalam Proses
        </span>
      );
    case 'Selesai':
    case 'Lunas':
    case 'Aktif':
    case 'Disetujui Kepsek':
    case 'Terkirim':
    case 'Hadir':
    case 'Baik':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5"></span>
          {status}
        </span>
      );
    case 'Draft':
    case 'Menunggu Persetujuan':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
          {status}
        </span>
      );
    case 'Diarsipkan':
    case 'Non-Aktif':
    case 'Lulus':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
          {status}
        </span>
      );
    case 'Mutasi Keluar':
    case 'Rusak Berat':
    case 'Ditolak':
    case 'Belum Lunas':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
          {status}
        </span>
      );
    case 'Mutasi Masuk':
    case 'Rusak Ringan':
    case 'Tertunda':
    case 'Izin':
    case 'Dinas Luar':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
          {status}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
          {status || '-'}
        </span>
      );
  }
};
