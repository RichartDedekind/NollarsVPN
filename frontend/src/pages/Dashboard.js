import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const Dashboard = () => {
  const { account, ensName, signMessage, resolveENS } = useWeb3();
  const navigate = useNavigate();
  
  const [customEnsName, setCustomEnsName] = useState('');
  const [vpnConfig, setVpnConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [vpnStatus, setVpnStatus] = useState('disconnected');

  // Redirect to home if not connected
  useEffect(() => {
    if (!account) {
      navigate('/');
    } else if (ensName) {
      setCustomEnsName(ensName);
    }
  }, [account, ensName, navigate]);

  // Generate VPN configuration
  const generateVpnConfig = async (e) => {
    e.preventDefault();
    
    if (!customEnsName) {
      setError('Please enter an ENS name');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Check if the ENS name is valid
      const resolvedAddress = await resolveENS(customEnsName);
      
      if (!resolvedAddress) {
        throw new Error(`Could not resolve ENS name: ${customEnsName}`);
      }
      
      // Check if the user owns the ENS name
      if (resolvedAddress.toLowerCase() !== account.toLowerCase()) {
        throw new Error(`You don't own the ENS name: ${customEnsName}`);
      }
      
      // Create a message to sign
      const message = `I am authenticating for DecentraVPN with my ENS name: ${customEnsName}`;
      
      // Sign the message
      const signature = await signMessage(message);
      
      // Send the request to the backend
      const response = await axios.post(`${API_BASE_URL}/vpn/generate-config`, {
        ensName: customEnsName,
        signature,
        message
      });
      
      // Set the VPN configuration
      setVpnConfig(response.data);
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error generating VPN config:', err);
      setError(err.message || 'Failed to generate VPN configuration');
      setIsLoading(false);
    }
  };

  // Download VPN configuration
  const downloadConfig = async () => {
    if (!vpnConfig) return;
    
    try {
      // Get the configuration file from IPFS
      const response = await axios.get(`${API_BASE_URL}/ipfs/get/${vpnConfig.ipfsCid}`, {
        responseType: 'blob'
      });
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', vpnConfig.filename || 'vpn-config.conf');
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading config:', err);
      setError('Failed to download configuration file');
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-card">
        <h2>VPN Dashboard</h2>
        
        <div className="vpn-status">
          <div className={`status-indicator status-${vpnStatus}`}></div>
          <span>Status: {vpnStatus === 'connected' ? 'Connected' : 'Disconnected'}</span>
        </div>
        
        <form className="ens-form" onSubmit={generateVpnConfig}>
          <div className="form-group">
            <label htmlFor="ensName">Your ENS Name</label>
            <input
              type="text"
              id="ensName"
              className="form-control"
              value={customEnsName}
              onChange={(e) => setCustomEnsName(e.target.value)}
              placeholder="e.g., yourname.eth"
              required
            />
          </div>
          
          <button
            type="submit"
            className="submit-btn"
            disabled={isLoading || !account}
          >
            {isLoading ? 'Generating...' : 'Generate VPN Configuration'}
          </button>
          
          {error && <p className="error-message">{error}</p>}
        </form>
        
        {vpnConfig && (
          <div className="config-download">
            <h3>VPN Configuration Ready</h3>
            <p>Your WireGuard configuration has been generated and stored on IPFS.</p>
            <p>IPFS CID: {vpnConfig.ipfsCid}</p>
            
            <button className="download-btn" onClick={downloadConfig}>
              Download Configuration
            </button>
            
            <div className="setup-instructions">
              <h4>Setup Instructions:</h4>
              <ol>
                <li>Download the WireGuard configuration file</li>
                <li>Install the WireGuard client for your platform</li>
                <li>Import the configuration file into the WireGuard client</li>
                <li>Connect to the VPN</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
