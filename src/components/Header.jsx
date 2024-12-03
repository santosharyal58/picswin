import React, { useState } from 'react';
import '../styles/Header.css';
import '../styles/auth.css'; // Ensure you have styles here
import AuthComponent from './Authentication';
import mylogo from '../assets/logo/picswin.png'

const Header = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleLoginClick = () => {
    setIsAuthOpen(true);
  };

  const handleCloseAuth = () => {
    setIsAuthOpen(false);
  };

  return (
    <header className="app-header">
      <div className="container header-container">
        <div className="logo">
          <img src={mylogo} alt="Photo Contest App" className="logo" />
        </div>
        <nav className="nav-links">
          <ul className='menu'>
            <li>
              <button className="btn login-button" onClick={handleLoginClick}>
                Login
              </button>
            </li>
          </ul>
          {isAuthOpen && <AuthComponent onClose={handleCloseAuth} />}
        </nav>
      </div>
    </header>
  );
};

export default Header;
