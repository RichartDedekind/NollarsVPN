import React from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';

const Header = () => {
  const { account, ensName, connectWallet, disconnectWallet, isConnecting } = useWeb3();

  // Format address for display
  const formatAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <span>DecentraVPN</span>
        </div>
        
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          {account && (
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          )}
          <li>
            <a href="https://github.com/yourusername/DecentraVPN" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </li>
        </ul>
        
        {!account ? (
          <button 
            className="connect-wallet-btn" 
            onClick={connectWallet}
            disabled={isConnecting}
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        ) : (
          <div className="wallet-info">
            <span className="wallet-address">
              {ensName || formatAddress(account)}
            </span>
            <button 
              className="connect-wallet-btn" 
              onClick={disconnectWallet}
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
