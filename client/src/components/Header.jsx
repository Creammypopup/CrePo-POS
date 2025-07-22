import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa'; // แก้ไข: เอา FaUser ออก
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/login');
  };

  return (
    <header className='bg-white shadow-md p-4 flex justify-between items-center z-10 relative'>
      <div className='logo'>
        {/* ทำให้โลโก้ไม่สามารถคลิกได้เมื่ออยู่ในหน้าหลัก เพื่อความสวยงาม */}
        <span className='text-xl font-bold text-gray-800'>CrePo POS</span>
      </div>
      <ul className='flex items-center space-x-6'>
        {user ? (
          <>
            <li className='text-gray-600'>
              สวัสดี, {user.name}
            </li>
            <li>
              <button onClick={onLogout} className='flex items-center text-gray-600 hover:text-red-500'>
                <FaSignOutAlt className='mr-1'/> ออกจากระบบ
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to='/login' className='flex items-center text-gray-600 hover:text-blue-500'>
                <FaSignInAlt className='mr-1'/> เข้าสู่ระบบ
              </Link>
            </li>
            {/* แก้ไข: ลบเมนูลงทะเบียนสำหรับคนทั่วไปออก */}
          </>
        )}
      </ul>
    </header>
  );
}

export default Header;
