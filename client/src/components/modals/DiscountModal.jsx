// client/src/components/modals/DiscountModal.jsx
import React, { useState } from 'react';
import Modal from 'react-modal';
import { FaTimes, FaPercentage, FaDollarSign } from 'react-icons/fa';
import { toast } from 'react-toastify';

const customModalStyles = {
  content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', borderRadius: '1.5rem', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '0', width: '90%', maxWidth: '400px', background: '#FDF7FF' },
  overlay: { backgroundColor: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(4px)', zIndex: 60 }
};

Modal.setAppElement('#root');

const DiscountModal = ({ isOpen, onClose, onApplyDiscount, currentDiscount = { type: 'percentage', value: 0 } }) => {
    const [type, setType] = useState(currentDiscount.type || 'percentage');
    const [value, setValue] = useState(currentDiscount.value || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        const discountValue = parseFloat(value);
        if (isNaN(discountValue) || discountValue < 0) {
            toast.error('กรุณาใส่ค่าส่วนลดที่ถูกต้อง');
            return;
        }
        onApplyDiscount({ type, value: discountValue });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} style={customModalStyles}>
            <div className="bg-white/50 p-6 flex justify-between items-center rounded-t-2xl border-b">
                <h2 className="text-2xl font-bold text-gray-800">ส่วนลด</h2>
                <button onClick={onClose}><FaTimes className="text-gray-400 hover:text-red-500 text-2xl"/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-200 rounded-lg">
                    <button type="button" onClick={() => setType('percentage')} className={`btn w-full ${type === 'percentage' ? 'bg-white shadow' : 'bg-transparent'}`}>เปอร์เซ็นต์ (%)</button>
                    <button type="button" onClick={() => setType('amount')} className={`btn w-full ${type === 'amount' ? 'bg-white shadow' : 'bg-transparent'}`}>จำนวนเงิน (บาท)</button>
                </div>
                <div>
                    <label className="block text-sm font-bold mb-2 text-gray-600">
                        {type === 'percentage' ? 'ระบุเปอร์เซ็นต์' : 'ระบุจำนวนเงิน'}
                    </label>
                    <div className="relative">
                        <input 
                            type="number"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="form-input text-center text-2xl p-4"
                            required
                            autoFocus
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                            {type === 'percentage' ? <FaPercentage/> : 'บาท'}
                        </span>
                    </div>
                </div>
                <div className="pt-4">
                    <button type="submit" className="btn btn-3d-pastel btn-primary w-full text-lg py-3">
                        ยืนยันส่วนลด
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default DiscountModal;