import React from 'react';
import './App.css';
import Sidebar from './sidebar.jsx';
import Topbar from './Topbar.jsx';
import Content from './Content.jsx';


const App = () => (
  <div className="container">
    <Topbar />
    <Sidebar />
    <Content />
  </div>
);

export default App;
