import React, { useContext } from "react";
import { assets } from '../assets/assets'
import { ShopContext } from '../Context/ShopContext'
import { Link } from 'react-router-dom'

const Profile = () => {
  const { user } = useContext(ShopContext);

  return (
    <div className="profile-page" style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f5f5f5', padding: '2rem' }}>
      <div style={{ background: '#b3aaaa', padding: '2rem 3rem', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', maxWidth: 400, width: '100%', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <div style={{ 
            width: 100, 
            height: 100, 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'white',
            border: '3px solid #e0e0e0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>
        <h2 style={{ margin: '0.5rem 0', fontWeight: 700 }}>{user?.name || 'User'}</h2>
        <p style={{  margin: '0.25rem 0 2rem 0' }}>{user?.email || 'user@email.com'}</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link 
            to="/orders" 
            style={{ 
              background: '#ff6b6b', 
              color: 'white', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '8px', 
              textDecoration: 'none', 
              fontWeight: 600,
              transition: 'background 0.3s'
            }}
            onMouseOver={(e) => e.target.style.background = '#ff5252'}
            onMouseOut={(e) => e.target.style.background = '#ff6b6b'}
          >
            My Orders
          </Link>
          
          <Link 
            to="/cart" 
            style={{ 
              background: '#4ecdc4', 
              color: 'white', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '8px', 
              textDecoration: 'none', 
              fontWeight: 600,
              transition: 'background 0.3s'
            }}
            onMouseOver={(e) => e.target.style.background = '#26a69a'}
            onMouseOut={(e) => e.target.style.background = '#4ecdc4'}
          >
            My Cart
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
