    // client/src/pages/Dashboard.jsx
    import React from "react";
    import { useSelector } from "react-redux";
    import { FaDollarSign, FaReceipt, FaExclamationTriangle, FaPrint, FaTruck, FaUserFriends, FaArrowDown, FaUserClock, FaFileInvoice } from "react-icons/fa";
    import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

    const salesData = [
      { name: 'จ.', ยอดขาย: 4000, รายจ่าย: 2400 }, { name: 'อ.', ยอดขาย: 3000, รายจ่าย: 1398 },
      { name: 'พ.', ยอดขาย: 2000, รายจ่าย: 9800 }, { name: 'พฤ.', ยอดขาย: 2780, รายจ่าย: 3908 },
      { name: 'ศ.', ยอดขาย: 1890, รายจ่าย: 4800 }, { name: 'ส.', ยอดขาย: 2390, รายจ่าย: 3800 },
      { name: 'อา.', ยอดขาย: 3490, รายจ่าย: 4300 },
    ];

    const lowStockData = [
        { name: 'ปูน TPI แดง', remaining: 5 }, { name: 'ท่อ PVC 4 นิ้ว', remaining: 2 },
        { name: 'สีทาบ้าน TOA', remaining: 8 },
    ];

    const topCustomers = [
        { name: 'บริษัท A จำกัด', total: 15000 }, { name: 'คุณสมหญิง', total: 12500 },
        { name: 'คุณสมชาย', total: 9800 },
    ];

    const deliveryStatus = [
        { name: 'คุณมานี', location: 'อ.เมือง', status: 'กำลังจัดส่ง', payment: 'เก็บปลายทาง ฿1,500' },
        { name: 'โครงการ B', location: 'อ.อัมพวา', status: 'เตรียมของ', payment: 'จ่ายแล้ว' },
    ];
    
    function StatCard({ icon, title, value, color }) {
      return (
        <div className={`p-6 rounded-2xl shadow-lg flex items-center space-x-4 bg-gradient-to-br ${color}`}>
          <div className="p-4 bg-white/30 rounded-full">{icon}</div>
          <div>
            <p className="text-gray-700 font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
          </div>
        </div>
      );
    }

    function Dashboard() {
      const { user } = useSelector((state) => state.auth);

      return (
        <div className="space-y-8">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">ภาพรวมระบบ</h1>
                <p className="text-gray-500">ยินดีต้อนรับ, {user?.name || 'ผู้ใช้งาน'}!</p>
            </div>
            <button className="btn btn-3d-pastel bg-white">
                <FaPrint className="mr-2"/> พิมพ์รายงานสรุป
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={<FaDollarSign size={28} className="text-green-800" />} title="ยอดขายวันนี้" value="฿1,250" color="from-green-200 to-green-100" />
            <StatCard icon={<FaReceipt size={28} className="text-red-800" />} title="รายจ่ายวันนี้" value="฿340" color="from-red-200 to-red-100" />
            <StatCard icon={<FaTruck size={28} className="text-blue-800" />} title="รอจัดส่ง" value="3 รายการ" color="from-blue-200 to-blue-100" />
            <StatCard icon={<FaUserClock size={28} className="text-orange-800" />} title="ลูกหนี้รอชำระ" value="2 ราย" color="from-orange-200 to-orange-100" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">สรุปยอดขาย 7 วันล่าสุด</h2>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={salesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip wrapperClassName="rounded-lg shadow-lg" />
                  <Legend />
                  <Bar dataKey="ยอดขาย" fill="#A076F9" name="ยอดขาย" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="รายจ่าย" fill="#FBCFE8" name="รายจ่าย" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><FaExclamationTriangle className="text-yellow-500 mr-3" /> สินค้าใกล้หมด</h2>
                    <ul className="space-y-2 text-sm">
                        {lowStockData.map(item => (
                            <li key={item.name} className="flex justify-between">
                                <span className="text-gray-600">{item.name}</span>
                                <span className="font-semibold text-red-500">{item.remaining} ชิ้น</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><FaFileInvoice className="text-gray-500 mr-3" /> สถานะเอกสาร</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <p className="text-gray-600">ใบเสนอราคา (รอดำเนินการ)</p>
                            <span className="font-bold text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full">2</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <p className="text-gray-600">ใบแจ้งหนี้ (ค้างชำระ)</p>
                            <span className="font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full">1</span>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      );
    }

    export default Dashboard;
