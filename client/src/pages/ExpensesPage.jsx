import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaPlus, FaRegFileAlt, FaEdit, FaTrash } from 'react-icons/fa';
// **START OF EDIT: แก้ไข Path ที่นี่**
import { getExpenses, deleteExpense, reset } from '../features/expense/expenseSlice';
// **END OF EDIT**
import ExpenseModal from '../../components/modals/ExpenseModal';
import Spinner from '../../components/Spinner';
import { toast } from 'react-toastify';
import moment from 'moment';

function ExpensesPage() {
    const dispatch = useDispatch();
    const { expenses, isLoading, isError, message } = useSelector((state) => state.expenses) || { expenses: [], isLoading: true };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);

    useEffect(() => {
        if(isError) {
            toast.error(message);
        }
        dispatch(getExpenses());
        return () => {
            dispatch(reset());
        }
    }, [dispatch, isError, message]);

    const handleOpenModal = (expense = null) => {
        setSelectedExpense(expense);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedExpense(null);
        // dispatch(getExpenses()); // Optional: refetch after modal closes
    };
    
    const handleDelete = (id) => {
        if(window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?')) {
            dispatch(deleteExpense(id));
            toast.success('ลบรายการสำเร็จ');
        }
    }

    if (isLoading && expenses.length === 0) {
        return <Spinner />;
    }

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">บันทึกค่าใช้จ่าย</h1>
            <button 
                onClick={() => handleOpenModal()}
                className="bg-pastel-peach-dark hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-xl flex items-center transition-all duration-300 shadow-lg shadow-orange-200"
            >
                <FaPlus className="mr-2" /> บันทึกค่าใช้จ่าย
            </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center mb-4">
                <FaRegFileAlt className="text-2xl text-pastel-peach-dark mr-3"/>
                <h2 className="text-xl font-semibold text-gray-700">รายการค่าใช้จ่ายล่าสุด</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b-2 text-left">
                            <th className="p-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">วันที่</th>
                            <th className="p-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">หมวดหมู่</th>
                            <th className="p-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">รายละเอียด</th>
                            <th className="p-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">ผู้ขาย</th>
                            <th className="p-3 text-sm font-semibold text-gray-500 uppercase tracking-wider text-right">จำนวนเงิน (บาท)</th>
                            <th className="p-3 text-sm font-semibold text-gray-500 uppercase tracking-wider text-center">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center p-8 text-gray-400">ยังไม่มีข้อมูลค่าใช้จ่าย</td>
                            </tr>
                        ) : (
                            expenses.map((expense) => (
                                <tr key={expense._id} className="border-b hover:bg-gray-50">
                                    <td className="p-4 text-gray-600">{moment(expense.date).format('DD/MM/YYYY')}</td>
                                    <td className="p-4">
                                        <span className="px-3 py-1 text-sm rounded-full bg-pastel-peach-light text-pastel-peach-dark font-semibold">
                                            {expense.category}
                                        </span>
                                    </td>
                                    <td className="p-4 font-medium text-gray-800">{expense.description}</td>
                                    <td className="p-4 text-gray-600">{expense.vendor || '-'}</td>
                                    <td className="p-4 text-gray-800 font-semibold text-right">{Number(expense.amount).toFixed(2)}</td>
                                    <td className="p-4 flex justify-center items-center space-x-2">
                                        <button onClick={() => handleOpenModal(expense)} className="text-pastel-blue-dark hover:text-blue-700"><FaEdit /></button>
                                        <button onClick={() => handleDelete(expense._id)} className="text-pastel-pink-dark hover:text-pink-700"><FaTrash /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
        <ExpenseModal 
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            expense={selectedExpense}
        />
    </div>
  );
}

export default ExpensesPage;