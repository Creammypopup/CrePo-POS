// ... (ส่วน import ทั้งหมดเหมือนเดิม) ...
import Sidebar from "./components/Sidebar"; // แก้ไข import ให้ใช้ Sidebar ตัวใหม่
import Header from "./components/Header"; // แก้ไข import ให้ใช้ Header ตัวใหม่

// ... (โค้ดส่วนอื่นๆ เหมือนเดิม) ...

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    // เปลี่ยนพื้นหลังตรงนี้
    <div className="flex h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 font-sans">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent"> {/* ทำให้พื้นหลังโปร่งใส */}
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

// ... (โค้ดส่วนที่เหลือของ App.jsx เหมือนเดิม) ...
