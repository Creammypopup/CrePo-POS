// client/src/pages/ExpensesPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaPlus, FaRegFileAlt, FaEdit, FaTrash, FaFilter, FaPrint } from "react-icons/fa";
import { getExpenses, deleteExpense, reset as resetExpenses } from "../features/expense/expenseSlice";
import { getCategories, reset as resetCategories } from "../features/category/categorySlice";
import ExpenseModal from "../components/modals/ExpenseModal";
import CategoryModal from "../components/modals/CategoryModal";
import Spinner from "../components/Spinner";
import moment from 'moment';
import { toast } from "react-toastify";

function ExpensesPage() {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [filter, setFilter] = useState({ type: 'month', value: moment().format('YYYY-MM'), category: 'all', source: 'all' });

  const dispatch = useDispatch();
  const { expenses, isLoading } = useSelector((state) => state.expense);
  const { categories, isLoading: categoriesLoading } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(getExpenses());
    dispatch(getCategories());
    return () => {
      dispatch(resetExpenses());
      dispatch(resetCategories());
    }
  }, [dispatch]);

  const expenseCategories = useMemo(() => {
    if (!categories) return [];
    const uniqueCategories = new Set(categories.map(cat => cat.name));
    return ['all', ...Array.from(uniqueCategories)];
  }, [categories]);

  const filteredExpenses = useMemo(() => {
    if (!expenses) return [];
    let data = [...expenses];

    // Filter by source (ทุน/กำไร)
    if (filter.source && filter.source !== 'all') {
        const sourceCategories = categories.filter(c => c.source === filter.source).map(c => c.name);
        data = data.filter(exp => sourceCategories.includes(exp.category));
    }

    if (filter.category && filter.category !== 'all') {
        data = data.filter(exp => exp.category === filter.category);
    }

    if (!filter.value) return data.sort((a, b) => new Date(b.date) - new Date(a.date));

    return data.filter(exp => {
        const expenseDate = moment(exp.date);
        if (filter.type === 'day') return expenseDate.isSame(filter.value, 'day');
        if (filter.type === 'month') return expenseDate.isSame(filter.value, 'month');
        if (filter.type === 'year') {
            const yearValue = filter.value > 2500 ? filter.value - 543 : filter.value;
            return expenseDate.year() === parseInt(yearValue, 10);
        }
        return true;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses, filter, categories]);

  const totalFilteredAmount = useMemo(() =>
    filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0), [filteredExpenses]);

  const handleAddExpense = () => {
    setCurrentExpense(null);
    setIsExpenseModalOpen(true);
  };

  const handleEditExpense = (expense) => {
    setCurrentExpense(expense);
    setIsExpenseModalOpen(true);
  };

  const handleDeleteExpense = (id, description) => {
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบรายการ "${description}"?`)) {
      dispatch(deleteExpense(id)).then(() => {
        toast.success("ลบรายการสำเร็จ");
      });
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const renderFilterInput = () => {
    const commonClasses = "form-input !py-2 !px-3 text-sm w-40";
    if (filter.type === 'day') {
        return <input type="date" name="value" value={filter.value} onChange={handleFilterChange} className={commonClasses} />;
    }
    if (filter.type === 'month') {
        return <input type="month" name="value" value={filter.value} onChange={handleFilterChange} className={commonClasses} />;
    }
    if (filter.type === 'year') {
        return <input type="number" name="value" placeholder="ระบุปี (พ.ศ.)" defaultValue={moment().year() + 543} onChange={handleFilterChange} className={`${commonClasses} w-32`} />;
    }
    return null;
  };

  if (isLoading || categoriesLoading) {
    return <Spinner />;
  }

  return (
    <>
    <style>{`
        .form-input-filter { @apply bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-brand-purple focus:border-brand-purple transition duration-150 ease-in-out; }
        @media print {
            body * { visibility: hidden; } .printable-container, .printable-container * { visibility: visible !important; -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
            .printable-container { position: absolute; left: 0; top: 0; width: 100%; font-size: 10pt; } .print-title { visibility: visible !important; display: block !important; text-align: center; font-size: 18pt; margin-bottom: 1rem;} .non-printable { display: none !important; }
        }
    `}</style>
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4 non-printable">
        <h1 className="text-3xl font-bold text-gray-800">บันทึกรายจ่าย</h1>
        <div className="flex gap-2">
            <button onClick={() => window.print()} className="btn btn-3d-pastel bg-gray-200 text-gray-800">
                <FaPrint className="mr-2" /> พิมพ์
            </button>
            <button onClick={handleAddExpense} className="btn btn-3d-pastel bg-green-200 text-green-800">
                <FaPlus className="mr-2" /> เพิ่มรายจ่าย
            </button>
        </div>
      </div>

      <div className="bg-white p-3 rounded-2xl shadow-lg flex flex-wrap justify-between items-center gap-4 non-printable">
        <div className="flex items-center gap-x-3 gap-y-2 flex-wrap">
            <div className="flex items-center gap-2 text-gray-500 text-sm font-semibold"><FaFilter /><span>ตัวกรอง:</span></div>
            <select name="type" value={filter.type} onChange={handleFilterChange} className="form-input !py-2 !px-3 text-sm pr-8 w-32">
                <option value="day">รายวัน</option><option value="month">รายเดือน</option><option value="year">รายปี</option>
            </select>
            {renderFilterInput()}
            <select name="source" value={filter.source} onChange={handleFilterChange} className="form-input !py-2 !px-3 text-sm pr-8 w-40">
                <option value="all">ทุกแหล่งที่มา</option>
                <option value="ทุน">ทุน</option>
                <option value="กำไร">กำไร</option>
            </select>
            <select name="category" value={filter.category} onChange={handleFilterChange} className="form-input !py-2 !px-3 text-sm pr-8 w-48">
                {expenseCategories.map(cat => <option key={cat} value={cat}>{cat === 'all' ? 'ทุกหมวดหมู่' : cat}</option>)}
            </select>
        </div>
        <div className="text-right flex-shrink-0">
            <p className="text-xs text-gray-500">ยอดรวมที่แสดง</p>
            <p className="text-xl font-bold text-red-600">{totalFilteredAmount.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}</p>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-4 printable-container">
        <h1 className="hidden print-title">สรุปรายการรายจ่าย</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left font-semibold text-gray-600">วันที่</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-600">หมวดหมู่</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-600">คำอธิบาย</th>
                <th className="py-3 px-4 text-right font-semibold text-gray-600">จำนวนเงิน</th>
                <th className="py-3 px-4 text-center font-semibold text-gray-600 non-printable">การกระทำ</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length > 0 ? filteredExpenses.map((expense) => (
                <tr key={expense._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 px-4 text-sm">{moment(expense.date).format('DD/MM/YYYY')}</td>
                  <td className="p-3 px-4 text-sm">{expense.category}</td>
                  <td className="p-3 px-4 text-sm">{expense.description}</td>
                  <td className="p-3 px-4 text-right text-sm text-red-600">{expense.amount.toLocaleString('th-TH')}</td>
                  <td className="p-3 px-4 text-center non-printable">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleEditExpense(expense)} className="btn p-2.5 bg-yellow-100 text-yellow-700 hover:bg-yellow-200"><FaEdit /></button>
                      <button onClick={() => handleDeleteExpense(expense._id, expense.description)} className="btn p-2.5 bg-red-100 text-red-700 hover:bg-red-200"><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                    <td colSpan="5" className="text-center py-10 text-gray-500">
                        <FaRegFileAlt className="mx-auto text-4xl mb-2 text-gray-300" />
                        ไม่พบข้อมูลรายจ่าย
                    </td>
                </tr>
              )}
            </tbody>
            {filteredExpenses.length > 0 && (
                <tfoot>
                    <tr className="border-t-2"><td colSpan="3" className="text-right font-bold py-3 px-4">ยอดรวม:</td><td className="text-right font-bold text-red-600 py-3 px-4">{totalFilteredAmount.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}</td><td className="non-printable"></td></tr>
                </tfoot>
            )}
          </table>
        </div>
      </div>

      {isExpenseModalOpen && (<ExpenseModal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} expense={currentExpense} onManageCategories={() => setIsCategoryModalOpen(true)} />)}
      {isCategoryModalOpen && (<CategoryModal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} />)}
    </div>
    </>
  );
}

export default ExpensesPage;