// client/src/pages/PawnPage.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaPlus, FaSearch, FaDollarSign, FaTrash, FaEdit, FaPrint } from 'react-icons/fa';
import Spinner from '../components/Spinner';
import PawnModal from '../components/modals/PawnModal';
import PawnActionModal from '../components/modals/PawnActionModal';
import { getPawns, deletePawn, reset } from '../features/pawn/pawnSlice';
import { toast } from 'react-toastify';
import moment from 'moment';
import { formatCurrency } from '../utils/formatUtils';

function PawnPage() {
    const dispatch = useDispatch();
    const { pawns, isLoading, isError, message } = useSelector((state) => state.pawn);

    const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [selectedPawn, setSelectedPawn] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, pawn: null });

    useEffect(() => {
        dispatch(getPawns());
        return () => { dispatch(reset()); };
    }, [dispatch]);

    useEffect(() => {
        if (isError) toast.error(message);
    }, [isError, message]);

    const filteredPawns = useMemo(() => {
        if (!Array.isArray(pawns)) return [];
        if (!searchTerm) return pawns;
        return pawns.filter(p => 
            p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.customer?.name && p.customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            p.pawnTicketId.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [pawns, searchTerm]);

    const handleOpenModal = (pawn = null) => {
        setSelectedPawn(pawn);
        setIsAddEditModalOpen(true);
    };

    const handleOpenActionModal = (pawn) => {
        setSelectedPawn(pawn);
        setIsActionModalOpen(true);
    };

    const handleDelete = (pawn) => {
        dispatch(deletePawn(pawn._id))
            .unwrap()
            .then(() => {
                toast.success('ลบรายการสำเร็จ');
                setDeleteConfirm({ isOpen: false, pawn: null });
            })
            .catch(err => toast.error(err));
    };

    const getStatusChip = (status) => {
        switch (status) {
            case 'active': return 'bg-blue-100 text-blue-800';
            case 'redeemed': return 'bg-green-100 text-green-800';
            case 'expired': return 'bg-yellow-100 text-yellow-800';
            case 'forfeited': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    
    const statusTranslations = {
        active: 'ดำเนินการ',
        redeemed: 'ไถ่ถอนแล้ว',
        expired: 'หมดอายุ',
        forfeited: 'หลุดจำนำ'
    }

    const typeTranslations = {
        pawn: 'รับฝาก',
        loan: 'ยืมเงิน'
    }

    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <h1 className="text-3xl font-bold text-gray-800">ระบบรับฝาก / จำนำ</h1>
                    <button onClick={() => handleOpenModal()} className="btn btn-3d-pastel btn-primary">
                        <FaPlus className="mr-2" /> เพิ่มรายการใหม่
                    </button>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <div className="relative mb-4">
                        <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="ค้นหาจากชื่อทรัพย์สิน, ลูกค้า, เลขที่ตั๋ว..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="form-input !pl-11"/>
                    </div>
                    
                    {isLoading && (!pawns || pawns.length === 0) ? <Spinner /> : (
                         <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2">
                                        <th className="p-3 text-left text-sm font-semibold text-gray-500">เลขที่ตั๋ว</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-500">ประเภท</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-500">รายการ/ทรัพย์สิน</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-500">ลูกค้า</th>
                                        <th className="p-3 text-right text-sm font-semibold text-gray-500">เงินต้น</th>
                                        <th className="p-3 text-center text-sm font-semibold text-gray-500">วันสิ้นสุด</th>
                                        <th className="p-3 text-center text-sm font-semibold text-gray-500">สถานะ</th>
                                        <th className="p-3 text-center text-sm font-semibold text-gray-500">การกระทำ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPawns.length > 0 ? filteredPawns.map((pawn) => (
                                        <tr key={pawn._id} className="border-b hover:bg-gray-50">
                                            <td className="p-4 font-mono text-xs text-gray-500">{pawn.pawnTicketId}</td>
                                            <td className="p-4 text-sm text-gray-600">{typeTranslations[pawn.type]}</td>
                                            <td className="p-4 font-medium text-gray-800">{pawn.productName}</td>
                                            <td className="p-4 text-gray-600">{pawn.customer?.name || '-'}</td>
                                            <td className="p-4 text-right text-gray-700">{formatCurrency(pawn.pawnAmount)}</td>
                                            <td className="p-4 text-center text-red-600">{moment(pawn.endDate).format('DD/MM/YYYY')}</td>
                                            <td className="p-4 text-center">
                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusChip(pawn.status)}`}>
                                                    {statusTranslations[pawn.status]}
                                                </span>
                                            </td>
                                            <td className="p-4 flex justify-center space-x-2">
                                                <button onClick={() => handleOpenActionModal(pawn)} className="btn btn-3d-pastel bg-green-200 text-green-800 p-2.5" disabled={pawn.status !== 'active'} title="จัดการ (ไถ่ถอน/ต่อดอก)"><FaDollarSign /></button>
                                                <button onClick={() => toast.info('ฟังก์ชันพิมพ์ตั๋วจะพร้อมใช้งานเร็วๆ นี้')} className="btn btn-3d-pastel bg-blue-200 text-blue-800 p-2.5" title="พิมพ์ตั๋ว"><FaPrint /></button>
                                                <button onClick={() => handleOpenModal(pawn)} className="btn btn-3d-pastel bg-brand-warning text-yellow-800 p-2.5" title="แก้ไขข้อมูล"><FaEdit /></button>
                                                <button onClick={() => setDeleteConfirm({isOpen: true, pawn})} className="btn btn-3d-pastel bg-brand-danger text-red-800 p-2.5" title="ลบรายการ"><FaTrash /></button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="8" className="text-center p-10 text-gray-400">ยังไม่มีข้อมูลการรับฝาก</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
            <PawnModal 
                isOpen={isAddEditModalOpen}
                onClose={() => setIsAddEditModalOpen(false)}
                pawn={selectedPawn}
            />
            <PawnActionModal 
                isOpen={isActionModalOpen}
                onClose={() => setIsActionModalOpen(false)}
                pawn={selectedPawn}
            />

            {deleteConfirm.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 animate-fade-in">
                    <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
                        <h3 className="text-xl font-bold text-gray-800">ยืนยันการลบ</h3>
                        <p className="text-gray-600 my-4">คุณแน่ใจหรือไม่ว่าต้องการลบรายการ <strong className='text-red-500'>{deleteConfirm.pawn.productName}</strong>?</p>
                        <div className="flex justify-center space-x-4">
                            <button onClick={() => setDeleteConfirm({ isOpen: false, pawn: null })} className="btn bg-gray-200 hover:bg-gray-300">ยกเลิก</button>
                            <button onClick={() => handleDelete(deleteConfirm.pawn)} className="btn btn-3d-pastel btn-danger">ยืนยัน</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default PawnPage;