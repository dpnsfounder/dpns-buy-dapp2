import React, { useState } from "react";
import Web3 from "web3";

export default function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [status, setStatus] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(accounts[0]);
        setStatus("Wallet connected.");
      } catch (err) {
        alert("MetaMask connection failed.");
      }
    } else {
      alert("MetaMask not installed.");
    }
  };

  const verifyTransaction = async () => {
    if (!transactionHash || transactionHash.length !== 66) {
      setStatus("❌ Invalid transaction hash.");
      return;
    }

    setLoading(true);
    setStatus("⏳ Verifying transaction...");

    try {
      const web3 = new Web3("https://bsc-dataseed.binance.org/");
      const tx = await web3.eth.getTransaction(transactionHash);

      if (tx && tx.to && tx.from && tx.value && tx.hash === transactionHash.toLowerCase()) {
        setIsVerified(true);
        setStatus("✅ Transaction verified. DPNS will be credited.");
      } else {
        setIsVerified(false);
        setStatus("❌ Transaction not found or invalid.");
      }
    } catch (err) {
      setStatus("❌ Error verifying transaction.");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial", maxWidth: 600, margin: "auto" }}>
      <h1>Buy DPNS</h1>

      {!walletAddress ? (
        <button onClick={connectMetaMask} style={{ padding: 10, fontSize: 16 }}>
          Connect Wallet
        </button>
      ) : (
        <p><strong>Connected:</strong> {walletAddress}</p>
      )}

      <input
        type="text"
        placeholder="Paste transaction hash"
        value={transactionHash}
        onChange={(e) => setTransactionHash(e.target.value)}
        style={{ width: "100%", padding: 10, fontSize: 14, marginTop: 20 }}
      />

      <button
        onClick={verifyTransaction}
        disabled={loading || !walletAddress}
        style={{
          padding: 10,
          fontSize: 16,
          marginTop: 10,
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          cursor: "pointer"
        }}
      >
        {loading ? "Verifying..." : "Submit Transaction"}
      </button>

      {status && (
        <div style={{ marginTop: 20, fontWeight: "bold", color: isVerified ? "green" : "black" }}>
          {status}
        </div>
      )}
    </div>
  );
}
