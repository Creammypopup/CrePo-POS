// client/src/pages/reports/InventoryReportPage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getInventoryReport, reset } from '../../features/report/reportSlice';
import Spinner from '../../components/Spinner';
import { formatCurrency } from '../../utils/formatUtils';

const ReportStatCard = ({ title, value, color }) => (
    <div className={`p-4 rounded-2xl shadow-lg bg-gradient-to-br ${color}`}>
        <p className="text-sm text-gray-700 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
);

function InventoryReportPage() {
    const dispatch = useDispatch();
    const { inventoryReport, isLoading } = useSelector((state) => state.report);

    useEffect(() => {
        dispatch(getInventoryReport());
        return () => { dispatch(reset()); };
    }, [dispatch]);

    const { products, summary } = inventoryReport;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">รายงานสินค้าคงคลัง</h1>
            {isLoading ? <Spinner /> : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <ReportStatCard title="จำนวนสินค้าทั้งหมด" value={`${summary.totalItems || 0} ชิ้น`} color="from-blue-200 to-blue-100" />
                        <ReportStatCard title="มูลค่า (ราคาขาย)" value={formatCurrency(summary.totalStockValue || 0)} color="from-green-200 to-green-100" />
                        <ReportStatCard title="มูลค่า (ต้นทุน)" value={formatCurrency(summary.totalStockCost || 0)} color="from-yellow-200 to-yellow-100" />
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-lg overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2">
                                    <th className="p-3 text-left">ชื่อสินค้า</th>
                                    <th className="p-3 text-right">คงเหลือ</th>
                                    <th className="p-3 text-right">ต้นทุน/หน่วย</th>
                                    <th className="p-3 text-right">ราคาขาย/หน่วย</th>
                                    <th className="p-3 text-right">มูลค่ารวม (ต้นทุน)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p._id} className="border-b hover:bg-gray-50">
                                        <td className="p-3 font-medium">{p.name}</td>
                                        <td className="p-3 text-right">{p.stock} {p.mainUnit}</td>
                                        <td className="p-3 text-right text-red-600">{formatCurrency(p.cost)}</td>
                                        <td className="p-3 text-right text-green-600">{formatCurrency(p.price)}</td>
                                        <td className="p-3 text-right font-semibold">{formatCurrency(p.cost * p.stock)}</td>
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

export default InventoryReportPage;