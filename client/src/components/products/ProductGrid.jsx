// client/src/components/products/ProductGrid.jsx
import React from 'react';
import { FaEdit, FaTrash, FaImage } from 'react-icons/fa';

function ProductGrid({ products, onEdit, onDelete }) {

  const StockStatus = ({ stock, stockAlert }) => {
    let statusClass = 'bg-green-100 text-green-800';
    if (stock === 0) {
      statusClass = 'bg-red-100 text-red-800';
    } else if (stockAlert > 0 && stock <= stockAlert) {
      statusClass = 'bg-yellow-100 text-yellow-800';
    }
    return (
      <span className={`absolute top-3 right-3 px-2.5 py-1 text-xs font-bold rounded-full ${statusClass} shadow-sm`}>
        {stock} ชิ้น
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {products.map((product) => (
        <div key={product._id} className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out flex flex-col">
          <div className="relative h-48 bg-pastel-gray-light flex items-center justify-center">
            {product.image ? 
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" /> : 
              <FaImage className="text-4xl text-pastel-gray" />
            }
            <StockStatus stock={product.stock} stockAlert={product.stockAlert} />
          </div>
          <div className="p-4 flex flex-col flex-grow">
            <p className="text-sm text-pastel-gray-dark">{product.category?.name || 'ไม่มีหมวดหมู่'}</p>
            <h3 className="font-bold text-lg text-gray-800 truncate mt-1 flex-grow" title={product.name}>{product.name}</h3>
            <div className="mt-4">
              <p className="text-sm text-pastel-gray-dark">ราคาขาย</p>
              <p className="font-bold text-2xl text-pastel-purple">
                {product.price !== null && product.price !== undefined 
                  ? product.price.toLocaleString('th-TH', { style: 'currency', currency: 'THB' }) 
                  : '-'}
              </p>
            </div>
          </div>
          <div className="p-4 bg-gray-50 border-t border-pastel-gray-light flex justify-end gap-3">
            <button onClick={() => onEdit(product)} className="btn-icon-pastel bg-pastel-blue/10 text-pastel-blue-dark hover:bg-pastel-blue/20">
              <FaEdit />
            </button>
            <button onClick={() => onDelete(product)} className="btn-icon-pastel bg-pastel-red/10 text-pastel-red-dark hover:bg-pastel-red/20">
              <FaTrash />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductGrid;