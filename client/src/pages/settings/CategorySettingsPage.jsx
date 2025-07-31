// client/src/pages/settings/CategorySettingsPage.jsx
import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteCategory } from '../../features/category/categorySlice';
import { FaPlus, FaTrash, FaSearch } from 'react-icons/fa';
import CategoryModal from '../../components/modals/CategoryModal';
import { toast } from 'react-toastify';

function CategorySettingsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories;
    return categories.filter(cat => 
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  const handleDelete = (id, name) => {
      if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบหมวดหมู่ "${name}"?`)) {
          dispatch(deleteCategory(id));
          toast.success(`ลบหมวดหมู่ "${name}" สำเร็จ`);
      }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">จัดการหมวดหมู่ค่าใช้จ่าย</h1>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-3d-pastel btn-primary"><FaPlus className="mr-2"/>เพิ่มหมวดหมู่ใหม่</button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="relative mb-4">
          <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="ค้นหาหมวดหมู่..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input !pl-11"
          />
        </div>

        <div className="space-y-2">
          {filteredCategories.map(cat => (
            <div key={cat.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="font-medium text-gray-800">{cat.name}</span>
              <div className="flex items-center gap-4">
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${cat.source === 'ทุน' ? 'bg-orange-100 text-orange-800' : 'bg-teal-100 text-teal-800'}`}>
                  หักจาก: {cat.source}
                </span>
                <button onClick={() => handleDelete(cat.id, cat.name)} className="text-red-500 hover:text-red-700"><FaTrash /></button>
              </div>
            </div>
          ))}
          {filteredCategories.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              <p>ไม่พบหมวดหมู่ที่ค้นหา</p>
            </div>
          )}
        </div>
      </div>
      
      <CategoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
export default CategorySettingsPage;