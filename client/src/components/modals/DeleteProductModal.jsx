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
        <h2 className="text-2xl font-bold text-gray-800">Confirm Deletion</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
          <FaTimes />
        </button>
      </div>
      <div className="text-center">
        <FaExclamationTriangle className="text-5xl text-red-500 mx-auto mb-4" />
        <p className="text-lg text-gray-700 mb-4">
          Are you sure you want to delete the product &quot;<strong>{product.name}</strong>&quot;?
        </p>
        <p className="text-sm text-gray-500">This action cannot be undone.</p>
      </div>
      <div className="flex justify-end mt-6">
        <button onClick={onClose} className="btn btn-secondary mr-4" disabled={isLoading}>
          Cancel
        </button>
        <button onClick={() => onConfirm(product._id)} className="btn btn-danger" disabled={isLoading}>
          {isLoading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </Modal>
  );
}

export default DeleteProductModal;