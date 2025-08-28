import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import '../styles/Maintemplate.css';

function Template() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-container">
      <Topbar />
      <div className="main-layout">
        <Sidebar isOpen={isSidebarOpen} setOpen={setSidebarOpen} />
        <main className={`content-area ${isSidebarOpen ? 'sidebar-open' : ''}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Template;