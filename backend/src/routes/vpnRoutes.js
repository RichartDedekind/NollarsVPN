const express = require('express');
const { createVPNConfig } = require('../services/vpnService');
const { resolveENSName, verifyENSSignature } = require('../services/ensService');
const { getGatewayUrl } = require('../services/ipfsService');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @route   POST /api/vpn/generate-config
 * @desc    Generate VPN configuration for a user with ENS authentication
 * @access  Public
 */
router.post('/generate-config', async (req, res) => {
  try {
    const { ensName, signature, message } = req.body;
    
    if (!ensName || !signature || !message) {
      return res.status(400).json({ 
        error: 'ENS name, signature, and message are required' 
      });
    }
    
    logger.info(`Generating VPN config for ENS name: ${ensName}`);
    
    // Verify the signature to ensure the user owns the ENS name
    const isValid = await verifyENSSignature(ensName, message, signature);
    
    if (!isValid) {
      logger.warn(`Invalid signature for ENS name: ${ensName}`);
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    // Resolve the ENS name to an Ethereum address
    const ensAddress = await resolveENSName(ensName);
    
    // Generate and store VPN configuration
    const configDetails = await createVPNConfig(ensName, ensAddress);
    
    // Generate IPFS gateway URL for the configuration
    const gatewayUrl = getGatewayUrl(configDetails.ipfsCid);
    
    return res.status(200).json({
      ensName,
      clientId: configDetails.clientId,
      ipfsCid: configDetails.ipfsCid,
      gatewayUrl,
      filename: configDetails.filename
    });
  } catch (error) {
    logger.error(`Error generating VPN config: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/vpn/status/:clientId
 * @desc    Get VPN connection status for a client
 * @access  Public
 */
router.get('/status/:clientId', (req, res) => {
  try {
    const { clientId } = req.params;
    
    // In a real implementation, you would check the actual connection status
    // This is a placeholder that always returns "disconnected"
    logger.info(`Checking VPN status for client: ${clientId}`);
    
    return res.status(200).json({
      clientId,
      status: 'disconnected',
      lastSeen: null
    });
  } catch (error) {
    logger.error(`Error checking VPN status: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
