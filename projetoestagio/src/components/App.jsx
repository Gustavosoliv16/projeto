import React, { useState } from 'react';
import './App.css';

const Sidebar = () => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`sidebar${hovered ? ' hovered' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <ul>
        <li>Home</li>
        <li>About</li>
        <li>Services</li>
        <li>Contact</li>
      </ul>
    </div>
  );
};

const TopBar = () => (
  <div className="topbar">
    <h1>Landing Page</h1>
    <nav>
      <a href="#home">Home</a>
      <a href="#about">About</a>
      <a href="#services">Services</a>
      <a href="#contact">Contact</a>
    </nav>
  </div>
);

const App = () => (
  <div className="container">
    <TopBar />
    <Sidebar />
    <main className="main-content">
      <h2>Welcome to the Landing Page!</h2>
      <p>This is a modern landing page with a hover sidebar and a top bar.</p>
    </main>
  </div>
);

export default App;
