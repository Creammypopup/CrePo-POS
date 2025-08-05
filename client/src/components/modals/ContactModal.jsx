// client/src/components/modals/ContactModal.jsx
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FaTimes, FaSave } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const customModalStyles = {
  content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', borderRadius: '1.5rem', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '0', width: '90%', maxWidth: '600px', background: '#FDF7FF', maxHeight: '90vh', display: 'flex', flexDirection: 'column' },
  overlay: { backgroundColor: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(4px)', zIndex: 50 }
};

Modal.setAppElement('#root');

const ContactModal = ({ isOpen, onClose, contact, type, onSave }) => {
    const dispatch = useDispatch();
    const isEditMode = Boolean(contact);
    const contactType = type === 'customer' ? 'ลูกค้า' : 'ผู้จำหน่าย';

    const initialFormState = { name: '', taxId: '', phone: '', email: '', address: '', notes: '' };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (isOpen) {
            setFormData(isEditMode ? { ...initialFormState, ...contact } : initialFormState);
        }
    }, [isOpen, contact, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast.error(`กรุณากรอกชื่อ${contactType}`);
            return;
        }
        dispatch(onSave(formData))
            .unwrap()
            .then(() => {
                toast.success(`${isEditMode ? 'อัปเดต' : 'เพิ่ม'}ข้อมูล${contactType} "${formData.name}" สำเร็จ!`);
                onClose();
            })
            .catch((err) => toast.error(err));
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} style={customModalStyles}>
            <div className="bg-white/50 p-6 flex justify-between items-center rounded-t-2xl border-b flex-shrink-0">
                <h2 className="text-2xl font-bold text-gray-800">{isEditMode ? 'แก้ไข' : 'เพิ่ม'}ข้อมูล{contactType}</h2>
                <button onClick={onClose}><FaTimes className="text-gray-400 hover:text-red-500 text-2xl"/></button>
            </div>
            <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto">
                <div className="p-6 space-y-4">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder={`* ชื่อ${contactType} / บริษัท`} className="form-input" required />
                    <input type="text" name="taxId" value={formData.taxId} onChange={handleChange} placeholder="เลขประจำตัวผู้เสียภาษี" className="form-input" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="เบอร์โทรศัพท์" className="form-input" />
                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="อีเมล" className="form-input" />
                    </div>
                    <textarea name="address" value={formData.address} onChange={handleChange} placeholder="ที่อยู่" className="form-input" rows="3"></textarea>
                    <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="หมายเหตุเพิ่มเติม" className="form-input" rows="2"></textarea>
                </div>
                <div className="flex justify-end items-center mt-auto pt-4 border-t bg-white/50 rounded-b-2xl p-6 flex-shrink-0">
                    <button type="button" onClick={onClose} className="btn bg-gray-200 text-gray-700 hover:bg-gray-300 mr-4">ยกเลิก</button>
                    <button type="submit" className="btn btn-3d-pastel btn-primary flex items-center"><FaSave className="mr-2" /> บันทึกข้อมูล</button>
                </div>
            </form>
        </Modal>
    );
};

export default ContactModal;