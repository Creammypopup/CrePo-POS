// client/src/pages/QuotationsPage.jsx
import React from 'react';
import { FaPlus, FaFilePdf } from 'react-icons/fa';

function QuotationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">ใบเสนอราคา</h1>
        <button className="btn btn-primary btn-3d-pastel">
            <FaPlus className="mr-2"/> สร้างใบเสนอราคา
        </button>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <p className="text-center text-gray-500 py-10">ฟังก์ชันใบเสนอราคาเต็มรูปแบบกำลังจะมาในเร็วๆ นี้</p>
      </div>
    </div>
  );
}

export default QuotationsPage;