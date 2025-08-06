// client/src/pages/PosPage.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaSearch, FaPlus, FaMinus, FaTrash, FaUser, FaShoppingCart, FaPauseCircle, FaPlayCircle, FaLock } from 'react-icons/fa';
import { getProducts, reset as resetProducts } from '../features/product/productSlice';
import { addToCart, incrementQuantity, decrementQuantity, removeFromCart, createSale, selectCustomer, resetSale, holdBill, recallBill } from '../features/sale/saleSlice';
import Spinner from '../components/Spinner';
import SelectCustomerModal from '../components/modals/SelectCustomerModal';
import PaymentModal from '../components/modals/PaymentModal';
import CloseShiftModal from '../components/modals/CloseShiftModal';
import { toast } from 'react-toastify';
import { formatCurrency } from '../utils/formatUtils';
import moment from 'moment';

function PosPage({ currentShift }) {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { products, isLoading: productsLoading } = useSelector((state) => state.products);
    const { cart, selectedCustomer, heldBills, isLoading: saleLoading } = useSelector((state) => state.sale);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isCloseShiftModalOpen, setIsCloseShiftModalOpen] = useState(false);

    const [isDelivery, setIsDelivery] = useState(false);
    const [deliveryInfo, setDeliveryInfo] = useState({
        deliveryFee: 0, recipientName: '', recipientPhone: '', deliveryAddress: '',
    });

    useEffect(() => {
        dispatch(getProducts());
        return () => { dispatch(resetProducts()); }
    }, [dispatch]);
    
    useEffect(() => {
        if (selectedCustomer && selectedCustomer._id !== 'walk-in') {
            setDeliveryInfo(prev => ({
                ...prev,
                recipientName: selectedCustomer.name,
                recipientPhone: selectedCustomer.phone || '',
                deliveryAddress: selectedCustomer.address || ''
            }));
        }
    }, [selectedCustomer]);

    const filteredProducts = useMemo(() => {
        if (!Array.isArray(products)) return [];
        if (!searchTerm) return products;
        return products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [products, searchTerm]);
    
    const cartSubtotal = useMemo(() => cart.reduce((total, item) => total + item.price * item.quantity, 0), [cart]);
    const cartTotal = useMemo(() => cartSubtotal + (isDelivery ? Number(deliveryInfo.deliveryFee) || 0 : 0), [cartSubtotal, isDelivery, deliveryInfo.deliveryFee]);

    const handleSelectCustomer = (customer) => dispatch(selectCustomer(customer));

    const handleConfirmPayment = (paymentData) => {
        const saleData = {
            products: cart.map(item => ({ productId: item._id, quantity: item.quantity, priceAtSale: item.price })),
            customerId: selectedCustomer?._id === 'walk-in' ? null : selectedCustomer._id,
            totalAmount: cartTotal,
            paymentMethod: paymentData.paymentMethod,
            isDelivery,
            ...deliveryInfo,
            shiftId: currentShift._id, // Attach shiftId to the sale
        };
        dispatch(createSale(saleData))
            .unwrap()
            .then(() => {
                toast.success('บันทึกการขายสำเร็จ!');
                setIsPaymentModalOpen(false);
                dispatch(resetSale());
                setIsDelivery(false);
                setDeliveryInfo({ deliveryFee: 0, recipientName: '', recipientPhone: '', deliveryAddress: '' });
            })
            .catch((err) => toast.error(err));
    }
    
    const handleHoldBill = () => {
        if (cart.length > 0) {
            dispatch(holdBill());
            toast.info('พักบิลปัจจุบันเรียบร้อย');
        } else {
            toast.error('ไม่มีสินค้าในตะกร้าสำหรับพักบิล');
        }
    }

    const handleDeliveryInfoChange = (e) => {
        const { name, value } = e.target;
        setDeliveryInfo(prev => ({ ...prev, [name]: value }));
    }

    return (
        <>
            <div className="bg-white/80 p-3 rounded-xl shadow-md mb-6 flex justify-between items-center non-printable">
                <div>
                    <span className="font-bold text-brand-purple">กะที่ #{currentShift.shiftNumber}</span>
                    <span className="text-sm text-gray-500 ml-4">พนักงาน: {user.name}</span>
                </div>
                <button onClick={() => setIsCloseShiftModalOpen(true)} className="btn btn-danger btn-3d-pastel !py-2 !px-4 text-sm">
                    <FaLock className="mr-2"/> ปิดกะการขาย
                </button>
            </div>

            <div className="flex flex-col md:flex-row h-[calc(100vh-14rem)] gap-6">
                <div className="w-full md:w-3/5 flex flex-col">
                     <div className="mb-4 relative">
                        <input type="text" placeholder="ค้นหาสินค้า..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="form-input w-full pl-10"/>
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                    <div className="flex-grow bg-white/80 p-4 rounded-2xl shadow-lg overflow-y-auto">
                        {productsLoading ? <Spinner /> : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {filteredProducts.map(product => (
                                    <div key={product._id} onClick={() => dispatch(addToCart(product))} className="bg-white rounded-2xl p-3 flex flex-col items-center justify-between text-center cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 border">
                                        <p className="font-semibold text-brand-text text-sm mb-2">{product.name}</p>
                                        <p className="text-xs text-brand-purple font-bold">{formatCurrency(product.price)}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="w-full md:w-2/5 bg-white/80 p-6 rounded-2xl shadow-lg flex flex-col">
                    <div className="flex items-center justify-between p-3 bg-blue-100 rounded-lg mb-4">
                        <div className="flex items-center gap-3">
                            <FaUser className="text-blue-600"/>
                            <span className="font-semibold text-blue-800">{selectedCustomer?.name || 'ลูกค้าทั่วไป'}</span>
                        </div>
                        <button onClick={() => setIsCustomerModalOpen(true)} className="text-sm text-blue-600 hover:underline">เปลี่ยน</button>
                    </div>

                    <div className="flex-grow overflow-y-auto pr-2 border-t pt-4">
                        {cart.length > 0 ? (
                            cart.map(item => (
                                <div key={item._id} className="flex items-center mb-3">
                                    <div className="flex-grow"><p className="font-semibold text-sm">{item.name}</p><p className="text-xs text-gray-500">{formatCurrency(item.price)}</p></div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => dispatch(decrementQuantity(item._id))} className="btn !p-2 bg-gray-200 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center"><FaMinus/></button>
                                        <span className="font-bold w-8 text-center">{item.quantity}</span>
                                        <button onClick={() => dispatch(incrementQuantity(item._id))} className="btn !p-2 bg-gray-200 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center"><FaPlus/></button>
                                    </div>
                                    <button onClick={() => dispatch(removeFromCart(item._id))} className="ml-4 text-red-400 hover:text-red-600"><FaTrash/></button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-400 mt-10 h-full flex flex-col justify-center items-center"><FaShoppingCart className="text-5xl text-gray-300 mb-4"/><p>ตะกร้าสินค้าว่าง</p></div>
                        )}
                    </div>
                    
                    <div className="border-t-2 pt-4 mt-2">
                        <label className="flex items-center cursor-pointer"><input type="checkbox" checked={isDelivery} onChange={(e) => setIsDelivery(e.target.checked)} className="form-checkbox" /> <span className="ml-2">จัดส่งสินค้า</span></label>
                        {isDelivery && (
                            <div className="mt-2 space-y-2 p-3 bg-gray-50 rounded-lg animate-fade-in">
                                <input type="number" name="deliveryFee" value={deliveryInfo.deliveryFee} onChange={handleDeliveryInfoChange} placeholder="ค่าจัดส่ง" className="form-input !py-2 text-sm" />
                                <input type="text" name="recipientName" value={deliveryInfo.recipientName} onChange={handleDeliveryInfoChange} placeholder="ชื่อผู้รับ" className="form-input !py-2 text-sm" />
                                <input type="text" name="recipientPhone" value={deliveryInfo.recipientPhone} onChange={handleDeliveryInfoChange} placeholder="เบอร์โทรผู้รับ" className="form-input !py-2 text-sm" />
                                <textarea name="deliveryAddress" value={deliveryInfo.deliveryAddress} onChange={handleDeliveryInfoChange} placeholder="ที่อยู่จัดส่ง" className="form-input !py-2 text-sm" rows="2"></textarea>
                            </div>
                        )}
                    </div>

                    <div className="border-t-2 pt-4 mt-4 space-y-2">
                        <div className="flex justify-between font-semibold text-lg"><span>ยอดรวม</span><span>{formatCurrency(cartTotal)}</span></div>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={handleHoldBill} className="w-full btn bg-amber-200 text-amber-800 font-bold py-3 rounded-xl text-base hover:bg-amber-300"><FaPauseCircle className="mr-2"/>พักบิล</button>
                             <button onClick={() => { if(heldBills.length > 0) dispatch(recallBill(0)); else toast.info("ไม่มีบิลที่พักไว้"); }} className="w-full btn bg-sky-200 text-sky-800 font-bold py-3 rounded-xl text-base hover:bg-sky-300 relative">
                                <FaPlayCircle className="mr-2"/>เรียกบิล
                                {heldBills.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{heldBills.length}</span>}
                            </button>
                        </div>
                        <button onClick={() => setIsPaymentModalOpen(true)} disabled={saleLoading || cart.length === 0} className="w-full bg-brand-purple text-white font-bold py-4 rounded-xl text-lg hover:bg-opacity-90 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed">ชำระเงิน</button>
                    </div>
                </div>
            </div>
            <SelectCustomerModal isOpen={isCustomerModalOpen} onSelectCustomer={handleSelectCustomer} onClose={() => setIsCustomerModalOpen(false)} />
            <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} total={cartTotal} onConfirmPayment={handleConfirmPayment} />
            <CloseShiftModal isOpen={isCloseShiftModalOpen} onClose={() => setIsCloseShiftModalOpen(false)} shift={currentShift} />
        </>
    );
}

export default PosPage;