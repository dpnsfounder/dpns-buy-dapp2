import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";

export async function connectWallet(setWallet) {
  try {
    let provider;

    if (window.ethereum && !/Mobi|Android/i.test(navigator.userAgent)) {
      // Desktop MetaMask
      provider = window.ethereum;
      await provider.request({ method: "eth_requestAccounts" });
    } else {
      // Mobile fallback: WalletConnect
      provider = new WalletConnectProvider({
        rpc: {
          56: "https://bsc-dataseed.binance.org/" // BNB Mainnet
        },
        chainId: 56
      });

      await provider.enable(); // Opens QR / WalletConnect modal
    }

    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    setWallet(accounts[0]);

    provider.on("disconnect", () => {
      setWallet("");
    });

  } catch (err) {
    console.error("❌ Wallet connection failed:", err);
  }
}
