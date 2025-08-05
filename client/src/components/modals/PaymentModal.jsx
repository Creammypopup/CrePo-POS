// client/src/components/modals/PaymentModal.jsx
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FaTimes, FaMoneyBillWave, FaCreditCard, FaQrcode } from 'react-icons/fa';
import { formatCurrency } from '../../utils/formatUtils';
import { toast } from 'react-toastify'; // Import toast

const customModalStyles = {
  content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', borderRadius: '1.5rem', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '0', width: '90%', maxWidth: '500px', background: '#FDF7FF', maxHeight: '90vh', display: 'flex', flexDirection: 'column' },
  overlay: { backgroundColor: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(4px)', zIndex: 50 }
};

Modal.setAppElement('#root');

const PaymentModal = ({ isOpen, onClose, total, onConfirmPayment }) => {
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [amountReceived, setAmountReceived] = useState('');
    const [change, setChange] = useState(0);

    useEffect(() => {
        if (isOpen) {
            setAmountReceived('');
            setChange(0);
            setPaymentMethod('cash');
        }
    }, [isOpen]);

    useEffect(() => {
        const received = parseFloat(amountReceived) || 0;
        setChange(received >= total ? received - total : 0);
    }, [amountReceived, total]);

    const handleConfirm = () => {
        if (paymentMethod === 'cash' && (parseFloat(amountReceived) || 0) < total) {
            toast.error('จำนวนเงินที่รับมาไม่เพียงพอ');
            return;
        }
        onConfirmPayment({
            paymentMethod,
            amountReceived: parseFloat(amountReceived) || total,
            total,
            change
        });
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} style={customModalStyles}>
            <div className="bg-white/50 p-6 flex justify-between items-center rounded-t-2xl border-b">
                <h2 className="text-2xl font-bold text-gray-800">ชำระเงิน</h2>
                <button onClick={onClose}><FaTimes className="text-gray-400 hover:text-red-500 text-2xl"/></button>
            </div>
            <div className="p-6 flex-grow overflow-y-auto space-y-6">
                <div className="text-center">
                    <p className="text-gray-500">ยอดชำระทั้งหมด</p>
                    <p className="text-5xl font-bold text-brand-purple">{formatCurrency(total)}</p>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => setPaymentMethod('cash')} className={`btn ${paymentMethod === 'cash' ? 'bg-green-200 text-green-800' : 'bg-gray-100'}`}><FaMoneyBillWave className="mr-2"/>เงินสด</button>
                    <button onClick={() => setPaymentMethod('transfer')} className={`btn ${paymentMethod === 'transfer' ? 'bg-blue-200 text-blue-800' : 'bg-gray-100'}`}><FaQrcode className="mr-2"/>โอนชำระ</button>
                    <button onClick={() => setPaymentMethod('credit')} className={`btn ${paymentMethod === 'credit' ? 'bg-orange-200 text-orange-800' : 'bg-gray-100'}`}><FaCreditCard className="mr-2"/>เงินเชื่อ</button>
                </div>

                {paymentMethod === 'cash' && (
                    <div className="space-y-4 animate-fade-in">
                        <div>
                            <label className="block text-sm font-medium mb-1">รับเงินมา</label>
                            <input type="number" value={amountReceived} onChange={(e) => setAmountReceived(e.target.value)} className="form-input text-2xl text-center p-4" placeholder="0.00" />
                        </div>
                        <div className="text-center">
                            <p className="text-gray-500">เงินทอน</p>
                            <p className="text-3xl font-semibold text-green-600">{formatCurrency(change)}</p>
                        </div>
                    </div>
                )}

                {paymentMethod === 'transfer' && (
                     <div className="p-4 bg-blue-50 rounded-lg text-center animate-fade-in">
                        <p className="font-semibold">สแกน QR Code เพื่อชำระเงิน</p>
                        <div className="w-40 h-40 bg-gray-300 mx-auto my-2 flex items-center justify-center text-gray-500">QR Code</div>
                        <p className="text-sm">ชื่อบัญชี: ร้าน CrePo-POS</p>
                     </div>
                )}
            </div>
            <div className="flex justify-end items-center mt-auto p-6 border-t bg-white/50 rounded-b-2xl">
                <button onClick={handleConfirm} className="w-full btn btn-3d-pastel btn-primary text-lg py-4">
                    ยืนยันการชำระเงิน
                </button>
            </div>
        </Modal>
    );
};

export default PaymentModal;