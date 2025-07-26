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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold mb-2 text-gray-600">วันที่</label>
                        <input type="date" name="date" value={date} onChange={onChange} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2 text-gray-600">หมวดหมู่</label>
                        <select name="category" value={category} onChange={onChange} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400" required>
                            {expenseCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold mb-2 text-gray-600">รายละเอียด</label>
                    <input type="text" name="description" value={description} onChange={onChange} placeholder="เช่น ค่าน้ำมัน, ซื้อสกรู" className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400" required />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold mb-2 text-gray-600">จำนวนเงิน (บาท)</label>
                        <input type="number" name="amount" value={amount} onChange={onChange} placeholder="0.00" className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2 text-gray-600">ผู้ขาย/ร้านค้า (ถ้ามี)</label>
                        <input type="text" name="vendor" value={vendor} onChange={onChange} placeholder="เช่น SCG Home" className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400" />
                    </div>
                </div>
                <div className="flex justify-end items-center mt-8 pt-6 border-t border-gray-200">
                    <button type="button" onClick={onClose} className="text-gray-600 font-bold uppercase px-6 py-2 text-sm rounded-lg hover:bg-gray-200 transition-colors mr-4">ยกเลิก</button>
                    <button type="submit" className="bg-pastel-green-dark text-white font-bold py-3 px-6 rounded-lg flex items-center transition-all duration-300 shadow-md hover:shadow-lg hover:bg-green-600">
                        <FaSave className="mr-2" />
                        บันทึก
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default ExpenseModal;