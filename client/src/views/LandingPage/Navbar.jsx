// src/components/Navbar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const styles = {
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 6%',
      background: 'rgba(0, 0, 0, 0.1)', // Transparent with blur effect
      backdropFilter: 'blur(10px)', // Adds blur for frosted look
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 1000,
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    },
    logo: {
      fontSize: '2.2rem',
      fontWeight: 'bold',
      fontFamily: "'Roboto', sans-serif",
      background: 'linear-gradient(310deg, #7928CA 0%, #FF0080 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      cursor: 'pointer',
      transition: 'transform 0.3s',
    },
    logoHover: {
      transform: 'scale(1.1)',
    },
    navLinks: {
      display: 'flex',
      listStyle: 'none',
      gap: '4rem',
    },
    navLink: {
      color: '#FFFFFF',
      textDecoration: 'none',
      fontWeight: '500',
      fontSize: '1rem',
      position: 'relative',
      padding: '0.5rem',
      transition: 'color 0.3s, transform 0.3s',
    },
    navLinkHoverEffect: {
      content: '""',
      position: 'absolute',
      width: '100%',
      height: '2px',
      bottom: '-4px',
      left: 0,
      background: 'linear-gradient(90deg, #7928CA, #FF0080)',
      transition: 'transform 0.3s ease',
      transform: 'scaleX(0)',
      transformOrigin: 'bottom right',
    },
    signInBtn: {
      padding: '0.5rem 1.5rem',
      borderRadius: '25px',
      background: 'linear-gradient(310deg, #7928CA 0%, #FF0080 100%)',
      color: '#ffffff',
      fontWeight: '600',
      textDecoration: 'none',
      cursor: 'pointer',
      transition: 'transform 0.3s, background 0.3s, box-shadow 0.3s',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
    },
    signInBtnHover: {
      transform: 'scale(1.08)',
      boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.3)',
    },
  };

  return (
    <nav style={styles.navbar}>
      {/* Logo */}
      <div
        style={styles.logo}
        onMouseEnter={(e) => (e.currentTarget.style.transform = styles.logoHover.transform)}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        EX
      </div>

      {/* Navigation Links */}
      <ul style={styles.navLinks}>
        {['Home', 'About', 'Services', 'Clients', 'Contact'].map((item) => (
          <li key={item}>
            <a
              href={`#${item.toLowerCase()}`}
              style={styles.navLink}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#FF0080';
                e.currentTarget.querySelector('.hoverEffect').style.transform = 'scaleX(1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#FFFFFF';
                e.currentTarget.querySelector('.hoverEffect').style.transform = 'scaleX(0)';
              }}
            >
              {item}
              
              {/* Underline Effect */}
              <span
                className="hoverEffect"
                style={{
                  ...styles.navLinkHoverEffect,
                  ...(item === 'Home' ? { transform: 'scaleX(1)', transformOrigin: 'bottom left' } : {}),
                }}
              ></span>

            </a>
          </li>
        ))}
      </ul>

      {/* Sign In Button */}
      <button
        onClick={() => navigate('/LoginPage')}
        style={styles.signInBtn}
        onMouseEnter={(e) => {
          e.target.style.transform = styles.signInBtnHover.transform;
          e.target.style.boxShadow = styles.signInBtnHover.boxShadow;
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.2)';
        }}
      >
        Sign in
      </button>
    </nav>
  );
};

export default Navbar;
