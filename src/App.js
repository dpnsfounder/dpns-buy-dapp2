import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [transactionHash, setTransactionHash] = useState("");
  const [status, setStatus] = useState("");

  // Configure WalletConnect
  const web3Modal = new Web3Modal({
    cacheProvider: false,
    providerOptions: {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          rpc: {
            56: "https://bsc-dataseed.binance.org/", // BNB Chain Mainnet
          },
        },
      },
    },
  });

  const connectWallet = async () => {
    try {
      const instance = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(instance);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      setProvider(provider);
      setWalletAddress(address);
      setStatus("Wallet connected successfully.");
    } catch (error) {
      console.error("Wallet connection failed:", error);
      setStatus("Wallet connection failed.");
    }
  };

  const handleVerifyTransaction = () => {
    if (!transactionHash) {
      setStatus("Please enter a transaction hash.");
      return;
    }

    setStatus("Verifying BNB transaction hash: " + transactionHash);
    // Simulate the logic to handle verification...
    setTimeout(() => {
      setStatus("✅ Transaction verified and DPNS claimed!");
    }, 2000);
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
      <h1>DPNS Buy DApp</h1>

      {!walletAddress ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <p>Connected: {walletAddress}</p>
      )}

      <input
        type="text"
        placeholder="Paste BNB transaction hash"
        value={transactionHash}
        onChange={(e) => setTransactionHash(e.target.value)}
        style={{ display: "block", marginTop: "20px", width: "300px" }}
      />

      <button onClick={handleVerifyTransaction} style={{ marginTop: "10px" }}>
        Verify & Claim DPNS
      </button>

      <p style={{ marginTop: "20px", color: "green" }}>{status}</p>
    </div>
  );
}

export default App;
