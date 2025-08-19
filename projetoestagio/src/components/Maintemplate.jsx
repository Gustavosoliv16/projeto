import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

function Template() {
  return (
    <div >
      <Sidebar />
      <div >
        <Topbar />
        <main>
          {}
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}

export default Template;