import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-modal';
import { FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import { createProduct, reset as resetProduct } from '../../features/product/productSlice';
import { getProductCategories } from '../../features/productCategory/productCategorySlice';
import { toast } from 'react-toastify';
import Spinner from '../Spinner';

const customStyles = {
  content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: '700px', maxHeight: '90vh', padding: '2rem', borderRadius: '1rem' },
  overlay: { backgroundColor: 'rgba(0, 0, 0, 0.6)' }
};

function AddProductModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { isLoading, isSuccess, isError, message } = useSelector((state) => state.products);
  const { productCategories, isLoading: categoriesLoading } = useSelector((state) => state.productCategories);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    baseUnit: 'ชิ้น',
    productType: 'standard',
  });
  const [sizes, setSizes] = useState([{ name: 'ปกติ', price: '', stock: '', sku: '', barcode: '' }]);

  useEffect(() => {
    if (isOpen) {
      dispatch(getProductCategories());
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (isError) toast.error(message);
    if (isSuccess) {
      toast.success('เพิ่มสินค้าสำเร็จ!');
      onClose();
    }
    dispatch(resetProduct());
  }, [isSuccess, isError, message, onClose, dispatch]);

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSizeChange = (index, e) => {
    const newSizes = [...sizes];
    newSizes[index][e.target.name] = e.target.value;
    setSizes(newSizes);
  };

  const addSize = () => {
    setSizes([...sizes, { name: '', price: '', stock: '', sku: '', barcode: '' }]);
  };

  const removeSize = (index) => {
    if (sizes.length > 1) {
      const newSizes = sizes.filter((_, i) => i !== index);
      setSizes(newSizes);
    } else {
      toast.warn('ต้องมีขนาด/ราคาอย่างน้อย 1 รายการ');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.baseUnit) {
      return toast.error('กรุณากรอกข้อมูลสินค้าที่จำเป็นให้ครบถ้วน');
    }
    if (sizes.some(s => !s.name || !s.price || s.stock === '')) {
      return toast.error('กรุณากรอกข้อมูล ขนาด, ราคา และสต็อกให้ครบทุกรายการ');
    }

    const productData = {
      ...formData,
      sizes: sizes.map(s => ({
        ...s,
        price: Number(s.price),
        stock: Number(s.stock)
      }))
    };

    dispatch(createProduct(productData));
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={customStyles} contentLabel="Add Product Modal" appElement={document.getElementById('root')}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">เพิ่มสินค้าใหม่</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
          <FaTimes size={24} />
        </button>
      </div>

      {isLoading && <Spinner />}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" value={formData.name} onChange={handleFormChange} placeholder="ชื่อสินค้า*" className="input-style" required />
          <select name="category" value={formData.category} onChange={handleFormChange} className="input-style" required>
            <option value="">-- เลือกหมวดหมู่* --</option>
            {categoriesLoading ? <option>กำลังโหลด...</option> : productCategories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          <input name="baseUnit" value={formData.baseUnit} onChange={handleFormChange} placeholder="หน่วยนับหลัก* (เช่น ชิ้น, กล่อง)" className="input-style" required />
          <input name="description" value={formData.description} onChange={handleFormChange} placeholder="คำอธิบายสินค้า (ไม่บังคับ)" className="input-style" />
        </div>

        {/* Dynamic Sizes/Variants */}
        <div className="pt-4">
          <h3 className="text-lg font-semibold mb-2">ขนาด / ราคา / สต็อก</h3>
          {sizes.map((size, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-2 items-center">
              <input name="name" value={size.name} onChange={(e) => handleSizeChange(index, e)} placeholder="ขนาด (เช่น 1 ลิตร)" className="input-style md:col-span-2" required />
              <input name="price" type="number" value={size.price} onChange={(e) => handleSizeChange(index, e)} placeholder="ราคาขาย*" className="input-style" required />
              <input name="stock" type="number" value={size.stock} onChange={(e) => handleSizeChange(index, e)} placeholder="สต็อก*" className="input-style" required />
              <button type="button" onClick={() => removeSize(index)} className="text-red-500 hover:text-red-700 justify-self-center"><FaTrash /></button>
            </div>
          ))}
          <button type="button" onClick={addSize} className="mt-2 flex items-center text-sm text-purple-600 hover:text-purple-800">
            <FaPlus className="mr-2" /> เพิ่มขนาด/ราคา
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6">
          <button type="button" onClick={onClose} className="btn-secondary">ยกเลิก</button>
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'กำลังบันทึก...' : 'บันทึกสินค้า'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default AddProductModal;