import React from 'react';
import { FaRegFileAlt } from 'react-icons/fa';

function ReceiptsPage() {
  // เนื้อหาชั่วคราวจนกว่าฟีเจอร์นี้จะถูกพัฒนา
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">ใบเสร็จรับเงิน</h1>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-12 text-center text-gray-500 flex flex-col items-center justify-center h-96">
        <FaRegFileAlt className="mx-auto text-6xl mb-4 text-purple-300" />
        <h2 className="text-2xl font-semibold mb-2 text-gray-700">ยังไม่พร้อมใช้งาน</h2>
        <p className="text-gray-600">ฟังก์ชันสำหรับจัดการใบเสร็จรับเงินกำลังอยู่ในระหว่างการพัฒนา</p>
      </div>
    </div>
  );
}

export default ReceiptsPage;
