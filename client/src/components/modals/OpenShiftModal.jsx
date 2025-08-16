// client/src/components/modals/OpenShiftModal.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { openShift } from '../../features/shift/shiftSlice';
import { FaPlayCircle, FaTimes } from 'react-icons/fa'; // Import FaTimes

export const OpenShiftModal = ({ isOpen, onClose }) => { // Add onClose prop
    const [startAmount, setStartAmount] = useState('');
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        const amount = parseFloat(startAmount);
        if (isNaN(amount) || amount < 0) {
            toast.error('กรุณากรอกจำนวนเงินเริ่มต้นให้ถูกต้อง');
            return;
        }
        dispatch(openShift(amount))
            .unwrap()
            .then(() => toast.success('เปิดกะการขายสำเร็จ!'))
            .catch(err => toast.error(err));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fade-in">
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center w-full max-w-sm">
                <div className="flex justify-end w-full">
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><FaTimes size={24} /></button>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">เปิดกะการขายใหม่</h3>
                <p className="text-gray-600 my-4">กรุณาระบุจำนวนเงินทอนเริ่มต้นในลิ้นชัก</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        type="number"
                        value={startAmount}
                        onChange={(e) => setStartAmount(e.target.value)}
                        placeholder="0.00"
                        className="form-input text-center text-2xl p-4"
                        required
                        autoFocus
                    />
                    <button type="submit" className="btn btn-3d-pastel btn-primary w-full flex items-center justify-center text-lg py-3">
                        <FaPlayCircle className="mr-2" /> เริ่มการขาย
                    </button>
                </form>
            </div>
        </div>
    );
};