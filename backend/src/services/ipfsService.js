const { create } = require('ipfs-http-client');
const logger = require('../utils/logger');

let ipfs;

/**
 * Initialize connection to IPFS node
 */
async function setupIPFS() {
  try {
    // Connect to the IPFS API
    const apiUrl = process.env.IPFS_API_URL || 'http://localhost:5001';
    ipfs = create(new URL(apiUrl));
    
    // Test the connection
    const nodeId = await ipfs.id();
    logger.info(`Connected to IPFS node: ${nodeId.id}`);
    return ipfs;
  } catch (error) {
    logger.error('Failed to connect to IPFS:', error);
    throw error;
  }
}

/**
 * Add content to IPFS
 * @param {Buffer|string} content - Content to add to IPFS
 * @returns {Promise<string>} - IPFS CID (Content Identifier)
 */
async function addToIPFS(content) {
  try {
    const result = await ipfs.add(content);
    logger.info(`Added content to IPFS with CID: ${result.cid}`);
    return result.cid.toString();
  } catch (error) {
    logger.error('Failed to add content to IPFS:', error);
    throw error;
  }
}

/**
 * Get content from IPFS by CID
 * @param {string} cid - IPFS Content Identifier
 * @returns {Promise<Buffer>} - Content from IPFS
 */
async function getFromIPFS(cid) {
  try {
    const chunks = [];
    for await (const chunk of ipfs.cat(cid)) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  } catch (error) {
    logger.error(`Failed to get content from IPFS with CID ${cid}:`, error);
    throw error;
  }
}

/**
 * Pin content to IPFS to ensure it remains available
 * @param {string} cid - IPFS Content Identifier
 * @returns {Promise<void>}
 */
async function pinContent(cid) {
  try {
    await ipfs.pin.add(cid);
    logger.info(`Pinned content with CID: ${cid}`);
  } catch (error) {
    logger.error(`Failed to pin content with CID ${cid}:`, error);
    throw error;
  }
}

/**
 * Get IPFS gateway URL for a CID
 * @param {string} cid - IPFS Content Identifier
 * @returns {string} - Gateway URL
 */
function getGatewayUrl(cid) {
  const gatewayUrl = process.env.IPFS_GATEWAY_URL || 'http://localhost:8080';
  return `${gatewayUrl}/ipfs/${cid}`;
}

module.exports = {
  setupIPFS,
  addToIPFS,
  getFromIPFS,
  pinContent,
  getGatewayUrl
};
