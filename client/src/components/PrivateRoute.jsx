import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
  const { user } = useSelector((state) => state.auth);

  // ถ้ามี user (login อยู่) ให้แสดงหน้าที่ต้องการ (Outlet)
  // ถ้าไม่มี ให้เด้งไปหน้า login
  return user ? <Outlet /> : <Navigate to='/login' replace />;
};

export default PrivateRoute;
