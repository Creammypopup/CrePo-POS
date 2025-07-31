// src/pages/ExpensesPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaPlus, FaRegFileAlt, FaEdit, FaTrash, FaFilter, FaPrint } from "react-icons/fa";
import { getExpenses, deleteExpense, reset } from "../features/expense/expenseSlice";
import ExpenseModal from "../components/modals/ExpenseModal";
import Spinner from "../components/Spinner";
import moment from 'moment';

function ExpensesPage() {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [filter, setFilter] = useState({ type: 'month', value: moment().format('YYYY-MM'), category: 'all' });

  const dispatch = useDispatch();
  const { expenses, isLoading } = useSelector((state) => state.expense);

  const expenseCategories = useMemo(() => {
    if (!expenses) return [];
    const uniqueCategories = new Set(expenses.map(exp => exp.category));
    return ['all', ...Array.from(uniqueCategories)];
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    if (!expenses) return [];
    let data = expenses;
    if (filter.category && filter.category !== 'all') {
        data = data.filter(exp => exp.category === filter.category);
    }
    if (!filter.value) return data;
    return data.filter(exp => {
        const expenseDate = moment(exp.date);
        if (filter.type === 'day') return expenseDate.isSame(filter.value, 'day');
        if (filter.type === 'month') return expenseDate.isSame(filter.value, 'month');
        if (filter.type === 'year') {
            const year = parseInt(filter.value, 10);
            return expenseDate.year() === (year > 2500 ? year - 543 : year);
        }
        return true;
    });
  }, [expenses, filter]);

  const totalFilteredAmount = useMemo(() =>
    filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0), [filteredExpenses]);

  const handleAddExpense = () => {
    setCurrentExpense(null);
    setIsExpenseModalOpen(true);
  };
  
  return (
    <>
    <style>{`
        @media print {
            body * { visibility: hidden; }
            .printable-container, .printable-container * { 
                visibility: visible !important;
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
            }
            .printable-container { position: absolute; left: 0; top: 0; width: 100%; font-size: 10pt; }
            .print-title { visibility: visible !important; display: block !important; text-align: center; font-size: 18pt; margin-bottom: 1rem;}
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

      <div className="bg-white p-4 rounded-2xl shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4 non-printable">
        <div className="flex items-center gap-x-4 gap-y-2 flex-wrap">
            <div className="flex items-center gap-2 text-gray-600 font-semibold"><FaFilter /><span>ตัวกรอง:</span></div>
            <select onChange={(e) => setFilter({ ...filter, type: e.target.value, value: '' })} className="form-input !py-2 pr-10">
                <option value="month">รายเดือน</option><option value="day">รายวัน</option><option value="year">รายปี</option>
            </select>
            {/* Filter inputs */}
        </div>
        <div className="text-right flex-shrink-0">
            <p className="text-gray-500">ยอดรวมที่แสดง</p>
            <p className="text-2xl font-bold text-red-600">{totalFilteredAmount.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}</p>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-4 printable-container">
        <h1 className="hidden print-title">สรุปรายการรายจ่าย</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left">วันที่</th>
                <th className="py-3 px-4 text-left">หมวดหมู่</th>
                <th className="py-3 px-4 text-left">คำอธิบาย</th>
                <th className="py-3 px-4 text-right">จำนวนเงิน</th>
                <th className="py-3 px-4 text-center non-printable">การกระทำ</th>
              </tr>
            </thead>
            <tbody>
              {/* Table Body */}
            </tbody>
            {filteredExpenses.length > 0 && (
                <tfoot>
                    <tr className="border-t-2"><td colSpan="3" className="text-right font-bold py-3 px-4">ยอดรวม:</td><td className="text-right font-bold text-red-600 py-3 px-4">{totalFilteredAmount.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}</td><td className="non-printable"></td></tr>
                </tfoot>
            )}
          </table>
        </div>
      </div>

      {isExpenseModalOpen && (<ExpenseModal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} expense={currentExpense}/>)}
    </div>
    </>
  );
}

export default ExpensesPage;