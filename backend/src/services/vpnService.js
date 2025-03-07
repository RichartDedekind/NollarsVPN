const { execSync } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { addToIPFS, pinContent } = require('./ipfsService');
const logger = require('../utils/logger');

// WireGuard configuration template
const WIREGUARD_CLIENT_TEMPLATE = `[Interface]
PrivateKey = {CLIENT_PRIVATE_KEY}
Address = {CLIENT_IP}
DNS = {DNS}

[Peer]
PublicKey = {SERVER_PUBLIC_KEY}
AllowedIPs = 0.0.0.0/0, ::/0
Endpoint = {SERVER_ENDPOINT}
PersistentKeepalive = 25
`;

/**
 * Generate WireGuard key pair
 * @returns {Object} Object containing public and private keys
 */
function generateWireGuardKeyPair() {
  try {
    // Generate a random private key
    const privateKey = crypto.randomBytes(32).toString('base64');
    
    // Derive the public key using the wg command if available
    // This is a simplified version - in production, you would use the actual WireGuard tools
    const publicKey = crypto.createHash('sha256').update(privateKey).digest('base64');
    
    return { privateKey, publicKey };
  } catch (error) {
    logger.error('Failed to generate WireGuard key pair:', error);
    throw error;
  }
}

/**
 * Generate a unique client IP address in the VPN subnet
 * @returns {string} Client IP address
 */
function generateClientIP() {
  // Get the server address and subnet from env
  const serverAddress = process.env.WIREGUARD_SERVER_ADDRESS || '10.0.0.1/24';
  const [baseIP, subnet] = serverAddress.split('/');
  const baseIPParts = baseIP.split('.');
  
  // Generate a random last octet between 2 and 254
  // (1 is usually reserved for the server, 255 for broadcast)
  const lastOctet = Math.floor(Math.random() * 253) + 2;
  
  // Construct the client IP
  baseIPParts[3] = lastOctet.toString();
  return baseIPParts.join('.');
}

/**
 * Generate WireGuard configuration for a client
 * @param {string} clientId - Unique identifier for the client (e.g., ENS name hash)
 * @returns {Object} Object containing configuration details and file content
 */
function generateClientConfig(clientId) {
  try {
    // Generate key pair for the client
    const { privateKey, publicKey } = generateWireGuardKeyPair();
    
    // Generate a unique IP for the client
    const clientIP = generateClientIP();
    
    // Get server configuration from environment variables
    const serverPublicKey = process.env.WIREGUARD_SERVER_PUBLIC_KEY || 'SERVER_PUBLIC_KEY';
    const serverEndpoint = process.env.WIREGUARD_SERVER_ENDPOINT || 'vpn.example.com:51820';
    const dns = process.env.WIREGUARD_DNS || '1.1.1.1';
    
    // Create the configuration file content
    const configContent = WIREGUARD_CLIENT_TEMPLATE
      .replace('{CLIENT_PRIVATE_KEY}', privateKey)
      .replace('{CLIENT_IP}', clientIP)
      .replace('{DNS}', dns)
      .replace('{SERVER_PUBLIC_KEY}', serverPublicKey)
      .replace('{SERVER_ENDPOINT}', serverEndpoint);
    
    // Create a unique filename
    const filename = `${clientId.replace(/[^a-zA-Z0-9]/g, '')}.conf`;
    
    return {
      filename,
      configContent,
      clientPublicKey: publicKey,
      clientPrivateKey: privateKey,
      clientIP
    };
  } catch (error) {
    logger.error(`Failed to generate client config for ${clientId}:`, error);
    throw error;
  }
}

/**
 * Store WireGuard configuration on IPFS
 * @param {string} clientId - Unique identifier for the client
 * @param {string} configContent - WireGuard configuration content
 * @returns {Promise<string>} IPFS CID of the stored configuration
 */
async function storeConfigOnIPFS(clientId, configContent) {
  try {
    // Add the configuration to IPFS
    const cid = await addToIPFS(Buffer.from(configContent));
    
    // Pin the content to ensure it remains available
    await pinContent(cid);
    
    logger.info(`Stored WireGuard configuration for ${clientId} on IPFS with CID: ${cid}`);
    return cid;
  } catch (error) {
    logger.error(`Failed to store configuration for ${clientId} on IPFS:`, error);
    throw error;
  }
}

/**
 * Generate and store a new VPN configuration for a user
 * @param {string} ensName - ENS name of the user
 * @param {string} ensAddress - Ethereum address of the user
 * @returns {Promise<Object>} Object containing configuration details and IPFS CID
 */
async function createVPNConfig(ensName, ensAddress) {
  try {
    // Generate a unique client ID based on the ENS name
    const clientId = crypto.createHash('sha256').update(ensName).digest('hex').substring(0, 12);
    
    // Generate WireGuard configuration
    const configDetails = generateClientConfig(clientId);
    
    // Store the configuration on IPFS
    const cid = await storeConfigOnIPFS(clientId, configDetails.configContent);
    
    // Return the configuration details and IPFS CID
    return {
      clientId,
      ensName,
      ensAddress,
      ipfsCid: cid,
      clientIP: configDetails.clientIP,
      clientPublicKey: configDetails.clientPublicKey,
      filename: configDetails.filename
    };
  } catch (error) {
    logger.error(`Failed to create VPN config for ${ensName}:`, error);
    throw error;
  }
}

module.exports = {
  generateWireGuardKeyPair,
  generateClientConfig,
  storeConfigOnIPFS,
  createVPNConfig
};
