import React, { useState } from "react";
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { verifyTransactionHash } from "./verifyTransaction";

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

  const DPNS_WALLET = "0x9e45ad8d5fc16bb89b215824630a7b84eb15ca50".toLowerCase();
  const MIN_AMOUNT = 25;

  const connectWallet = async () => {
    try {
      let provider;

      const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);

      if (window.ethereum && !isMobile) {
        provider = window.ethereum;
        await provider.request({ method: "eth_requestAccounts" });
      } else {
        provider = new WalletConnectProvider({
          rpc: {
            56: "https://bsc-dataseed.binance.org/"
          },
          chainId: 56
        });

        await provider.enable();
      }

      const web3 = new Web3(provider);
      const accounts = await web3.eth.getAccounts();
      setWalletAddress(accounts[0]);

      provider.on("disconnect", () => {
        setWalletAddress("");
      });

    } catch (err) {
      console.error("❌ Wallet connection failed:", err);
    }
  };

  const handleVerify = async () => {
    try {
      setStatus("");
      setLoading(true);

      const result = await verifyTransactionHash(txHash, walletAddress, DPNS_WALLET, MIN_AMOUNT, TOKEN_CONTRACTS, ERC20_ABI);
      if (result.verified) {
        setStatus("✅ Transaction verified! You will receive your DPNS.");
        setIsVerified(true);
      } else {
        setStatus("❌ Verification failed. " + result.reason);
        setIsVerified(false);
      }

    } catch (err) {
      console.error("Error verifying transaction:", err);
      setStatus("❌ Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>DPNS Buy DApp</h1>

      {!walletAddress ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <p>Connected: {walletAddress}</p>
      )}

      <input
        type="text"
        placeholder="Enter your transaction hash"
        value={txHash}
        onChange={(e) => setTxHash(e.target.value)}
        style={{ width: "100%", marginTop: "20px", padding: "10px" }}
      />

      <button onClick={handleVerify} disabled={loading || !walletAddress}>
        {loading ? "Verifying..." : "Submit Transaction"}
      </button>

      {status && (
        <p style={{ marginTop: "20px", color: isVerified ? "green" : "red" }}>{status}</p>
      )}
    </div>
  );
}
