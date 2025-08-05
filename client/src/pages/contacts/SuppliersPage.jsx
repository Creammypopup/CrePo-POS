// client/src/pages/contacts/SuppliersPage.jsx
import React from 'react';
import ContactsListPage from './ContactsListPage';
import { 
    getSuppliers, 
    createSupplier, 
    updateSupplier, 
    deleteSupplier,
    reset
} from '../../features/supplier/supplierSlice';

function SuppliersPage() {
  return (
    <ContactsListPage
        pageTitle="จัดการข้อมูลผู้จำหน่าย"
        contactType="supplier"
        dataSelector={(state) => ({ data: state.suppliers.suppliers, isLoading: state.suppliers.isLoading, isError: state.suppliers.isError, message: state.suppliers.message })}
        getThunk={getSuppliers}
        createThunk={createSupplier}
        updateThunk={updateSupplier}
        deleteThunk={deleteSupplier}
        resetThunk={reset}
    />
  );
}

export default SuppliersPage;