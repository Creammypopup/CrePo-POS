// client/src/components/modals/PawnActionModal.jsx
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FaTimes, FaMoneyBillWave, FaCalendarPlus, FaExclamationTriangle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { updatePawn } from '../../features/pawn/pawnSlice';
import moment from 'moment';
import { formatCurrency } from '../../utils/formatUtils';

const customModalStyles = {
  content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', borderRadius: '1.5rem', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '0', width: '90%', maxWidth: '550px', background: '#FDF7FF' },
  overlay: { backgroundColor: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(4px)', zIndex: 60 }
};

Modal.setAppElement('#root');

const PawnActionModal = ({ isOpen, onClose, pawn }) => {
    const dispatch = useDispatch();
    const [calculated, setCalculated] = useState({ months: 0, interest: 0, total: 0 });
    const [extendMonths, setExtendMonths] = useState(1);

    useEffect(() => {
        if (pawn) {
            const startDate = moment(pawn.startDate);
            const today = moment();
            const monthsPassed = Math.ceil(today.diff(startDate, 'months', true));
            const interest = pawn.pawnAmount * (pawn.interestRate / 100) * monthsPassed;
            const total = pawn.pawnAmount + interest;
            setCalculated({ months: monthsPassed > 0 ? monthsPassed : 1, interest, total });
        }
    }, [pawn]);
    
    const handleRedeem = () => {
        if (window.confirm('ยืนยันการไถ่ถอนทรัพย์สินชิ้นนี้?')) {
            dispatch(updatePawn({ ...pawn, status: 'redeemed' }))
                .unwrap()
                .then(() => {
                    toast.success('บันทึกการไถ่ถอนสำเร็จ!');
                    onClose();
                })
                .catch(err => toast.error(err));
        }
    };

    const handleExtend = () => {
        const newEndDate = moment(pawn.endDate).add(extendMonths, 'months').format('YYYY-MM-DD');
        if (window.confirm(`ชำระดอกเบี้ย ${formatCurrency(calculated.interest)} และต่อสัญญาไปอีก ${extendMonths} เดือน ถึงวันที่ ${moment(newEndDate).format('DD/MM/YYYY')}?`)) {
            // Here you would typically record the interest payment as an expense/income
            // For now, we just update the end date
            dispatch(updatePawn({ ...pawn, endDate: newEndDate }))
                .unwrap()
                .then(() => {
                    toast.success('ต่อดอกเบี้ยสำเร็จ!');
                    onClose();
                })
                .catch(err => toast.error(err));
        }
    }

    const handleForfeit = () => {
        if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการปรับสถานะเป็น "หลุดจำนำ"? การกระทำนี้ไม่สามารถย้อนกลับได้')) {
            dispatch(updatePawn({ ...pawn, status: 'forfeited' }))
                .unwrap()
                .then(() => {
                    toast.warn('ปรับสถานะเป็นหลุดจำนำแล้ว');
                    onClose();
                })
                .catch(err => toast.error(err));
        }
    }
    
    if (!pawn) return null;

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} style={customModalStyles}>
            <div className="bg-white/50 p-6 flex justify-between items-center rounded-t-2xl border-b">
                <h2 className="text-2xl font-bold text-gray-800">จัดการรายการรับฝาก</h2>
                <button onClick={onClose}><FaTimes className="text-gray-400 hover:text-red-500 text-2xl"/></button>
            </div>
            <div className="p-6 space-y-4">
                <div className="p-4 bg-white rounded-lg shadow-sm">
                    <p className="font-semibold text-lg">{pawn.productName}</p>
                    <p className="text-sm text-gray-500">ลูกค้า: {pawn.customer?.name}</p>
                    <p className="text-sm text-gray-500">เลขที่ตั๋ว: {pawn.pawnTicketId}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-blue-100 p-3 rounded-lg">
                        <p className="text-sm text-blue-800 font-semibold">เงินต้น</p>
                        <p className="text-xl font-bold text-blue-900">{formatCurrency(pawn.pawnAmount)}</p>
                    </div>
                     <div className="bg-yellow-100 p-3 rounded-lg">
                        <p className="text-sm text-yellow-800 font-semibold">ดอกเบี้ย ({calculated.months} เดือน)</p>
                        <p className="text-xl font-bold text-yellow-900">{formatCurrency(calculated.interest)}</p>
                    </div>
                </div>
                 <div className="bg-green-100 p-4 rounded-lg text-center">
                    <p className="text-md text-green-800 font-semibold">ยอดรวมไถ่ถอน</p>
                    <p className="text-3xl font-bold text-green-900">{formatCurrency(calculated.total)}</p>
                </div>

                {/* Extend Section */}
                <div className="p-4 bg-amber-50 rounded-lg space-y-2">
                    <p className="font-semibold text-amber-800 flex items-center"><FaCalendarPlus className="mr-2"/> ต่อดอก</p>
                    <div className="flex items-center gap-2">
                        <input type="number" value={extendMonths} onChange={e => setExtendMonths(parseInt(e.target.value))} className="form-input w-20 !py-1.5" min="1" />
                        <label className="text-sm text-gray-700">เดือน</label>
                        <button onClick={handleExtend} className="btn btn-3d-pastel bg-amber-200 text-amber-800 ml-auto">จ่ายดอกและต่อสัญญา</button>
                    </div>
                </div>
            </div>
             <div className="flex justify-between items-center mt-auto pt-4 border-t bg-white/50 rounded-b-2xl p-6">
                <button onClick={handleForfeit} className="btn bg-red-100 text-red-800 flex items-center">
                    <FaExclamationTriangle className="mr-2"/> หลุดจำนำ
                </button>
                <button type="button" onClick={handleRedeem} className="btn btn-3d-pastel btn-success flex items-center">
                    <FaMoneyBillWave className="mr-2" /> ยืนยันการไถ่ถอน
                </button>
            </div>
        </Modal>
    );
};

export default PawnActionModal;