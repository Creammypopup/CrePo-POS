import React from 'react';
import { useSelector } from 'react-redux';
import { FaFileInvoiceDollar, FaShoppingBag, FaChartLine, FaExclamationTriangle, FaFileAlt } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- Mock Data (for demonstration) ---
const chartData = [ { name: 'ม.ค.', 'รายรับ': 4000, 'รายจ่าย': 2400 }, { name: 'ก.พ.', 'รายรับ': 3000, 'รายจ่าย': 1398 }, { name: 'มี.ค.', 'รายรับ': 2000, 'รายจ่าย': 9800 }, { name: 'เม.ย.', 'รายรับ': 2780, 'รายจ่าย': 3908 }, { name: 'พ.ค.', 'รายรับ': 1890, 'รายจ่าย': 4800 }, { name: 'มิ.ย.', 'รายรับ': 2390, 'รายจ่าย': 3800 }, { name: 'ก.ค.', 'รายรับ': 3490, 'รายจ่าย': 4300 }, ];
const documentStatus = [ 
    { doc: 'ใบเสนอราคา #QT-0021', status: 'รออนุมัติ', color: 'blue' },
    { doc: 'ใบสั่งซื้อ #PO-0015', status: 'รอจัดส่ง', color: 'yellow' },
    { doc: 'ใบแจ้งหนี้ #IV-0033', status: 'ส่งแล้ว', color: 'green' },
];
const paymentAlerts = [
    { type: 'ลูกหนี้', name: 'บริษัท โชคดี จำกัด', status: 'เกินกำหนด 3 วัน', amount: '15,000.00', color: 'red' },
    { type: 'เจ้าหนี้', name: 'SCG Home', status: 'ถึงกำหนดพรุ่งนี้', amount: '45,200.00', color: 'yellow' },
]


// --- Components ---
const StatCard = ({ title, value, icon, gradient, permission }) => {
    const { user } = useSelector((state) => state.auth);
    if (permission && !user?.permissions.includes(permission)) {
        return null;
    }
    return (
        <div className={`p-6 rounded-2xl shadow-lg flex items-center space-x-4 text-white ${gradient} border-b-4 border-black/20`}>
            <div className="p-3 bg-white/30 rounded-full">{icon}</div>
            <div>
                <p className="text-lg font-semibold">{title}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
        </div>
    );
};

const InfoWidget = ({ title, icon, children, cta }) => (
    <div className="p-6 bg-white rounded-2xl shadow-lg h-full flex flex-col">
        <div className="flex items-center justify-between text-xl font-bold text-gray-700 mb-4">
            <div className="flex items-center">
                {icon}
                <h2 className="ml-3">{title}</h2>
            </div>
            {cta && <button className="text-sm font-semibold text-purple-600 hover:underline">{cta}</button>}
        </div>
        <div className="flex-grow space-y-3">{children}</div>
    </div>
);

// --- Main Dashboard Component ---
function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-8">
        {/* Header */}
        <div>
            <h1 className="text-3xl font-bold text-gray-800">ยินดีต้อนรับ, {user?.name || 'ผู้ใช้งาน'}!</h1>
            <p className="text-gray-500">{isAdmin ? 'ภาพรวมทั้งหมดของธุรกิจคุณในวันนี้' : 'ภาพรวมการทำงานของคุณ'}</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard title="ยอดขายวันนี้" value="฿1,250" icon={<FaFileInvoiceDollar size={28} />} gradient="bg-gradient-to-br from-purple-400 to-pink-400" />
            <StatCard title="รายจ่ายวันนี้" value="฿340" icon={<FaShoppingBag size={28} />} gradient="bg-gradient-to-br from-sky-400 to-green-400" />
            <StatCard title="กำไรวันนี้ (โดยประมาณ)" value="฿910" icon={<FaChartLine size={28} />} gradient="bg-gradient-to-br from-green-400 to-teal-400" permission="dashboard-view-profit" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Chart */}
            <div className="lg:col-span-2">
                <InfoWidget title="สรุปรายรับ-รายจ่าย" icon={<FaChartLine className="text-purple-500" />}>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip wrapperClassName="!rounded-lg !border-gray-300 !bg-white/80 !backdrop-blur-lg !shadow-lg" />
                            <Legend />
                            <Bar dataKey="รายรับ" fill="#a855f7" name="รายรับ" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="รายจ่าย" fill="#2dd4bf" name="รายจ่าย" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </InfoWidget>
            </div>

            {/* Right Column: Info Widgets */}
            <div className="space-y-8">
                <InfoWidget title="สถานะเอกสาร" icon={<FaFileAlt className="text-blue-500" />} cta="ดูทั้งหมด">
                    {documentStatus.map(item => (
                        <div key={item.doc} className="flex justify-between items-center p-3 bg-gray-50/50 rounded-lg hover:bg-gray-100 cursor-pointer">
                            <span className="font-semibold text-gray-700">{item.doc}</span>
                            <span className={`font-bold text-sm px-2 py-0.5 rounded-full bg-${item.color}-100 text-${item.color}-600`}>{item.status}</span>
                        </div>
                    ))}
                </InfoWidget>

                <InfoWidget title="แจ้งเตือนการชำระเงิน" icon={<FaExclamationTriangle className="text-red-500" />} cta="ดูทั้งหมด">
                    {paymentAlerts.map(item => (
                        <div key={item.name} className={`p-3 rounded-lg border-l-4 bg-${item.color}-50 border-${item.color}-400`}>
                            <div className="flex justify-between">
                                <span className="font-bold text-gray-800">{item.name}</span>
                                <span className={`font-semibold text-${item.color}-600`}>฿{item.amount}</span>
                            </div>
                            <p className={`text-sm text-${item.color}-500`}>{item.type} - {item.status}</p>
                        </div>
                    ))}
                </InfoWidget>
            </div>
        </div>
    </div>
  );
}

export default Dashboard;