// client/src/components/products/ProductTable.jsx
import React from 'react';
import { FaEdit, FaTrash, FaImage } from 'react-icons/fa';
import moment from 'moment';

function ProductTable({ products, onEdit, onDelete }) {

  const StockStatus = ({ stock, stockAlert }) => {
    let statusClass = 'bg-green-100 text-green-800';
    if (stock === 0) {
      statusClass = 'bg-red-100 text-red-800';
    } else if (stockAlert > 0 && stock <= stockAlert) {
      statusClass = 'bg-yellow-100 text-yellow-800';
    }
    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusClass}`}>
        {stock} ชิ้น
      </span>
    );
  };

  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
      <table className="min-w-full divide-y divide-pastel-gray-light">
        <thead className="bg-pastel-purple-lightest">
          <tr>
            <th className="py-4 px-6 text-left text-sm font-bold text-pastel-purple-dark uppercase tracking-wider">สินค้า</th>
            <th className="py-4 px-6 text-left text-sm font-bold text-pastel-purple-dark uppercase tracking-wider">SKU</th>
            <th className="py-4 px-6 text-left text-sm font-bold text-pastel-purple-dark uppercase tracking-wider">หมวดหมู่</th>
            <th className="py-4 px-6 text-right text-sm font-bold text-pastel-purple-dark uppercase tracking-wider">ราคาขาย</th>
            <th className="py-4 px-6 text-center text-sm font-bold text-pastel-purple-dark uppercase tracking-wider">สต็อก</th>
            <th className="py-4 px-6 text-left text-sm font-bold text-pastel-purple-dark uppercase tracking-wider">วันหมดอายุ</th>
            <th className="py-4 px-6 text-center text-sm font-bold text-pastel-purple-dark uppercase tracking-wider">จัดการ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-pastel-gray-light">
          {products.map((product) => (
            <tr key={product._id} className="hover:bg-pastel-purple-lightest/50 transition-colors duration-200">
              <td className="py-4 px-6 whitespace-nowrap">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-pastel-gray-light flex items-center justify-center shadow-sm">
                    {product.image ? 
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" /> : 
                      <FaImage className="text-pastel-gray" />
                    }
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">{product.name}</div>
                    <div className="text-sm text-pastel-gray-dark">{product.description?.substring(0, 30)}...</div>
                  </div>
                </div>
              </td>
              <td className="py-4 px-6 whitespace-nowrap text-pastel-gray-dark">{product.sku || '-'}</td>
              <td className="py-4 px-6 whitespace-nowrap text-pastel-gray-dark">{product.category?.name || '-'}</td>
              <td className="py-4 px-6 whitespace-nowrap text-right font-semibold text-gray-700">
                {product.price !== null && product.price !== undefined 
                  ? product.price.toLocaleString('th-TH', { style: 'currency', currency: 'THB' }) 
                  : '-'}
              </td>
              <td className="py-4 px-6 whitespace-nowrap text-center">
                <StockStatus stock={product.stock} stockAlert={product.stockAlert} />
              </td>
              <td className="py-4 px-6 whitespace-nowrap text-pastel-gray-dark">
                {product.expiryDate ? moment(product.expiryDate).format('DD MMM YYYY') : '-'}
              </td>
              <td className="py-4 px-6 whitespace-nowrap text-center">
                <div className="flex justify-center items-center gap-4">
                  <button onClick={() => onEdit(product)} className="text-pastel-blue hover:text-pastel-blue-dark transition-transform transform hover:scale-110">
                    <FaEdit size={18} />
                  </button>
                  <button onClick={() => onDelete(product)} className="text-pastel-red hover:text-pastel-red-dark transition-transform transform hover:scale-110">
                    <FaTrash size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;