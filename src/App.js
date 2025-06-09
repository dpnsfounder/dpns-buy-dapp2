import React, { useState } from "react";

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [txHash, setTxHash] = useState("");
  const [status, setStatus] = useState("");

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

  function handleVerifyTransaction() {
    if (!txHash.trim()) {
      setStatus("❌ Please enter a transaction hash.");
      return;
    }

    // Simulate BNB transaction check (this part we'll wire later)
    setStatus(`🔍 Verifying transaction: ${txHash}...`);

    setTimeout(() => {
      setStatus(`✅ Transaction verified! DPNS will be credited.`);
      // Here you'll update your backend later
    }, 2000);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>DPNS Buy DApp</h1>

      {!walletAddress ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <>
          <p>Connected: {walletAddress}</p>

          <div style={{ marginTop: 20 }}>
            <input
              type="text"
              placeholder="Paste BNB transaction hash"
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              style={{ width: "300px", padding: "5px" }}
            />
            <br />
            <button onClick={handleVerifyTransaction} style={{ marginTop: 10 }}>
              Verify & Claim DPNS
            </button>
            {status && <p style={{ marginTop: 10 }}>{status}</p>}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
