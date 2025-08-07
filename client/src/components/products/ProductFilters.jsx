// client/src/components/products/ProductFilters.jsx
import React from 'react';
import { FaFileImport, FaFileExport, FaPrint, FaBarcode } from 'react-icons/fa';

function ProductFilters({ activeFilter, setActiveFilter, onBarcodePrint }) {
  const getFilterButtonClass = (filterName) => 
    `btn !py-2 !px-5 text-sm rounded-full transition-all duration-300 transform hover:scale-105 ${activeFilter === filterName 
      ? 'bg-pastel-purple text-white shadow-lg' 
      : 'bg-white text-pastel-gray-dark hover:bg-pastel-purple-lightest'}`;

  return (
    <div className="flex flex-wrap gap-2 items-center mb-6 p-4 bg-white/60 rounded-2xl shadow-sm">
      <button onClick={() => setActiveFilter('all')} className={getFilterButtonClass('all')}>สินค้าทั้งหมด</button>
      <button onClick={() => setActiveFilter('low-stock')} className={getFilterButtonClass('low-stock')}>ใกล้หมดสต็อก</button>
      <button onClick={() => setActiveFilter('expiring')} className={getFilterButtonClass('expiring')}>ใกล้หมดอายุ</button>
      <div className="flex-grow"></div>
      <div className="flex gap-2">
        <button className="btn-icon-pastel bg-white"><FaFileImport /> <span className="hidden sm:inline">นำเข้า</span></button>
        <button className="btn-icon-pastel bg-white"><FaFileExport /> <span className="hidden sm:inline">ส่งออก</span></button>
        <button className="btn-icon-pastel bg-white"><FaPrint /> <span className="hidden sm:inline">พิมพ์</span></button>
        <button onClick={onBarcodePrint} className="btn-icon-pastel bg-white"><FaBarcode /> <span className="hidden sm:inline">บาร์โค้ด</span></button>
      </div>
    </div>
  );
}

export default ProductFilters;
