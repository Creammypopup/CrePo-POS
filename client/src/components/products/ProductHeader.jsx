// client/src/components/products/ProductHeader.jsx
import React from 'react';
import { FaBoxOpen, FaPlus, FaSearch } from 'react-icons/fa';

function ProductHeader({ onAdd, searchTerm, setSearchTerm }) {
  return (
    <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white rounded-2xl shadow-md">
          <FaBoxOpen className="text-4xl text-pastel-purple" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-pastel-purple-dark">จัดการสินค้า</h1>
          <p className="text-pastel-gray-dark mt-1">เพิ่ม แก้ไข และดูรายการสินค้าทั้งหมดในคลัง</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative flex-grow md:flex-grow-0">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-pastel-gray" />
          <input 
            type="text" 
            placeholder="ค้นหาด้วยชื่อ, SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-12 w-full md:w-80 !py-3 !rounded-2xl shadow-inner-pastel"
          />
        </div>
        <button 
          onClick={onAdd} 
          className="btn btn-3d-pastel btn-primary-pastel flex items-center gap-2 transform hover:scale-105 transition-transform duration-200"
        >
          <FaPlus />
          เพิ่มสินค้าใหม่
        </button>
      </div>
    </div>
  );
}

export default ProductHeader;
