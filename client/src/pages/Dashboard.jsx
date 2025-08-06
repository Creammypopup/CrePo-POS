// client/src/pages/Dashboard.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaDollarSign, FaBoxes, FaExclamationTriangle, FaPrint, FaShippingFast, FaCalendarTimes, FaFileInvoice } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getDashboardStats, reset } from '../features/dashboard/dashboardSlice';
import Spinner from "../components/Spinner";
import { formatCurrency } from '../utils/formatUtils';
import moment from "moment";

function InfoList({ title, icon, items = [], onNavigate, emptyText, dataKey, subKey, dateKey, statusKey, filterState }) {
    const navigate = useNavigate();

    const handleNavigate = (path, state) => {
        navigate(path, { state });
    };

    const getDeliveryStatusChip = (status) => {
        switch (status) {
            case 'pending': return 'bg-gray-200 text-gray-800';
            case 'preparing': return 'bg-yellow-200 text-yellow-800';
            case 'shipping': return 'bg-blue-200 text-blue-800';
            case 'delivered': return 'bg-green-200 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const deliveryStatusTranslations = {
        pending: 'รอจัดส่ง',
        preparing: 'กำลังเตรียม',
        shipping: 'กำลังจัดส่ง',
        delivered: 'จัดส่งแล้ว'
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">{icon}{title}</h2>
            <div className="flex-grow space-y-2 text-sm">
                {items.length > 0 ? items.map(item => (
                    <div key={item._id} onClick={() => handleNavigate(onNavigate, { saleId: item._id })} className="flex justify-between items-center hover:bg-gray-50 p-1 rounded cursor-pointer">
                        <div>
                            <p className="text-gray-600 font-medium">{item[dataKey]}</p>
                            {subKey && <p className="text-xs text-gray-400">{item.customer?.name || ''}</p>}
                        </div>
                        <div className="text-right">
                            {dateKey && <span className="font-semibold text-orange-500">{moment(item[dateKey]).format('DD/MM/YY')}</span>}
                            {statusKey && <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getDeliveryStatusChip(item[statusKey])}`}>{deliveryStatusTranslations[item[statusKey]]}</span>}
                            {!dateKey && !statusKey && <span className="font-semibold text-red-500">{item.stock} {item.mainUnit}</span>}
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

  const { totalSalesValue, totalItemsSold, topProductsToday, lowStockProducts, expiringProducts, overduePawns, pendingDeliveries } = stats;

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
        <StatCard icon={<FaShippingFast size={28} className="text-cyan-800" />} title="รอจัดส่ง" value={`${pendingDeliveries?.length || 0} รายการ`} color="from-cyan-200 to-cyan-100" isLoading={isLoading} />
        <StatCard icon={<FaExclamationTriangle size={28} className="text-red-800" />} title="ของใกล้หมด" value={`${lowStockProducts?.length || 0} รายการ`} color="from-red-200 to-red-100" isLoading={isLoading} />
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
              icon={<FaShippingFast className="text-cyan-500 mr-3" />}
              title="สถานะการจัดส่ง"
              items={pendingDeliveries}
              onNavigate="/reports/sales"
              filterState={{ filter: 'pending_delivery' }}
              emptyText="ไม่มีรายการที่ต้องจัดส่ง"
              dataKey="_id"
              subKey="customer.name"
              statusKey="deliveryStatus"
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