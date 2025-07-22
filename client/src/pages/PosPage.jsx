import React, { useState } from 'react';
import { FaSearch, FaPlus, FaMinus, FaTrash } from 'react-icons/fa';

// Mock data for products
const mockProducts = [
  { id: 1, name: 'ลาเต้ร้อน', price: 55, image: 'https://placehold.co/150x150/E9D5FF/585076?text=Latte' },
  { id: 2, name: 'อเมริกาโน่เย็น', price: 60, image: 'https://placehold.co/150x150/FBCFE8/585076?text=Americano' },
  { id: 3, name: 'ครัวซองต์', price: 75, image: 'https://placehold.co/150x150/BFDBFE/585076?text=Croissant' },
  { id: 4, name: 'เค้กช็อกโกแลต', price: 85, image: 'https://placehold.co/150x150/FED7AA/585076?text=Cake' },
  { id: 5, name: 'ชาเขียวมัทฉะ', price: 65, image: 'https://placehold.co/150x150/A7F3D0/585076?text=Matcha' },
];

function PosPage() {
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const addToCart = (product) => {
        // ... (logic to add to cart will be here)
    };

    const filteredProducts = mockProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-[calc(100vh-8rem)] gap-6">
            {/* Product Selection Area */}
            <div className="w-3/5 flex flex-col">
                <div className="mb-4 relative">
                    <input 
                        type="text"
                        placeholder="ค้นหาสินค้า..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-candy-content-bg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-candy-purple transition-colors"
                    />
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <div className="flex-grow bg-candy-content-bg p-4 rounded-2xl shadow-lg shadow-purple-100 overflow-y-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredProducts.map(product => (
                            <div key={product.id} onClick={() => addToCart(product)} className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300">
                                <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded-xl mb-2" />
                                <p className="font-semibold text-candy-text-primary">{product.name}</p>
                                <p className="text-sm text-candy-text-secondary">฿{product.price.toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Cart & Checkout Area */}
            <div className="w-2/5 bg-candy-content-bg p-6 rounded-2xl shadow-lg shadow-purple-100 flex flex-col">
                <h2 className="text-2xl font-bold text-candy-text-primary border-b-2 border-candy-bg pb-4 mb-4">รายการสั่งซื้อ</h2>
                <div className="flex-grow overflow-y-auto">
                    {/* Cart items will be rendered here */}
                    <div className="text-center text-gray-400 mt-10">
                        <p>ยังไม่มีสินค้าในตะกร้า</p>
                    </div>
                </div>
                <div className="border-t-2 border-candy-bg pt-4 mt-4 space-y-2">
                    <div className="flex justify-between font-semibold">
                        <span>ยอดรวม</span>
                        <span>฿0.00</span>
                    </div>
                    <button className="w-full bg-candy-purple-action text-white font-bold py-4 rounded-xl text-lg hover:brightness-110 transition-all">
                        ชำระเงิน
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PosPage;
