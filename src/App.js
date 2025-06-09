import React, { useState } from "react";
import Web3 from "web3";

// Stablecoin token contracts on BNB Chain (BEP-20)
const TOKEN_CONTRACTS = {
  USDT: "0x55d398326f99059fF775485246999027B3197955",
  BUSD: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
  USDC: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
};

// Standard ERC20 ABI snippet for transfer events
const ERC20_ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
];

export default function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [txHash, setTxHash] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const DPNS_WALLET = "0x9E45AdD5FC16Bb899E215824630A7b84eB15ca50".toLowerCase();
  const MIN_AMOUNT = 25;

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(accounts[0]);
        setStatus("✅ Wallet connected.");
      } catch {
        setStatus("❌ Wallet connection failed.");
      }
    } else {
      alert("Please install MetaMask.");
    }
  };

  const verifyTransaction = async () => {
    if (!txHash || txHash.length !== 66) {
      setStatus("❌ Invalid transaction hash.");
      return;
    }

    setLoading(true);
    setStatus("⏳ Verifying...");

    try {
      const web3 = new Web3("https://bsc-dataseed.binance.org/");
      const receipt = await web3.eth.getTransactionReceipt(txHash);
      if (!receipt || !receipt.status) {
        setStatus("❌ Transaction not confirmed yet.");
        setLoading(false);
        return;
      }

      const logs = receipt.logs;

      let matchFound = false;

      for (const [symbol, address] of Object.entries(TOKEN_CONTRACTS)) {
        const contract = new web3.eth.Contract(ERC20_ABI, address);

        for (let log of logs) {
          try {
            const parsed = contract._decodeEventABI.call(
              {
                name: "Transfer",
                jsonInterface: ERC20_ABI[0],
              },
              log
            );

            const from = parsed.from.toLowerCase();
            const to = parsed.to.toLowerCase();
            const value = Web3.utils.fromWei(parsed.value, "ether");

            if (
              to === DPNS_WALLET &&
              from === walletAddress.toLowerCase() &&
              parseFloat(value) >= MIN_AMOUNT
            ) {
              setIsVerified(true);
              setStatus(`✅ Verified: ${symbol} transfer of $${value}`);
              matchFound = true;
              break;
            }
          } catch {}
        }

        if (matchFound) break;
      }

      if (!matchFound) {
        setStatus("❌ No valid token transfer found to DPNS wallet.");
        setIsVerified(false);
      }
    } catch (err) {
      setStatus("❌ Error verifying transaction.");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial", maxWidth: 600, margin: "auto" }}>
      <h1>Buy DPNS (Stablecoin Payment)</h1>

      {!walletAddress ? (
        <button onClick={connectWallet} style={{ padding: 10, fontSize: 16 }}>
          Connect Wallet
        </button>
      ) : (
        <p><strong>Connected:</strong> {walletAddress}</p>
      )}

      <input
        type="text"
        placeholder="Paste transaction hash"
        value={txHash}
        onChange={(e) => setTxHash(e.target.value)}
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
