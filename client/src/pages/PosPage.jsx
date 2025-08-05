// client/src/pages/PosPage.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaSearch, FaPlus, FaMinus, FaTrash, FaTimesCircle } from 'react-icons/fa';
import { getProducts, reset as resetProducts } from '../features/product/productSlice';
import { addToCart, incrementQuantity, decrementQuantity, removeFromCart, clearCart, createSale } from '../features/sale/saleSlice';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';

function PosPage() {
    const dispatch = useDispatch();
    const { products, isLoading: productsLoading } = useSelector((state) => state.products);
    const { cart, isLoading: saleLoading } = useSelector((state) => state.sale);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(getProducts());
        return () => {
            dispatch(resetProducts());
        }
    }, [dispatch]);

    const filteredProducts = useMemo(() => {
        if (!Array.isArray(products)) return [];
        if (!searchTerm) return products;
        return products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [products, searchTerm]);
    
    const cartTotal = useMemo(() => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    }, [cart]);

    const handleCheckout = () => {
        if (cart.length === 0) {
            toast.error('กรุณาเพิ่มสินค้าลงในตะกร้า');
            return;
        }
        const saleData = {
            products: cart.map(item => ({ productId: item._id, quantity: item.quantity })),
            // customerId can be added here later
        };
        dispatch(createSale(saleData))
            .unwrap()
            .then(() => {
                toast.success('บันทึกการขายสำเร็จ!');
                dispatch(getProducts()); // Refresh product stock
            })
            .catch((err) => toast.error(err));
    }


    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-8rem)] gap-6">
            {/* Product Selection Area */}
            <div className="w-full md:w-3/5 flex flex-col">
                <div className="mb-4 relative">
                    <input 
                        type="text"
                        placeholder="ค้นหาสินค้า..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-input w-full pl-10"
                    />
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <div className="flex-grow bg-white/80 p-4 rounded-2xl shadow-lg overflow-y-auto">
                    {productsLoading ? <Spinner /> : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredProducts.map(product => (
                                <div key={product._id} onClick={() => dispatch(addToCart(product))} className="bg-white rounded-2xl p-3 flex flex-col items-center justify-between text-center cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 border">
                                    <p className="font-semibold text-brand-text text-sm mb-2">{product.name}</p>
                                    <p className="text-xs text-brand-purple font-bold">฿{product.price.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Cart & Checkout Area */}
            <div className="w-full md:w-2/5 bg-white/80 p-6 rounded-2xl shadow-lg flex flex-col">
                <div className="flex justify-between items-center border-b-2 pb-4 mb-4">
                    <h2 className="text-2xl font-bold text-brand-text">รายการสั่งซื้อ</h2>
                    <button onClick={() => dispatch(clearCart())} className="flex items-center text-sm text-red-500 hover:text-red-700">
                        <FaTimesCircle className="mr-1"/>ล้างตะกร้า
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto pr-2">
                    {cart.length > 0 ? (
                        cart.map(item => (
                            <div key={item._id} className="flex items-center mb-3">
                                <div className="flex-grow">
                                    <p className="font-semibold text-sm">{item.name}</p>
                                    <p className="text-xs text-gray-500">฿{item.price.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => dispatch(decrementQuantity(item._id))} className="btn !p-2 bg-gray-200 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center"><FaMinus/></button>
                                    <span className="font-bold w-8 text-center">{item.quantity}</span>
                                    <button onClick={() => dispatch(incrementQuantity(item._id))} className="btn !p-2 bg-gray-200 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center"><FaPlus/></button>
                                </div>
                                <button onClick={() => dispatch(removeFromCart(item._id))} className="ml-4 text-red-400 hover:text-red-600"><FaTrash/></button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-400 mt-10">
                            <p>ยังไม่มีสินค้าในตะกร้า</p>
                        </div>
                    )}
                </div>
                <div className="border-t-2 pt-4 mt-4 space-y-4">
                    <div className="flex justify-between font-semibold text-lg">
                        <span>ยอดรวม</span>
                        <span>{cartTotal.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}</span>
                    </div>
                    <button onClick={handleCheckout} disabled={saleLoading} className="w-full bg-brand-purple text-white font-bold py-4 rounded-xl text-lg hover:bg-opacity-90 transition-all disabled:bg-gray-400">
                        {saleLoading ? 'กำลังบันทึก...' : 'ชำระเงิน'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PosPage;