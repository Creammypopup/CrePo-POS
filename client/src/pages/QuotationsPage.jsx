import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getQuotations, reset } from '../features/quotation/quotationSlice';
import { Link } from 'react-router-dom';
import Spinner from '../components/Spinner';

const QuotationsPage = () => {
  const dispatch = useDispatch();
  const { quotations, isLoading, isError, message } = useSelector((state) => state.quotations);

  useEffect(() => {
    if (isError) {
      console.error(message);
    }

    dispatch(getQuotations());

    return () => {
      dispatch(reset());
    };
  }, [dispatch, isError, message]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">ใบเสนอราคา</h1>
        <Link to="/quotations/new" className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
          + สร้างใบเสนอราคาใหม่
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เลขที่</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ลูกค้า</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ยอดรวม</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {quotations.length > 0 ? (
                quotations.map((q) => (
                  <tr key={q._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{q.quotationId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{q.customer?.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(q.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-800">{q.totalAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${q.status === 'accepted' ? 'bg-green-100 text-green-800' : q.status === 'rejected' ? 'bg-red-100 text-red-800' : q.status === 'sent' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/quotations/${q._id}`} className="text-purple-600 hover:text-purple-900">ดูรายละเอียด</Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">ไม่พบใบเสนอราคา</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QuotationsPage;
