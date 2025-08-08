import React from 'react';
import Modal from 'react-modal';
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';

const customStyles = {
  content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: '500px', padding: '2rem', borderRadius: '1rem' },
  overlay: { backgroundColor: 'rgba(0, 0, 0, 0.6)' }
};

function DeleteProductModal({ isOpen, onClose, onConfirm, product, isLoading }) {
  if (!product) return null;

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={customStyles} contentLabel="Delete Product Modal" appElement={document.getElementById('root')}>
      <div className="flex justify-between items-center mb-4">
        