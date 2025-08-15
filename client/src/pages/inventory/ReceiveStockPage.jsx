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
    const { user } = useSelector(state => state.auth);
    const { suppliers } = useSelector(state => state.suppliers);

    const [items, setItems] = useState([]);
    const [supplier, setSupplier] = useState('');
    const [notes, setNotes] = useState('');
    const [orderDate, setOrderDate] = useState(moment().format('YYYY-MM-DD'));
    const [paymentMethod, setPaymentMethod] = useState('credit');
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
            .slice(0, 10);
        setSearchResults(results);
    }, [searchTerm, products]);
    
    const totalCost = useMemo(() => items.reduce((sum, item) => sum + (Number(item.cost) * Number(item.quantity)), 0), [items]);

    const handleAddItem = (product, size = null) => {
        const itemId = size ? `${product._id}-${size._id}` : product._id;
        if (items.some(i => i.itemId === itemId)) {
            toast.info(`"${product.name}${size ? ` - ${size.name}` : ''}" อยู่ในรายการแล้ว`);
            return;
        }
        setItems([...items, {
            itemId: itemId,
            product: product._id,
            sizeId: size ? size._id : null,
            name: size ? `${product.name} - ${size.name}` : product.name,
            quantity: 1,
            cost: size ? size.cost : product.cost || 0,
            currentStock: size ? size.stock : product.stock || 0,
            expiryDate: ''
        }]);
        setSearchTerm('');
        setSearchResults([]);
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        // แปลงค่า 'quantity' และ 'cost' เป็นตัวเลขเสมอ
        if (field === 'quantity' || field === 'cost') {
            // ใช้ parseFloat เพื่อรองรับทศนิยมสำหรับ 'cost' และปล่อยให้เป็น string ว่างถ้าผู้ใช้ลบข้อมูล
            newItems[index][field] = value === '' ? '' : parseFloat(value);
        } else {
            newItems[index][field] = value;
        }
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
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const payload = { supplier, items, totalCost, notes, orderDate, paymentMethod };

        try {
            await axios.post(API_URL, payload, config);
            toast.success('บันทึกการรับสินค้าเข้าสต็อกสำเร็จ!');
            setItems([]);
            setSupplier('');
            setNotes('');
            dispatch(getProducts());
        } catch (error) {
            const message = (error.response?.data?.message) || error.message || error.toString();
            toast.error(`เกิดข้อผิดพลาด: ${message}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">รับสินค้าเข้าสต็อก (PO)</h1>
                <button type="submit" className="btn btn-primary btn-3d-pastel text-lg px-8 py-3">
                    <FaSave className="mr-2" /> บันทึกการรับสินค้า
                </button>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-3 gap-6">
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
                        <div className="absolute w-full bg-white shadow-lg rounded-lg mt-1 z-20 max-h-60 overflow-y-auto">
                            {searchResults.map(p => 
                                !p.hasMultipleSizes ? (
                                    <div key={p._id} onClick={() => handleAddItem(p)} className="p-3 hover:bg-brand-purple-light cursor-pointer border-b">{p.name}</div>
                                ) : (
                                    <div key={p._id} className="p-3 border-b">
                                        <p className="font-semibold">{p.name}</p>
                                        <div className="pl-4">
                                            {p.sizes.map(size => (
                                                <div key={size._id} onClick={() => handleAddItem(p, size)} className="p-2 hover:bg-blue-100 cursor-pointer rounded">
                                                   - {size.name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
                 <div>
                    <label className="block text-sm font-bold mb-2 text-gray-600">ผู้จำหน่าย (ถ้ามี)</label>
                    <select value={supplier} onChange={(e) => setSupplier(e.target.value)} className="form-input">
                        <option value="">-- ไม่ระบุ --</option>
                        {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold mb-2 text-gray-600">วันที่รับเข้า</label>
                    <input type="date" value={orderDate} onChange={e => setOrderDate(e.target.value)} className="form-input" />
                </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-lg">
                 <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr className="border-b-2">
                                <th className="p-3 text-left w-2/5">สินค้า</th>
                                <th className="p-3 text-right">จำนวน</th>
                                <th className="p-3 text-right">ต้นทุน/หน่วย</th>
                                <th className="p-3 text-center">วันหมดอายุ</th>
                                <th className="p-3 text-right">รวม</th>
                                <th className="p-3 text-center"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={item.itemId} className="border-b">
                                    <td className="p-2">
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-xs text-gray-400">คงเหลือ: {item.currentStock}</p>
                                    </td>
                                    <td className="p-2"><input type="number" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} className="form-input !py-1.5 text-right w-24" required /></td>
                                    <td className="p-2"><input type="number" step="any" value={item.cost} onChange={e => handleItemChange(index, 'cost', e.target.value)} className="form-input !py-1.5 text-right w-32" required /></td>
                                    <td className="p-2"><input type="date" value={item.expiryDate} onChange={e => handleItemChange(index, 'expiryDate', e.target.value)} className="form-input !py-1.5" /></td>
                                    <td className="p-2 text-right font-semibold">{formatCurrency(item.quantity * item.cost)}</td>
                                    <td className="p-2 text-center"><button type="button" onClick={() => handleRemoveItem(index)} className="btn p-2 bg-red-100 text-red-600"><FaTrash /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div>
                    <label className="block text-sm font-bold mb-2 text-gray-600">วิธีการชำระเงิน</label>
                    <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="form-input">
                        <option value="credit">เงินเชื่อ (เจ้าหนี้)</option>
                        <option value="cash">เงินสด</option>
                        <option value="transfer">โอนชำระ</option>
                    </select>
                    <label className="block text-sm font-bold mb-2 mt-4 text-gray-600">หมายเหตุ</label>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} rows="3" className="form-input"></textarea>
                </div>
                <div className="space-y-2 text-right">
                    <p className="text-xl font-bold">ยอดรวมต้นทุน</p>
                    <p className="text-4xl font-bold text-brand-purple">{formatCurrency(totalCost)}</p>
                </div>
            </div>
        </form>
    );
}

export default ReceiveStockPage;