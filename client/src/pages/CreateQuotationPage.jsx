import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createQuotation, reset } from '../features/quotation/quotationSlice';
import { getCustomers } from '../features/customer/customerSlice';
import { getProducts } from '../features/product/productSlice';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';

const CreateQuotationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Form state
  const [customer, setCustomer] = useState('');
  const [products, setProducts] = useState([]);
  const [notes, setNotes] = useState('');
  const [validUntil, setValidUntil] = useState('');

  // Redux states
  const { isLoading, isError, isSuccess, message } = useSelector((state) => state.quotations);
  const { customers } = useSelector((state) => state.customers);
  const { products: allProducts } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getCustomers());
    dispatch(getProducts());

    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      toast.success('สร้างใบเสนอราคาเรียบร้อยแล้ว!');
      navigate('/quotations');
    }

    return () => {
      dispatch(reset());
    };
  }, [dispatch, navigate, isError, isSuccess, message]);

  const handleAddProduct = () => {
    setProducts([...products, { product: '', quantity: 1, price: 0 }]);
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    setProducts(updatedProducts);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!customer || products.length === 0) {
        toast.error('กรุณาเลือกลูกค้าและเพิ่มสินค้าอย่างน้อย 1 รายการ');
        return;
    }
    const quotationData = {
        customer,
        products: products.map(p => ({ ...p, name: allProducts.find(ap => ap._id === p.product)?.name })),
        notes,
        validUntil,
        // Subtotal and Total will be calculated on the backend
    };
    dispatch(createQuotation(quotationData));
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">สร้างใบเสนอราคาใหม่</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
        
        {/* Customer Selection */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">ลูกค้า</label>
          <select onChange={(e) => setCustomer(e.target.value)} value={customer} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option value="">-- เลือกลูกค้า --</option>
            {customers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>

        {/* Products Section */}
        <h2 className="text-xl font-semibold mb-4">รายการสินค้า</h2>
        {products.map((item, index) => (
          <div key={index} className="grid grid-cols-4 gap-4 mb-4 items-center">
            <select 
              value={item.product}
              onChange={(e) => handleProductChange(index, 'product', e.target.value)}
              className="col-span-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">-- เลือกสินค้า --</option>
              {allProducts.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
            <input 
              type="number"
              placeholder="จำนวน"
              value={item.quantity}
              onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <input 
              type="number"
              placeholder="ราคาต่อหน่วย"
              value={item.price}
              onChange={(e) => handleProductChange(index, 'price', e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        ))}
        <button type="button" onClick={handleAddProduct} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-6">
          + เพิ่มสินค้า
        </button>

        {/* Notes and Valid Until */}
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">หมายเหตุ</label>
            <textarea onChange={(e) => setNotes(e.target.value)} value={notes} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
        </div>
        <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">ใช้ได้ถึงวันที่</label>
            <input type="date" onChange={(e) => setValidUntil(e.target.value)} value={validUntil} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>

        <div className="flex items-center justify-between">
          <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" disabled={isLoading}>
            {isLoading ? 'กำลังบันทึก...' : 'บันทึกใบเสนอราคา'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuotationPage;
