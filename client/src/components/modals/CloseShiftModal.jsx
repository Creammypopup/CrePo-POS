// client/src/components/modals/CloseShiftModal.jsx
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal'; // <-- THE MISSING IMPORT
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { closeShift } from '../../features/shift/shiftSlice';
import { FaTimes, FaLock, FaPrint } from 'react-icons/fa';
import { formatCurrency } from '../../utils/formatUtils';
import axios from 'axios';
import Spinner from '../Spinner';

const customModalStyles = {
  content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', borderRadius: '1.5rem', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '0', width: '90%', maxWidth: '500px', background: '#FDF7FF' },
  overlay: { backgroundColor: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(4px)', zIndex: 60 }
};

Modal.setAppElement('#root');

const CloseShiftModal = ({ isOpen, onClose, shift }) => {
    const [endAmount, setEndAmount] = useState('');
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchSalesSummary = async () => {
            setLoading(true);
            try {
                const token = JSON.parse(localStorage.getItem('user'))?.token;
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data: allSales } = await axios.get('/api/sales', config);
                
                const shiftSales = allSales.filter(s => s.shift === shift._id);
                
                let cash = 0, transfer = 0, credit = 0;
                shiftSales.forEach(s => {
                    if(s.paymentMethod === 'cash') cash += s.totalAmount;
                    else if(s.paymentMethod === 'transfer') transfer += s.totalAmount;
                    else if(s.paymentMethod === 'credit') credit += s.totalAmount;
                });
                const total = cash + transfer + credit;
                const expectedCash = shift.startAmount + cash;

                setSummary({ cash, transfer, credit, total, expectedCash });
            } catch (error) {
                toast.error("ไม่สามารถสรุปยอดขายได้");
            } finally {
                setLoading(false);
            }
        };

        if (isOpen && shift) {
            fetchSalesSummary();
        }
    }, [isOpen, shift]);
    
    const cashDifference = summary ? parseFloat(endAmount || 0) - summary.expectedCash : 0;

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(closeShift(parseFloat(endAmount)))
            .unwrap()
            .then(() => {
                toast.success('ปิดกะเรียบร้อย');
                onClose();
            })
            .catch(err => toast.error(err));
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} style={customModalStyles}>
            <div className="bg-white/50 p-6 flex justify-between items-center rounded-t-2xl border-b">
                <h2 className="text-2xl font-bold text-gray-800">ปิดกะการขาย #{shift?.shiftNumber}</h2>
                <button onClick={onClose}><FaTimes className="text-gray-400 hover:text-red-500 text-2xl"/></button>
            </div>
            {loading ? <div className="h-96 flex justify-center items-center"><Spinner/></div> : summary ? (
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div className="p-4 bg-white rounded-lg shadow-sm space-y-2">
                            <div className="flex justify-between"><span className="text-gray-600">เงินทอนเริ่มต้น:</span> <span className="font-semibold">{formatCurrency(shift.startAmount)}</span></div>
                            <div className="flex justify-between"><span className="text-gray-600">ยอดขายเงินสด:</span> <span className="font-semibold">{formatCurrency(summary.cash)}</span></div>
                            <div className="flex justify-between border-t pt-2"><span className="text-gray-800 font-bold">เงินสดที่ควรมี:</span> <span className="font-bold text-blue-600">{formatCurrency(summary.expectedCash)}</span></div>
                        </div>
                         <div>
                            <label className="block text-sm font-bold mb-2 text-gray-600">จำนวนเงินสดในลิ้นชัก (ที่นับได้)*</label>
                            <input type="number" step="any" value={endAmount} onChange={e => setEndAmount(e.target.value)} className="form-input text-2xl text-center p-3" required />
                        </div>
                        <div className={`p-3 rounded-lg text-center ${cashDifference === 0 ? 'bg-gray-100' : cashDifference > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                            <p className={`text-sm font-semibold ${cashDifference === 0 ? 'text-gray-800' : cashDifference > 0 ? 'text-green-800' : 'text-red-800'}`}>
                                ส่วนต่างเงินสด
                            </p>
                            <p className={`text-xl font-bold ${cashDifference === 0 ? 'text-gray-900' : cashDifference > 0 ? 'text-green-900' : 'text-red-900'}`}>
                                {formatCurrency(cashDifference)}
                            </p>
                        </div>
                         <div className="p-4 bg-white rounded-lg shadow-sm space-y-2">
                             <div className="flex justify-between"><span className="text-gray-600">ยอดขายโอน:</span> <span className="font-semibold">{formatCurrency(summary.transfer)}</span></div>
                             <div className="flex justify-between"><span className="text-gray-600">ยอดขายเงินเชื่อ:</span> <span className="font-semibold">{formatCurrency(summary.credit)}</span></div>
                             <div className="flex justify-between border-t pt-2"><span className="text-gray-800 font-bold">ยอดขายรวมทั้งหมด:</span> <span className="font-bold text-green-600">{formatCurrency(summary.total)}</span></div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center mt-auto pt-4 border-t bg-white/50 rounded-b-2xl p-6 gap-2">
                         <button type="button" onClick={() => toast.info('ฟังก์ชันพิมพ์จะพร้อมใช้งานเร็วๆ นี้')} className="btn bg-gray-200 text-gray-700 hover:bg-gray-300">
                           <FaPrint/>
                        </button>
                        <button type="submit" className="btn btn-3d-pastel btn-danger flex items-center w-full justify-center text-lg py-3">
                            <FaLock className="mr-2" /> ยืนยันการปิดกะ
                        </button>
                    </div>
                </form>
            ) : <div className="p-10 text-center text-red-500">ไม่สามารถสรุปยอดขายได้</div>}
        </Modal>
    );
};

export default CloseShiftModal;