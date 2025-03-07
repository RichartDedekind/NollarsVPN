import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ENS API calls
export const resolveENSName = async (ensName) => {
  try {
    const response = await api.get(`/ens/resolve/${ensName}`);
    return response.data;
  } catch (error) {
    console.error('Error resolving ENS name:', error);
    throw error;
  }
};

export const verifyENSOwnership = async (ensName, address) => {
  try {
    const response = await api.post('/ens/verify-ownership', { ensName, address });
    return response.data;
  } catch (error) {
    console.error('Error verifying ENS ownership:', error);
    throw error;
  }
};

export const verifyENSSignature = async (ensName, message, signature) => {
  try {
    const response = await api.post('/ens/verify-signature', { ensName, message, signature });
    return response.data;
  } catch (error) {
    console.error('Error verifying ENS signature:', error);
    throw error;
  }
};

// VPN API calls
export const generateVPNConfig = async (ensName, signature, message) => {
  try {
    const response = await api.post('/vpn/generate-config', { ensName, signature, message });
    return response.data;
  } catch (error) {
    console.error('Error generating VPN config:', error);
    throw error;
  }
};

export const getVPNStatus = async (clientId) => {
  try {
    const response = await api.get(`/vpn/status/${clientId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting VPN status:', error);
    throw error;
  }
};

// IPFS API calls
export const addToIPFS = async (content) => {
  try {
    const response = await api.post('/ipfs/add', { content });
    return response.data;
  } catch (error) {
    console.error('Error adding to IPFS:', error);
    throw error;
  }
};

export const getFromIPFS = async (cid) => {
  try {
    const response = await api.get(`/ipfs/get/${cid}`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Error getting from IPFS:', error);
    throw error;
  }
};

export const getIPFSGatewayUrl = async (cid) => {
  try {
    const response = await api.get(`/ipfs/gateway/${cid}`);
    return response.data;
  } catch (error) {
    console.error('Error getting IPFS gateway URL:', error);
    throw error;
  }
};

export default {
  resolveENSName,
  verifyENSOwnership,
  verifyENSSignature,
  generateVPNConfig,
  getVPNStatus,
  addToIPFS,
  getFromIPFS,
  getIPFSGatewayUrl
};
