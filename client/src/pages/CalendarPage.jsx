// client/src/pages/CalendarPage.jsx
import React from 'react';
import { FaTools } from 'react-icons/fa';

function CalendarPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">ปฏิทิน</h1>
      
      <div className="bg-white shadow-lg rounded-2xl p-12 text-center text-gray-500 flex flex-col items-center justify-center h-[60vh]">
        <FaTools className="mx-auto text-6xl mb-4 text-yellow-400" />
        <h2 className="text-2xl font-semibold mb-2 text-gray-700">กำลังปรับปรุงครั้งใหญ่</h2>
        <p className="text-gray-600 max-w-md">
          เพื่อแก้ปัญหาการแสดงผลที่เกิดซ้ำซ้อน เรากำลังยกเครื่องระบบปฏิทินใหม่ทั้งหมด 
          ขออภัยในความไม่สะดวกและจะรีบนำกลับมาให้บริการอีกครั้งครับ
        </p>
      </div>
    </div>
  );
}

export default CalendarPage;