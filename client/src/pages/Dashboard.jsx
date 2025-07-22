import React from 'react';
import { useSelector } from 'react-redux';
import { FaPlus, FaFileInvoiceDollar, FaShoppingBag, FaBoxOpen } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const chartData = [ { name: 'ม.ค.', 'รายรับ': 4000, 'รายจ่าย': 2400 }, { name: 'ก.พ.', 'รายรับ': 3000, 'รายจ่าย': 1398 }, { name: 'มี.ค.', 'รายรับ': 2000, 'รายจ่าย': 9800 }, { name: 'เม.ย.', 'รายรับ': 2780, 'รายจ่าย': 3908 }, { name: 'พ.ค.', 'รายรับ': 1890, 'รายจ่าย': 4800 }, { name: 'มิ.ย.', 'รายรับ': 2390, 'รายจ่าย': 3800 }, { name: 'ก.ค.', 'รายรับ': 3490, 'รายจ่าย': 4300 }, ];

const StatCard = ({ title, value, icon, gradient }) => (
  <div className={`p-6 rounded-2xl shadow-lg flex items-center space-x-4 text-white ${gradient}`}>
    <div className="p-3 bg-white/20 rounded-full"> {icon} </div>
    <div> <p className="text-lg font-semibold">{title}</p> <p className="text-2xl font-bold">{value}</p> </div>
  </div>
);

const QuickActionButton = ({ title, icon, color, hoverColor }) => (
  <button className={`flex flex-col items-center justify-center p-4 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 w-full ${color} ${hoverColor}`}>
    <div className="p-3 bg-white/60 rounded-full mb-2"> {icon} </div>
    <span className="font-semibold text-sm text-gray-700">{title}</span>
  </button>
);

function Dashboard() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">ยินดีต้อนรับ, {user?.name || 'ผู้ใช้งาน'}!</h1>
        <p className="text-gray-500">ภาพรวมธุรกิจของคุณในวันนี้</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="ยอดขายวันนี้" value="฿1,250" icon={<FaFileInvoiceDollar size={28} />} gradient="bg-gradient-to-br from-pastel-purple to-pastel-pink" />
        <StatCard title="รายจ่ายวันนี้" value="฿340" icon={<FaShoppingBag size={28} />} gradient="bg-gradient-to-br from-pastel-sky to-pastel-mint" />
        <StatCard title="สินค้าคงเหลือ" value="1,289 ชิ้น" icon={<FaBoxOpen size={28} />} gradient="bg-gradient-to-br from-pastel-yellow to-pastel-peach" />
        <StatCard title="รออนุมัติ" value="3 รายการ" icon={<FaPlus size={28} />} gradient="bg-gradient-to-br from-pastel-mint to-teal-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-6 bg-white rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold text-gray-700 mb-4">สรุปรายรับ-รายจ่าย</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip wrapperClassName="!rounded-lg !border-gray-300 !bg-white !shadow-lg" />
              <Legend />
              <Bar dataKey="รายรับ" fill="#C084FC" name="รายรับ" radius={[4, 4, 0, 0]} />
              <Bar dataKey="รายจ่าย" fill="#A7F3D0" name="รายจ่าย" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow-lg space-y-4">
           <h2 className="text-xl font-bold text-gray-700 mb-2">ทำรายการด่วน</h2>
           <div className="grid grid-cols-2 gap-4">
            <QuickActionButton title="สร้างใบแจ้งหนี้" icon={<FaFileInvoiceDollar size={24} className="text-pastel-purple-dark"/>} color="bg-pastel-purple-light" hoverColor="hover:bg-pastel-purple" />
            <QuickActionButton title="บันทึกค่าใช้จ่าย" icon={<FaShoppingBag size={24} className="text-pastel-sky-dark"/>} color="bg-pastel-sky-light" hoverColor="hover:bg-pastel-sky" />
            <QuickActionButton title="เพิ่มสินค้า" icon={<FaBoxOpen size={24} className="text-pastel-yellow-dark"/>} color="bg-pastel-yellow-light" hoverColor="hover:bg-pastel-yellow" />
            <QuickActionButton title="เพิ่มผู้ติดต่อ" icon={<FaPlus size={24} className="text-pastel-mint-dark"/>} color="bg-pastel-mint-light" hoverColor="hover:bg-pastel-mint" />
           </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
