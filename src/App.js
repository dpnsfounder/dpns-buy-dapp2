import React, { useState } from "react";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";

export default function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [txHash, setTxHash] = useState("");

  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(accounts[0]);
      } catch (err) {
        alert("MetaMask connection failed.");
      }
    } else {
      alert("MetaMask not installed.");
    }
  };

  const connectWalletConnect = async () => {
    try {
      const provider = new WalletConnectProvider({
        rpc: {
          56: "https://bsc-dataseed.binance.org/", // BNB Chain Mainnet
        },
      });

      await provider.enable();
      const web3 = new Web3(provider);
      const accounts = await web3.eth.getAccounts();
      setWalletAddress(accounts[0]);

      // Optional: close session when done
      provider.on("disconnect", () => {
        setWalletAddress("");
      });
    } catch (err) {
      alert("WalletConnect failed.");
    }
  };

  const handleClaim = () => {
    if (!txHash) return alert("Please enter a transaction hash.");
    alert(`✅ Transaction hash submitted: ${txHash}\n\n(Verification logic coming soon)`);
  };

  return (
    <div style={{ fontFamily: "Arial", textAlign: "center", marginTop: "50px" }}>
      <h1>DPNS Buy DApp</h1>
      {walletAddress ? (
        <>
          <p>Connected: <b>{walletAddress}</b></p>
          <input
            type="text"
            placeholder="Paste BNB transaction hash"
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
            style={{ padding: "10px", width: "300px" }}
          />
          <br /><br />
          <button onClick={handleClaim} style={{ padding: "10px 20px" }}>
            Verify & Claim DPNS
          </button>
        </>
      ) : (
        <>
          <p><b>Choose Wallet:</b></p>
          <button onClick={connectMetaMask} style={{ margin: "10px", padding: "10px 20px" }}>
            Connect MetaMask
          </button>
          <button onClick={connectWalletConnect} style={{ margin: "10px", padding: "10px 20px" }}>
            WalletConnect (TrustWallet, SafePal, etc.)
          </button>
        </>
      )}
    </div>
  );
}
