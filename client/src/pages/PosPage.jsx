// client/src/pages/PosPage.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaSearch, FaPlus, FaMinus, FaTrash, FaUser, FaShoppingCart, FaLock, FaTag, FaExclamationCircle, FaBarcode, FaCamera } from 'react-icons/fa';
import { getProducts } from '../features/product/productSlice';
import { getCustomers } from '../features/customer/customerSlice';
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

function PosPage({ currentShift }) {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { products, isLoading: productsLoading } = useSelector((state) => state.products);
    const { customers } = useSelector((state) => state.customers);
    const { cart, selectedCustomer, discount, isLoading: saleLoading } = useSelector((state) => state.sale);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [barcode, setBarcode] = useState('');
    const [modal, setModal] = useState({ name: null, data: null });

    useEffect(() => { 
        dispatch(getProducts());
        dispatch(getCustomers());
    }, [dispatch]);
    
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
    
    const handleAddToCart = (product, size = null) => {
        let price = size ? size.price : product.price;
        if (selectedCustomer && selectedCustomer._id !== 'walk-in') {
            const customerDetails = customers.find(c => c._id === selectedCustomer._id);
            const history = customerDetails?.priceHistory?.find(h => 
                h.product === product._id && h.sizeId === (size ? size._id : null)
            );
            if (history) {
                price = history.lastPrice;
                toast.info(`ใช้ราคาล่าสุดสำหรับลูกค้า: ${formatCurrency(price)}`);
            }
        }
        if (product.productType === 'weighted') {
            setModal({ name: 'weight', data: { product, size, price } });
            return;
        }
        dispatch(addToCart({ product, size }));
        if (product.linkedFreebies?.length > 0) {
            product.linkedFreebies.forEach(fb => {
                const freebieProduct = products.find(p => p._id === fb.product._id);
                if (freebieProduct) {
                    dispatch(addToCart({ product: freebieProduct, quantity: fb.quantity, isFreebie: true }));
                    toast.info(`เพิ่มของแถม: ${freebieProduct.name}`);
                }
            });
        }
    };

    // ... Other handlers
    
    return (
        <>
           <div className="bg-white/80 p-3 rounded-xl shadow-md mb-6 flex justify-between items-center">
                <div>
                    <span className="font-bold text-brand-purple">กะที่ #{currentShift.shiftNumber}</span>
                    <span className="text-sm text-gray-500 ml-4">พนักงาน: {user.name}</span>
                </div>
                <button onClick={() => setModal({name: 'closeShift'})} className="btn btn-danger btn-3d-pastel !py-2 !px-4 text-sm">
                    <FaLock className="mr-2"/> ปิดกะการขาย
                </button>
            </div>
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
                    <div className="flex-grow bg-white/80 p-4 rounded-2xl shadow-lg overflow-y-auto">
                        {productsLoading ? <Spinner /> : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {filteredProducts.map(product => (
                                    <div key={product._id} className="bg-white rounded-2xl p-3 flex flex-col items-center justify-between text-center border hover:shadow-xl hover:scale-105 transition-all duration-300">
                                        <p className="font-semibold text-brand-text text-sm mb-2 flex-grow">{product.name}</p>
                                        {!product.hasMultipleSizes ? (
                                             <button onClick={() => handleAddToCart(product)} className="btn btn-primary !py-1 !px-3 text-xs w-full">{formatCurrency(product.price)}</button>
                                        ) : (
                                            <div className="w-full space-y-1">
                                                {product.sizes.map(size => (
                                                    <button key={size._id} onClick={() => handleAddToCart(product, size)} className="btn bg-gray-200 text-gray-800 !py-1 !px-2 text-xs w-full text-left flex justify-between">
                                                        <span>{size.name}</span>
                                                        <span>{formatCurrency(size.price)}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="w-full md:w-2/5 bg-white/80 p-6 rounded-2xl shadow-lg flex flex-col">
                    <div className="flex items-center justify-between p-3 bg-blue-100 rounded-lg mb-4">
                        <div className="flex items-center gap-3"><FaUser className="text-blue-600"/><span className="font-semibold text-blue-800">{selectedCustomer?.name}</span></div>
                        <button onClick={() => setModal({name: 'customer'})} className="text-sm text-blue-600 hover:underline">เปลี่ยน</button>
                    </div>
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
                                    <div className="flex items-center gap-2">
                                        {/* Quantity Controls and Remove button */}
                                    </div>
                                </div>
                                {/* Unit Selector */}
                             </div>
                        ))}
                    </div>
                     <div className="border-t-2 pt-4 mt-4 space-y-2">
                        <div className="flex justify-between"><span>รวมเป็นเงิน</span><span>{formatCurrency(subTotal)}</span></div>
                        <div className="flex justify-between items-center text-red-600">
                            <button onClick={() => setModal({ name: 'discount' })} className="text-sm flex items-center hover:underline"><FaTag className="mr-2"/>ส่วนลดท้ายบิล</button>
                            <span>- {formatCurrency(discountAmount)}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-2xl"><span>ยอดรวมสุทธิ</span><span>{formatCurrency(cartTotal)}</span></div>
                        <button onClick={() => setModal({ name: 'payment' })} disabled={saleLoading || cart.length === 0} className="w-full bg-brand-purple text-white font-bold py-4 rounded-xl text-lg hover:bg-opacity-90 disabled:bg-gray-400">
                            ชำระเงิน
                        </button>
                    </div>
                </div>
            </div>
            
            {/* All Modals */}
        </>
    );
}

export default PosPage;