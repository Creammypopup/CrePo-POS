// client/src/pages/Dashboard.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaDollarSign, FaBoxes, FaExclamationTriangle, FaPrint, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getDashboardStats, reset } from '../features/dashboard/dashboardSlice';
import Spinner from "../components/Spinner";
import { formatCurrency } from '../utils/formatUtils';

function StatCard({ icon, title, value, color, isLoading }) {
  return (
    <div className={`p-6 rounded-2xl shadow-lg flex items-center space-x-4 bg-gradient-to-br ${color}`}>
      <div className="p-4 bg-white/30 rounded-full">{icon}</div>
      <div>
        <p className="text-gray-700 font-medium">{title}</p>
        {isLoading ? <div className="h-8 w-24 bg-white/40 rounded-md animate-pulse"></div> : <p className="text-2xl font-bold text-gray-800">{value}</p>}
      </div>
    </div>
  );
}

function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stats, isLoading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(getDashboardStats());
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  const { totalSalesValue, totalItemsSold, topProductsToday, lowStockProducts } = stats;

  return (
    <>
      <style>{`
        @media print {
            body * { visibility: hidden; }
            .printable-container, .printable-container * { 
                visibility: visible !important;
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
            }
            .printable-container { position: absolute; left: 0; top: 0; width: 100%; font-size: 10pt; padding: 2rem; }
            .non-printable { display: none !important; }
            .print-title { visibility: visible !important; display: block !important; text-align: center; font-size: 18pt; margin-bottom: 1rem;}
        }
      `}</style>
      <div className="space-y-8 printable-container">
        <div className="flex flex-wrap justify-between items-center gap-4 non-printable">
          <div>
              <h1 className="text-3xl font-bold text-gray-800">ภาพรวมระบบ</h1>
              <p className="text-gray-500">ยินดีต้อนรับ, {user?.name || 'ผู้ใช้งาน'}!</p>
          </div>
          <button onClick={() => window.print()} className="btn btn-3d-pastel bg-white">
              <FaPrint className="mr-2"/> พิมพ์รายงานสรุป
          </button>
        </div>

        <h1 className="hidden print-title">รายงานสรุปภาพรวมระบบ</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={<FaDollarSign size={28} className="text-green-800" />} title="ยอดขายวันนี้" value={formatCurrency(totalSalesValue)} color="from-green-200 to-green-100" isLoading={isLoading} />
          <StatCard icon={<FaBoxes size={28} className="text-blue-800" />} title="จำนวนที่ขาย" value={`${totalItemsSold || 0} รายการ`} color="from-blue-200 to-blue-100" isLoading={isLoading} />
          <StatCard icon={<FaArrowUp size={28} className="text-teal-800" />} title="รายรับ (เร็วๆนี้)" value="-" color="from-teal-200 to-teal-100" isLoading={isLoading} />
          <StatCard icon={<FaArrowDown size={28} className="text-red-800" />} title="รายจ่าย (เร็วๆนี้)" value="-" color="from-red-200 to-red-100" isLoading={isLoading} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">5 สินค้าขายดีวันนี้</h2>
             {isLoading ? <div className="h-[350px] flex items-center justify-center"><Spinner/></div> : (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={topProductsToday} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip wrapperClassName="rounded-lg shadow-lg" />
                    <Legend />
                    <Bar dataKey="totalQuantity" fill="#A076F9" name="จำนวนที่ขายได้" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
             )}
          </div>

          <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><FaExclamationTriangle className="text-yellow-500 mr-3" /> สินค้าใกล้หมดสต็อก</h2>
                  {isLoading ? <div className="h-24 bg-gray-100 rounded-md animate-pulse"></div> : (
                    <ul className="space-y-2 text-sm">
                        {lowStockProducts && lowStockProducts.length > 0 ? lowStockProducts.map(item => (
                            <li key={item._id} className="flex justify-between">
                                <span className="text-gray-600">{item.name}</span>
                                <span className="font-semibold text-red-500">{item.stock} {item.mainUnit}</span>
                            </li>
                        )) : <p className="text-gray-400 text-center py-4">ไม่มีสินค้าใกล้หมด</p>}
                    </ul>
                  )}
              </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;