
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from './Spinner';

// PrivateRoute เวอร์ชันที่เรียบง่ายและแน่นอนกว่า
// ดึงข้อมูล user และสถานะ isLoading จาก Redux store โดยตรง
const PrivateRoute = () => {
  const { user, isLoading } = useSelector((state) => state.auth);

  // ถ้ากำลังโหลดข้อมูล (เช่น กำลังเช็ค token) ให้แสดง Spinner
  if (isLoading) {
    return <Spinner />;
  }

  // ถ้ามีข้อมูล user (login แล้ว) ให้แสดงหน้าเว็บที่ต้องการ (ผ่าน <Outlet />)
  // ถ้าไม่มี ให้เด้งไปหน้า /login
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
