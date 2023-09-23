"use client"
import React, { createContext, useContext, useState } from 'react';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);

  const updateWalletAddress = (newAddress) => {
    setWalletAddress(newAddress);
  };

  return (
    <WalletContext.Provider value={{ walletAddress, updateWalletAddress }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  return useContext(WalletContext);
};