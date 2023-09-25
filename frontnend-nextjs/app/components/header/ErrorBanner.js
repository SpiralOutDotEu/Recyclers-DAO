"use client"
import React, { useState, useEffect } from 'react';
import useToken from '../../hooks/useToken';
import { useWallet } from '../../contexts/WalletContext';

const ErrorBanner = () => {
  const { ethereumBalance, loading, error } = useToken();
  const { walletAddress } = useWallet();
  const [noWallet, setNoWallet] = useState();
  const [noConnection, setNoConnection] = useState();
  const [wrongChain, setWrongChain] = useState();
  const [noBalance, setNoBalance] = useState();
  useEffect(() => {
    (!window?.ethereum) ? setNoWallet(true) : setNoWallet(false);
    (!window?.account || loading) ? setNoConnection(true) : setNoConnection(false);
    (!window?.ethereum?.chainId !== '0x4cb2f') ? setWrongChain(true) : setWrongChain(false);
    (!ethereumBalance || !(ethereumBalance>0) ) ? setNoBalance(true) : setNoBalance(false)
  }, [loading , error,  ethereumBalance, walletAddress])

  return (
    <div>
    {noWallet && (
      <div className="bg-red-500 text-white p-4">
        <p>
          No ethereum wallet is detected. Please install{' '}
          <a
            href="https://metamask.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            MetaMask
          </a>{' '}
          or other compatible wallet to use this app.
        </p>
      </div>
    )}
    {!noWallet && !walletAddress && (
        <div className="bg-yellow-500 text-white p-4">
          <p>
            Connect your wallet...
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-500 text-white p-4">
          <p>
            An error occurred while fetching account details. Please ensure you are on the correct chain and have a positive balance.
          </p>
        </div>
      )}

      {walletAddress && wrongChain && (
        <div className="bg-red-500 text-white p-4">
          <p>
            Please switch to the Filecoin - Calibration testnet network in your MetaMask wallet.
          </p>
        </div>
      )}

      { walletAddress && !(wrongChain) && noBalance && (
      <div className="bg-red-500 text-white p-4">
        <p>
          Your account balance is insufficient. Please add funds to your account by visiting <a
            href="https://faucet.calibration.fildev.network/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            this Filecoin Faucet
          </a> .
        </p>
      </div>
      )}
      </div>
 
)
};


export default ErrorBanner;
