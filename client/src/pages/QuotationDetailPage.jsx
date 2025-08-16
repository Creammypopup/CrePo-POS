import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuotationById, updateQuotationStatus, reset } from '../features/quotation/quotationSlice';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';

const QuotationDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { quotation, isLoading, isError, message } = useSelector((state) => state.quotations);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    dispatch(getQuotationById(id));

    return () => {
      dispatch(reset());
    };
  }, [dispatch, id, isError, message]);

  const handleSendQuotation = () => {
    dispatch(updateQuotationStatus({ id, status: 'sent' })).then(() => {
        toast.success('ใบเสนอราคาถูกส่งแล้ว!');
        dispatch(getQuotationById(id)); // Refresh data
    });
  };

  if (isLoading || !quotation) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">ใบเสนอราคา #{quotation.quotationId}</h1>
          <p className="text-sm text-gray-500">สร้างเมื่อ: {new Date(quotation.createdAt).toLocaleDateString()}</p>
          <p className="text-sm text-gray-500">ใช้ได้ถึง: {new Date(quotation.validUntil).toLocaleDateString()}</p>
        </div>
        <div className="text-right">
            <span className={`px-4 py-2 inline-flex text-sm leading-5 font-semibold rounded-full ${quotation.status === 'accepted' ? 'bg-green-100 text-green-800' : quotation.status === 'rejected' ? 'bg-red-100 text-red-800' : quotation.status === 'sent' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                {quotation.status}
            </span>
        </div>
      </div>

      {/* Customer Info */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">ข้อมูลลูกค้า</h2>
        <p className="mt-2"><strong>ชื่อ:</strong> {quotation.customer?.name}</p>
        {/* Add more customer details if available */}
      </div>

      {/* Products Table */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-2">รายการสินค้า</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead><tr><th className="px-2 py-3">สินค้า</th><th className="px-2 py-3">จำนวน</th><th className="px-2 py-3">ราคา/หน่วย</th><th className="px-2 py-3">รวม</th></tr></thead>
          <tbody>
            {quotation.products.map((p, i) => (
              <tr key={i}><td>{p.name}</td><td>{p.quantity}</td><td>{p.price.toFixed(2)}</td><td>{(p.quantity * p.price).toFixed(2)}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Notes */}
      {quotation.notes && <div className="mb-6"><h2 className="text-xl font-semibold">หมายเหตุ</h2><p>{quotation.notes}</p></div>}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        {quotation.status === 'draft' && (
            <button onClick={handleSendQuotation} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                ส่งให้ลูกค้า
            </button>
        )}
        {quotation.status === 'accepted' && (
            <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                แปลงเป็นรายการขาย
            </button>
        )}
        <button className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">สร้าง PDF</button>
        <button onClick={() => navigate('/quotations')} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">กลับ</button>
      </div>
    </div>
  );
};

export default QuotationDetailPage;
