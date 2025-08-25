import React, { useContext } from 'react';
import { AuthContext } from '../authContext/AuthContext';
import { logout } from '../authContext/AuthActions';

const DebugPanel = () => {
  const { user, dispatch } = useContext(AuthContext);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('user');
    console.log('User logged out and localStorage cleared');
  };

  const clearLocalStorage = () => {
    localStorage.clear();
    window.location.reload();
    console.log('localStorage cleared and page reloaded');
  };

  const checkLocalStorage = () => {
    const storedUser = localStorage.getItem('user');
    console.log('localStorage user:', storedUser);
    console.log('AuthContext user:', user);
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h4 style={{ margin: '0 0 10px 0' }}>Debug Panel</h4>
      <div style={{ marginBottom: '5px' }}>
        <strong>User:</strong> {user ? 'Logged In' : 'Not Logged In'}
      </div>
      <div style={{ marginBottom: '10px' }}>
        <strong>Path:</strong> {window.location.pathname}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <button 
          onClick={handleLogout}
          style={{ padding: '5px', fontSize: '10px' }}
        >
          Logout
        </button>
        <button 
          onClick={clearLocalStorage}
          style={{ padding: '5px', fontSize: '10px' }}
        >
          Clear localStorage
        </button>
        <button 
          onClick={checkLocalStorage}
          style={{ padding: '5px', fontSize: '10px' }}
        >
          Check localStorage
        </button>
      </div>
    </div>
  );
};

export default DebugPanel;
