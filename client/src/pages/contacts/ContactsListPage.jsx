// client/src/pages/contacts/ContactsListPage.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaUserPlus, FaEdit, FaTrash, FaSearch, FaUsers } from 'react-icons/fa';
import Spinner from '../../components/Spinner';
import ContactModal from '../../components/modals/ContactModal';
import { toast } from 'react-toastify';

const ContactsListPage = ({
    pageTitle,
    contactType,
    dataSelector,
    getThunk,
    createThunk,
    updateThunk,
    deleteThunk,
    resetThunk
}) => {
    const dispatch = useDispatch();
    const { data, isLoading, isError, message } = useSelector(dataSelector);

    const [modalState, setModalState] = useState({ isOpen: false, contact: null });
    const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, contact: null });
    const [searchTerm, setSearchTerm] = useState('');
    
    useEffect(() => {
        dispatch(getThunk());
        return () => { dispatch(resetThunk()); };
    }, [dispatch, getThunk, resetThunk]);

    useEffect(() => {
        if (isError) toast.error(message);
    }, [isError, message]);

    const filteredData = useMemo(() => {
        if (!Array.isArray(data)) return [];
        if (!searchTerm) return data;
        return data.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [data, searchTerm]);

    const handleOpenModal = (contact = null) => setModalState({ isOpen: true, contact });
    const handleCloseModal = () => setModalState({ isOpen: false, contact: null });

    const handleDelete = (contact) => {
        dispatch(deleteThunk(contact._id))
            .unwrap()
            .then(() => {
                toast.success(`ลบข้อมูล "${contact.name}" สำเร็จ`);
                setDeleteConfirm({ isOpen: false, contact: null });
            })
            .catch((err) => toast.error(err));
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <h1 className="text-3xl font-bold text-gray-800">{pageTitle}</h1>
                     <button onClick={() => handleOpenModal()} className="btn btn-3d-pastel btn-primary">
                        <FaUserPlus className="mr-2" /> เพิ่ม{pageTitle.includes('ลูกค้า') ? 'ลูกค้า' : 'ผู้จำหน่าย'}ใหม่
                    </button>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                        <div className="relative flex-grow">
                            <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                            <input type="text" placeholder="ค้นหาจากชื่อ..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="form-input !pl-11"/>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 bg-gray-100 px-4 py-2 rounded-lg">
                            <FaUsers />
                            <span className="font-medium">ทั้งหมด: {filteredData.length} รายการ</span>
                        </div>
                    </div>
                    
                    {isLoading && (!data || data.length === 0) ? <Spinner /> : (
                         <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2">
                                        <th className="p-3 text-left text-sm font-semibold text-gray-500 w-16">ลำดับ</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-500">ชื่อ</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-500 hidden md:table-cell">เบอร์โทรศัพท์</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-500 hidden lg:table-cell">อีเมล</th>
                                        <th className="p-3 text-center text-sm font-semibold text-gray-500">การกระทำ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.length > 0 ? filteredData.map((contact, index) => (
                                        <tr key={contact._id} className="border-b hover:bg-gray-50">
                                            <td className="p-4 text-center text-gray-500">{index + 1}</td>
                                            <td className="p-4 font-medium text-gray-800">{contact.name}</td>
                                            <td className="p-4 text-gray-600 hidden md:table-cell">{contact.phone || '-'}</td>
                                            <td className="p-4 text-gray-600 hidden lg:table-cell">{contact.email || '-'}</td>
                                            <td className="p-4 flex justify-center space-x-2">
                                                <button onClick={() => handleOpenModal(contact)} className="btn btn-3d-pastel bg-brand-warning text-yellow-800 p-2.5"><FaEdit /></button>
                                                <button onClick={() => setDeleteConfirm({ isOpen: true, contact })} className="btn btn-3d-pastel bg-brand-danger text-red-800 p-2.5"><FaTrash /></button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="5" className="text-center p-10 text-gray-400">ยังไม่มีข้อมูล</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <ContactModal 
                isOpen={modalState.isOpen}
                onClose={handleCloseModal}
                contact={modalState.contact}
                type={contactType}
                onSave={modalState.contact ? updateThunk : createThunk}
            />

            {deleteConfirm.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 animate-fade-in">
                    <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
                        <h3 className="text-xl font-bold text-gray-800">ยืนยันการลบ</h3>
                        <p className="text-gray-600 my-4">คุณแน่ใจหรือไม่ว่าต้องการลบ <strong className='text-red-500'>{deleteConfirm.contact.name}</strong>?</p>
                        <div className="flex justify-center space-x-4">
                            <button onClick={() => setDeleteConfirm({ isOpen: false, contact: null })} className="btn bg-gray-200 hover:bg-gray-300">ยกเลิก</button>
                            <button onClick={() => handleDelete(deleteConfirm.contact)} className="btn btn-3d-pastel btn-danger">ยืนยัน</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ContactsListPage;