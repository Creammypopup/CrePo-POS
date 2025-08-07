// client/src/pages/ProductsPage.jsx
import React, { useEffect, useState, useMemo, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getProducts, deleteProduct, reset } from '../features/product/productSlice';
import { FaPlus, FaBoxOpen, FaPrint, FaBarcode, FaFileImport, FaFileExport, FaEdit, FaTrash, FaSearch, FaChevronDown, FaChevronRight } from 'react-icons/fa';
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
        <div className="flex flex-wrap gap-2 items-center">
             <button onClick={() => setActiveFilter('all')} className={getFilterButtonClass('all')}>สินค้าทั้งหมด</button>
             <button onClick={() => setActiveFilter('low-stock')} className={getFilterButtonClass('low-stock')}>ใกล้หมดสต็อก</button>
             <button onClick={() => setActiveFilter('expiring')} className={getFilterButtonClass('expiring')}>ใกล้หมดอายุ</button>
             <div className="flex-grow"></div>
             <div className="flex gap-2">
                <button className="btn bg-white"><FaFileImport className="mr-2"/> นำเข้า</button>
                <button className="btn bg-white"><FaFileExport className="mr-2"/> ส่งออก</button>
                <button className="btn bg-white"><FaPrint className="mr-2"/> พิมพ์รายการ</button>
                <button onClick={() => setIsBarcodeModalOpen(true)} className="btn bg-white"><FaBarcode className="mr-2"/> พิมพ์บาร์โค้ด</button>
                <button onClick={() => setIsAddModalOpen(true)} className="btn btn-3d-pastel btn-primary ml-auto">
                  <FaPlus className="mr-2" /> เพิ่มสินค้าใหม่
                </button>
             </div>
        </div>
      </div>


      <AddProductModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <BarcodeModal isOpen={isBarcodeModalOpen} onClose={() => setIsBarcodeModalOpen(false)} products={products} />
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