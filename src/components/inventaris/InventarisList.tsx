import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { InventarisBarang } from '../../types';
import { 
  Package, 
  Search, 
  Plus, 
  Printer, 
  FileSpreadsheet, 
  Trash2, 
  MapPin, 
  QrCode, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  X
} from 'lucide-react';

export const InventarisList: React.FC = () => {
  const { inventarisList, addInventaris, deleteInventaris } = useSchool();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRuangan, setFilterRuangan] = useState('all');
  const [filterKondisi, setFilterKondisi] = useState('all');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedForLabel, setSelectedForLabel] = useState<InventarisBarang | null>(null);

  const filteredBarang = inventarisList.filter(b => {
    const matchSearch = 
      b.namaBarang.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.kodeBarang.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.merkModel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRuangan = filterRuangan === 'all' || b.ruangan === filterRuangan;
    const matchKondisi = filterKondisi === 'all' || b.kondisi === filterKondisi;
    return matchSearch && matchRuangan && matchKondisi;
  });

  const handleExportCSV = () => {
    const headers = ['Kode Barang', 'Nama Barang / Aset', 'Kategori', 'Merk / Model', 'Kondisi', 'Jumlah', 'Satuan', 'Ruangan', 'Tahun Perolehan', 'Sumber Dana', 'Nilai Aset (Rp)'];
    const rows = filteredBarang.map(b => [
      `"${b.kodeBarang}"`,
      `"${b.namaBarang}"`,
      `"${b.kategori}"`,
      `"${b.merkModel}"`,
      `"${b.kondisi}"`,
      b.jumlah,
      `"${b.satuan}"`,
      `"${b.ruangan}"`,
      b.tahunPerolehan,
      `"${b.sumberDana}"`,
      b.nilaiAset
    ]);
    const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const uri = encodeURI(csv);
    const link = document.createElement('a');
    link.setAttribute('href', uri);
    link.setAttribute('download', `Daftar_Inventaris_Sarpras_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-cyan-500/30 text-cyan-200 text-xs font-semibold rounded-md border border-cyan-400/20">
              Modul Sarpras & Inventaris (KIR)
            </span>
            <span className="text-xs text-cyan-200/80">Tata Usaha SMP</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Kartu Inventaris Ruangan & Manajemen Aset Sekolah
          </h1>
          <p className="text-xs text-cyan-100/80 mt-1 max-w-2xl leading-relaxed">
            Pencatatan sarana prasarana, pelabelan QR/Barcode aset, monitoring kondisi barang (Baik/Rusak), dan pelaporan sumber dana BOS/APBD.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-xs border border-white/10 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
            Ekspor Laporan KIR
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-[1.02] cursor-pointer"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            + Tambah Aset Barang
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari Kode Barang, Nama Alat/Sarpras, atau Merk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-slate-50/50"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterRuangan}
              onChange={(e) => setFilterRuangan(e.target.value)}
              className="text-xs px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 font-medium"
            >
              <option value="all">Semua Lokasi Ruangan</option>
              <option value="Laboratorium Komputer">Lab Komputer</option>
              <option value="Laboratorium IPA">Lab IPA</option>
              <option value="Ruang Tata Usaha">Ruang Tata Usaha</option>
              <option value="Perpustakaan">Perpustakaan</option>
              <option value="Ruang Guru">Ruang Guru</option>
            </select>

            <select
              value={filterKondisi}
              onChange={(e) => setFilterKondisi(e.target.value)}
              className="text-xs px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 font-medium"
            >
              <option value="all">Semua Kondisi</option>
              <option value="Baik">Baik</option>
              <option value="Rusak Ringan">Rusak Ringan</option>
              <option value="Rusak Berat">Rusak Berat</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 uppercase tracking-wider font-semibold text-[11px]">
              <tr>
                <th className="py-3 px-4">Kode & Nama Barang</th>
                <th className="py-3 px-4">Merk / Spesifikasi</th>
                <th className="py-3 px-4">Lokasi Ruangan</th>
                <th className="py-3 px-4">Kondisi & Jumlah</th>
                <th className="py-3 px-4">Tahun & Sumber Dana</th>
                <th className="py-3 px-4 text-center">Label & Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBarang.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Package className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-medium text-slate-600">Tidak ada barang inventaris sesuai filter.</p>
                  </td>
                </tr>
              ) : (
                filteredBarang.map((barang) => (
                  <tr key={barang.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Kode & Nama */}
                    <td className="py-3.5 px-4 align-middle">
                      <span className="font-mono font-bold text-cyan-950 block text-xs">{barang.kodeBarang}</span>
                      <span className="font-bold text-slate-900 block mt-0.5">{barang.namaBarang}</span>
                      <span className="text-[10px] text-slate-500 font-mono">Kategori: {barang.kategori}</span>
                    </td>

                    {/* Merk */}
                    <td className="py-3.5 px-4 align-middle font-medium text-slate-800">
                      {barang.merkModel}
                    </td>

                    {/* Ruangan */}
                    <td className="py-3.5 px-4 align-middle">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-800 rounded-lg text-[11px] font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-cyan-700" />
                        {barang.ruangan}
                      </span>
                    </td>

                    {/* Kondisi & Jumlah */}
                    <td className="py-3.5 px-4 align-middle">
                      <div className="space-y-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          barang.kondisi === 'Baik' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : barang.kondisi === 'Rusak Ringan' 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {barang.kondisi === 'Baik' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          {barang.kondisi === 'Rusak Ringan' && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                          {barang.kondisi === 'Rusak Berat' && <XCircle className="w-3 h-3 text-rose-600" />}
                          {barang.kondisi}
                        </span>
                        <span className="text-xs font-bold text-slate-900 block font-mono">
                          {barang.jumlah} {barang.satuan}
                        </span>
                      </div>
                    </td>

                    {/* Tahun & Sumber Dana */}
                    <td className="py-3.5 px-4 align-middle">
                      <span className="font-semibold text-slate-800 block">Th. {barang.tahunPerolehan}</span>
                      <span className="text-[11px] text-cyan-900 font-medium block">{barang.sumberDana}</span>
                      <span className="text-[10px] text-slate-500 font-mono">Rp {barang.nilaiAset.toLocaleString('id-ID')}</span>
                    </td>

                    {/* Aksi */}
                    <td className="py-3.5 px-4 align-middle text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedForLabel(barang)}
                          className="p-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 rounded-lg transition-colors cursor-pointer"
                          title="Cetak Stiker Label Barcode Aset"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus barang ${barang.namaBarang}?`)) {
                              deleteInventaris(barang.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Barang"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Label Cetak Stiker Barcode */}
      {selectedForLabel && (
        <LabelBarcodeModal
          barang={selectedForLabel}
          onClose={() => setSelectedForLabel(null)}
        />
      )}

      {/* Modal Tambah Barang */}
      {showAddModal && (
        <InventarisAddModal onClose={() => setShowAddModal(false)} />
      )}

    </div>
  );
};

// Sub-component for adding item
const InventarisAddModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { addInventaris } = useSchool();

  const [namaBarang, setNamaBarang] = useState('');
  const [kategori, setKategori] = useState('Elektronik & Multimedia');
  const [merkModel, setMerkModel] = useState('');
  const [kondisi, setKondisi] = useState<'Baik' | 'Rusak Ringan' | 'Rusak Berat'>('Baik');
  const [jumlah, setJumlah] = useState(1);
  const [satuan, setSatuan] = useState('Unit');
  const [ruangan, setRuangan] = useState('Laboratorium Komputer');
  const [tahunPerolehan, setTahunPerolehan] = useState(2026);
  const [sumberDana, setSumberDana] = useState('BOS Reguler 2026');
  const [nilaiAset, setNilaiAset] = useState(5000000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaBarang) {
      alert('Nama barang wajib diisi.');
      return;
    }

    addInventaris({
      namaBarang,
      kategori,
      merkModel: merkModel || '-',
      kondisi,
      jumlah: Number(jumlah),
      satuan,
      ruangan,
      tahunPerolehan: Number(tahunPerolehan),
      sumberDana,
      nilaiAset: Number(nilaiAset)
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto text-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
        <div className="bg-cyan-950 text-white px-6 py-4 flex items-center justify-between">
          <h3 className="font-bold text-base">Registrasi Sarana Prasarana / Inventaris Baru</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          <div>
            <label className="block font-bold text-slate-700 mb-1">Nama Barang / Peralatan *</label>
            <input
              type="text"
              required
              value={namaBarang}
              onChange={(e) => setNamaBarang(e.target.value)}
              placeholder="Contoh: Laptop Chromebook Siswa ANBK"
              className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kategori Sarpras</label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
              >
                <option value="Elektronik & Multimedia">Elektronik & Multimedia</option>
                <option value="Alat Peraga & Lab IPA">Alat Peraga & Lab IPA</option>
                <option value="Mebel & Perabot Kelas">Mebel & Perabot Kelas</option>
                <option value="Peralatan Olahraga">Peralatan Olahraga</option>
                <option value="Buku Perpustakaan">Buku Perpustakaan</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Merk / Tipe / Spesifikasi</label>
              <input
                type="text"
                value={merkModel}
                onChange={(e) => setMerkModel(e.target.value)}
                placeholder="Contoh: Asus Core i5 / Lion 4 Laci"
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Lokasi Ruangan *</label>
              <select
                value={ruangan}
                onChange={(e) => setRuangan(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-semibold"
              >
                <option value="Laboratorium Komputer">Laboratorium Komputer</option>
                <option value="Laboratorium IPA">Laboratorium IPA</option>
                <option value="Ruang Tata Usaha">Ruang Tata Usaha</option>
                <option value="Perpustakaan">Perpustakaan</option>
                <option value="Ruang Guru">Ruang Guru</option>
                <option value="Kelas 7A">Kelas 7A</option>
                <option value="Kelas 8A">Kelas 8A</option>
                <option value="Kelas 9A">Kelas 9A</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Kondisi Awal</label>
              <select
                value={kondisi}
                onChange={(e) => setKondisi(e.target.value as any)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
              >
                <option value="Baik">Baik</option>
                <option value="Rusak Ringan">Rusak Ringan</option>
                <option value="Rusak Berat">Rusak Berat</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Jumlah & Satuan</label>
              <div className="flex gap-1">
                <input
                  type="number"
                  value={jumlah}
                  onChange={(e) => setJumlah(Number(e.target.value))}
                  className="w-16 p-2.5 border border-slate-300 rounded-xl bg-white font-bold"
                />
                <input
                  type="text"
                  value={satuan}
                  onChange={(e) => setSatuan(e.target.value)}
                  className="flex-1 p-2.5 border border-slate-300 rounded-xl bg-white"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tahun Perolehan</label>
              <input
                type="number"
                value={tahunPerolehan}
                onChange={(e) => setTahunPerolehan(Number(e.target.value))}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Sumber Dana</label>
              <input
                type="text"
                value={sumberDana}
                onChange={(e) => setSumberDana(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nilai Aset (Rp)</label>
              <input
                type="number"
                value={nilaiAset}
                onChange={(e) => setNilaiAset(Number(e.target.value))}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-mono"
              />
            </div>
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
              className="px-5 py-2.5 bg-cyan-800 hover:bg-cyan-900 text-white font-bold rounded-xl shadow-md cursor-pointer"
            >
              Simpan ke Register KIR
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

// Sub-component for printable QR/Barcode label
const LabelBarcodeModal: React.FC<{ barang: InventarisBarang; onClose: () => void }> = ({ barang, onClose }) => {
  const { schoolProfile } = useSchool();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 print:border-none print:shadow-none">
        
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-slate-50 print:hidden">
          <h3 className="font-bold text-gray-800 text-sm">Cetak Stiker Label Barcode Aset</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print Label
            </button>
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700">✕</button>
          </div>
        </div>

        {/* Printable Label Box */}
        <div className="p-6 flex flex-col items-center justify-center bg-slate-100 print:bg-white print:p-0">
          
          <div className="w-[300px] bg-white border-2 border-slate-900 p-4 rounded-md shadow-md text-slate-900 print:shadow-none">
            <div className="text-center pb-2 border-b border-slate-900">
              <h4 className="text-[11px] font-black uppercase tracking-wider">{schoolProfile.namaSekolah}</h4>
              <p className="text-[8px] font-bold text-slate-700 uppercase">LABEL BARANG MILIK NEGARA / SEKOLAH</p>
            </div>

            <div className="flex items-center gap-3 py-3">
              <div className="w-16 h-16 border border-slate-400 p-1 flex flex-col items-center justify-center bg-slate-50 flex-shrink-0 font-mono text-[7px] text-center">
                <span className="font-bold">QR CODE</span>
                <span className="text-[6px]">{barang.kodeBarang}</span>
              </div>

              <div className="text-[10px] space-y-0.5 flex-1">
                <p className="font-bold text-slate-900 line-clamp-1">{barang.namaBarang}</p>
                <p className="font-mono text-[9px] font-bold text-cyan-900">{barang.kodeBarang}</p>
                <p className="text-[9px] text-slate-600">Lokasi: {barang.ruangan}</p>
                <p className="text-[8px] text-slate-500">Tahun: {barang.tahunPerolehan} • {barang.sumberDana}</p>
              </div>
            </div>

            <div className="pt-1 border-t border-dashed border-slate-400 text-center text-[7px] text-slate-500 font-mono">
              DILARANG MEMINDAHKAN / MERUSAK TANPA IZIN TATA USAHA
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
