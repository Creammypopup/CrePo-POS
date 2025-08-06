// client/src/components/modals/EditProductModal.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import { FaTimes, FaSave, FaPlus, FaTrash } from 'react-icons/fa';
import { updateProduct } from '../../features/product/productSlice';
import { getProductCategories } from '../../features/productCategory/productCategorySlice';
import ProductCategoryModal from './ProductCategoryModal';

const customModalStyles = {
  content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', borderRadius: '1.5rem', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '0', width: '90%', maxWidth: '800px', background: '#FDF7FF', maxHeight: '90vh', display: 'flex', flexDirection: 'column' },
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

function EditProductModal({ isOpen, onClose, product }) {
  const dispatch = useDispatch();
  const { categories: productCategories } = useSelector((state) => state.productCategories);
  const [formData, setFormData] = useState({});
  const [profit, setProfit] = useState(0);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  useEffect(() => {
    if (product && isOpen) {
        setFormData({
            ...product,
            sizes: product.sizes || [],
            sellingUnits: product.sellingUnits || [],
        });
        dispatch(getProductCategories());
    }
  }, [product, isOpen, dispatch]);

  useEffect(() => {
      if (formData.price !== undefined && formData.cost !== undefined) {
          const price = parseFloat(formData.price) || 0;
          const cost = parseFloat(formData.cost) || 0;
          setProfit(price >= cost ? price - cost : 0);
      }
  }, [formData.price, formData.cost]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  // --- START OF EDIT: Bug Fix for updating sizes ---
  const handleDynamicChange = (listName, index, e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => {
        const newList = [...prevFormData[listName]];
        newList[index] = { ...newList[index], [name]: value };
        return { ...prevFormData, [listName]: newList };
    });
  };
  // --- END OF EDIT ---
  
  const addDynamicItem = (listName, newItem) => {
    setFormData(p => ({ ...p, [listName]: [...(p[listName] || []), newItem] }));
  };

  const removeDynamicItem = (listName, index) => {
    setFormData(p => ({ ...p, [listName]: p[listName].filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProduct(formData))
        .unwrap()
        .then(() => {
            toast.success(`อัปเดตสินค้า "${formData.name}" สำเร็จ!`);
            onClose();
        })
        .catch((error) => toast.error(error.message || 'เกิดข้อผิดพลาด'));
  };

  if (!product) return null;

  return (
    <>
    <Modal isOpen={isOpen} onRequestClose={onClose} style={customModalStyles}>
        <div className="bg-white/50 p-6 flex justify-between items-center rounded-t-2xl border-b flex-shrink-0">
            <h2 className="text-2xl font-bold text-gray-800">แก้ไขสินค้า</h2>
            <button onClick={onClose}><FaTimes className="text-gray-400 hover:text-red-500 text-2xl"/></button>
        </div>
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto">
            <div className="p-6 space-y-6">
                <div className="bg-white p-5 border rounded-2xl shadow-sm">
                    <h3 className="font-semibold text-lg mb-4 text-brand-purple">ข้อมูลพื้นฐาน</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="name" placeholder="ชื่อสินค้า*" value={formData.name || ''} onChange={onChange} className="form-input md:col-span-2" required />
                        <div className="flex items-center gap-2">
                            <select name="category" value={formData.category || ''} onChange={onChange} className="form-input" required>
                                <option value="" disabled>-- เลือกหมวดหมู่* --</option>
                                {productCategories.map(cat => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
                            </select>
                            <button type="button" onClick={() => setIsCategoryModalOpen(true)} className="btn p-2.5 bg-blue-100 text-blue-700 hover:bg-blue-200"><FaPlus/></button>
                        </div>
                        <input type="text" name="sku" value={formData.sku || ''} onChange={onChange} className="form-input" placeholder="รหัสสินค้า (SKU)" />
                        <input type="text" name="description" value={formData.description || ''} onChange={onChange} className="form-input md:col-span-2" placeholder="รายละเอียดสินค้า" />
                    </div>
                </div>
                
                <div className="bg-white p-5 border rounded-2xl shadow-sm">
                    <h3 className="font-semibold text-lg mb-4 text-orange-600">ฟังก์ชันเพิ่มเติม</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Switch label="สินค้าหลายขนาด" isEnabled={formData.hasMultipleSizes} onToggle={() => setFormData(p => ({...p, hasMultipleSizes: !p.hasMultipleSizes, price: '', cost: ''}))} />
                        <Switch label="สินค้ามีหลายหน่วย" isEnabled={formData.hasSubUnits} onToggle={() => setFormData(p => ({...p, hasSubUnits: !p.hasSubUnits}))} />
                        <Switch label="สินค้าชั่งน้ำหนัก" isEnabled={formData.productType === 'weighted'} onToggle={() => setFormData(p => ({...p, productType: p.productType === 'weighted' ? 'standard' : 'weighted'}))} />
                    </div>
                </div>

                <div className="bg-white p-5 border rounded-2xl shadow-sm">
                    <h3 className="font-semibold text-lg mb-4 text-green-600">ราคาและต้นทุน (พื้นฐาน)</h3>
                    {formData.hasMultipleSizes && <p className="text-xs text-amber-600 -mt-3 mb-3 p-2 bg-amber-100 rounded-lg">เมื่อเปิดใช้งาน "สินค้าหลายขนาด" ราคาและต้นทุนหลักจะถูกใช้เป็นค่าเริ่มต้นเท่านั้น กรุณากำหนดราคาของแต่ละขนาดในส่วน "จัดการขนาดสินค้า"</p>}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                        <input type="number" step="any" name="cost" value={formData.cost ?? ''} onChange={onChange} className="form-input" placeholder="ราคาทุน" required={!formData.hasMultipleSizes} min="0" disabled={formData.hasMultipleSizes} />
                        <input type="number" step="any" name="price" value={formData.price ?? ''} onChange={onChange} className="form-input" placeholder="ราคาขาย" required={!formData.hasMultipleSizes} min={formData.cost || 0} disabled={formData.hasMultipleSizes} />
                        <div>
                            <label className="block text-sm font-medium mb-1 text-center">กำไร (บาท)</label>
                            <input type="text" value={profit.toLocaleString('th-TH')} className="form-input bg-gray-100 text-center" readOnly />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 border rounded-2xl shadow-sm">
                    <h3 className="font-semibold text-lg mb-4 text-blue-600">คลังสินค้า</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <input type="number" name="stock" value={formData.stock ?? ''} onChange={onChange} className="form-input" placeholder="จำนวนตั้งต้น" disabled={formData.hasMultipleSizes}/>
                        <input type="text" name="mainUnit" value={formData.mainUnit || ''} onChange={onChange} className="form-input" placeholder="หน่วยนับหลัก*" required />
                        <input type="number" name="stockAlert" value={formData.stockAlert ?? ''} onChange={onChange} className="form-input" placeholder="แจ้งเตือนเมื่อต่ำกว่า" />
                    </div>
                </div>
                
                {formData.hasMultipleSizes && (
                     <div className="bg-white p-5 border rounded-2xl shadow-sm animate-fade-in">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-lg text-indigo-600">จัดการขนาดสินค้า</h3>
                            <button type="button" onClick={() => addDynamicItem('sizes', { name: '', sku: '', cost: '', price: '', stock: '' })} className="btn btn-3d-pastel bg-indigo-200 text-indigo-800 text-xs py-1 px-3"><FaPlus className="mr-2"/>เพิ่มขนาด</button>
                        </div>
                        <div className="space-y-2">
                             <div className="grid grid-cols-12 gap-2 px-2 text-xs font-semibold text-gray-500">
                                <div className="col-span-3">ชื่อขนาด*</div>
                                <div className="col-span-2">รหัส SKU</div>
                                <div className="col-span-2">ต้นทุน</div>
                                <div className="col-span-2">ราคาขาย*</div>
                                <div className="col-span-2">สต็อก</div>
                            </div>
                            {formData.sizes && formData.sizes.map((size, index) => (
                                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                                <input type="text" name="name" value={size.name} onChange={e => handleDynamicChange('sizes', index, e)} placeholder="เช่น S, M" className="form-input !py-1.5 col-span-3" required/>
                                <input type="text" name="sku" value={size.sku} onChange={e => handleDynamicChange('sizes', index, e)} placeholder="รหัสสินค้า" className="form-input !py-1.5 col-span-2"/>
                                <input type="number" step="any" name="cost" value={size.cost} onChange={e => handleDynamicChange('sizes', index, e)} placeholder="0.00" className="form-input !py-1.5 col-span-2"/>
                                <input type="number" step="any" name="price" value={size.price} onChange={e => handleDynamicChange('sizes', index, e)} placeholder="0.00" className="form-input !py-1.5 col-span-2" required/>
                                <input type="number" name="stock" value={size.stock} onChange={e => handleDynamicChange('sizes', index, e)} placeholder="0" className="form-input !py-1.5 col-span-2" />
                                <button type="button" onClick={() => removeDynamicItem('sizes', index)} className="btn p-2 bg-red-100 text-red-600 col-span-1"><FaTrash/></button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="flex justify-end items-center mt-auto pt-4 border-t bg-white/50 rounded-b-2xl p-6 flex-shrink-0">
                <button type="button" onClick={onClose} className="btn bg-gray-200 text-gray-700 hover:bg-gray-300 mr-4">ยกเลิก</button>
                <button type="submit" className="btn btn-3d-pastel btn-primary flex items-center"><FaSave className="mr-2" /> บันทึกการเปลี่ยนแปลง</button>
            </div>
        </form>
    </Modal>
    <ProductCategoryModal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} />
    </>
  );
}

export default EditProductModal;