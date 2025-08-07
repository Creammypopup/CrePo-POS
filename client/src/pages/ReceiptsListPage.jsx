// client/src/pages/ReceiptsListPage.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaPrint } from 'react-icons/fa';
import Spinner from '../components/Spinner';
import { formatCurrency } from '../utils/formatUtils';
import moment from 'moment';
import { toast } from 'react-toastify';

const API_URL = '/api/sales/';

function ReceiptsListPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [sales, setSales] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('user'))?.token;
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get(API_URL, config);
                setSales(data);
            } catch (error) {
                toast.error('ไม่สามารถดึงข้อมูลการขายได้');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSales();
    }, [dispatch]);

    const filteredSales = useMemo(() => {
        if (!searchTerm) return sales;
        return sales.filter(sale =>
            (sale.customer?.name && sale.customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            sale._id.slice(-8).toUpperCase().includes(searchTerm.toUpperCase())
        );
    }, [sales, searchTerm]);

    if (isLoading) return <Spinner />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">ประวัติการขาย / ใบเสร็จ</h1>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="relative mb-4">
                    <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="ค้นหาจากชื่อลูกค้า หรือ เลขที่ใบเสร็จ..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="form-input !pl-11"/>
                </div>
                 <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2">
                                <th className="p-3 text-left">เลขที่</th>
                                <th className="p-3 text-left">วันที่</th>
                                <th className="p-3 text-left">ลูกค้า</th>
                                <th className="p-3 text-center">ช่องทาง</th>
                                <th className="p-3 text-right">ยอดรวม</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSales.map(sale => (
                                <tr key={sale._id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/receipts/${sale._id}`)}>
                                    <td className="p-3 font-mono text-xs">{sale._id.slice(-8).toUpperCase()}</td>
                                    <td className="p-3">{moment(sale.createdAt).format('DD/MM/YYYY HH:mm')}</td>
                                    <td className="p-3">{sale.customer?.name || 'ลูกค้าทั่วไป'}</td>
                                    <td className="p-3 text-center">{sale.paymentMethod}</td>
                                    <td className="p-3 text-right font-medium">{formatCurrency(sale.totalAmount)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ReceiptsListPage;