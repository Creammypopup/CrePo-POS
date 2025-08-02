// client/src/components/modals/AddProductModal.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import { FaTimes, FaSave } from 'react-icons/fa';
import { createProduct } from '../../features/product/productSlice';

const customModalStyles = {
  content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', borderRadius: '1rem', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '2rem', width: '90%', maxWidth: '700px', background: '#fff' },
  overlay: { backgroundColor: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(4px)', zIndex: 50 }
};

Modal.setAppElement('#root');

function AddProductModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
      name: '',
      category: '',
      price: '',
      cost: '',
      stock: '',
      mainUnit: 'ชิ้น',
  });

  const { name, category, price, cost, stock, mainUnit } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createProduct(formData))
        .unwrap()
        .then(() => {
            toast.success(`เพิ่มสินค้า "${name}" สำเร็จ!`);
            onClose();
        })
        .catch((error) => {
            toast.error(error);
        });
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={customModalStyles}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-700">เพิ่มสินค้าใหม่</h2>
        <button onClick={onClose}><FaTimes className="text-gray-400 hover:text-gray-600 text-2xl"/></button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        {/* Basic Info Section */}
        <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-3 text-gray-600">ข้อมูลพื้นฐาน</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">ชื่อสินค้า*</label>
                    <input type="text" name="name" value={name} onChange={onChange} className="form-input" required />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">หมวดหมู่*</label>
                    <input type="text" name="category" value={category} onChange={onChange} className="form-input" required />
                </div>
            </div>
        </div>

        {/* Pricing & Stock Section */}
        <div className="p-4 border rounded-lg">
             <h3 className="font-semibold mb-3 text-gray-600">ราคาและสต็อก</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <div>
                    <label className="block text-sm font-medium mb-1">ราคาขาย*</label>
                    <input type="number" name="price" value={price} onChange={onChange} className="form-input" required />
                </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">ต้นทุน*</label>
                    <input type="number" name="cost" value={cost} onChange={onChange} className="form-input" required />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">จำนวนตั้งต้น*</label>
                    <input type="number" name="stock" value={stock} onChange={onChange} className="form-input" required />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">หน่วยนับหลัก*</label>
                    <input type="text" name="mainUnit" value={mainUnit} onChange={onChange} className="form-input" required />
                </div>
            </div>
        </div>

        {/* This is a placeholder for more advanced fields */}
        <div className="text-center text-gray-400 text-sm p-4">
            ฟังก์ชันเพิ่มเติม เช่น หน่วยนับย่อย, ผู้จำหน่าย, และอื่นๆ จะถูกเพิ่มในขั้นตอนถัดไป
        </div>

        <div className="flex justify-end items-center mt-8 pt-6 border-t border-gray-200">
          <button type="button" onClick={onClose} className="btn bg-gray-200 text-gray-700 hover:bg-gray-300 mr-4">ยกเลิก</button>
          <button type="submit" className="btn btn-3d-pastel btn-primary flex items-center"><FaSave className="mr-2" /> บันทึกสินค้า</button>
        </div>
      </form>
    </Modal>
  );
}

export default AddProductModal;