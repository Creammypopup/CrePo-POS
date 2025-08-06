// client/src/pages/PosPageWrapper.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCurrentShift } from '../features/shift/shiftSlice';
import PosPage from './PosPage';
import { OpenShiftModal } from '../components/modals/OpenShiftModal';
import Spinner from '../components/Spinner';

function PosPageWrapper() {
    const dispatch = useDispatch();
    const { currentShift, isLoading } = useSelector((state) => state.shift);

    useEffect(() => {
        dispatch(getCurrentShift());
    }, [dispatch]);

    if (isLoading) {
        return <Spinner />;
    }

    if (!currentShift) {
        return <OpenShiftModal isOpen={true} />;
    }

    return <PosPage currentShift={currentShift} />;
}

export default PosPageWrapper;