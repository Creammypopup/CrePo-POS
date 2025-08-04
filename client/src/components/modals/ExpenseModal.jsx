// client/src/components/modals/ExpenseModal.jsx
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import { FaTimes, FaSave, FaPlusCircle } from 'react-icons/fa';
import { createExpense, updateExpense } from '../../features/expense/expenseSlice';
import moment from 'moment';

const customModalStyles = {
  content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', borderRadius: '1rem', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '2rem', width: '90%', maxWidth: '550px', background: '#fff' },
  overlay: { backgroundColor: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(4px)', zIndex: 50 }
};

Modal.setAppElement('#root');

const ExpenseModal = ({ isOpen, onClose, expense, onManageCategories }) => {
    const dispatch = useDispatch();
    const isEditMode = Boolean(expense);

    const { categories } = useSelector((state) => state.category);

    const [formData, setFormData] = useState({
        date: moment().format('YYYY-MM-DD'),
        description: '',
        category: categories?.[0]?.name || '',
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
                category: categories?.[0]?.name || '',
                amount: '',
                vendor: '',
            });
        }
    }, [expense, isEditMode, isOpen, categories]);

    const { date, description, category, amount, vendor } = formData;
    const onChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

    const onSubmit = (e) => {
        e.preventDefault();
        if (isEditMode) {
            dispatch(updateExpense({ id: expense._id, ...formData })).then(() => {
                toast.success('อัปเดตรายการค่าใช้จ่ายสำเร็จ');
            });
        } else {
            dispatch(createExpense(formData)).then(() => {
                toast.success('บันทึกค่าใช้จ่ายใหม่สำเร็จ');
            });
        }
        onClose();
    };

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
                        <input type="date" name="date" value={date} onChange={onChange} className="form-input" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2 text-gray-600">หมวดหมู่</label>
                        <div className="flex items-center gap-2">
                            <select name="category" value={category} onChange={onChange} className="form-input flex-grow" required>
                                {categories && categories.map(cat => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
                            </select>
                            <button type="button" onClick={onManageCategories} className="btn p-2.5 bg-blue-100 text-blue-700 hover:bg-blue-200">
                                <FaPlusCircle />
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold mb-2 text-gray-600">รายละเอียด</label>
                    <input type="text" name="description" value={description} onChange={onChange} placeholder="เช่น ค่าน้ำมัน, ซื้อสกรู" className="form-input" required />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold mb-2 text-gray-600">จำนวนเงิน (บาท)</label>
                        <input type="number" name="amount" value={amount} onChange={onChange} placeholder="0.00" className="form-input" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2 text-gray-600">ผู้ขาย/ร้านค้า (ถ้ามี)</label>
                        <input type="text" name="vendor" value={vendor} onChange={onChange} placeholder="เช่น SCG Home" className="form-input" />
                    </div>
                </div>
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