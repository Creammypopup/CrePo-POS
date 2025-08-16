// client/src/pages/ReceiptPage.jsx
import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getSaleById, resetSale } from '../features/sale/saleSlice';
import Spinner from '../components/Spinner';
import { formatCurrency } from '../utils/formatUtils';
import moment from 'moment';
import { useReactToPrint } from 'react-to-print';
import { FaPrint, FaArrowLeft } from 'react-icons/fa';

const ReceiptContent = React.forwardRef(({ sale, settings }, ref) => {
    if (!sale) return null;

    const totalBeforeTax = sale.totalAmount / 1.07;
    const taxAmount = sale.totalAmount - totalBeforeTax;

    return (
        <div ref={ref} className="p-10 bg-white font-sans text-gray-800">
            <header className="flex justify-between items-start pb-4 border-b-2 border-gray-800">
                <div>
                    <h1 className="text-4xl font-bold">ใบเสร็จรับเงิน / ใบกำกับภาษี</h1>
                    <p className="text-gray-600">ต้นฉบับ</p>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-bold">{settings?.companyName || 'ชื่อร้านค้า'}</h2>
                    <p className="text-sm text-gray-600 max-w-xs">{settings?.address || 'ที่อยู่ร้านค้า'}</p>
                    <p className="text-sm text-gray-600">โทร: {settings?.phone || '-'}</p>
                    <p className="text-sm text-gray-600">เลขประจำตัวผู้เสียภาษี: {settings?.taxId || '-'}</p>
                </div>
            </header>

            <section className="flex justify-between mt-6">
                <div className="text-sm">
                    <p className="font-bold">ลูกค้า:</p>
                    <p>{sale.customer?.name || 'ลูกค้าทั่วไป'}</p>
                    <p>{sale.customer?.address || ''}</p>
                    <p>โทร: {sale.customer?.phone || '-'}</p>
                </div>
                <div className="text-sm text-right">
                    <p><span className="font-bold">เลขที่:</span> {sale._id.slice(-8).toUpperCase()}</p>
                    <p><span className="font-bold">วันที่:</span> {moment(sale.createdAt).format('DD/MM/YYYY')}</p>
                </div>
            </section>

            <main className="mt-8">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 text-left font-bold w-12">#</th>
                            <th className="p-2 text-left font-bold">รายการ</th>
                            <th className="p-2 text-right font-bold">จำนวน</th>
                            <th className="p-2 text-right font-bold">ราคา/หน่วย</th>
                            <th className="p-2 text-right font-bold">จำนวนเงิน</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sale.products.map((item, index) => (
                            <tr key={item._id} className="border-b">
                                <td className="p-2">{index + 1}</td>
                                <td className="p-2">{item.product?.name || 'N/A'}</td>
                                <td className="p-2 text-right">{item.quantity}</td>
                                <td className="p-2 text-right">{formatCurrency(item.priceAtSale).replace('฿','')}</td>
                                <td className="p-2 text-right">{formatCurrency(item.priceAtSale * item.quantity).replace('฿','')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 <div className="flex justify-end mt-4">
                    <div className="w-2/5 text-sm">
                        <div className="flex justify-between"><span >รวมเป็นเงิน</span><span>{formatCurrency(totalBeforeTax).replace('฿','')}</span></div>
                        <div className="flex justify-between"><span >ภาษีมูลค่าเพิ่ม 7%</span><span>{formatCurrency(taxAmount).replace('฿','')}</span></div>
                        <div className="flex justify-between font-bold text-lg mt-2 border-t pt-2"><span >ยอดสุทธิ</span><span>{formatCurrency(sale.totalAmount).replace('฿','')}</span></div>
                    </div>
                </div>
            </main>
            <footer className="text-center text-xs text-gray-500 mt-16">
                <p>ขอบคุณที่ใช้บริการ</p>
            </footer>
        </div>
    );
});
ReceiptContent.displayName = 'ReceiptContent';


function ReceiptPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { selectedSale, isLoading } = useSelector((state) => state.sale);
    const { settings } = useSelector((state) => state.settings);
    const componentRef = useRef();

    useEffect(() => {
        dispatch(getSaleById(id));
        return () => { dispatch(resetSale()); };
    }, [dispatch, id]);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    
    if (isLoading || !selectedSale) {
        return <Spinner />;
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-lg">
                <button onClick={() => navigate(-1)} className="btn bg-gray-200 text-gray-700"><FaArrowLeft className="mr-2"/> กลับ</button>
                <h2 className="text-xl font-bold">ใบเสร็จเลขที่: {selectedSale._id.slice(-8).toUpperCase()}</h2>
                <button onClick={handlePrint} className="btn btn-primary btn-3d-pastel"><FaPrint className="mr-2"/> พิมพ์ใบเสร็จ</button>
            </div>
            <div className="bg-white rounded-2xl shadow-lg">
                <ReceiptContent ref={componentRef} sale={selectedSale} settings={settings} />
            </div>
        </div>
    );
}

export default ReceiptPage;