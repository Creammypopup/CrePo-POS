// client/src/pages/Dashboard.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom"; // <-- IMPORT Link
import { FaDollarSign, FaBoxes, FaExclamationTriangle, FaPrint, FaArrowUp, FaArrowDown, FaCalendarTimes, FaFileInvoice } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getDashboardStats, reset } from '../features/dashboard/dashboardSlice';
import Spinner from "../components/Spinner";
import { formatCurrency } from '../utils/formatUtils';
import moment from "moment";

// A new, more powerful InfoList component
function InfoList({ title, icon, items = [], onNavigate, emptyText, dataKey, subKey, dateKey, filterState }) {
    const navigate = useNavigate();

    const handleNavigate = (path, state) => {
        navigate(path, { state });
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">{icon}{title}</h2>
            <div className="flex-grow space-y-2 text-sm">
                {items.length > 0 ? items.map(item => (
                    <div key={item._id} onClick={() => handleNavigate(onNavigate, filterState)} className="flex justify-between items-center hover:bg-gray-50 p-1 rounded cursor-pointer">
                        <div>
                            <p className="text-gray-600 font-medium">{item[dataKey]}</p>
                            {subKey && <p className="text-xs text-gray-400">{item.customer?.name || ''}</p>}
                        </div>
                        <div className="text-right">
                            {dateKey ? (
                                <span className="font-semibold text-orange-500">{moment(item[dateKey]).format('DD/MM/YY')}</span>
                            ) : (
                                <span className="font-semibold text-red-500">{item.stock} {item.mainUnit}</span>
                            )}
                        </div>
                    </div>
                )) : <p className="text-gray-400 text-center py-4">{emptyText}</p>}
            </div>
            {items.length > 0 && (
                 <button onClick={() => handleNavigate(onNavigate, filterState)} className="text-sm text-brand-purple hover:underline mt-4 text-center">ดูทั้งหมด</button>
            )}
        </div>
    );
}


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

  const { totalSalesValue, totalItemsSold, topProductsToday, lowStockProducts, expiringProducts, overduePawns } = stats;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-800">ภาพรวมระบบ</h1>
            <p className="text-gray-500">ยินดีต้อนรับ, {user?.name || 'ผู้ใช้งาน'}!</p>
        </div>
        <button onClick={() => window.print()} className="btn btn-3d-pastel bg-white">
            <FaPrint className="mr-2"/> พิมพ์รายงานสรุป
        </button>
      </div>

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
            <InfoList 
              icon={<FaExclamationTriangle className="text-yellow-500 mr-3" />}
              title="สินค้าใกล้หมดสต็อก"
              items={lowStockProducts}
              onNavigate="/products"
              filterState={{ filter: 'low-stock' }}
              emptyText="ไม่มีสินค้าใกล้หมด"
              dataKey="name"
            />
            <InfoList 
              icon={<FaCalendarTimes className="text-orange-500 mr-3" />}
              title="สินค้าใกล้หมดอายุ"
              items={expiringProducts}
              onNavigate="/products"
              filterState={{ filter: 'expiring' }}
              emptyText="ไม่มีสินค้าใกล้หมดอายุ"
              dataKey="name"
              dateKey="expiryDate"
            />
            <InfoList 
              icon={<FaFileInvoice className="text-red-500 mr-3" />}
              title="รับฝากเลยกำหนด"
              items={overduePawns}
              onNavigate="/pawn"
              filterState={{ filter: 'overdue' }}
              emptyText="ไม่มีรายการที่เลยกำหนด"
              dataKey="productName"
              subKey="customer.name"
              dateKey="endDate"
            />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;