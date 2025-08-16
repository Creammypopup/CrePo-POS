import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-modal';
import { FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import { createProduct, reset as resetProduct } from '../../features/product/productSlice';
import { getProductCategories } from '../../features/productCategory/productCategorySlice';
import { toast } from 'react-toastify';
import Spinner from '../Spinner';

const customStyles = {
  content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: '800px', maxHeight: '90vh', padding: '2rem', borderRadius: '1rem' },
  overlay: { backgroundColor: 'rgba(0, 0, 0, 0.6)' }
};

function AddProductModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { isLoading, isSuccess, isError, message } = useSelector((state) => state.products);
  const { categories: productCategories, isLoading: categoriesLoading } = useSelector((state) => state.productCategories); // Corrected destructuring

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    productType: 'standard',
    stockUnit: 'ชิ้น',
    stockQuantity: 0,
    costPerStockUnit: 0,
    reorderPoint: 0,
    sku: '',
    barcode: '',
  });
  const [sellingUnits, setSellingUnits] = useState([{ name: 'ชิ้น', price: '', stockConversionFactor: 1 }]);

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
      // Reset form state after successful submission
      setFormData({
        name: '',
        description: '',
        category: '',
        productType: 'standard',
        stockUnit: 'ชิ้น',
        stockQuantity: 0,
        costPerStockUnit: 0,
        reorderPoint: 0,
        sku: '',
        barcode: '',
      });
      setSellingUnits([{ name: 'ชิ้น', price: '', stockConversionFactor: 1 }]);
    }
    dispatch(resetProduct());
  }, [isSuccess, isError, message, onClose, dispatch]);

  const handleFormChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
  };

  const handleUnitChange = (index, e) => {
    const { name, value, type } = e.target;
    const newUnits = [...sellingUnits];
    newUnits[index][name] = type === 'number' ? Number(value) : value;
    setSellingUnits(newUnits);
  };

  const addUnit = () => {
    setSellingUnits([...sellingUnits, { name: '', price: '', stockConversionFactor: '' }]);
  };

  const removeUnit = (index) => {
    if (sellingUnits.length > 1) {
      const newUnits = sellingUnits.filter((_, i) => i !== index);
      setSellingUnits(newUnits);
    } else {
      toast.warn('ต้องมีหน่วยขายอย่างน้อย 1 รายการ');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation
    if (!formData.name || !formData.category || (formData.productType !== 'service' && !formData.stockUnit)) {
      return toast.error('กรุณากรอกข้อมูลสินค้าที่จำเป็น (ชื่อ, หมวดหมู่, หน่วยสต็อก) ให้ครบถ้วน');
    }
    if (formData.productType !== 'service' && sellingUnits.some(u => !u.name || !u.price || !u.stockConversionFactor)) {
      return toast.error('กรุณากรอกข้อมูลหน่วยขาย (ชื่อ, ราคา, ตัวคูณ) ให้ครบทุกรายการ');
    }

    const productData = {
      ...formData,
      sellingUnits: formData.productType === 'service' ? [] : sellingUnits,
    };

    dispatch(createProduct(productData));
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={customStyles} contentLabel="Add Product Modal" appElement={document.getElementById('root')}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">เพิ่มสินค้าใหม่</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><FaTimes size={24} /></button>
      </div>

      {isLoading && <Spinner />}

      <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto p-2" style={{maxHeight: '75vh'}}>
        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input name="name" value={formData.name} onChange={handleFormChange} placeholder="ชื่อสินค้า*" className="input-style" required />
          <select name="category" value={formData.category} onChange={handleFormChange} className="input-style" required>
            <option value="">-- เลือกหมวดหมู่* --</option>
            {categoriesLoading ? <option>กำลังโหลด...</option> : productCategories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          <select name="productType" value={formData.productType} onChange={handleFormChange} className="input-style">
            <option value="standard">สินค้ามาตรฐาน</option>
            <option value="weight_based">สินค้าชั่งน้ำหนัก</option>
            <option value="service">บริการ (ไม่ตัดสต็อก)</option>
          </select>
        </div>
        <input name="description" value={formData.description} onChange={handleFormChange} placeholder="คำอธิบายสินค้า (ไม่บังคับ)" className="input-style w-full" />
        
        {formData.productType !== 'service' && (
          <div className='p-4 bg-gray-50 rounded-lg mt-4'>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">ข้อมูลสต็อก</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <input name="stockUnit" value={formData.stockUnit} onChange={handleFormChange} placeholder="หน่วยสต็อกหลัก* (เช่น kg, ชิ้น)" className="input-style" required />
                <input name="stockQuantity" type="number" value={formData.stockQuantity} onChange={handleFormChange} placeholder="จำนวนคงเหลือ" className="input-style" />
                <input name="costPerStockUnit" type="number" value={formData.costPerStockUnit} onChange={handleFormChange} placeholder="ต้นทุนต่อหน่วยหลัก" className="input-style" />
                <input name="reorderPoint" type="number" value={formData.reorderPoint} onChange={handleFormChange} placeholder="จุดสั่งซื้อ" className="input-style" />
            </div>
          </div>
        )}

        {/* Dynamic Selling Units */}
        {formData.productType !== 'service' && (
            <div className="pt-4">
                <h3 className="text-lg font-semibold mb-2">หน่วยขายและราคา</h3>
                {sellingUnits.map((unit, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-8 gap-2 mb-2 items-center">
                        <input name="name" value={unit.name} onChange={(e) => handleUnitChange(index, e)} placeholder="ชื่อหน่วยขาย (เช่น ลัง)" className="input-style md:col-span-3" required />
                        <input name="price" type="number" value={unit.price} onChange={(e) => handleUnitChange(index, e)} placeholder="ราคาขาย*" className="input-style md:col-span-2" required />
                        <input name="stockConversionFactor" type="number" value={unit.stockConversionFactor} onChange={(e) => handleUnitChange(index, e)} placeholder="ตัวคูณ*" className="input-style md:col-span-2" required />
                        <div className="flex items-center justify-center">
                            <button type="button" onClick={() => removeUnit(index)} className="text-red-500 hover:text-red-700"><FaTrash /></button>
                        </div>
                    </div>
                ))}
                <button type="button" onClick={addUnit} className="mt-2 flex items-center text-sm text-purple-600 hover:text-purple-800">
                    <FaPlus className="mr-2" /> เพิ่มหน่วยขาย
                </button>
            </div>
        )}

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