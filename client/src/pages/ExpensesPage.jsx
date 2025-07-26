import React from 'react';
import { FaPlus, FaRegFileAlt } from 'react-icons/fa';

// Mock Data
const mockExpenses = [
    { id: 1, date: '25/07/2025', category: 'ค่าเดินทาง', description: 'ค่าน้ำมันรถส่งของ', amount: 1200.00 },
    { id: 2, date: '25/07/2025', category: 'ค่าวัสดุ', description: 'สั่งซื้อสกรูและน็อต', amount: 850.50 },
    { id: 3, date: '24/07/2025', category: 'ค่าสาธารณูปโภค', description: 'ค่าไฟฟ้าประจำเดือน', amount: 3500.00 },
    { id: 4, date: '23/07/2025', category: 'อื่นๆ', description: 'ค่าเลี้ยงกาแฟลูกค้า', amount: 350.00 },
];

function ExpensesPage() {
  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">บันทึกค่าใช้จ่าย</h1>
            <button className="bg-pastel-peach-dark hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-xl flex items-center transition-all duration-300 shadow-lg shadow-orange-200">
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
                            <th className="p-3 text-sm font-semibold text-gray-500 uppercase tracking-wider text-right">จำนวนเงิน (บาท)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockExpenses.map((expense) => (
                            <tr key={expense.id} className="border-b hover:bg-gray-50">
                                <td className="p-4 text-gray-600">{expense.date}</td>
                                <td className="p-4">
                                    <span className="px-3 py-1 text-sm rounded-full bg-orange-100 text-orange-700 font-semibold">
                                        {expense.category}
                                    </span>
                                </td>
                                <td className="p-4 font-medium text-gray-800">{expense.description}</td>
                                <td className="p-4 text-gray-800 font-semibold text-right">{expense.amount.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
}

export default ExpensesPage;