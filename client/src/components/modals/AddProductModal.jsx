// client/src/components/modals/AddProductModal.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import { FaTimes, FaSave, FaPlus, FaTrash } from 'react-icons/fa';
import { createProduct } from '../../features/product/productSlice';
import { getCategories } from '../../features/category/categorySlice';


const customModalStyles = {
  content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', borderRadius: '1rem', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '2rem', width: '90%', maxWidth: '800px', background: '#fff' },
  overlay: { backgroundColor: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(4px)', zIndex: 50 }
};

Modal.setAppElement('#root');

function AddProductModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);

  const [formData, setFormData] = useState({
      name: '',
      category: '',
      description: '',
      sku: '',
      barcode: '',
      price: '',
      stock: '',
      stockAlert: '',
      mainUnit: 'ชิ้น',
      subUnits: [],
      suppliers: [{ supplierName: '', cost: '' }],
  });

  useEffect(() => {
    if (isOpen) {
        // Fetch expense categories to be used as product categories
        dispatch(getCategories());
        // Set default category if available
        if (categories && categories.length > 0 && !formData.category) {
            setFormData(prev => ({ ...prev, category: categories[0].name }));
        }
    }
  }, [isOpen, dispatch, categories, formData.category]);


  const onChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value, }));
  };

  // --- Handlers for dynamic sub-units ---
  const handleSubUnitChange = (index, event) => {
    const values = [...formData.subUnits];
    values[index][event.target.name] = event.target.value;
    setFormData(p => ({ ...p, subUnits: values }));
  };
  const addSubUnit = () => {
    setFormData(p => ({ ...p, subUnits: [...p.subUnits, { name: '', conversionRate: '' }] }));
  };
  const removeSubUnit = (index) => {
    const values = [...formData.subUnits];
    values.splice(index, 1);
    setFormData(p => ({ ...p, subUnits: values }));
  };

  // --- Handlers for dynamic suppliers ---
    const handleSupplierChange = (index, event) => {
    const values = [...formData.suppliers];
    values[index][event.target.name] = event.target.value;
    setFormData(p => ({ ...p, suppliers: values }));
  };
  const addSupplier = () => {
    setFormData(p => ({ ...p, suppliers: [...p.suppliers, { supplierName: '', cost: '' }] }));
  };
  const removeSupplier = (index) => {
    if (formData.suppliers.length <= 1) return; // Must have at least one supplier
    const values = [...formData.suppliers];
    values.splice(index, 1);
    setFormData(p => ({ ...p, suppliers: values }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    // Calculate average cost from suppliers to save in the main 'cost' field
    const totalCost = formData.suppliers.reduce((sum, s) => sum + parseFloat(s.cost || 0), 0);
    const averageCost = formData.suppliers.length > 0 ? totalCost / formData.suppliers.length : 0;

    const productData = { ...formData, cost: averageCost };

    dispatch(createProduct(productData))
        .unwrap()
        .then(() => {
            toast.success(`เพิ่มสินค้า "${formData.name}" สำเร็จ!`);
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
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-3">
        {/* --- Basic Info --- */}
        <fieldset className="p-4 border rounded-lg">
            <legend className="px-2 font-semibold text-gray-600">ข้อมูลพื้นฐาน</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">ชื่อสินค้า*</label>
                    <input type="text" name="name" value={formData.name} onChange={onChange} className="form-input" required />
                </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">หมวดหมู่*</label>
                    <select name="category" value={formData.category} onChange={onChange} className="form-input" required>
                        <option value="" disabled>-- เลือกหมวดหมู่ --</option>
                        {categories.map(cat => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">รหัส SKU (ปล่อยว่างเพื่อสร้างอัตโนมัติ)</label>
                    <input type="text" name="sku" value={formData.sku} onChange={onChange} className="form-input" />
                </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">รหัสบาร์โค้ด (ปล่อยว่างเพื่อสร้างอัตโนมัติ)</label>
                    <input type="text" name="barcode" value={formData.barcode} onChange={onChange} className="form-input" />
                </div>
                 <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">รายละเอียดสินค้า</label>
                    <textarea name="description" value={formData.description} onChange={onChange} rows="2" className="form-input"></textarea>
                </div>
            </div>
        </fieldset>

        {/* --- Stock & Units --- */}
        <fieldset className="p-4 border rounded-lg">
             <legend className="px-2 font-semibold text-gray-600">สต็อกและหน่วยนับ</legend>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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
                    <input type="number" name="stockAlert" value={formData.stockAlert} onChange={onChange} className="form-input" />
                </div>
            </div>
            {/* Sub-units */}
            <h4 className="text-sm font-medium mb-2">หน่วยนับย่อย (เช่น โหล, กล่อง)</h4>
            {formData.subUnits.map((subUnit, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                    <input type="text" name="name" placeholder="ชื่อหน่วยนับย่อย" value={subUnit.name} onChange={e => handleSubUnitChange(index, e)} className="form-input" />
                    <span className="text-gray-500">=</span>
                    <input type="number" name="conversionRate" placeholder="จำนวน" value={subUnit.conversionRate} onChange={e => handleSubUnitChange(index, e)} className="form-input w-24" />
                    <span className="text-gray-600 text-sm">{formData.mainUnit}</span>
                    <button type="button" onClick={() => removeSubUnit(index)} className="btn p-2 bg-red-100 text-red-700"><FaTrash /></button>
                </div>
            ))}
             <button type="button" onClick={addSubUnit} className="btn text-sm bg-blue-100 text-blue-700"><FaPlus className="mr-2"/>เพิ่มหน่วยนับย่อย</button>
        </fieldset>

        {/* --- Pricing & Suppliers --- */}
        <fieldset className="p-4 border rounded-lg">
             <legend className="px-2 font-semibold text-gray-600">ราคาและผู้จำหน่าย</legend>
             <div className="mb-4">
                <label className="block text-sm font-medium mb-1">ราคาขายต่อหน่วยหลัก*</label>
                <input type="number" name="price" value={formData.price} onChange={onChange} className="form-input" required />
            </div>
            <h4 className="text-sm font-medium mb-2">ผู้จำหน่ายและราคาต้นทุน</h4>
            {formData.suppliers.map((supplier, index) => (
                 <div key={index} className="flex items-center gap-2 mb-2">
                    <input type="text" name="supplierName" placeholder="ชื่อผู้จำหน่าย" value={supplier.supplierName} onChange={e => handleSupplierChange(index, e)} className="form-input" />
                    <input type="number" name="cost" placeholder="ราคาต้นทุน" value={supplier.cost} onChange={e => handleSupplierChange(index, e)} className="form-input w-40" />
                    <button type="button" onClick={() => removeSupplier(index)} className="btn p-2 bg-red-100 text-red-700 disabled:opacity-50" disabled={formData.suppliers.length <= 1}><FaTrash /></button>
                </div>
            ))}
             <button type="button" onClick={addSupplier} className="btn text-sm bg-blue-100 text-blue-700"><FaPlus className="mr-2"/>เพิ่มผู้จำหน่าย</button>
        </fieldset>


        <div className="flex justify-end items-center mt-8 pt-6 border-t border-gray-200">
          <button type="button" onClick={onClose} className="btn bg-gray-200 text-gray-700 hover:bg-gray-300 mr-4">ยกเลิก</button>
          <button type="submit" className="btn btn-3d-pastel btn-primary flex items-center"><FaSave className="mr-2" /> บันทึกสินค้า</button>
        </div>
      </form>
    </Modal>
  );
}

export default AddProductModal;