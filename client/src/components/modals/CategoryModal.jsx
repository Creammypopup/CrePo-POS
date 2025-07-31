// client/src/components/modals/CategoryModal.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addCategory } from '../../features/category/categorySlice';
import { toast } from 'react-toastify';
import { FaSave, FaTimes } from 'react-icons/fa';
import Modal from 'react-modal';

const customModalStyles = {
  content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', borderRadius: '1rem', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '2rem', width: '90%', maxWidth: '500px' },
  overlay: { backgroundColor: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(4px)', zIndex: 50 }
};

Modal.setAppElement('#root');

function CategoryModal({ isOpen, onClose }) {
  const [name, setName] = useState('');
  const [source, setSource] = useState('กำไร');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('กรุณาใส่ชื่อหมวดหมู่');
      return;
    }
    dispatch(addCategory({ name, source }));
    toast.success(`เพิ่มหมวดหมู่ "${name}" สำเร็จ`);
    onClose();
    setName('');
    setSource('กำไร');
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={customModalStyles}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-700">เพิ่มหมวดหมู่ใหม่</h2>
        <button onClick={onClose}><FaTimes className="text-gray-400 hover:text-gray-600 text-2xl"/></button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">ชื่อหมวดหมู่</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="เช่น ค่าเช่าร้าน..." className="form-input"/>
        </div>
        <div>
          <label className="block font-medium mb-1">หักจาก</label>
          <select value={source} onChange={(e) => setSource(e.target.value)} className="form-input">
            <option value="กำไร">กำไร</option>
            <option value="ทุน">ทุน</option>
          </select>
        </div>
        <div className="flex justify-end items-center mt-8 pt-6 border-t border-gray-200">
          <button type="button" onClick={onClose} className="btn bg-gray-200 text-gray-700 hover:bg-gray-300 mr-4">ยกเลิก</button>
          <button type="submit" className="btn btn-3d-pastel btn-primary flex items-center"><FaSave className="mr-2" /> บันทึก</button>
        </div>
      </form>
    </Modal>
  );
}

export default CategoryModal;