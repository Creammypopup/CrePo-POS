// client/src/pages/ProductsPage.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getProducts, deleteProduct, reset } from '../features/product/productSlice';
import Spinner from '../components/Spinner';
import AddProductModal from '../components/modals/AddProductModal';
import BarcodeModal from '../components/modals/BarcodeModal';
import EditProductModal from '../components/modals/EditProductModal';
import ProductHeader from '../components/products/ProductHeader';
import ProductFilters from '../components/products/ProductFilters';
import ProductViewToggle from '../components/products/ProductViewToggle';
import ProductTable from '../components/products/ProductTable';
import ProductGrid from '../components/products/ProductGrid';
import { toast } from 'react-toastify';
import moment from 'moment';

function ProductsPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { products, isLoading, isError, message } = useSelector((state) => state.products);

  const [view, setView] = useState('grid'); // 'grid' or 'list'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, product: null });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
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
      (p.category?.name && p.category.name.toLowerCase().includes(lowercasedTerm))
    );
  }, [products, searchTerm, activeFilter]);

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const openDeleteConfirm = (product) => {
    setDeleteConfirm({ isOpen: true, product });
  };

  const handleDelete = () => {
    if (!deleteConfirm.product) return;
    dispatch(deleteProduct(deleteConfirm.product._id))
      .unwrap()
      .then(() => {
        toast.success(`ลบสินค้า "${deleteConfirm.product.name}" สำเร็จ!`);
        setDeleteConfirm({ isOpen: false, product: null });
      })
      .catch((e) => toast.error(e || 'เกิดข้อผิดพลาดในการลบ'));
  };

  if (isLoading && (!products || products.length === 0)) return <Spinner />;

  return (
    <div className="p-8 bg-pastel-purple-lightest min-h-screen animate-fade-in">
      <ProductHeader 
        onAdd={() => setIsAddModalOpen(true)} 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
      />

      <div className="flex justify-between items-center mb-4">
        <ProductFilters 
          activeFilter={activeFilter} 
          setActiveFilter={setActiveFilter} 
          onBarcodePrint={() => setIsBarcodeModalOpen(true)}
        />
        <ProductViewToggle view={view} setView={setView} />
      </div>

      {view === 'grid' ? (
        <ProductGrid products={filteredProducts} onEdit={openEditModal} onDelete={openDeleteConfirm} />
      ) : (
        <ProductTable products={filteredProducts} onEdit={openEditModal} onDelete={openDeleteConfirm} />
      )}

      {filteredProducts.length === 0 && !isLoading && (
        <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
          <h3 className="text-2xl font-bold text-pastel-gray-dark">ไม่พบสินค้า</h3>
          <p className="text-pastel-gray mt-2">ลองเปลี่ยนคำค้นหาหรือฟิลเตอร์ของคุณ</p>
        </div>
      )}

      <AddProductModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <BarcodeModal isOpen={isBarcodeModalOpen} onClose={() => setIsBarcodeModalOpen(false)} products={products} />
      {isEditModalOpen && <EditProductModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} product={selectedProduct} />}

      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 animate-fade-in">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm mx-auto">
            <h3 className="text-xl font-bold text-gray-800">ยืนยันการลบ</h3>
            <p className="text-gray-600 my-4">คุณแน่ใจหรือไม่ว่าต้องการลบสินค้า <br/><strong className="text-red-500">{deleteConfirm.product.name}</strong>?</p>
            <div className="flex justify-center space-x-4">
              <button onClick={() => setDeleteConfirm({ isOpen: false, product: null })} className="btn bg-gray-200 hover:bg-gray-300">ยกเลิก</button>
              <button onClick={handleDelete} className="btn btn-3d-pastel btn-danger">ยืนยันการลบ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsPage;
