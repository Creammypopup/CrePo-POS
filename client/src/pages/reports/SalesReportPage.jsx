// client/src/pages/reports/SalesReportPage.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getSalesReport, reset } from '../../features/report/reportSlice';
import { FaPrint, FaFileExcel, FaCalendarAlt } from 'react-icons/fa';
import Spinner from '../../components/Spinner';
import { formatCurrency } from '../../utils/formatUtils';
import moment from 'moment';

const ReportStatCard = ({ title, value, color }) => (
    <div className={`p-4 rounded-2xl shadow-lg bg-gradient-to-br ${color}`}>
        <p className="text-sm text-gray-700 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
);

function SalesReportPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { salesReport, isLoading } = useSelector((state) => state.report);
    const [dateRange, setDateRange] = useState({
        startDate: moment().startOf('month').format('YYYY-MM-DD'),
        endDate: moment().endOf('month').format('YYYY-MM-DD'),
    });

    useEffect(() => {
        dispatch(getSalesReport(dateRange));
        return () => { dispatch(reset()); };
    }, [dispatch]);

    const handleDateChange = (e) => {
        setDateRange(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSearch = () => {
        dispatch(getSalesReport(dateRange));
    };
    
    // --- START OF EDIT ---
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
    // --- END OF EDIT ---

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-800">รายงานการขาย</h1>
                <div className="flex items-center gap-2">
                    <button className="btn bg-white"><FaPrint className="mr-2"/> พิมพ์</button>
                    <button className="btn bg-white"><FaFileExcel className="mr-2"/> Excel</button>
                </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-lg flex flex-wrap items-end gap-4">
                <div>
                    <label className="text-sm font-semibold text-gray-600">จากวันที่</label>
                    <input type="date" name="startDate" value={dateRange.startDate} onChange={handleDateChange} className="form-input mt-1"/>
                </div>
                <div>
                    <label className="text-sm font-semibold text-gray-600">ถึงวันที่</label>
                    <input type="date" name="endDate" value={dateRange.endDate} onChange={handleDateChange} className="form-input mt-1"/>
                </div>
                <button onClick={handleSearch} className="btn btn-primary btn-3d-pastel self-end">แสดงรายงาน</button>
            </div>

            {isLoading ? <Spinner /> : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <ReportStatCard title="ยอดขายรวม" value={formatCurrency(salesReport.summary.totalAmount)} color="from-green-200 to-green-100" />
                        <ReportStatCard title="ต้นทุน" value={formatCurrency(salesReport.summary.totalCost)} color="from-orange-200 to-orange-100" />
                        <ReportStatCard title="กำไร" value={formatCurrency(salesReport.summary.totalProfit)} color="from-sky-200 to-sky-100" />
                        <ReportStatCard title="จำนวนบิล" value={`${salesReport.summary.totalTransactions} รายการ`} color="from-purple-200 to-purple-100" />
                    </div>

                    <div className="bg-white p-4 rounded-2xl shadow-lg overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2">
                                    <th className="p-3 text-left">วันที่</th>
                                    <th className="p-3 text-left">ลูกค้า</th>
                                    <th className="p-3 text-center">ช่องทาง</th>
                                    <th className="p-3 text-center">สถานะจัดส่ง</th> {/* <-- ADD THIS HEADER */}
                                    <th className="p-3 text-right">ยอดรวม</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salesReport.sales.map(sale => (
                                    <tr key={sale._id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/receipts/${sale._id}`)}>
                                        <td className="p-3">{moment(sale.createdAt).format('DD/MM/YYYY HH:mm')}</td>
                                        <td className="p-3">{sale.customer?.name || 'ลูกค้าทั่วไป'}</td>
                                        <td className="p-3 text-center">{sale.paymentMethod}</td>
                                        {/* --- START OF EDIT --- */}
                                        <td className="p-3 text-center">
                                            {sale.isDelivery ? (
                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getDeliveryStatusChip(sale.deliveryStatus)}`}>
                                                    {deliveryStatusTranslations[sale.deliveryStatus]}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        {/* --- END OF EDIT --- */}
                                        <td className="p-3 text-right font-medium">{formatCurrency(sale.totalAmount)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}

export default SalesReportPage;