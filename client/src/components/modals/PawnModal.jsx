// client/src/components/modals/PawnModal.jsx
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FaTimes, FaSave, FaPlusCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createPawn, updatePawn } from '../../features/pawn/pawnSlice';
import { getCustomers, createCustomer } from '../../features/customer/customerSlice';
import ContactModal from './ContactModal'; // Import ContactModal
import moment from 'moment';

const customModalStyles = {
  content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', borderRadius: '1.5rem', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '0', width: '90%', maxWidth: '700px', background: '#FDF7FF', maxHeight: '90vh', display: 'flex', flexDirection: 'column' },
  overlay: { backgroundColor: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(4px)', zIndex: 50 }
};

Modal.setAppElement('#root');

const PawnModal = ({ isOpen, onClose, pawn }) => {
    const dispatch = useDispatch();
    const { customers } = useSelector(state => state.customers);
    const isEditMode = Boolean(pawn);

    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false); // State for contact modal

    const initialFormState = {
        type: 'pawn', // Default to pawn
        customer: '',
        productName: '',
        productDescription: '',
        pawnAmount: '',
        interestRate: 1.25,
        startDate: moment().format('YYYY-MM-DD'),
        endDate: '',
        notes: '',
    };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (isOpen) {
            dispatch(getCustomers());
            if (isEditMode) {
                const formattedPawn = {
                    ...pawn,
                    customer: pawn.customer?._id || '',
                    startDate: moment(pawn.startDate).format('YYYY-MM-DD'),
                    endDate: moment(pawn.endDate).format('YYYY-MM-DD'),
                };
                setFormData({ ...initialFormState, ...formattedPawn });
            } else {
                setFormData(initialFormState);
            }
        }
    }, [isOpen, pawn, isEditMode, dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const action = isEditMode ? updatePawn(formData) : createPawn(formData);
        const successMessage = isEditMode 
            ? `แก้ไขรายการสำเร็จ!`
            : `เพิ่มรายการสำเร็จ!`;

        dispatch(action)
            .unwrap()
            .then(() => {
                toast.success(successMessage);
                onClose();
            })
            .catch((err) => toast.error(err));
    };

    return (
        <>
            <Modal isOpen={isOpen} onRequestClose={onClose} style={customModalStyles}>
                <div className="bg-white/50 p-6 flex justify-between items-center rounded-t-2xl border-b flex-shrink-0">
                    <h2 className="text-2xl font-bold text-gray-800">{isEditMode ? 'แก้ไขรายการ' : 'รายการใหม่'}</h2>
                    <button onClick={onClose}><FaTimes className="text-gray-400 hover:text-red-500 text-2xl"/></button>
                </div>
                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto">
                    <div className="p-6 space-y-4">
                        {/* Type Selector */}
                        <div className="grid grid-cols-2 gap-2 p-1 bg-gray-200 rounded-lg">
                            <button type="button" onClick={() => setFormData(p => ({...p, type: 'pawn'}))} className={`btn w-full ${formData.type === 'pawn' ? 'bg-white shadow' : 'bg-transparent'}`}>รับฝาก (มีทรัพย์สิน)</button>
                            <button type="button" onClick={() => setFormData(p => ({...p, type: 'loan'}))} className={`btn w-full ${formData.type === 'loan' ? 'bg-white shadow' : 'bg-transparent'}`}>ยืมเงิน (ไม่มีทรัพย์สิน)</button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold mb-2 text-gray-600">ลูกค้า*</label>
                                <div className="flex items-center gap-2">
                                    <select name="customer" value={formData.customer} onChange={handleChange} className="form-input" required>
                                        <option value="" disabled>-- เลือกลูกค้า --</option>
                                        {customers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                    <button type="button" onClick={() => setIsCustomerModalOpen(true)} className="btn p-2.5 bg-blue-100 text-blue-700 hover:bg-blue-200"><FaPlusCircle/></button>
                                </div>
                            </div>
                            
                            {formData.type === 'pawn' && (
                                <>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold mb-2 text-gray-600">ชื่อทรัพย์สิน*</label>
                                        <input type="text" name="productName" value={formData.productName} onChange={handleChange} placeholder="เช่น สร้อยคอทองคำ 1 บาท" className="form-input" required={formData.type === 'pawn'} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold mb-2 text-gray-600">รายละเอียดทรัพย์สิน</label>
                                        <textarea name="productDescription" value={formData.productDescription} onChange={handleChange} placeholder="ตำหนิ, รุ่น, ยี่ห้อ..." className="form-input" rows="2"></textarea>
                                    </div>
                                </>
                            )}

                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-600">เงินต้น (บาท)*</label>
                                <input type="number" name="pawnAmount" value={formData.pawnAmount} onChange={handleChange} placeholder="0.00" className="form-input" required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-600">อัตราดอกเบี้ย (% ต่อเดือน)*</label>
                                <input type="number" step="0.01" name="interestRate" value={formData.interestRate} onChange={handleChange} className="form-input" required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-600">วันที่เริ่มสัญญา*</label>
                                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="form-input" required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-600">วันที่สิ้นสุดสัญญา*</label>
                                <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="form-input" required />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold mb-2 text-gray-600">หมายเหตุ</label>
                                <textarea name="notes" value={formData.notes} onChange={handleChange} className="form-input" rows="2"></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end items-center mt-auto pt-4 border-t bg-white/50 rounded-b-2xl p-6 flex-shrink-0">
                        <button type="button" onClick={onClose} className="btn bg-gray-200 text-gray-700 hover:bg-gray-300 mr-4">ยกเลิก</button>
                        <button type="submit" className="btn btn-3d-pastel btn-primary flex items-center"><FaSave className="mr-2" /> บันทึกรายการ</button>
                    </div>
                </form>
            </Modal>
            <ContactModal 
                isOpen={isCustomerModalOpen}
                onClose={() => setIsCustomerModalOpen(false)}
                type="customer"
                onSave={createCustomer} // Use the thunk for creating
            />
        </>
    );
};

export default PawnModal;