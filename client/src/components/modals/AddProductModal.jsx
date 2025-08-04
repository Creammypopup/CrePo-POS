// client/src/components/modals/AddProductModal.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import { FaTimes, FaSave, FaPlus, FaTrash, FaPlusCircle } from 'react-icons/fa';
import { createProduct } from '../../features/product/productSlice';

const customModalStyles = {
  content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', borderRadius: '1.5rem', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '0', width: '90%', maxWidth: '800px', background: '#FDF7FF', maxHeight: '90vh' },
  overlay: { backgroundColor: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(4px)', zIndex: 50 }
};

Modal.setAppElement('#root');

const Switch = ({ label, isEnabled, onToggle }) => (
    <label className="flex items-center cursor-pointer">
        <div className="relative">
            <input type="checkbox" className="sr-only" checked={isEnabled} onChange={onToggle} />
            <div className={`block w-14 h-8 rounded-full transition-colors ${isEnabled ? 'bg-brand-purple' : 'bg-gray-300'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isEnabled ? 'transform translate-x-6' : ''}`}></div>
        </div>
        <div className="ml-3 text-gray-700 font-medium">{label}</div>
    </label>
);

const initialFormData = {
    name: '', sku: '', category: '', description: '',
    price: '', cost: '', stock: '', stockAlert: '', mainUnit: 'ชิ้น',
};

function AddProductModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialFormData);
  const [profit, setProfit] = useState(0);
  const [hasSubUnits, setHasSubUnits] = useState(false);
  const [isWeighted, setIsWeighted] = useState(false);
  const [hasGifts, setHasGifts] = useState(false);
  const [gifts, setGifts] = useState([]);

  useEffect(() => {
    if (isOpen) {
        setFormData(initialFormData);
        setProfit(0);
        setHasSubUnits(false);
        setIsWeighted(false);
        setHasGifts(false);
        setGifts([]);
    }
  }, [isOpen]);

  useEffect(() => {
      const price = parseFloat(formData.price) || 0;
      const cost = parseFloat(formData.cost) || 0;
      setProfit(price >= cost ? price - cost : 0);
  }, [formData.price, formData.cost]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleAddGift = () => setGifts([...gifts, { name: '', cost: 0, price: 0, quantity: 1, isFree: true }]);
  const handleGiftChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const newGifts = [...gifts];
    newGifts[index][name] = type === 'checkbox' ? checked : value;
    if (type === 'checkbox' && checked) newGifts[index].cost = 0;
    setGifts(newGifts);
  };
  const handleRemoveGift = (index) => setGifts(gifts.filter((_, i) => i !== index));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || formData.cost === '' || formData.price === '' || formData.stock === '' || !formData.mainUnit) {
        toast.error("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครบถ้วน");
        return;
    }
    if (parseFloat(formData.price) < parseFloat(formData.cost)) {
        toast.error("ราคาขายต้องไม่ต่ำกว่าราคาทุน");
        return;
    }
    dispatch(createProduct(formData))
        .unwrap()
        .then(() => {
            toast.success(`เพิ่มสินค้า "${formData.name}" สำเร็จ!`);
            onClose();
        })
        .catch((error) => toast.error(error.message || 'เกิดข้อผิดพลาดในการบันทึก'));
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={customModalStyles}>
      <div className="bg-white/50 p-6 flex justify-between items-center rounded-t-2xl border-b">
        <h2 className="text-2xl font-bold text-gray-800">เพิ่มสินค้าใหม่</h2>
        <button onClick={onClose}><FaTimes className="text-gray-400 hover:text-red-500 text-2xl"/></button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 p-6 max-h-[80vh] overflow-y-auto">
         <div className="bg-white p-5 border rounded-2xl shadow-sm">
            <h3 className="font-semibold text-lg mb-4 text-brand-purple">ข้อมูลพื้นฐาน</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">ชื่อสินค้า*</label>
                    <input type="text" name="name" value={formData.name} onChange={onChange} className="form-input" required />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">หมวดหมู่สินค้า*</label>
                    <div className="flex items-center gap-2">
                        <select name="category" value={formData.category} onChange={onChange} className="form-input" required>
                            <option value="" disabled>-- เลือกหมวดหมู่ --</option>
                            <option value="ปูนและวัสดุก่อ">ปูนและวัสดุก่อ</option>
                            <option value="เครื่องมือช่าง">เครื่องมือช่าง</option>
                            <option value="สีและเคมีภัณฑ์">สีและเคมีภัณฑ์</option>
                        </select>
                        <button type="button" onClick={() => toast.info("Coming soon!")} className="btn p-2.5 bg-blue-100 text-blue-700 hover:bg-blue-200"><FaPlusCircle/></button>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">รหัสสินค้า (SKU)</label>
                    <input type="text" name="sku" value={formData.sku} onChange={onChange} className="form-input" placeholder="เว้นว่างเพื่อให้ระบบสร้างอัตโนมัติ" />
                </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">รายละเอียดสินค้า</label>
                    <input type="text" name="description" value={formData.description} onChange={onChange} className="form-input" />
                </div>
            </div>
        </div>
        <div className="bg-white p-5 border rounded-2xl shadow-sm">
            <h3 className="font-semibold text-lg mb-4 text-green-600">ราคาและต้นทุน</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                 <div>
                    <label className="block text-sm font-medium mb-1">ราคาทุน*</label>
                    <input type="number" step="any" name="cost" value={formData.cost} onChange={onChange} className="form-input" required min="0" />
                </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">ราคาขาย*</label>
                    <input type="number" step="any" name="price" value={formData.price} onChange={onChange} className="form-input" required min={formData.cost || 0} />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">กำไร (บาท)</label>
                    <input type="text" name="profit" value={profit.toLocaleString('th-TH')} className="form-input bg-gray-100" readOnly />
                </div>
            </div>
        </div>
        <div className="bg-white p-5 border rounded-2xl shadow-sm">
             <h3 className="font-semibold text-lg mb-4 text-blue-600">คลังสินค้า</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">จำนวนตั้งต้น*</label>
                    <input type="number" name="stock" value={formData.stock} onChange={onChange} className="form-input" required />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">หน่วยนับหลัก*</label>
                    <input type="text" name="mainUnit" value={formData.mainUnit} onChange={onChange} className="form-input" required />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">แจ้งเตือนเมื่อต่ำกว่า</label>
                    <input type="number" name="stockAlert" value={formData.stockAlert} onChange={onChange} className="form-input" placeholder="0" />
                </div>
            </div>
        </div>
         <div className="bg-white p-5 border rounded-2xl shadow-sm">
            <h3 className="font-semibold text-lg mb-4 text-orange-600">ฟังก์ชันเพิ่มเติม</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Switch label="สินค้ามีหลายหน่วย" isEnabled={hasSubUnits} onToggle={() => setHasSubUnits(!hasSubUnits)} />
                <Switch label="สินค้าชั่งน้ำหนัก" isEnabled={isWeighted} onToggle={() => setIsWeighted(!isWeighted)} />
                <Switch label="สินค้ามีของแถม" isEnabled={hasGifts} onToggle={() => setHasGifts(!hasGifts)} />
            </div>
        </div>
         {hasGifts && (
             <div className="bg-white p-5 border rounded-2xl shadow-sm animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-lg text-pink-600">จัดการของแถม</h3>
                    <button type="button" onClick={handleAddGift} className="btn btn-3d-pastel bg-pink-200 text-pink-800 text-xs py-1 px-3">
                        <FaPlus className="mr-2" />เพิ่มของแถม
                    </button>
                </div>
                <div className="space-y-3">
                    {gifts.map((gift, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg grid grid-cols-12 gap-3 items-center">
                            <div className="col-span-12 md:col-span-4">
                                <label className="text-xs">ชื่อของแถม</label>
                                <input type="text" name="name" value={gift.name} onChange={(e) => handleGiftChange(index, e)} className="form-input !py-1.5" />
                            </div>
                            <div className="col-span-6 md:col-span-2">
                                <label className="text-xs">ต้นทุน</label>
                                <input type="number" step="any" name="cost" value={gift.cost} onChange={(e) => handleGiftChange(index, e)} className="form-input !py-1.5" disabled={gift.isFree} />
                            </div>
                             <div className="col-span-6 md:col-span-2">
                                <label className="text-xs">ราคาขาย (ถ้ามี)</label>
                                <input type="number" step="any" name="price" value={gift.price} onChange={(e) => handleGiftChange(index, e)} className="form-input !py-1.5" />
                            </div>
                            <div className="col-span-6 md:col-span-1">
                                <label className="text-xs">จำนวน</label>
                                <input type="number" name="quantity" value={gift.quantity} onChange={(e) => handleGiftChange(index, e)} className="form-input !py-1.5" />
                            </div>
                            <div className="col-span-6 md:col-span-2 flex items-end h-full">
                                <label className="flex items-center"><input type="checkbox" name="isFree" checked={gift.isFree} onChange={(e) => handleGiftChange(index, e)} className="form-checkbox" /> <span className="ml-1 text-xs">ได้มาฟรี</span></label>
                            </div>
                            <div className="col-span-12 md:col-span-1 flex justify-end items-end h-full">
                                 <button type="button" onClick={() => handleRemoveGift(index)} className="btn p-2 bg-red-100 text-red-600"><FaTrash /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
         )}
        <div className="flex justify-end items-center mt-8 pt-6 border-t bg-white/50 rounded-b-2xl p-6">
          <button type="button" onClick={onClose} className="btn bg-gray-200 text-gray-700 hover:bg-gray-300 mr-4">ยกเลิก</button>
          <button type="submit" className="btn btn-3d-pastel btn-primary flex items-center"><FaSave className="mr-2" /> บันทึกสินค้า</button>
        </div>
      </form>
    </Modal>
  );
}
export default AddProductModal;