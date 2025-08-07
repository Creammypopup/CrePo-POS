// client/src/components/modals/CameraScannerModal.jsx
import React from 'react';
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';
import { BrowserMultiFormatReader } from '@zxing/library';
import { useZxing } from 'react-zxing';

const customModalStyles = {
  content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', borderRadius: '1.5rem', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '0', width: '90%', maxWidth: '500px', background: '#000' },
  overlay: { backgroundColor: 'rgba(17, 24, 39, 0.8)', backdropFilter: 'blur(4px)', zIndex: 80 }
};

Modal.setAppElement('#root');

const CameraScannerModal = ({ isOpen, onClose, onScan }) => {
    const { ref } = useZxing({
        onDecodeResult(result) {
            onScan(result.getText());
        },
    });

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} style={customModalStyles}>
            <div className="relative">
                <video ref={ref} className="w-full h-full rounded-2xl" />
                <button onClick={onClose} className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2">
                    <FaTimes size={24} />
                </button>
            </div>
        </Modal>
    );
};

export default CameraScannerModal;