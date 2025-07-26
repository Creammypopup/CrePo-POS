import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaPlus, FaRegFileAlt, FaEdit, FaTrash } from "react-icons/fa";
import {
  getExpenses,
  deleteExpense,
  reset,
} from "../features/expense/expenseSlice";
import ExpenseModal from "../components/modals/ExpenseModal"; // <--- แก้ไข path ตรงนี้
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

function ExpensesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const dispatch = useDispatch();
  const { expenses, isLoading, isError, message } = useSelector(
    (state) => state.expense
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    dispatch(getExpenses());
    return () => {
      dispatch(reset());
    };
  }, [dispatch, isError, message]);

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

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">จัดการรายจ่าย</h1>
        <button
          onClick={handleAddExpense}
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg flex items-center transition duration-300"
        >
          <FaPlus className="mr-2" /> เพิ่มรายจ่าย
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  วันที่
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  หมวดหมู่
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  คำอธิบาย
                </th>
                <th className="py-3 px-4 text-right text-sm font-semibold text-gray-600">
                  จำนวนเงิน
                </th>
                <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600">
                  การกระทำ
                </th>
              </tr>
            </thead>
            <tbody>
              {expenses.length > 0 ? (
                expenses.map((expense) => (
                  <tr key={expense._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {new Date(expense.date).toLocaleDateString("th-TH")}
                    </td>
                    <td className="py-3 px-4">{expense.category}</td>
                    <td className="py-3 px-4">{expense.description}</td>
                    <td className="py-3 px-4 text-right">
                      {expense.amount.toLocaleString("th-TH", {
                        style: "currency",
                        currency: "THB",
                      })}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleEditExpense(expense)}
                        className="text-yellow-500 hover:text-yellow-600 mr-3"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(expense._id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    <FaRegFileAlt className="mx-auto text-4xl mb-2" />
                    ยังไม่มีข้อมูลรายจ่าย
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
