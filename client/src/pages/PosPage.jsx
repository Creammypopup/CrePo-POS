// client/src/pages/PosPage.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaSearch, FaPlus, FaMinus, FaTrash, FaUser, FaShoppingCart, FaLock, FaTag, FaExclamationCircle, FaBarcode, FaCamera } from 'react-icons/fa';
import { getProducts } from '../features/product/productSlice';
import { addToCart, updateCartItem, removeFromCart, createSale, selectCustomer, resetSale, applyDiscount } from '../features/sale/saleSlice';
import Spinner from '../components/Spinner';
import SelectCustomerModal from '../components/modals/SelectCustomerModal';
import PaymentModal from '../components/modals/PaymentModal';
import CloseShiftModal from '../components/modals/CloseShiftModal';
import DiscountModal from '../components/modals/DiscountModal';
import WeightInputModal from '../components/modals/WeightInputModal';
import CameraScannerModal from '../components/modals/CameraScannerModal';
import { toast } from 'react-toastify';
import { formatCurrency } from '../utils/formatUtils';
import axios from 'axios';

function PosPage({ currentShift }) {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { products, isLoading: productsLoading } = useSelector((state) => state.products);
    const { cart, selectedCustomer, discount, isLoading: saleLoading } = useSelector((state) => state.sale);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [barcode, setBarcode] = useState('');
    const [modal, setModal] = useState({ name: null, data: null });

    useEffect(() => { dispatch(getProducts()); }, [dispatch]);
    
    const filteredProducts = useMemo(() => {
        if (!Array.isArray(products) || !searchTerm) return products;
        return products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [products, searchTerm]);

    const subTotal = useMemo(() => cart.reduce((total, item) => total + (item.isFreebie ? 0 : item.priceAtSale * item.quantity), 0), [cart]);
    const discountAmount = useMemo(() => {
        if (discount.type === 'percentage') return (subTotal * discount.value) / 100;
        if (discount.type === 'amount') return discount.value;
        return 0;
    }, [subTotal, discount]);
    const cartTotal = useMemo(() => subTotal - discountAmount, [subTotal, discountAmount]);

    const findAndAddProduct = (barcodeValue) => {
        const product = products.find(p => p.barcode === barcodeValue);
        if (product) {
            handleAddToCart(product);
            setBarcode('');
            setModal({ name: null });
        } else {
            toast.error('ไม่พบสินค้าสำหรับบาร์โค้ดนี้');
        }
    };

    const handleBarcodeScan = (e) => {
        e.preventDefault();
        if (!barcode) return;
        findAndAddProduct(barcode);
    };
    
    // ... Other handlers ...
    
    return (
        <>
            {/* ... Header and Product Grid */}
            <div className="flex flex-col md:flex-row h-[calc(100vh-14rem)] gap-6">
                 <div className="w-full md:w-3/5 flex flex-col">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="relative">
                            <input type="text" placeholder="ค้นหาสินค้า..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="form-input w-full pl-10"/>
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                        <form onSubmit={handleBarcodeScan} className="relative flex items-center gap-2">
                            <input type="text" placeholder="สแกนบาร์โค้ด..." value={barcode} onChange={(e) => setBarcode(e.target.value)} className="form-input w-full pl-10"/>
                            <FaBarcode className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <button type="button" onClick={() => setModal({ name: 'cameraScanner' })} className="btn p-3 bg-white"><FaCamera/></button>
                        </form>
                    </div>
                    {/* ... Product Grid */}
                </div>
                <div className="w-full md:w-2/5 bg-white/80 p-6 rounded-2xl shadow-lg flex flex-col">
                    {/* ... Customer Selector */}
                    <div className="flex-grow overflow-y-auto pr-2 border-t pt-4">
                        {cart.map(item => (
                             <div key={item.itemId} className="flex flex-col mb-3 border-b pb-3">
                                <div className="flex items-center">
                                    <div className="flex-grow">
                                        <p className="font-semibold text-sm flex items-center">{item.name} {item.isFreebie && <span className="text-xs ml-2 bg-green-200 text-green-800 px-2 py-0.5 rounded-full">ของแถม</span>}</p>
                                        <div className="flex items-center">
                                            <input type="number" step="any" className="text-xs text-gray-500 bg-transparent w-20 p-0.5 rounded border border-transparent hover:border-gray-300 focus:border-brand-purple disabled:bg-transparent" value={item.priceAtSale} onChange={(e) => handlePriceChange(item.itemId, e.target.value)} disabled={item.isFreebie}/>
                                            <button onClick={() => setModal({ name: 'itemDiscount', data: item })} className="ml-2 text-xs text-blue-500 hover:underline">(ลด)</button>
                                        </div>
                                        <p className="text-xs text-gray-400">คงเหลือ: {item.stock}</p>
                                    </div>
                                    {/* ... Quantity Controls and Remove button */}
                                </div>
                                {/* ... Unit Selector */}
                             </div>
                        ))}
                    </div>
                    {/* ... Payment section */}
                </div>
            </div>
            
            {/* All Modals */}
        </>
    );
}

export default PosPage;