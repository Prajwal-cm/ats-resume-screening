import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import './dashboard-layout.css';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
      <div className="dashboard-layout__main">
        <Navbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />
        <main className="dashboard-layout__content">
          <Outlet />
        </main>
      </div>
      {sidebarOpen && (
        <div className="dashboard-layout__overlay" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}