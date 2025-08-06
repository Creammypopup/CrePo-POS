// client/src/pages/ReportsPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChartLine, FaFileInvoiceDollar, FaBoxOpen, FaUsers } from 'react-icons/fa';

const ReportCard = ({ title, description, icon, path, color }) => {
    const navigate = useNavigate();
    return (
        <div 
            onClick={() => navigate(path)}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex items-start space-x-4"
        >
            <div className={`p-4 rounded-full bg-gradient-to-br ${color}`}>
                {icon}
            </div>
            <div>
                <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                <p className="text-gray-500 mt-1">{description}</p>
            </div>
        </div>
    );
}

function ReportsPage() {
  return (
    <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">ศูนย์รวมรายงาน</h1>
        <p className="text-gray-500">เลือกดูรายงานเพื่อวิเคราะห์ข้อมูลภาพรวมของธุรกิจคุณ</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ReportCard 
                title="รายงานการขาย"
                description="สรุปยอดขายตามช่วงเวลา, สินค้า, หรือพนักงาน"
                icon={<FaChartLine size={24} className="text-white"/>}
                path="/reports/sales"
                color="from-blue-400 to-blue-300"
            />
             <ReportCard 
                title="รายงานค่าใช้จ่าย"
                description="สรุปรายจ่ายตามหมวดหมู่และช่วงเวลา"
                icon={<FaFileInvoiceDollar size={24} className="text-white"/>}
                path="/expenses" // Link to existing page
                color="from-red-400 to-red-300"
            />
            <ReportCard 
                title="รายงานสต็อกสินค้า"
                description="ดูความเคลื่อนไหวและมูลค่าสินค้าคงคลัง"
                icon={<FaBoxOpen size={24} className="text-white"/>}
                path="/reports/inventory"
                color="from-green-400 to-green-300"
            />
            <ReportCard 
                title="รายงานการรับฝาก"
                description="สรุปรายการรับฝาก, ดอกเบี้ย, และของหลุดจำนำ"
                icon={<FaUsers size={24} className="text-white"/>}
                path="/reports/pawn"
                color="from-yellow-400 to-yellow-300"
            />
        </div>
    </div>
  );
}

export default ReportsPage;