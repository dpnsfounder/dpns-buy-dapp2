// src/verifyTransaction.js

export function verifyTransactionHash(txnHash) {
  const acceptedHashes = [
    "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef", // Dummy valid hash 1
    "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcd" // Dummy valid hash 2
  ];

  return acceptedHashes.includes(txnHash.toLowerCase());
}
