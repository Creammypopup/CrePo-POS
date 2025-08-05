// client/src/pages/ProductsPage.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProducts, deleteProduct, reset } from '../features/product/productSlice';
import { FaPlus, FaBoxOpen, FaPrint, FaBarcode, FaFileImport, FaFileExport, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import Spinner from '../components/Spinner';
import AddProductModal from '../components/modals/AddProductModal';
import BarcodeModal from '../components/modals/BarcodeModal';
import EditProductModal from '../components/modals/EditProductModal';
import { toast } from 'react-toastify';

function ProductsPage() {
  const dispatch = useDispatch();
  const { products, isLoading, isError, message } = useSelector((state) => state.products);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, product: null });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isError) toast.error(message);
    dispatch(getProducts());
    return () => { dispatch(reset()); };
  }, [dispatch, isError, message]);

  const filteredProducts = useMemo(() => {
      if (!Array.isArray(products)) return [];
      if (!searchTerm) return products;
      const lowercasedTerm = searchTerm.toLowerCase();
      return products.filter(p =>
          p.name.toLowerCase().includes(lowercasedTerm) ||
          (p.sku && p.sku.toLowerCase().includes(lowercasedTerm)) ||
          (p.category && p.category.toLowerCase().includes(lowercasedTerm))
      );
  }, [products, searchTerm]);

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

  if (isLoading && !products.length) return <Spinner />;

  return (
    <>
      <style>{`
          @media print {
              body * { visibility: hidden; }
              .printable-container, .printable-container * { visibility: visible !important; -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
              .printable-container { 
                  position: absolute; 
                  left: 0; 
                  top: 0; 
                  width: 100%; 
                  font-size: 10pt; 
                  padding: 1rem; 
              }
              .non-printable { display: none !important; }
              .print-title { display: block !important; text-align: center; font-size: 18pt; margin-bottom: 1rem; }
              table { width: 100%; border-collapse: collapse; }
              th, td { padding: 8px; border: 1px solid #ddd; text-align: left; }
              th { background-color: #f2f2f2 !important; }
          }
      `}</style>
      <div className="space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-4 non-printable">
          <div>
             <h1 className="text-3xl font-bold text-gray-800">สินค้าทั้งหมด</h1>
             <p className="text-gray-500 text-sm mt-1">{filteredProducts.length > 0 ? `${filteredProducts.length} รายการ` : 'ไม่มีสินค้า'}</p>
          </div>
          <div className="flex-grow md:flex-grow-0">
             <div className="relative">
                 <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                 <input type="text" placeholder="ค้นหาจากชื่อ, รหัส, หมวดหมู่..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="form-input pl-10 w-full md:w-80"/>
             </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 non-printable">
             <button onClick={() => toast.info("ฟังก์ชันนำเข้าข้อมูลกำลังจะมาเร็วๆ นี้")} className="btn btn-3d-pastel bg-blue-200 text-blue-800">
                <FaFileImport className="mr-2" /> นำเข้า
             </button>
              <button onClick={() => toast.info("ฟังก์ชันส่งออกข้อมูลกำลังจะมาเร็วๆ นี้")} className="btn btn-3d-pastel bg-green-200 text-green-800">
                <FaFileExport className="mr-2" /> ส่งออก
             </button>
             <button onClick={() => setIsBarcodeModalOpen(true)} className="btn btn-3d-pastel bg-gray-600 text-white">
                <FaBarcode className="mr-2" /> พิมพ์บาร์โค้ด
             </button>
             <button onClick={() => window.print()} className="btn btn-3d-pastel bg-white text-gray-700">
                <FaPrint className="mr-2" /> พิมพ์รายการ
             </button>
            <button onClick={() => setIsAddModalOpen(true)} className="btn btn-3d-pastel btn-primary ml-auto">
              <FaPlus className="mr-2" /> เพิ่มสินค้าใหม่
            </button>
          </div>

        <div className="bg-white shadow-lg rounded-2xl p-4 printable-container">
           <h1 className="hidden print-title">รายการสินค้าทั้งหมด</h1>
           <div className="overflow-x-auto">
             <table className="min-w-full bg-white">
               <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600 non-printable">ลำดับ</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600">รหัสสินค้า</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600">ชื่อสินค้า</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600">หมวดหมู่</th>
                  <th className="py-3 px-4 text-right font-semibold text-gray-600">ราคาขาย</th>
                  <th className="py-3 px-4 text-right font-semibold text-gray-600">คงเหลือ</th>
                  <th className="py-3 px-4 text-center font-semibold text-gray-600 non-printable">การกระทำ</th>
                </tr>
               </thead>
               <tbody>
                  {isLoading ? (
                    <tr><td colSpan="7" className="text-center py-10"><Spinner/></td></tr>
                  ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((product, index) => (
                      <tr key={product._id} className="border-b hover:bg-gray-50">
                        <td className="p-3 px-4 text-sm text-gray-500 non-printable">{index + 1}</td>
                        <td className="p-3 px-4 text-sm text-gray-500">{product.sku}</td>
                        <td className="p-3 px-4 text-sm font-medium text-gray-800">{product.name}</td>
                        <td className="p-3 px-4 text-sm text-gray-600">{product.category}</td>
                        <td className="p-3 px-4 text-sm text-right text-green-600 font-semibold">{product.price.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td className="p-3 px-4 text-sm text-right font-bold">{product.stock} {product.mainUnit}</td>
                        <td className="p-3 px-4 text-center non-printable">
                          <div className="flex justify-center gap-2">
                              <button onClick={() => openEditModal(product)} className="btn p-2.5 bg-yellow-100 text-yellow-700 hover:bg-yellow-200"><FaEdit /></button>
                              <button onClick={() => setDeleteConfirm({ isOpen: true, product })} className="btn p-2.5 bg-red-100 text-red-700 hover:bg-red-200"><FaTrash /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                        <td colSpan="7" className="text-center py-10 text-gray-500">
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