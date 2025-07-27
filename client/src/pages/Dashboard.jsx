import React from "react";
import { useSelector } from "react-redux";
import { FaDollarSign, FaReceipt, FaBoxOpen, FaExclamationTriangle } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- ข้อมูลตัวอย่างสำหรับกราฟ ---
const data = [
  { name: 'จ.', ยอดขาย: 4000, รายจ่าย: 2400 },
  { name: 'อ.', ยอดขาย: 3000, รายจ่าย: 1398 },
  { name: 'พ.', ยอดขาย: 2000, รายจ่าย: 9800 },
  { name: 'พฤ.', ยอดขาย: 2780, รายจ่าย: 3908 },
  { name: 'ศ.', ยอดขาย: 1890, รายจ่าย: 4800 },
  { name: 'ส.', ยอดขาย: 2390, รายจ่าย: 3800 },
  { name: 'อา.', ยอดขาย: 3490, รายจ่าย: 4300 },
];

// --- Component การ์ดแสดงผล (StatCard) ---
// แก้ไขโดยเพิ่ม Optional Chaining (?.) เพื่อป้องกัน Error
function StatCard({ icon, title, value, color, permission }) {
  const { user } = useSelector((state) => state.auth);

  // ตรวจสอบสิทธิ์: ถ้าไม่มี permission หรือ user มีสิทธิ์ ให้แสดงการ์ด
  // user?.role?.permissions?.includes(permission) -> จะไม่ Error แม้ user จะยังโหลดไม่เสร็จ
  const canView = !permission || user?.role?.permissions?.includes(permission);

  if (!canView) {
    return null; // ถ้าไม่มีสิทธิ์ ไม่ต้องแสดงการ์ดนี้
  }

  return (
    <div className={`card-3d flex items-center space-x-4 bg-gradient-to-br ${color}`}>
      <div className="p-4 bg-white/30 rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-gray-700 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

// --- หน้า Dashboard หลัก ---
function Dashboard() {
  return (
    <div className="space-y-8">
      {/* ส่วนของการ์ดสรุปข้อมูล */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<FaDollarSign size={28} className="text-green-800" />}
          title="ยอดขายวันนี้"
          value="฿1,250"
          color="from-pastel-green to-green-100"
          permission="view_dashboard" // ตัวอย่างการใช้ permission
        />
        <StatCard
          icon={<FaReceipt size={28} className="text-blue-800" />}
          title="รายจ่ายวันนี้"
          value="฿340"
          color="from-pastel-blue to-blue-100"
          permission="view_dashboard"
        />
        <StatCard
          icon={<FaBoxOpen size={28} className="text-yellow-800" />}
          title="สินค้าทั้งหมด"
          value="152 ชิ้น"
          color="from-pastel-yellow to-yellow-100"
          permission="manage_products"
        />
        <StatCard
          icon={<FaExclamationTriangle size={28} className="text-red-800" />}
          title="สินค้าใกล้หมด"
          value="5 รายการ"
          color="from-pastel-pink to-red-100"
          permission="manage_products"
        />
      </div>

      {/* ส่วนของกราฟและสถานะเอกสาร */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* กราฟสรุปรายรับ-รายจ่าย */}
        <div className="lg:col-span-2 card-3d">
          <h2 className="text-xl font-bold text-gray-800 mb-4">สรุปรายรับ-รายจ่าย</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip wrapperClassName="rounded-lg shadow-lg" />
              <Legend />
              <Bar dataKey="ยอดขาย" fill="#BEA9DF" name="ยอดขาย" radius={[4, 4, 0, 0]} />
              <Bar dataKey="รายจ่าย" fill="#F5DCE0" name="รายจ่าย" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* สถานะเอกสาร */}
        <div className="card-3d">
          <h2 className="text-xl font-bold text-gray-800 mb-4">สถานะเอกสาร</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-600">ใบเสนอราคา</p>
              <span className="font-bold text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full text-sm">รอดำเนินการ</span>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-600">ใบสั่งซื้อ</p>
              <span className="font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full text-sm">รอของเข้า</span>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-600">ใบแจ้งหนี้</p>
              <span className="font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm">ส่งแล้ว</span>
            </div>
             <div className="flex justify-between items-center">
              <p className="text-gray-600">ใบแจ้งหนี้ (ค้างชำระ)</p>
              <span className="font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full text-sm">เกินกำหนด</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
