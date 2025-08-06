// client/src/pages/ProductsPage.jsx
import React, { useEffect, useState, useMemo, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getProducts, deleteProduct, reset } from '../features/product/productSlice';
import { FaPlus, FaBoxOpen, FaPrint, FaBarcode, FaEdit, FaTrash, FaSearch, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import Spinner from '../components/Spinner';
import AddProductModal from '../components/modals/AddProductModal';
import BarcodeModal from '../components/modals/BarcodeModal';
import EditProductModal from '../components/modals/EditProductModal';
import { toast } from 'react-toastify';
import moment from 'moment';

function ProductsPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { products, isLoading, isError, message } = useSelector((state) => state.products);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, product: null });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRows, setExpandedRows] = useState([]);
  const [activeFilter, setActiveFilter] = useState(location.state?.filter || 'all');
  
  useEffect(() => {
    if (isError) toast.error(message);
    dispatch(getProducts());
    return () => { dispatch(reset()); };
  }, [dispatch, isError, message]);

  const filteredProducts = useMemo(() => {
      if (!Array.isArray(products)) return [];
      let data = [...products];
      if (activeFilter === 'low-stock') {
          data = data.filter(p => p.stockAlert > 0 && p.stock <= p.stockAlert);
      } else if (activeFilter === 'expiring') {
          const thirtyDaysFromNow = moment().add(30, 'days');
          data = data.filter(p => p.expiryDate && moment(p.expiryDate).isBefore(thirtyDaysFromNow));
      }

      if (!searchTerm) return data;
      const lowercasedTerm = searchTerm.toLowerCase();
      return data.filter(p =>
          p.name.toLowerCase().includes(lowercasedTerm) ||
          (p.sku && p.sku.toLowerCase().includes(lowercasedTerm)) ||
          (p.category && p.category.toLowerCase().includes(lowercasedTerm))
      );
  }, [products, searchTerm, activeFilter]);

  const openEditModal = (product) => {
      setSelectedProduct(product);
      setIsEditModalOpen(true);
  }

  const handleDelete = (product) => {
      dispatch(deleteProduct(product._id))
        .unwrap()
        .then(() => {
            toast.success(`ลบสินค้า "${product.name}" สำเร็จ!`);
            setDeleteConfirm({ isOpen: false, product: null });
        })
        .catch((e) => toast.error(e || 'เกิดข้อผิดพลาดในการลบ'));
  }

  const toggleRow = (id) => {
    setExpandedRows(expandedRows.includes(id) ? expandedRows.filter(rowId => rowId !== id) : [...expandedRows, id]);
  };
  
  const getFilterButtonClass = (filterName) => 
      `btn !py-1.5 !px-4 text-sm ${activeFilter === filterName ? 'bg-brand-purple text-white' : 'bg-white text-gray-600'}`;

  if (isLoading && (!products || products.length === 0)) return <Spinner />;

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
             <h1 className="text-3xl font-bold text-gray-800">สินค้าทั้งหมด</h1>
             <p className="text-gray-500 text-sm mt-1">{filteredProducts.length > 0 ? `${filteredProducts.length} รายการ` : 'ไม่มีสินค้า'}</p>
          </div>
          <div className="flex-grow md:flex-grow-0">
             <div className="relative">
                 <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                 <input type="text" placeholder="ค้นหา..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="form-input pl-10 w-full md:w-80"/>
             </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
             <button onClick={() => setActiveFilter('all')} className={getFilterButtonClass('all')}>สินค้าทั้งหมด</button>
             <button onClick={() => setActiveFilter('low-stock')} className={getFilterButtonClass('low-stock')}>ใกล้หมดสต็อก</button>
             <button onClick={() => setActiveFilter('expiring')} className={getFilterButtonClass('expiring')}>ใกล้หมดอายุ</button>
             <div className="flex-grow"></div>
            <button onClick={() => setIsAddModalOpen(true)} className="btn btn-3d-pastel btn-primary ml-auto">
              <FaPlus className="mr-2" /> เพิ่มสินค้าใหม่
            </button>
          </div>

        <div className="bg-white shadow-lg rounded-2xl p-4">
           <div className="overflow-x-auto">
             <table className="min-w-full bg-white">
               <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600 w-12">#</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600 w-12"></th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600">ชื่อสินค้า</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600">หมวดหมู่</th>
                  <th className="py-3 px-4 text-right font-semibold text-gray-600">ราคาขาย</th>
                  <th className="py-3 px-4 text-right font-semibold text-gray-600">คงเหลือ</th>
                  <th className="py-3 px-4 text-center font-semibold text-gray-600">วันหมดอายุ</th>
                  <th className="py-3 px-4 text-center font-semibold text-gray-600">การกระทำ</th>
                </tr>
               </thead>
               <tbody>
                  {isLoading && products.length === 0 ? (
                    <tr><td colSpan="8" className="text-center py-10"><Spinner/></td></tr>
                  ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((product, index) => (
                      <Fragment key={product._id}>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="p-3 px-4 text-center text-gray-500">{index + 1}</td>
                          <td className="p-3 px-4 text-center">
                            {product.hasMultipleSizes && (
                              <button onClick={() => toggleRow(product._id)} className="text-gray-400 hover:text-brand-purple">
                                {expandedRows.includes(product._id) ? <FaChevronDown /> : <FaChevronRight />}
                              </button>
                            )}
                          </td>
                          <td className="p-3 px-4 text-sm font-medium text-gray-800">{product.name}</td>
                          <td className="p-3 px-4 text-sm text-gray-600">{product.category}</td>
                          <td className="p-3 px-4 text-right text-sm text-gray-500 italic">
                            {product.hasMultipleSizes ? '-' : product.price.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="p-3 px-4 text-right text-sm text-gray-500 italic">
                             {product.hasMultipleSizes ? '-' : `${product.stock} ${product.mainUnit}`}
                          </td>
                           <td className="p-3 px-4 text-center text-sm text-gray-500">
                             {product.hasMultipleSizes ? '-' : (product.expiryDate ? moment(product.expiryDate).format('DD/MM/YY') : '-')}
                           </td>
                          <td className="p-3 px-4 text-center">
                            <div className="flex justify-center gap-2">
                                <button onClick={() => openEditModal(product)} className="btn p-2.5 bg-yellow-100 text-yellow-700 hover:bg-yellow-200"><FaEdit /></button>
                                <button onClick={() => setDeleteConfirm({ isOpen: true, product })} className="btn p-2.5 bg-red-100 text-red-700 hover:bg-red-200"><FaTrash /></button>
                            </div>
                          </td>
                        </tr>
                        {expandedRows.includes(product._id) && product.sizes && product.sizes.map((size, index) => (
                          <tr key={`${product._id}-${index}`} className="bg-purple-50 border-b border-purple-100">
                            <td colSpan="2"></td>
                            <td className="p-2 pl-16 text-sm text-purple-800">{size.name}</td>
                            <td className="p-2"></td>
                            <td className="p-2 text-right text-sm font-semibold text-purple-800">{size.price.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                            <td className="p-2 text-right text-sm font-semibold text-purple-800">{size.stock} {product.mainUnit}</td>
                            <td className="p-2 text-center text-sm font-semibold text-purple-800">{size.expiryDate ? moment(size.expiryDate).format('DD/MM/YY') : '-'}</td>
                            <td className="p-2"></td>
                          </tr>
                        ))}
                      </Fragment>
                    ))
                  ) : (
                    <tr>
                        <td colSpan="8" className="text-center py-10 text-gray-500">
                            <FaBoxOpen className="mx-auto text-4xl mb-2 text-gray-300" />
                            ไม่พบข้อมูลสินค้า {searchTerm && 'ที่ตรงกับคำค้นหา'}
                        </td>
                    </tr>
                  )}
               </tbody>
             </table>
           </div>
        </div>
      </div>

      <AddProductModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <BarcodeModal isOpen={isBarcodeModalOpen} onClose={() => setIsBarcodeModalOpen(false)} />
      <EditProductModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} product={selectedProduct} />

       {deleteConfirm.isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 animate-fade-in">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
                    <h3 className="text-xl font-bold text-gray-800">ยืนยันการลบ</h3>
                    <p className="text-gray-600 my-4">คุณแน่ใจหรือไม่ว่าต้องการลบสินค้า <br/><strong className="text-red-500">{deleteConfirm.product.name}</strong>?</p>
                    <div className="flex justify-center space-x-4">
                        <button onClick={() => setDeleteConfirm({ isOpen: false, product: null })} className="btn bg-gray-200 hover:bg-gray-300">ยกเลิก</button>
                        <button onClick={() => handleDelete(deleteConfirm.product)} className="btn btn-3d-pastel btn-danger">ยืนยันการลบ</button>
                    </div>
                </div>
            </div>
        )}
    </>
  );
}
export default ProductsPage;