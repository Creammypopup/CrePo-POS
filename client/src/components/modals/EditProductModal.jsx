// client/src/components/modals/EditProductModal.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import { FaTimes, FaSave, FaPlusCircle } from 'react-icons/fa';
import { updateProduct } from '../../features/product/productSlice';

const customModalStyles = {
  content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', borderRadius: '1.5rem', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '0', width: '90%', maxWidth: '800px', background: '#FDF7FF', maxHeight: '90vh' },
  overlay: { backgroundColor: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(4px)', zIndex: 50 }
};

Modal.setAppElement('#root');

function EditProductModal({ isOpen, onClose, product }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const [profit, setProfit] = useState(0);

  useEffect(() => {
    if (product) {
        setFormData({ ...product });
    }
  }, [product, isOpen]);

  useEffect(() => {
      if (formData.price !== undefined && formData.cost !== undefined) {
          const price = parseFloat(formData.price) || 0;
          const cost = parseFloat(formData.cost) || 0;
          setProfit(price >= cost ? price - cost : 0);
      }
  }, [formData.price, formData.cost]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
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
    <Modal isOpen={isOpen} onRequestClose={onClose} style={customModalStyles}>
        <div className="bg-white/50 p-6 flex justify-between items-center rounded-t-2xl border-b">
            <h2 className="text-2xl font-bold text-gray-800">แก้ไขสินค้า</h2>
            <button onClick={onClose}><FaTimes className="text-gray-400 hover:text-red-500 text-2xl"/></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 p-6 max-h-[80vh] overflow-y-auto">
             <div className="bg-white p-5 border rounded-2xl shadow-sm">
                <h3 className="font-semibold text-lg mb-4 text-brand-purple">ข้อมูลพื้นฐาน</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">ชื่อสินค้า*</label>
                        <input type="text" name="name" value={formData.name || ''} onChange={onChange} className="form-input" required />
                    </div>
                    <div>
                    <label className="block text-sm font-medium mb-1">หมวดหมู่สินค้า*</label>
                        <div className="flex items-center gap-2">
                            <select name="category" value={formData.category || ''} onChange={onChange} className="form-input" required>
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
                        <input type="text" name="sku" value={formData.sku || ''} onChange={onChange} className="form-input" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium mb-1">รายละเอียดสินค้า</label>
                        <input type="text" name="description" value={formData.description || ''} onChange={onChange} className="form-input" />
                    </div>
                </div>
            </div>
             <div className="bg-white p-5 border rounded-2xl shadow-sm">
                <h3 className="font-semibold text-lg mb-4 text-green-600">ราคาและต้นทุน</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                     <div>
                        <label className="block text-sm font-medium mb-1">ราคาทุน*</label>
                        <input type="number" step="any" name="cost" value={formData.cost === undefined ? '' : formData.cost} onChange={onChange} className="form-input" required min="0" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium mb-1">ราคาขาย*</label>
                        <input type="number" step="any" name="price" value={formData.price === undefined ? '' : formData.price} onChange={onChange} className="form-input" required min={formData.cost || 0} />
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
                        <label className="block text-sm font-medium mb-1">จำนวนคงเหลือ*</label>
                        <input type="number" name="stock" value={formData.stock === undefined ? '' : formData.stock} onChange={onChange} className="form-input" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">หน่วยนับหลัก*</label>
                        <input type="text" name="mainUnit" value={formData.mainUnit || ''} onChange={onChange} className="form-input" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">แจ้งเตือนเมื่อต่ำกว่า</label>
                        <input type="number" name="stockAlert" value={formData.stockAlert === undefined ? '' : formData.stockAlert} onChange={onChange} className="form-input" placeholder="0" />
                    </div>
                </div>
            </div>
             <div className="flex justify-end items-center mt-8 pt-6 border-t bg-white/50 rounded-b-2xl p-6">
                <button type="button" onClick={onClose} className="btn bg-gray-200 text-gray-700 hover:bg-gray-300 mr-4">ยกเลิก</button>
                <button type="submit" className="btn btn-3d-pastel btn-primary flex items-center"><FaSave className="mr-2" /> บันทึกการเปลี่ยนแปลง</button>
            </div>
        </form>
    </Modal>
  );
}

export default EditProductModal;