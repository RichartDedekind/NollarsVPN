import React, { createContext, useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';

// Create context
const Web3Context = createContext();

// Provider component
export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [network, setNetwork] = useState(null);
  const [ensName, setEnsName] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Initialize Web3Modal
  const web3Modal = new Web3Modal({
    network: "mainnet",
    cacheProvider: true,
    providerOptions: {}
  });

  // Connect wallet
  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      
      // Connect to the wallet
      const instance = await web3Modal.connect();
      
      // Create ethers provider
      const ethersProvider = new ethers.providers.Web3Provider(instance);
      setProvider(ethersProvider);
      
      // Get signer
      const ethersSigner = ethersProvider.getSigner();
      setSigner(ethersSigner);
      
      // Get account
      const address = await ethersSigner.getAddress();
      setAccount(address);
      
      // Get network
      const network = await ethersProvider.getNetwork();
      setNetwork(network);
      
      // Try to resolve ENS name
      try {
        const name = await ethersProvider.lookupAddress(address);
        setEnsName(name);
      } catch (ensError) {
        console.log("No ENS name found for this address");
        setEnsName(null);
      }
      
      // Setup event listeners
      instance.on("accountsChanged", handleAccountsChanged);
      instance.on("chainChanged", handleChainChanged);
      instance.on("disconnect", handleDisconnect);
      
      setIsConnecting(false);
    } catch (err) {
      console.error("Error connecting wallet:", err);
      setError("Failed to connect wallet. Please try again.");
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = async () => {
    try {
      await web3Modal.clearCachedProvider();
      setProvider(null);
      setSigner(null);
      setAccount(null);
      setNetwork(null);
      setEnsName(null);
    } catch (err) {
      console.error("Error disconnecting wallet:", err);
    }
  };

  // Handle account change
  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      await disconnectWallet();
    } else {
      // Account changed, update state
      const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
      const ethersSigner = ethersProvider.getSigner();
      const address = await ethersSigner.getAddress();
      
      setProvider(ethersProvider);
      setSigner(ethersSigner);
      setAccount(address);
      
      // Try to resolve ENS name
      try {
        const name = await ethersProvider.lookupAddress(address);
        setEnsName(name);
      } catch (ensError) {
        console.log("No ENS name found for this address");
        setEnsName(null);
      }
    }
  };

  // Handle chain change
  const handleChainChanged = () => {
    // Reload the page when the chain changes
    window.location.reload();
  };

  // Handle disconnect
  const handleDisconnect = async () => {
    await disconnectWallet();
  };

  // Sign message with connected wallet
  const signMessage = async (message) => {
    if (!signer) {
      throw new Error("Wallet not connected");
    }
    
    try {
      const signature = await signer.signMessage(message);
      return signature;
    } catch (err) {
      console.error("Error signing message:", err);
      throw err;
    }
  };

  // Check if user has an ENS name
  const checkENS = async (address) => {
    if (!provider) {
      throw new Error("Wallet not connected");
    }
    
    try {
      const name = await provider.lookupAddress(address);
      return name;
    } catch (err) {
      console.error("Error checking ENS:", err);
      return null;
    }
  };

  // Resolve ENS name to address
  const resolveENS = async (name) => {
    if (!provider) {
      throw new Error("Wallet not connected");
    }
    
    try {
      const address = await provider.resolveName(name);
      return address;
    } catch (err) {
      console.error("Error resolving ENS:", err);
      return null;
    }
  };

  // Auto connect if provider is cached
  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connectWallet();
    }
  }, []);

  // Context value
  const value = {
    provider,
    signer,
    account,
    network,
    ensName,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    signMessage,
    checkENS,
    resolveENS
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};

// Custom hook to use the Web3 context
export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};
