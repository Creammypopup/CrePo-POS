// client/src/components/modals/ProductCategoryModal.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'react-modal';
import { FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import { getProductCategories, createProductCategory, deleteProductCategory } from '../../features/productCategory/productCategorySlice';
import Spinner from '../Spinner';

const customModalStyles = {
  content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', borderRadius: '1rem', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '0', width: '90%', maxWidth: '500px', background: '#FDF7FF' },
  overlay: { backgroundColor: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(4px)', zIndex: 60 } // Higher zIndex
};

Modal.setAppElement('#root');

function ProductCategoryModal({ isOpen, onClose }) {
    const dispatch = useDispatch();
    const { categories, isLoading } = useSelector((state) => state.productCategories);
    const [newCategoryName, setNewCategoryName] = useState('');

    useEffect(() => {
        if (isOpen) {
            dispatch(getProductCategories());
        }
    }, [isOpen, dispatch]);

    const handleAddCategory = (e) => {
        e.preventDefault();
        if (newCategoryName.trim()) {
            dispatch(createProductCategory({ name: newCategoryName }));
            setNewCategoryName('');
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบหมวดหมู่นี้?')) {
            dispatch(deleteProductCategory(id));
        }
    }

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} style={customModalStyles}>
            <div className="bg-white/50 p-6 flex justify-between items-center rounded-t-xl border-b">
                <h2 className="text-xl font-bold text-gray-800">จัดการหมวดหมู่สินค้า</h2>
                <button onClick={onClose}><FaTimes className="text-gray-400 hover:text-red-500 text-2xl"/></button>
            </div>
            <div className="p-6 space-y-4">
                <form onSubmit={handleAddCategory} className="flex gap-2">
                    <input 
                        type="text" 
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="form-input flex-grow" 
                        placeholder="เพิ่มหมวดหมู่ใหม่..."
                    />
                    <button type="submit" className="btn btn-primary flex-shrink-0"><FaPlus/></button>
                </form>
                <div className="h-64 overflow-y-auto space-y-2 border p-2 rounded-lg bg-gray-50">
                    {isLoading && categories.length === 0 ? <Spinner /> : categories.map(cat => (
                        <div key={cat._id} className="flex justify-between items-center bg-white p-2 rounded hover:bg-gray-100">
                            <span className="text-gray-700">{cat.name}</span>
                            <button onClick={() => handleDelete(cat._id)} className="text-red-400 hover:text-red-600"><FaTrash /></button>
                        </div>
                    ))}
                </div>
            </div>
             <div className="flex justify-end p-4 bg-gray-50 rounded-b-xl border-t">
                <button onClick={onClose} className="btn bg-gray-200 text-gray-700 hover:bg-gray-300">ปิด</button>
            </div>
        </Modal>
    );
}

export default ProductCategoryModal;