const express = require('express');
const { resolveENSName, verifyENSOwnership, verifyENSSignature } = require('../services/ensService');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @route   GET /api/ens/resolve/:ensName
 * @desc    Resolve ENS name to Ethereum address
 * @access  Public
 */
router.get('/resolve/:ensName', async (req, res) => {
  try {
    const { ensName } = req.params;
    logger.info(`Resolving ENS name: ${ensName}`);
    
    const address = await resolveENSName(ensName);
    return res.status(200).json({ ensName, address });
  } catch (error) {
    logger.error(`Error resolving ENS name: ${error.message}`);
    return res.status(400).json({ error: error.message });
  }
});

/**
 * @route   POST /api/ens/verify-ownership
 * @desc    Verify that an address owns an ENS name
 * @access  Public
 */
router.post('/verify-ownership', async (req, res) => {
  try {
    const { ensName, address } = req.body;
    
    if (!ensName || !address) {
      return res.status(400).json({ error: 'ENS name and address are required' });
    }
    
    logger.info(`Verifying ENS ownership for ${ensName} by address ${address}`);
    
    const isOwner = await verifyENSOwnership(ensName, address);
    return res.status(200).json({ ensName, address, isOwner });
  } catch (error) {
    logger.error(`Error verifying ENS ownership: ${error.message}`);
    return res.status(400).json({ error: error.message });
  }
});

/**
 * @route   POST /api/ens/verify-signature
 * @desc    Verify ENS signature to prove ownership
 * @access  Public
 */
router.post('/verify-signature', async (req, res) => {
  try {
    const { ensName, message, signature } = req.body;
    
    if (!ensName || !message || !signature) {
      return res.status(400).json({ error: 'ENS name, message, and signature are required' });
    }
    
    logger.info(`Verifying signature for ENS name: ${ensName}`);
    
    const isValid = await verifyENSSignature(ensName, message, signature);
    return res.status(200).json({ ensName, isValid });
  } catch (error) {
    logger.error(`Error verifying ENS signature: ${error.message}`);
    return res.status(400).json({ error: error.message });
  }
});

module.exports = router;
