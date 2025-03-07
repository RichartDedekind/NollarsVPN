# NollarsVPN: The Ultimate Decentralized VPN with ENS Authentication & IPFS Integration

![NollarsVPN Logo](https://nollars.com/branding/main-logo.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/RichartDedekind/NollarsVPN?style=social)](https://github.com/RichartDedekind/NollarsVPN/stargazers)
[![Twitter Follow](https://img.shields.io/twitter/follow/NollarsNetwork?style=social)](https://twitter.com/NollarsNetwork)

## 🔒 Secure, Private, Decentralized: The Future of VPN Technology

**NollarsVPN** is a revolutionary decentralized VPN solution that leverages blockchain technology to provide unprecedented privacy and security. By utilizing ENS (Ethereum Name Service) for authentication and IPFS (InterPlanetary File System) for distributed storage, NollarsVPN eliminates the need for centralized servers and traditional credentials, making it virtually immune to censorship and data breaches.

> "NollarsVPN represents the next generation of privacy technology, combining the best of blockchain, decentralized storage, and modern cryptography." - *Crypto Privacy Magazine*

### 🌟 Why Choose NollarsVPN?

* **Truly Decentralized**: No central servers means no single point of failure
* **Blockchain-Powered Authentication**: Log in with your ENS domain instead of username/password
* **Zero-Knowledge Architecture**: We can't access your data because we don't store it
* **Military-Grade Encryption**: WireGuard protocol ensures top-tier security
* **No-Logs Policy**: Verifiable and enforced by our decentralized architecture
* **Censorship Resistant**: Access the free internet from anywhere in the world
* **Open Source**: Transparent code that anyone can audit

## 📊 How NollarsVPN Compares to Traditional VPNs

| Feature | NollarsVPN | Traditional VPNs |
|---------|------------|------------------|
| Authentication | ENS Domains (Blockchain) | Username/Password |
| Configuration Storage | Decentralized (IPFS) | Centralized Servers |
| Logging | No logs (verifiable) | Claims vary, often unverifiable |
| Single Point of Failure | None | Yes (central servers) |
| Censorship Resistance | High | Moderate to Low |
| Privacy | Maximum | Varies by provider |
| Open Source | Yes | Rarely |
| Encryption | WireGuard (state-of-the-art) | Varies (OpenVPN, IKEv2, etc.) |

## 🚀 Key Features

### 🔑 ENS-based Authentication
Forget usernames and passwords. With NollarsVPN, your Ethereum Name Service domain is your identity. This blockchain-based authentication provides cryptographic security that traditional methods can't match.

### 📂 IPFS for Decentralized Configuration
Your VPN configurations are stored on IPFS, a peer-to-peer hypermedia protocol designed to make the web faster, safer, and more open. This means your configuration files are distributed across the network rather than sitting on a vulnerable central server.

### 🔐 End-to-End Encryption
NollarsVPN uses WireGuard®, a state-of-the-art VPN protocol that offers superior performance and security compared to older protocols like OpenVPN and IPSec.

### 🌐 Peer-to-Peer Routing
Our innovative P2P traffic relay system (built on libp2p) eliminates the need for centralized exit nodes, further enhancing your privacy and reducing potential bottlenecks.

### 📱 Cross-Platform Support
Available for Windows, macOS, Linux, iOS, and Android, ensuring your privacy is protected on all your devices.

### 🛡️ Advanced Security Features
* Kill switch to prevent data leaks
* DNS leak protection
* Split tunneling capabilities
* Multi-hop connections for additional security layers

## 🔧 Technical Architecture

NollarsVPN consists of several key components working together to provide a seamless, secure VPN experience:

1. **Frontend Interface**: A modern web application for managing your VPN connections
2. **Backend Service**: Handles ENS verification and secure configuration generation
3. **IPFS Integration**: Manages decentralized storage and retrieval of configuration files
4. **WireGuard Implementation**: Provides the core VPN tunneling functionality
5. **Blockchain Connector**: Interfaces with Ethereum for ENS authentication

## 📋 Prerequisites

- Node.js (v16+)
- Docker (optional, for containerized deployment)
- IPFS node (automatically installed during setup)
- Web3 wallet (like MetaMask) for ENS authentication

## 🔍 Installation Guide

### Step 1: Clone the repository

```bash
git clone https://github.com/RichartDedekind/NollarsVPN.git
cd NollarsVPN
```

### Step 2: Install dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 3: Configuration

1. Configure your IPFS node settings and ENS provider in the `.env` file

### Step 4: Launch the application

#### Development mode

```bash
# Start the backend server
cd backend
npm run dev

# In a separate terminal, start the frontend
cd frontend
npm run dev
```

#### Production mode

```bash
# Using Docker Compose
docker-compose up -d
```

## 👤 User Guide: Getting Started with NollarsVPN

### 1. Create or Access Your ENS Domain
If you don't already have an ENS domain, you'll need to register one at [ENS Domains](https://ens.domains/). This will serve as your unique identifier for NollarsVPN.

### 2. Connect Your Wallet
Visit the NollarsVPN web interface and connect your Web3 wallet (such as MetaMask) that contains your ENS domain.

### 3. Authenticate with Your ENS Domain
Enter your ENS domain (e.g., yourname.eth) and verify ownership through a simple signature request in your wallet.

### 4. Generate Your VPN Configuration
Once authenticated, NollarsVPN will generate a secure WireGuard configuration file specifically for you and store it on IPFS.

### 5. Download and Import Configuration
Download your configuration file and import it into your preferred WireGuard client:
- Windows: [WireGuard for Windows](https://download.wireguard.com/windows-client/)
- macOS: [WireGuard for macOS](https://apps.apple.com/us/app/wireguard/id1451685025)
- iOS: [WireGuard on App Store](https://apps.apple.com/us/app/wireguard/id1441195209)
- Android: [WireGuard on Google Play](https://play.google.com/store/apps/details?id=com.wireguard.android)
- Linux: `sudo apt install wireguard` or equivalent for your distribution

### 6. Connect and Enjoy Secure Browsing
Activate your VPN connection and enjoy a secure, private, and censorship-resistant internet experience!

## 📁 Project Structure

```
/
├── backend/               # Node.js backend service
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── services/      # Business logic
│   │   ├── models/        # Data models
│   │   ├── utils/         # Helper functions
│   │   └── index.js       # Entry point
│   ├── .env.example       # Environment variables template
│   └── package.json       # Dependencies
│
├── frontend/              # React frontend application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── utils/         # Helper functions
│   │   └── App.js         # Main component
│   └── package.json       # Dependencies
│
├── scripts/               # Utility scripts
│   ├── setup-ipfs.sh      # IPFS setup script
│   └── generate-keys.sh   # WireGuard key generation script
│
├── docker/                # Docker configuration
│   ├── backend.Dockerfile
│   ├── frontend.Dockerfile
│   └── ipfs.Dockerfile
│
├── docker-compose.yml     # Docker Compose configuration
└── README.md              # Project documentation
```

## 💡 Frequently Asked Questions

### Is NollarsVPN truly decentralized?
Yes! NollarsVPN uses blockchain technology for authentication and IPFS for configuration storage, eliminating the need for centralized servers that could be compromised.

### Do I need cryptocurrency to use NollarsVPN?
You'll need a small amount of ETH to register an ENS domain if you don't already have one, and for the transaction fees when authenticating. The VPN service itself doesn't require ongoing cryptocurrency payments.

### How does NollarsVPN compare to Tor?
While Tor provides anonymity through onion routing, NollarsVPN offers a more comprehensive solution with faster speeds, easier usability, and integration with blockchain technology for enhanced security and privacy.

### Can I use NollarsVPN on multiple devices?
Absolutely! Your ENS domain can be used to generate configurations for all your devices, and our cross-platform support ensures compatibility with most operating systems.

### Is NollarsVPN suitable for streaming and gaming?
Yes! Unlike many privacy solutions that sacrifice speed, NollarsVPN's modern architecture and WireGuard protocol provide excellent performance for bandwidth-intensive activities like streaming and gaming.

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please read our [Contributing Guidelines](CONTRIBUTING.md) for more details.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [ENS](https://ens.domains/) - For decentralized domain name services
- [IPFS](https://ipfs.io/) - For decentralized storage capabilities
- [WireGuard](https://www.wireguard.com/) - For secure VPN tunneling technology
- [libp2p](https://libp2p.io/) - For peer-to-peer networking infrastructure
- [Ethereum](https://ethereum.org/) - For blockchain infrastructure

## 📬 Contact & Support

- Website: [https://nollarsvpn.com](https://nollars.com)
- Twitter: [@NollarsVPN](https://twitter.com/NollarsNetwork)

## 💰 Support the Project

If you find NollarsVPN valuable, please consider supporting our development efforts with a Bitcoin donation:

```
BTC: bc1pxw5j059khxkrdclwepfctz4ap4gjggczvzv7fxley6ten0n653dsex3edp
```

Your donations help us maintain and improve NollarsVPN, keeping it free, open-source, and independent from corporate interests.

---

<p align="center">
  <strong>NollarsVPN - Decentralized Privacy for a Decentralized World</strong>
</p>

<p align="center">
  &copy; 2025 NollarsVPN. All rights reserved.
</p>
