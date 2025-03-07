import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import { Web3Provider } from './contexts/Web3Context';
import './App.css';

function App() {
  return (
    <Web3Provider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
          <footer className="footer">
            <p>DecentraVPN - Decentralized VPN with ENS Authentication & IPFS</p>
            <p>© {new Date().getFullYear()} - Open Source Project</p>
          </footer>
        </div>
      </Router>
    </Web3Provider>
  );
}

export default App;
