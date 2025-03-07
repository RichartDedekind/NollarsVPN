const { ethers } = require('ethers');
const logger = require('../utils/logger');

// ENS Registry ABI (minimal for name resolution)
const ENS_REGISTRY_ABI = [
  'function resolver(bytes32 node) external view returns (address)',
  'function owner(bytes32 node) external view returns (address)'
];

// ENS Resolver ABI (minimal for address resolution)
const ENS_RESOLVER_ABI = [
  'function addr(bytes32 node) external view returns (address)'
];

// Initialize Ethereum provider
const provider = new ethers.providers.JsonRpcProvider(
  process.env.ETH_PROVIDER_URL || 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID'
);

// Initialize ENS Registry contract
const ensRegistryAddress = process.env.ENS_REGISTRY_ADDRESS || '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';
const ensRegistry = new ethers.Contract(ensRegistryAddress, ENS_REGISTRY_ABI, provider);

/**
 * Convert ENS name to namehash
 * @param {string} name - ENS name (e.g., 'alice.eth')
 * @returns {string} - ENS namehash
 */
function namehash(name) {
  let node = ethers.utils.arrayify(ethers.constants.HashZero);
  
  if (name) {
    const labels = name.split('.');
    for (let i = labels.length - 1; i >= 0; i--) {
      const labelHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(labels[i]));
      node = ethers.utils.keccak256(ethers.utils.concat([node, labelHash]));
    }
  }
  
  return ethers.utils.hexlify(node);
}

/**
 * Resolve ENS name to Ethereum address
 * @param {string} ensName - ENS name (e.g., 'alice.eth')
 * @returns {Promise<string>} - Ethereum address
 */
async function resolveENSName(ensName) {
  try {
    // Directly use ethers.js resolver
    const address = await provider.resolveName(ensName);
    if (!address) {
      throw new Error(`ENS name ${ensName} not found or not resolved to an address`);
    }
    logger.info(`Resolved ENS name ${ensName} to address ${address}`);
    return address;
  } catch (error) {
    logger.error(`Failed to resolve ENS name ${ensName}:`, error);
    throw error;
  }
}

/**
 * Verify that the given address owns the ENS name
 * @param {string} ensName - ENS name (e.g., 'alice.eth')
 * @param {string} address - Ethereum address to verify
 * @returns {Promise<boolean>} - True if address owns the ENS name
 */
async function verifyENSOwnership(ensName, address) {
  try {
    const node = namehash(ensName);
    const owner = await ensRegistry.owner(node);
    
    // Check if the address matches the owner
    const isOwner = owner.toLowerCase() === address.toLowerCase();
    logger.info(`ENS ownership verification for ${ensName}: ${isOwner ? 'Verified' : 'Failed'}`);
    return isOwner;
  } catch (error) {
    logger.error(`Failed to verify ENS ownership for ${ensName}:`, error);
    throw error;
  }
}

/**
 * Verify ENS signature to prove ownership
 * @param {string} ensName - ENS name (e.g., 'alice.eth')
 * @param {string} message - Message that was signed
 * @param {string} signature - Signature to verify
 * @returns {Promise<boolean>} - True if signature is valid
 */
async function verifyENSSignature(ensName, message, signature) {
  try {
    // Resolve the ENS name to an address
    const address = await resolveENSName(ensName);
    
    // Verify the signature
    const signerAddress = ethers.utils.verifyMessage(message, signature);
    const isValid = signerAddress.toLowerCase() === address.toLowerCase();
    
    logger.info(`ENS signature verification for ${ensName}: ${isValid ? 'Valid' : 'Invalid'}`);
    return isValid;
  } catch (error) {
    logger.error(`Failed to verify ENS signature for ${ensName}:`, error);
    throw error;
  }
}

module.exports = {
  resolveENSName,
  verifyENSOwnership,
  verifyENSSignature,
  namehash
};
