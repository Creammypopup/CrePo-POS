    // client/src/pages/Dashboard.jsx
    import React from "react";
    import { useSelector } from "react-redux";
    import { FaDollarSign, FaReceipt, FaBoxOpen, FaExclamationTriangle, FaPrint } from "react-icons/fa";
    import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

    const data = [
      { name: 'จ.', ยอดขาย: 4000, รายจ่าย: 2400 },
      { name: 'อ.', ยอดขาย: 3000, รายจ่าย: 1398 },
      { name: 'พ.', ยอดขาย: 2000, รายจ่าย: 9800 },
      { name: 'พฤ.', ยอดขาย: 2780, รายจ่าย: 3908 },
      { name: 'ศ.', ยอดขาย: 1890, รายจ่าย: 4800 },
      { name: 'ส.', ยอดขาย: 2390, รายจ่าย: 3800 },
      { name: 'อา.', ยอดขาย: 3490, รายจ่าย: 4300 },
    ];

    function StatCard({ icon, title, value, color, permission }) {
      const { user } = useSelector((state) => state.auth);
      const canView = !permission || user?.role?.permissions?.includes(permission);

      if (!canView) {
        return null;
      }

      return (
        <div className={`p-6 rounded-2xl shadow-lg flex items-center space-x-4 bg-gradient-to-br ${color}`}>
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

    function Dashboard() {
      return (
        <div className="space-y-8">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-800">ภาพรวม</h1>
            <button className="btn btn-3d-pastel bg-white">
                <FaPrint className="mr-2"/> พิมพ์รายงานสรุป
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={<FaDollarSign size={28} className="text-green-800" />}
              title="ยอดขายวันนี้"
              value="฿1,250"
              color="from-green-200 to-green-100"
              permission="view_dashboard"
            />
            <StatCard
              icon={<FaReceipt size={28} className="text-blue-800" />}
              title="รายจ่ายวันนี้"
              value="฿340"
              color="from-blue-200 to-blue-100"
              permission="view_dashboard"
            />
            <StatCard
              icon={<FaExclamationTriangle size={28} className="text-yellow-800" />}
              title="สินค้าใกล้หมด"
              value="5 รายการ"
              color="from-yellow-200 to-yellow-100"
              permission="manage_products"
            />
             {/* New cards will be added here */}
            <div className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-purple-200 to-purple-100">
                <h3 className="font-bold text-gray-800">สถานะการจัดส่ง</h3>
                <p className="text-gray-600 mt-2">กำลังเตรียม: 3</p>
                <p className="text-gray-600">กำลังส่ง: 2</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">สรุปรายรับ-รายจ่าย</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip wrapperClassName="rounded-lg shadow-lg" />
                  <Legend />
                  <Bar dataKey="ยอดขาย" fill="#A076F9" name="ยอดขาย" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="รายจ่าย" fill="#D9ACF5" name="รายจ่าย" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg space-y-4">
              <h2 className="text-xl font-bold text-gray-800">ลูกค้าดีเด่น (เดือนนี้)</h2>
              <p>คุณสมชาย ใจดี</p>
               <h2 className="text-xl font-bold text-gray-800 pt-4">สินค้าที่ต้องสั่งซื้อ</h2>
               <p>ปูนซีเมนต์ TPI (แดง)</p>
            </div>
          </div>
        </div>
      );
    }

    export default Dashboard;
    