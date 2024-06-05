// import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MyNavbar from './components/navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import HelpCenter from './pages/HelpCenter';


const App = () => {
  return (
    <Router>
      <div>
        <MyNavbar />
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/helpcenter" element={<HelpCenter />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
