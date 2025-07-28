// client/src/components/modals/ExpenseModal.jsx
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import { FaTimes, FaSave } from 'react-icons/fa';
import { createExpense, updateExpense } from '../../features/expense/expenseSlice';
import moment from 'moment';

const customModalStyles = {
  content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', borderRadius: '1rem', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '2rem', width: '90%', maxWidth: '550px', background: '#fff' },
  overlay: { backgroundColor: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(4px)', zIndex: 50 }
};

Modal.setAppElement('#root');

const ExpenseModal = ({ isOpen, onClose, expense }) => {
    const dispatch = useDispatch();
    const isEditMode = Boolean(expense);

    const [formData, setFormData] = useState({
        date: moment().format('YYYY-MM-DD'),
        description: '',
        category: 'อื่นๆ',
        amount: '',
        vendor: '',
    });

    useEffect(() => {
        if (isEditMode && expense) {
            setFormData({
                date: moment(expense.date).format('YYYY-MM-DD'),
                description: expense.description,
                category: expense.category,
                amount: expense.amount,
                vendor: expense.vendor || '',
            });
        } else {
             setFormData({
                date: moment().format('YYYY-MM-DD'),
                description: '',
                category: 'อื่นๆ',
                amount: '',
                vendor: '',
            });
        }
    }, [expense, isEditMode, isOpen]);


    const { date, description, category, amount, vendor } = formData;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (isEditMode) {
            dispatch(updateExpense({ id: expense._id, ...formData }));
            toast.success('อัปเดตรายการค่าใช้จ่ายสำเร็จ');
        } else {
            dispatch(createExpense(formData));
            toast.success('บันทึกค่าใช้จ่ายใหม่สำเร็จ');
        }
        onClose();
    };

    const expenseCategories = ['ค่าเดินทาง', 'ค่าวัสดุ', 'ค่าจ้าง', 'ค่าสาธารณูปโภค', 'อื่นๆ'];

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} style={customModalStyles} contentLabel="Expense Modal">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-700">{isEditMode ? 'แก้ไขรายการค่าใช้จ่าย' : 'บันทึกค่าใช้จ่ายใหม่'}</h2>
                <button onClick={onClose}><FaTimes className="text-gray-400 hover:text-gray-600 text-2xl"/></button>
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
                {/* (โค้ดฟอร์มเหมือนเดิม) */}
                <div className="flex justify-end items-center mt-8 pt-6 border-t border-gray-200">
                    <button type="button" onClick={onClose} className="btn bg-gray-200 text-gray-700 hover:bg-gray-300 mr-4">ยกเลิก</button>
                    <button type="submit" className="btn btn-3d-pastel btn-success flex items-center">
                        <FaSave className="mr-2" />
                        บันทึก
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default ExpenseModal;