
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import LogoutButton from "@/components/LogoutButton";

const Layout = () => {
  const { user } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <header className="border-b px-4 py-3 bg-background flex items-center justify-between">
        <div className="flex items-center">
          <button
            className="md:hidden mr-2"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">NoteNest</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user?.email}</span>
          <LogoutButton />
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`md:relative absolute z-10 h-full transition-transform duration-300 ${
            isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <Sidebar />
        </aside>
        
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
