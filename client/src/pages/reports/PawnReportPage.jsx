// client/src/pages/reports/PawnReportPage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPawnReport, reset } from '../../features/report/reportSlice';
import Spinner from '../../components/Spinner';
import { formatCurrency } from '../../utils/formatUtils';
import moment from 'moment';

const ReportStatCard = ({ title, value, count, color }) => (
    <div className={`p-4 rounded-2xl shadow-lg bg-gradient-to-br ${color}`}>
        <p className="text-sm text-gray-700 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-xs text-gray-600">{count} รายการ</p>
    </div>
);

function PawnReportPage() {
    const dispatch = useDispatch();
    const { pawnReport, isLoading } = useSelector((state) => state.report);

    useEffect(() => {
        dispatch(getPawnReport());
        return () => { dispatch(reset()); };
    }, [dispatch]);
    
    const { pawns, summary } = pawnReport;

    const getStatusChip = (status) => {
        switch (status) {
            case 'active': return 'bg-blue-100 text-blue-800';
            case 'redeemed': return 'bg-green-100 text-green-800';
            case 'expired': return 'bg-yellow-100 text-yellow-800';
            case 'forfeited': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const statusTranslations = {
        active: 'ดำเนินการ',
        redeemed: 'ไถ่ถอนแล้ว',
        expired: 'หมดอายุ',
        forfeited: 'หลุดจำนำ'
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">รายงานการรับฝาก/จำนำ</h1>
            {isLoading ? <Spinner /> : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <ReportStatCard title="กำลังดำเนินการ" value={formatCurrency(summary.active?.amount || 0)} count={summary.active?.count || 0} color="from-blue-200 to-blue-100" />
                        <ReportStatCard title="ไถ่ถอนแล้ว" value={formatCurrency(summary.redeemed?.amount || 0)} count={summary.redeemed?.count || 0} color="from-green-200 to-green-100" />
                        <ReportStatCard title="หมดอายุ" value={formatCurrency(summary.expired?.amount || 0)} count={summary.expired?.count || 0} color="from-yellow-200 to-yellow-100" />
                        <ReportStatCard title="หลุดจำนำ" value={formatCurrency(summary.forfeited?.amount || 0)} count={summary.forfeited?.count || 0} color="from-red-200 to-red-100" />
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-lg overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2"><th className="p-3 text-left">เลขที่ตั๋ว</th><th className="p-3 text-left">ทรัพย์สิน</th><th className="p-3 text-left">ลูกค้า</th><th className="p-3 text-right">เงินต้น</th><th className="p-3 text-center">วันสิ้นสุด</th><th className="p-3 text-center">สถานะ</th></tr>
                            </thead>
                            <tbody>
                                {pawns.map(p => (
                                    <tr key={p._id} className="border-b hover:bg-gray-50">
                                        <td className="p-3 font-mono text-xs">{p.pawnTicketId}</td>
                                        <td className="p-3 font-medium">{p.productName}</td>
                                        <td className="p-3">{p.customer?.name}</td>
                                        <td className="p-3 text-right">{formatCurrency(p.pawnAmount)}</td>
                                        <td className="p-3 text-center">{moment(p.endDate).format('DD/MM/YYYY')}</td>
                                        <td className="p-3 text-center"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusChip(p.status)}`}>{statusTranslations[p.status]}</span></td>
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

export default PawnReportPage;