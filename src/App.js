import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import GerbangMaster from './components/GerbangMaster';
import LalinReport from './components/LalinReport';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/gerbang" element={<GerbangMaster />} />
        <Route path="/lalin" element={<LalinReport />} />
      </Routes>
    </Router>
  );
}

export default App;
