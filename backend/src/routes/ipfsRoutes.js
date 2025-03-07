const express = require('express');
const { addToIPFS, getFromIPFS, getGatewayUrl } = require('../services/ipfsService');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @route   POST /api/ipfs/add
 * @desc    Add content to IPFS
 * @access  Public
 */
router.post('/add', async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    logger.info('Adding content to IPFS');
    
    // Add the content to IPFS
    const cid = await addToIPFS(Buffer.from(content));
    
    // Generate gateway URL
    const gatewayUrl = getGatewayUrl(cid);
    
    return res.status(200).json({ cid, gatewayUrl });
  } catch (error) {
    logger.error(`Error adding content to IPFS: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/ipfs/get/:cid
 * @desc    Get content from IPFS by CID
 * @access  Public
 */
router.get('/get/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    
    logger.info(`Getting content from IPFS with CID: ${cid}`);
    
    // Get the content from IPFS
    const content = await getFromIPFS(cid);
    
    // Set the appropriate content type
    res.setHeader('Content-Type', 'application/octet-stream');
    
    // Send the content
    return res.send(content);
  } catch (error) {
    logger.error(`Error getting content from IPFS: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/ipfs/gateway/:cid
 * @desc    Get gateway URL for IPFS content
 * @access  Public
 */
router.get('/gateway/:cid', (req, res) => {
  try {
    const { cid } = req.params;
    
    logger.info(`Getting gateway URL for CID: ${cid}`);
    
    // Generate gateway URL
    const gatewayUrl = getGatewayUrl(cid);
    
    return res.status(200).json({ cid, gatewayUrl });
  } catch (error) {
    logger.error(`Error getting gateway URL: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
