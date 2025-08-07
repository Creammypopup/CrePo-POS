// client/src/pages/inventory/StockAdjustmentsPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../features/product/productSlice';
import { FaSearch, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_URL = '/api/stock/adjust';

function StockAdjustmentsPage() {
    const dispatch = useDispatch();
    const { products } = useSelector(state => state.products);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [adjustment, setAdjustment] = useState('');
    const [notes, setNotes] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    
    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch]);

    useEffect(() => {
        if (!searchTerm) {
            setSearchResults([]);
            return;
        }
        const lowercasedTerm = searchTerm.toLowerCase();
        setSearchResults(products.filter(p => p.name.toLowerCase().includes(lowercasedTerm)).slice(0, 5));
    }, [searchTerm, products]);
    
    const handleSelectProduct = (product) => {
        setSelectedProduct(product);
        setSelectedSize(null);
        setSearchTerm('');
        setSearchResults([]);
    };
    
    const currentStock = useMemo(() => {
        if (selectedSize) return selectedSize.stock;
        if (selectedProduct) return selectedProduct.stock;
        return 0;
    }, [selectedProduct, selectedSize]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedProduct || !adjustment) {
            toast.error('กรุณาเลือกสินค้าและใส่จำนวนที่ต้องการปรับ');
            return;
        }

        const token = JSON.parse(localStorage.getItem('user'))?.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const payload = {
            productId: selectedProduct._id,
            sizeId: selectedSize ? selectedSize._id : null,
            adjustment: Number(adjustment),
            notes
        };

        try {
            await axios.post(API_URL, payload, config);
            toast.success('ปรับปรุงสต็อกสำเร็จ!');
            dispatch(getProducts()); // Refresh product list
            setSelectedProduct(null);
            setSelectedSize(null);
            setAdjustment('');
            setNotes('');
        } catch (error) {
            toast.error(`เกิดข้อผิดพลาด: ${error.response?.data?.message || 'Server Error'}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">ปรับปรุงสต็อก</h1>
            
            <div className="bg-white p-6 rounded-2xl shadow-lg space-y-4">
                 <div className="relative">
                    <label className="block text-sm font-bold mb-2 text-gray-600">1. ค้นหาสินค้า</label>
                    <input 
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="พิมพ์ชื่อสินค้า..."
                        className="form-input"
                    />
                     {searchResults.length > 0 && (
                        <div className="absolute w-full bg-white shadow-lg rounded-lg mt-1 z-10">
                            {searchResults.map(p => (
                                <div key={p._id} onClick={() => handleSelectProduct(p)} className="p-3 hover:bg-gray-100 cursor-pointer">{p.name}</div>
                            ))}
                        </div>
                    )}
                </div>

                {selectedProduct && (
                    <div className="p-4 bg-blue-50 rounded-lg space-y-4 animate-fade-in">
                        <h3 className="font-bold text-lg">{selectedProduct.name}</h3>
                        {selectedProduct.hasMultipleSizes && (
                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-600">2. เลือกขนาด (ถ้ามี)</label>
                                <select onChange={(e) => setSelectedSize(selectedProduct.sizes.find(s => s._id === e.target.value))} className="form-input">
                                    <option value="">-- เลือกขนาด --</option>
                                    {selectedProduct.sizes.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                                </select>
                            </div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-600">3. จำนวนที่ปรับ</label>
                                <input type="number" value={adjustment} onChange={e => setAdjustment(e.target.value)} placeholder="+10 หรือ -5" className="form-input" />
                                <p className="text-xs text-gray-500 mt-1">สต็อกปัจจุบัน: {currentStock}</p>
                            </div>
                             <div>
                                <label className="block text-sm font-bold mb-2 text-gray-600">4. หมายเหตุ</label>
                                <input type="text" value={notes} onChange={e => setNotes(e.target.value)} placeholder="เช่น สินค้าชำรุด" className="form-input" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex justify-end">
                <button type="submit" className="btn btn-primary btn-3d-pastel text-lg" disabled={!selectedProduct || !adjustment}>
                    <FaSave className="mr-2"/> บันทึกการปรับปรุง
                </button>
            </div>
        </form>
    );
}

export default StockAdjustmentsPage;