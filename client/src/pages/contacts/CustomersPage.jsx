// client/src/pages/contacts/CustomersPage.jsx
import React from 'react';
import ContactsListPage from './ContactsListPage';
import { 
    getCustomers, 
    createCustomer, 
    updateCustomer, 
    deleteCustomer,
    reset
} from '../../features/customer/customerSlice';

function CustomersPage() {
  return (
    <ContactsListPage
        pageTitle="จัดการข้อมูลลูกค้า"
        contactType="customer"
        dataSelector={(state) => ({ data: state.customers.customers, isLoading: state.customers.isLoading, isError: state.customers.isError, message: state.customers.message })}
        getThunk={getCustomers}
        createThunk={createCustomer}
        updateThunk={updateCustomer}
        deleteThunk={deleteCustomer}
        resetThunk={reset}
    />
  );
}

export default CustomersPage;