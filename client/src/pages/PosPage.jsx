// client/src/pages/PosPage.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaSearch, FaPlus, FaMinus, FaTrash, FaUser, FaShoppingCart, FaLock, FaTag, FaExclamationCircle, FaBarcode, FaCamera } from 'react-icons/fa';
import { getProducts } from '../features/product/productSlice';
import { getCustomers } from '../features/customer/customerSlice';
import { addToCart, updateCartItem, removeFromCart, createSale, selectCustomer, resetSale, applyDiscount } from '../features/sale/saleSlice';
import Spinner from '../components/Spinner'; // This seems to be a custom component
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
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => { 
        dispatch(getProducts());
        dispatch(getCustomers());
    }, [dispatch]);

    const categories = useMemo(() => ['All', ...new Set(products.map(p => p.category))], [products]);
    
    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
            const matchesSearch = !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [products, searchTerm, activeCategory]);

    // ... (All calculation memos: subTotal, discountAmount, cartTotal)
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
            if (modal.name === 'cameraScanner') setModal({ name: null });
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
        if (selectedCustomer?._id !== 'walk-in') {
            const customerDetails = customers.find(c => c._id === selectedCustomer._id);
            const history = customerDetails?.priceHistory?.find(h => h.product === product._id && h.sizeId === (size ? size._id : null));
            if (history) {
                price = history.lastPrice;
                toast.info(`ใช้ราคาล่าสุดสำหรับลูกค้า: ${formatCurrency(price)}`);
            }
        }
        if (product.productType === 'weighted') {
            setModal({ name: 'weight', data: { product, size, price } });
            return;
        }
        dispatch(addToCart({ product, size, priceAtSale: price }));
    };

    const handlePriceChange = (itemId, newPrice) => {
        const price = parseFloat(newPrice);
        dispatch(updateCartItem({ itemId, priceAtSale: !isNaN(price) ? price : 0 }));
    };

    const handleConfirmPayment = (paymentData) => {
        const saleData = {
            customerId: selectedCustomer._id,
            products: cart.map(item => ({
                productId: item.productId,
                sizeId: item.sizeId,
                quantity: item.quantity,
                priceAtSale: item.priceAtSale,
                costAtSale: item.costAtSale,
            })),
            subTotal,
            discountType: discount.type,
            discountValue: discount.value,
            discountAmount,
            totalAmount: cartTotal,
            paymentMethod: paymentData.method,
        };
        dispatch(createSale(saleData)).then(() => setModal({ name: null }));
    };

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
                                        <p className="text-xs text-gray-400 mb-2">คงเหลือ: {product.stock}</p>
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
                        {cart.length > 0 ? (
                            cart.map(item => (
                                 <div key={item.itemId} className="flex flex-col mb-3 border-b pb-3">
                                    <div className="flex items-center">
                                        <div className="flex-grow">
                                            <p className="font-semibold text-sm flex items-center">{item.name}</p>
                                            <div className="flex items-center">
                                                <input type="number" step="any" className="text-xs text-gray-500 bg-transparent w-20 p-0.5 rounded border border-transparent hover:border-gray-300 focus:border-brand-purple" value={item.priceAtSale} onChange={(e) => handlePriceChange(item.itemId, e.target.value)} />
                                            </div>
                                             <p className="text-xs text-gray-400">คงเหลือ: {item.stock}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => dispatch(updateCartItem({ itemId: item.itemId, quantity: item.quantity - 1 }))} disabled={item.quantity <= 1} className="btn !p-2 bg-gray-200 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center disabled:opacity-50"><FaMinus/></button>
                                            <span className="font-bold w-8 text-center">{item.quantity}</span>
                                            <button onClick={() => dispatch(updateCartItem({ itemId: item.itemId, quantity: item.quantity + 1 }))} className="btn !p-2 bg-gray-200 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center"><FaPlus/></button>
                                        </div>
                                        <button onClick={() => dispatch(removeFromCart(item.itemId))} className="ml-4 text-red-400 hover:text-red-600"><FaTrash/></button>
                                    </div>
                                 </div>
                            ))
                        ) : (
                             <div className="text-center text-gray-400 mt-10 h-full flex flex-col justify-center items-center"><FaShoppingCart className="text-5xl text-gray-300 mb-4"/><p>ตะกร้าสินค้าว่าง</p></div>
                        )}
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
            
            <SelectCustomerModal isOpen={modal.name === 'customer'} onClose={() => setModal({ name: null })} onSelectCustomer={(c) => dispatch(selectCustomer(c))} />
            <PaymentModal isOpen={modal.name === 'payment'} onClose={() => setModal({ name: null })} total={cartTotal} onConfirmPayment={handleConfirmPayment} />
            <CloseShiftModal isOpen={modal.name === 'closeShift'} onClose={() => setModal({ name: null })} shift={currentShift} />
            <DiscountModal isOpen={modal.name === 'discount'} onClose={() => setModal({ name: null })} onApplyDiscount={(d) => dispatch(applyDiscount(d))} />
            <WeightInputModal isOpen={modal.name === 'weight'} onClose={() => setModal({ name: null })} product={modal.data?.product} onConfirm={(weight) => { /* Logic to add weighted item */ }} />
            <CameraScannerModal isOpen={modal.name === 'cameraScanner'} onClose={() => setModal({ name: null })} onScan={findAndAddProduct} />
        </>
    );
}

export default PosPage;