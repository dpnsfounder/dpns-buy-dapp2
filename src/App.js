import React, { useState } from "react";

function App() {
  const [walletAddress, setWalletAddress] = useState(null);

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.error("Wallet connection error:", error);
      }
    } else {
      alert("MetaMask not detected. Please install MetaMask.");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>DPNS Buy DApp</h1>
      {!walletAddress ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <p>Connected: {walletAddress}</p>
      )}
    </div>
  );
}

export default App;
