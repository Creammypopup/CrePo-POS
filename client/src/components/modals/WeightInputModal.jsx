// client/src/components/modals/WeightInputModal.jsx
import React, { useState } from 'react';
import Modal from 'react-modal';
import { FaTimes, FaWeightHanging } from 'react-icons/fa';
import { toast } from 'react-toastify';

const customModalStyles = {
  content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', borderRadius: '1.5rem', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '0', width: '90%', maxWidth: '400px', background: '#FDF7FF' },
  overlay: { backgroundColor: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(4px)', zIndex: 70 }
};

Modal.setAppElement('#root');

const WeightInputModal = ({ isOpen, onClose, product, onConfirm }) => {
    const [weight, setWeight] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const weightValue = parseFloat(weight);
        if (isNaN(weightValue) || weightValue <= 0) {
            toast.error('กรุณากรอกน้ำหนักที่ถูกต้อง');
            return;
        }
        onConfirm(weightValue);
        onClose();
        setWeight('');
    };

    if (!product) return null;

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} style={customModalStyles}>
            <div className="bg-white/50 p-6 flex justify-between items-center rounded-t-2xl border-b">
                <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
                <button onClick={onClose}><FaTimes className="text-gray-400 hover:text-red-500 text-2xl"/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                    <label className="block text-sm font-bold mb-2 text-gray-600">
                        กรอกน้ำหนัก (กิโลกรัม)
                    </label>
                    <div className="relative">
                        <input 
                            type="number"
                            step="any"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="form-input text-center text-3xl p-4"
                            required
                            autoFocus
                        />
                         <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">kg</span>
                    </div>
                </div>
                <div className="pt-4">
                    <button type="submit" className="btn btn-3d-pastel btn-primary w-full text-lg py-3">
                        <FaWeightHanging className="mr-2"/> ยืนยันน้ำหนัก
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default WeightInputModal;