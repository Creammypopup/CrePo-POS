// client/src/pages/PosPageWrapper.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { getCurrentShift } from '../features/shift/shiftSlice';
import PosPage from './PosPage';
import { OpenShiftModal } from '../components/modals/OpenShiftModal';
import Spinner from '../components/Spinner';

function PosPageWrapper() {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Initialize useNavigate
    const { currentShift, isLoading } = useSelector((state) => state.shift);
    const [isModalOpen, setIsModalOpen] = useState(true); // State to control modal visibility

    useEffect(() => {
        dispatch(getCurrentShift());
    }, [dispatch]);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        navigate('/'); // Redirect to dashboard or previous page
    };

    if (isLoading) {
        return <Spinner />;
    }

    // Only show modal if there's no current shift AND modal is set to open
    if (!currentShift && isModalOpen) {
        return <OpenShiftModal isOpen={true} onClose={handleCloseModal} />;
    }

    // If there's no current shift and modal is closed, redirect to dashboard
    if (!currentShift && !isModalOpen) {
        navigate('/');
        return null; // Or a loading spinner, or an error message
    }

    return <PosPage currentShift={currentShift} />;
}

export default PosPageWrapper;