import React, { useState, useEffect, useMemo } from 'react';
import Modal from 'react-modal';
import { FaTimes, FaWeightHanging, FaDollarSign, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { formatCurrency } from '../../utils/formatUtils';

const customModalStyles = {
  content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', borderRadius: '1.5rem', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '0', width: '90%', maxWidth: '450px', background: '#FDF7FF' },
  overlay: { backgroundColor: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(4px)', zIndex: 70 }
};

Modal.setAppElement('#root');

const WeightInputModal = ({ isOpen, onClose, product, onConfirm }) => {
    const [inputValue, setInputValue] = useState('');
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [inputMode, setInputMode] = useState('quantity'); // 'quantity' or 'price'

    useEffect(() => {
        if (isOpen && product && product.sellingUnits && product.sellingUnits.length > 0) {
            setSelectedUnit(product.sellingUnits[0]); // Select the first unit by default
            setInputValue(''); // Clear input on open
            setInputMode('quantity'); // Reset input mode
        }
    }, [isOpen, product]);

    const calculatedPrice = useMemo(() => {
        if (!selectedUnit || isNaN(parseFloat(inputValue)) || parseFloat(inputValue) <= 0) return 0;
        if (inputMode === 'quantity') {
            return parseFloat(inputValue) * selectedUnit.price;
        } else { // inputMode === 'price'
            return parseFloat(inputValue);
        }
    }, [inputValue, selectedUnit, inputMode]);

    const calculatedQuantity = useMemo(() => {
        if (!selectedUnit || isNaN(parseFloat(inputValue)) || parseFloat(inputValue) <= 0) return 0;
        if (inputMode === 'quantity') {
            return parseFloat(inputValue);
        } else { // inputMode === 'price'
            return parseFloat(inputValue) / selectedUnit.price;
        }
    }, [inputValue, selectedUnit, inputMode]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedUnit) {
            toast.error('กรุณาเลือกหน่วยขาย');
            return;
        }
        if (isNaN(parseFloat(inputValue)) || parseFloat(inputValue) <= 0) {
            toast.error(`กรุณากรอก${inputMode === 'quantity' ? 'จำนวน' : 'ราคา'}ที่ถูกต้อง`);
            return;
        }

        // quantityToAdd is the quantity in terms of the selected selling unit
        const quantityToAdd = calculatedQuantity;
        const priceAtSale = calculatedPrice;

        // Calculate quantity in stock unit for validation
        const quantityInStockUnit = quantityToAdd * selectedUnit.stockConversionFactor;

        if (product.productType !== 'service' && quantityInStockUnit > product.stockQuantity) {
            toast.error(`สินค้าในสต็อกไม่เพียงพอ. คงเหลือ: ${product.stockQuantity} ${product.stockUnit}`);
            return;
        }

        onConfirm(product, selectedUnit, quantityToAdd, priceAtSale);
        onClose();
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
                    <label className="block text-sm font-bold mb-2 text-gray-600">เลือกหน่วยขาย</label>
                    <select
                        className="form-input text-center text-lg p-2"
                        value={selectedUnit ? selectedUnit.name : ''}
                        onChange={(e) => setSelectedUnit(product.sellingUnits.find(unit => unit.name === e.target.value))}
                        required
                    >
                        {product.sellingUnits.map((unit) => (
                            <option key={unit.name} value={unit.name}>
                                {unit.name} ({formatCurrency(unit.price)}/{unit.name})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-center space-x-2 mb-4">
                    <button
                        type="button"
                        onClick={() => setInputMode('quantity')}
                        className={`btn ${inputMode === 'quantity' ? 'btn-primary' : 'btn-secondary'} !py-2 !px-4 text-sm`}
                    >
                        <FaWeightHanging className="mr-2"/> กรอกจำนวน ({selectedUnit?.name || 'หน่วย'})
                    </button>
                    <button
                        type="button"
                        onClick={() => setInputMode('price')}
                        className={`btn ${inputMode === 'price' ? 'btn-primary' : 'btn-secondary'} !py-2 !px-4 text-sm`}
                    >
                        <FaDollarSign className="mr-2"/> กรอกราคา
                    </button>
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2 text-gray-600">
                        {inputMode === 'quantity' ? `กรอกจำนวน (${selectedUnit?.name || 'หน่วย'})` : 'กรอกราคา (บาท)'}
                    </label>
                    <div className="relative">
                        <input 
                            type="number"
                            step="any"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="form-input text-center text-3xl p-4"
                            required
                            autoFocus
                        />
                         <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                            {inputMode === 'quantity' ? (selectedUnit?.name || 'หน่วย') : 'บาท'}
                         </span>
                    </div>
                </div>

                <div className="text-center text-xl font-bold text-brand-purple mt-4">
                    รวม: {formatCurrency(calculatedPrice)} บาท
                </div>

                <div className="pt-4">
                    <button type="submit" className="btn btn-3d-pastel btn-primary w-full text-lg py-3">
                        <FaPlus className="mr-2"/> เพิ่มลงตะกร้า
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default WeightInputModal;