// client/src/components/modals/SelectCustomerModal.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'react-modal';
import { FaTimes, FaSearch } from 'react-icons/fa';
import { getCustomers } from '../../features/customer/customerSlice';
import Spinner from '../Spinner';

const customModalStyles = {
  content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', borderRadius: '1.5rem', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '0', width: '90%', maxWidth: '500px', background: '#FDF7FF', maxHeight: '70vh', display: 'flex', flexDirection: 'column' },
  overlay: { backgroundColor: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(4px)', zIndex: 60 }
};

Modal.setAppElement('#root');

const SelectCustomerModal = ({ isOpen, onClose, onSelectCustomer }) => {
    const dispatch = useDispatch();
    const { customers, isLoading } = useSelector((state) => state.customers);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isOpen) {
            dispatch(getCustomers());
        }
    }, [isOpen, dispatch]);

    const filteredCustomers = useMemo(() => {
        if (!Array.isArray(customers)) return [];
        if (!searchTerm) return customers;
        return customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [customers, searchTerm]);

    const handleSelect = (customer) => {
        onSelectCustomer(customer);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} style={customModalStyles}>
            <div className="bg-white/50 p-6 flex justify-between items-center rounded-t-2xl border-b flex-shrink-0">
                <h2 className="text-xl font-bold text-gray-800">เลือกลูกค้า</h2>
                <button onClick={onClose}><FaTimes className="text-gray-400 hover:text-red-500 text-2xl"/></button>
            </div>
            <div className="p-4 flex-grow flex flex-col">
                <div className="relative mb-4">
                    <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="ค้นหาลูกค้า..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="form-input !pl-11"/>
                </div>
                <div className="overflow-y-auto flex-grow">
                    {isLoading ? <Spinner /> : (
                        <div className="space-y-2">
                            {filteredCustomers.map(customer => (
                                <div key={customer._id} onClick={() => handleSelect(customer)} className="p-3 bg-white rounded-lg hover:bg-brand-purple-light cursor-pointer transition-colors">
                                    <p className="font-semibold">{customer.name}</p>
                                    <p className="text-sm text-gray-500">{customer.phone || 'ไม่มีเบอร์โทร'}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default SelectCustomerModal;