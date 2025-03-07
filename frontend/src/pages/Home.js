import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';

const Home = () => {
  const { account, connectWallet } = useWeb3();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (account) {
      navigate('/dashboard');
    } else {
      connectWallet();
    }
  };

  return (
    <div className="home">
      <section className="hero">
        <h1>Decentralized VPN with ENS Authentication</h1>
        <p>
          A censorship-resistant, privacy-focused VPN service that leverages ENS for authentication
          and IPFS for decentralized configuration storage.
        </p>
        <button className="cta-button" onClick={handleGetStarted}>
          {account ? 'Go to Dashboard' : 'Get Started'}
        </button>
      </section>

      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3>ENS-based Authentication</h3>
          <p>
            Log in with your ENS domain instead of traditional credentials, ensuring your identity
            is verified through the Ethereum blockchain.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📦</div>
          <h3>IPFS for Decentralized Hosting</h3>
          <p>
            VPN configurations and related files are stored and distributed via IPFS, ensuring
            censorship resistance and high availability.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🔐</div>
          <h3>End-to-End Encryption</h3>
          <p>
            Secure tunneling using WireGuard protocol provides maximum privacy and security for
            your internet connection.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🌐</div>
          <h3>Peer-to-Peer Routing</h3>
          <p>
            P2P traffic relay avoids centralized exit nodes, enhancing privacy and reducing
            single points of failure.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📝</div>
          <h3>No Centralized Logs</h3>
          <p>
            Verifiable no-logs policy with full transparency ensures your browsing activity
            remains private.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🚀</div>
          <h3>Simple Onboarding</h3>
          <p>
            Just enter your ENS domain and receive your VPN configuration automatically, making
            setup quick and easy.
          </p>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Connect Your Wallet</h3>
            <p>Connect your Ethereum wallet to authenticate with your ENS domain.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Verify ENS Ownership</h3>
            <p>Sign a message to verify that you own the ENS domain.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Generate VPN Configuration</h3>
            <p>Your WireGuard configuration is generated and stored on IPFS.</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Connect to VPN</h3>
            <p>Download the configuration file and import it into your WireGuard client.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
