// client/src/components/modals/BarcodeModal.jsx
import React, { useState, useMemo } from 'react';
import Modal from 'react-modal';
import { FaTimes, FaPrint, FaTrash, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const customModalStyles = {
    content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', borderRadius: '1.5rem', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '0', width: '90%', maxWidth: '900px', background: '#FDF7FF', maxHeight: '90vh' },
    overlay: { backgroundColor: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(4px)', zIndex: 50 }
};

Modal.setAppElement('#root');

function BarcodeModal({ isOpen, onClose }) {
    const { products } = useSelector((state) => state.products);
    const [printQueue, setPrintQueue] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [printSettings, setPrintSettings] = useState({
        size: '3x3',
        customWidth: 3,
        customHeight: 3,
        showName: true,
        showPrice: true,
        showSku: true,
    });

    // FIX: Ensure products is an array before filtering
    const filteredProducts = useMemo(() => {
        if (!searchTerm || !Array.isArray(products)) return [];
        return products.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
        ).slice(0, 5);
    }, [searchTerm, products]);


    const addProductToQueue = (product) => {
        if (printQueue.some(p => p._id === product._id)) {
            toast.info(`"${product.name}" อยู่ในรายการแล้ว`);
            return;
        }
        setPrintQueue([...printQueue, { ...product, count: 1 }]);
        setSearchTerm('');
    };

    const removeProductFromQueue = (productId) => {
        setPrintQueue(printQueue.filter(p => p._id !== productId));
    };

    const updateProductCount = (productId, count) => {
        const newCount = Math.max(1, parseInt(count, 10) || 1);
        setPrintQueue(printQueue.map(p => p._id === productId ? { ...p, count: newCount } : p));
    };

    const handleSettingChange = (e) => {
        const { name, type, checked, value } = e.target;
        setPrintSettings(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} style={customModalStyles}>
             <div className="bg-white/50 p-6 flex justify-between items-center rounded-t-2xl border-b">
                <h2 className="text-2xl font-bold text-gray-800">ตั้งค่าการพิมพ์บาร์โค้ด</h2>
                <button onClick={onClose}><FaTimes className="text-gray-400 hover:text-red-500 text-2xl"/></button>
            </div>

            <div className="flex flex-col md:flex-row h-[65vh]">
                {/* Left Panel: Settings */}
                <div className="w-full md:w-1/3 p-6 border-r flex flex-col gap-6">
                    <h3 className="font-semibold text-lg text-brand-purple">1. ตั้งค่ารูปแบบ</h3>
                     <div>
                        <label className="block text-sm font-medium mb-1">ขนาดสติกเกอร์</label>
                        <select name="size" value={printSettings.size} onChange={handleSettingChange} className="form-input">
                            <option value="3x3">3cm x 3cm</option>
                            <option value="5x3">5cm x 3cm</option>
                            <option value="a4">A4 (30 ดวง)</option>
                            <option value="custom">กำหนดเอง</option>
                        </select>
                    </div>

                    {printSettings.size === 'custom' && (
                        <div className="grid grid-cols-2 gap-2 p-3 bg-blue-50 rounded-lg animate-fade-in">
                            <div>
                                <label className="block text-xs font-medium mb-1">กว้าง (cm)</label>
                                <input type="number" name="customWidth" value={printSettings.customWidth} onChange={handleSettingChange} className="form-input !py-2" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1">สูง (cm)</label>
                                <input type="number" name="customHeight" value={printSettings.customHeight} onChange={handleSettingChange} className="form-input !py-2" />
                            </div>
                        </div>
                    )}

                    <div>
                         <label className="block text-sm font-medium mb-2">ข้อมูลที่จะแสดง</label>
                         <div className="space-y-2">
                            <label className="flex items-center"><input type="checkbox" name="showName" checked={printSettings.showName} onChange={handleSettingChange} className="form-checkbox" /> <span className="ml-2">ชื่อสินค้า</span></label>
                            <label className="flex items-center"><input type="checkbox" name="showPrice" checked={printSettings.showPrice} onChange={handleSettingChange} className="form-checkbox" /> <span className="ml-2">ราคา</span></label>
                            <label className="flex items-center"><input type="checkbox" name="showSku" checked={printSettings.showSku} onChange={handleSettingChange} className="form-checkbox" /> <span className="ml-2">รหัสสินค้า</span></label>
                         </div>
                    </div>
                </div>

                {/* Right Panel: Product List & Preview */}
                <div className="w-full md:w-2/3 p-6 flex flex-col">
                    <h3 className="font-semibold text-lg text-brand-purple mb-2">2. เลือกสินค้า</h3>
                    <div className="relative mb-4">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="ค้นหาด้วยชื่อ หรือ รหัสสินค้า..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="form-input pl-10"
                        />
                        {searchTerm && (
                            <div className="absolute w-full bg-white shadow-lg rounded-lg mt-1 z-10 max-h-48 overflow-y-auto">
                                {filteredProducts.length > 0 ? filteredProducts.map(p => (
                                    <div key={p._id} onClick={() => addProductToQueue(p)} className="p-3 hover:bg-brand-purple-light cursor-pointer">
                                        {p.name} ({p.sku})
                                    </div>
                                )) : <div className="p-3 text-gray-500">ไม่พบสินค้า</div>}
                            </div>
                        )}
                    </div>

                    <div className="flex-grow overflow-y-auto space-y-2 pr-2 border-t pt-4">
                         {printQueue.map((p) => (
                            <div key={p._id} className="bg-white p-2 rounded-lg flex items-center justify-between animate-fade-in">
                                <p className="font-medium text-sm flex-grow">{p.name}</p>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <label className="text-sm">จำนวน:</label>
                                    <input type="number" value={p.count} onChange={(e) => updateProductCount(p._id, e.target.value)} className="form-input w-20 !py-1" />
                                    <button onClick={() => removeProductFromQueue(p._id)} className="btn p-2 bg-red-100 text-red-600"><FaTrash /></button>
                                </div>
                            </div>
                         ))}
                         {printQueue.length === 0 && (
                            <div className="text-center text-gray-400 pt-10">ค้นหาและเลือกสินค้าที่ต้องการพิมพ์</div>
                         )}
                    </div>
                </div>
            </div>

             <div className="flex justify-end items-center mt-4 pt-4 border-t bg-white/50 rounded-b-2xl p-6">
                <button type="button" onClick={onClose} className="btn bg-gray-200 text-gray-700 hover:bg-gray-300 mr-4">ยกเลิก</button>
                <button type="submit" className="btn btn-3d-pastel btn-primary flex items-center" onClick={() => toast.info("ฟังก์ชันพิมพ์กำลังจะมาเร็วๆ นี้!")}><FaPrint className="mr-2" /> พิมพ์บาร์โค้ด</button>
            </div>
        </Modal>
    );
}

export default BarcodeModal;