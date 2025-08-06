// client/src/pages/inventory/ReceiveStockPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../features/product/productSlice';
import { getSuppliers } from '../../features/supplier/supplierSlice';
import { FaPlus, FaTrash, FaSearch, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import { formatCurrency } from '../../utils/formatUtils';
import moment from 'moment';

const API_URL = '/api/purchase-orders/';

function ReceiveStockPage() {
    const dispatch = useDispatch();
    const { products } = useSelector(state => state.products);
    const { suppliers } = useSelector(state => state.suppliers);

    const [items, setItems] = useState([]);
    const [supplier, setSupplier] = useState('');
    const [notes, setNotes] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        dispatch(getProducts());
        dispatch(getSuppliers());
    }, [dispatch]);

    useEffect(() => {
        if (!searchTerm) {
            setSearchResults([]);
            return;
        }
        const lowercasedTerm = searchTerm.toLowerCase();
        const results = products
            .filter(p => p.name.toLowerCase().includes(lowercasedTerm) || (p.sku && p.sku.toLowerCase().includes(lowercasedTerm)))
            .slice(0, 5);
        setSearchResults(results);
    }, [searchTerm, products]);
    
    const totalCost = useMemo(() => items.reduce((sum, item) => sum + (item.cost * item.quantity), 0), [items]);

    const handleAddItem = (product) => {
        if (items.some(i => i.product === product._id)) {
            toast.info(`"${product.name}" อยู่ในรายการแล้ว`);
            return;
        }
        setItems([...items, {
            product: product._id,
            name: product.name,
            quantity: 1,
            cost: product.cost || 0,
            expiryDate: ''
        }]);
        setSearchTerm('');
        setSearchResults([]);
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };
    
    const handleRemoveItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (items.length === 0) {
            toast.error('กรุณาเพิ่มสินค้าอย่างน้อย 1 รายการ');
            return;
        }

        const token = JSON.parse(localStorage.getItem('user'))?.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const payload = { supplier, items, totalCost, notes };

        try {
            await axios.post(API_URL, payload, config);
            toast.success('บันทึกการรับสินค้าเข้าสต็อกสำเร็จ!');
            setItems([]);
            setSupplier('');
            setNotes('');
            dispatch(getProducts()); // Re-fetch products to update stock
        } catch (error) {
            const message = (error.response?.data?.message) || error.message || error.toString();
            toast.error(`เกิดข้อผิดพลาด: ${message}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">รับสินค้าเข้าสต็อก</h1>
            
            <div className="bg-white p-6 rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-bold mb-2 text-gray-600">ผู้จำหน่าย (ถ้ามี)</label>
                    <select value={supplier} onChange={(e) => setSupplier(e.target.value)} className="form-input">
                        <option value="">-- ไม่ระบุ --</option>
                        {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                    </select>
                </div>
                 <div className="relative">
                    <label className="block text-sm font-bold mb-2 text-gray-600">ค้นหาสินค้าเพื่อเพิ่ม</label>
                    <input 
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="พิมพ์ชื่อหรือรหัสสินค้า..."
                        className="form-input"
                    />
                     {searchResults.length > 0 && (
                        <div className="absolute w-full bg-white shadow-lg rounded-lg mt-1 z-10 max-h-60 overflow-y-auto">
                            {searchResults.map(p => (
                                <div key={p._id} onClick={() => handleAddItem(p)} className="p-3 hover:bg-brand-purple-light cursor-pointer">
                                    {p.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-lg">
                 <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2">
                                <th className="p-3 text-left">สินค้า</th>
                                <th className="p-3 text-right">จำนวน</th>
                                <th className="p-3 text-right">ต้นทุน/หน่วย</th>
                                <th className="p-3 text-center">วันหมดอายุ</th>
                                <th className="p-3 text-right">รวม</th>
                                <th className="p-3 text-center"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index} className="border-b">
                                    <td className="p-2 font-medium">{item.name}</td>
                                    <td className="p-2"><input type="number" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} className="form-input !py-1.5 text-right" required /></td>
                                    <td className="p-2"><input type="number" step="any" value={item.cost} onChange={e => handleItemChange(index, 'cost', e.target.value)} className="form-input !py-1.5 text-right" required /></td>
                                    <td className="p-2"><input type="date" value={item.expiryDate} onChange={e => handleItemChange(index, 'expiryDate', e.target.value)} className="form-input !py-1.5" /></td>
                                    <td className="p-2 text-right font-semibold">{formatCurrency(item.quantity * item.cost)}</td>
                                    <td className="p-2 text-center"><button type="button" onClick={() => handleRemoveItem(index)} className="btn p-2 bg-red-100 text-red-600"><FaTrash /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold mb-2 text-gray-600">หมายเหตุ</label>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} rows="3" className="form-input"></textarea>
                </div>
                <div className="space-y-2 text-right">
                    <p className="text-xl font-bold">ยอดรวมต้นทุน</p>
                    <p className="text-4xl font-bold text-brand-purple">{formatCurrency(totalCost)}</p>
                    <div className="pt-2">
                        <button type="submit" className="btn btn-primary btn-3d-pastel text-lg px-8 py-3">
                            <FaSave className="mr-2" /> บันทึกการรับสินค้า
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default ReceiveStockPage;