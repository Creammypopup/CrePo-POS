// client/src/pages/ProductsPage.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProducts, reset } from '../features/product/productSlice';
import { FaPlus, FaBoxOpen } from 'react-icons/fa';
import Spinner from '../components/Spinner';
import AddProductModal from '../components/modals/AddProductModal';

function ProductsPage() {
  const dispatch = useDispatch();
  const { products, isLoading, isError, message } = useSelector((state) => state.products);
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getProducts());
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">จัดการสินค้า</h1>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-3d-pastel btn-primary">
            <FaPlus className="mr-2" /> เพิ่มสินค้าใหม่
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600">รหัสสินค้า</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600">ชื่อสินค้า</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600">หมวดหมู่</th>
                  <th className="py-3 px-4 text-right font-semibold text-gray-600">ราคาขาย</th>
                  <th className="py-3 px-4 text-right font-semibold text-gray-600">คงเหลือ</th>
                  <th className="py-3 px-4 text-center font-semibold text-gray-600">การกระทำ</th>
                </tr>
              </thead>
              <tbody>
                {products && products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product._id} className="border-b hover:bg-gray-50">
                      <td className="p-3 px-4 text-sm text-gray-500">{product.sku}</td>
                      <td className="p-3 px-4 text-sm font-medium text-gray-800">{product.name}</td>
                      <td className="p-3 px-4 text-sm text-gray-600">{product.category}</td>
                      <td className="p-3 px-4 text-sm text-right text-green-600 font-semibold">{product.price.toLocaleString('th-TH')}</td>
                      <td className="p-3 px-4 text-sm text-right font-bold">{product.stock} {product.mainUnit}</td>
                      <td className="p-3 px-4 text-center">
                        {/* Action buttons will be here */}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-500">
                      <FaBoxOpen className="mx-auto text-4xl mb-2 text-gray-300" />
                      ยังไม่มีข้อมูลสินค้า
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

export default ProductsPage;