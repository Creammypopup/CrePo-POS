// client/src/pages/ExpensesPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaPlus, FaRegFileAlt, FaEdit, FaTrash, FaFilter, FaPrint } from "react-icons/fa";
import { getExpenses, deleteExpense, reset } from "../features/expense/expenseSlice";
import ExpenseModal from "../components/modals/ExpenseModal";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import moment from 'moment';

function ExpensesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [filter, setFilter] = useState({ type: 'month', value: moment().format('YYYY-MM'), category: 'all' });

  const dispatch = useDispatch();
  const { expenses, isLoading, isError, message } = useSelector(
    (state) => state.expense
  );

  const expenseCategories = useMemo(() => {
    if (!expenses) return [];
    const uniqueCategories = new Set(expenses.map(exp => exp.category));
    return ['all', ...Array.from(uniqueCategories)];
  }, [expenses]);

  useEffect(() => {
    if (isError) { toast.error(message); }
    dispatch(getExpenses());
    return () => { dispatch(reset()); };
  }, [dispatch, isError, message]);

  const filteredExpenses = useMemo(() => {
    if (!expenses) return [];

    let data = expenses;

    // Filter by category
    if (filter.category && filter.category !== 'all') {
        data = data.filter(exp => exp.category === filter.category);
    }

    // Filter by date
    if (!filter.value) return data;
    return data.filter(exp => {
        const expenseDate = moment(exp.date);
        if (filter.type === 'day') {
            return expenseDate.isSame(filter.value, 'day');
        }
        if (filter.type === 'month') {
            return expenseDate.isSame(filter.value, 'month');
        }
        if (filter.type === 'year') {
            const year = parseInt(filter.value, 10);
            const gregorianYear = year > 2500 ? year - 543 : year;
            return expenseDate.year() === gregorianYear;
        }
        return true;
    });
  }, [expenses, filter]);

  const totalFilteredAmount = useMemo(() => 
    filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0),
  [filteredExpenses]);

  const handleAddExpense = () => {
    setCurrentExpense(null);
    setIsModalOpen(true);
  };

  const handleEditExpense = (expense) => {
    setCurrentExpense(expense);
    setIsModalOpen(true);
  };

  const handleDeleteExpense = (id) => {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบรายจ่ายนี้?")) {
      dispatch(deleteExpense(id));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentExpense(null);
  };

  const renderFilterInput = () => {
    switch (filter.type) {
        case 'day':
            return <input type="date" value={filter.value} onChange={(e) => setFilter({ ...filter, value: e.target.value })} className="form-input !py-2" />;
        case 'month':
            return <input type="month" value={filter.value} onChange={(e) => setFilter({ ...filter, value: e.target.value })} className="form-input !py-2" />;
        case 'year':
            return <input type="number" placeholder="YYYY (พ.ศ.)" value={filter.value} onChange={(e) => setFilter({ ...filter, value: e.target.value })} className="form-input !py-2" />;
        default:
            return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">จัดการรายจ่าย</h1>
        <div className="flex gap-2">
            <button onClick={() => window.print()} className="btn btn-3d-pastel bg-gray-100 text-gray-700">
                <FaPrint className="mr-2" /> พิมพ์
            </button>
            <button onClick={handleAddExpense} className="btn btn-3d-pastel btn-primary">
                <FaPlus className="mr-2" /> เพิ่มรายจ่าย
            </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-lg flex flex-wrap items-center gap-4">
        <FaFilter className="text-gray-500" />
        <select value={filter.type} onChange={(e) => setFilter({ type: e.target.value, value: '' })} className="form-input w-auto !py-2 pr-10">
            <option value="day">รายวัน</option>
            <option value="month">รายเดือน</option>
            <option value="year">รายปี</option>
        </select>
        {renderFilterInput()}
        <select value={filter.category} onChange={(e) => setFilter({ ...filter, category: e.target.value })} className="form-input w-auto !py-2 pr-10">
            {expenseCategories.map(cat => (
                <option key={cat} value={cat}>{cat === 'all' ? 'ทุกหมวดหมู่' : cat}</option>
            ))}
        </select>
        <div className="ml-auto text-right">
            <p className="text-gray-500">ยอดรวมที่แสดง</p>
            <p className="text-xl font-bold text-brand-purple">{totalFilteredAmount.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}</p>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">วันที่</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">หมวดหมู่</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">คำอธิบาย</th>
                <th className="py-3 px-4 text-right text-sm font-semibold text-gray-600">จำนวนเงิน</th>
                <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600">การกระทำ</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="5" className="text-center py-10"><Spinner /></td></tr>
              ) : filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => (
                  <tr key={expense._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{new Date(expense.date).toLocaleDateString("th-TH")}</td>
                    <td className="py-3 px-4">{expense.category}</td>
                    <td className="py-3 px-4">{expense.description}</td>
                    <td className="py-3 px-4 text-right text-red-600 font-semibold">{expense.amount.toLocaleString("th-TH", { style: "currency", currency: "THB" })}</td>
                    <td className="py-3 px-4 text-center space-x-2">
                      <button onClick={() => handleEditExpense(expense)} className="btn btn-3d-pastel bg-brand-warning text-yellow-800 p-2.5"><FaEdit /></button>
                      <button onClick={() => handleDeleteExpense(expense._id)} className="btn btn-3d-pastel bg-brand-danger text-red-800 p-2.5"><FaTrash /></button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-gray-500">
                    <FaRegFileAlt className="mx-auto text-4xl mb-2" />
                    ไม่พบข้อมูลรายจ่ายตามเงื่อนไขที่เลือก
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <ExpenseModal
          isOpen={isModalOpen}
          onClose={closeModal}
          expense={currentExpense}
        />
      )}
    </div>
  );
}

export default ExpensesPage;