import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

const ConnectWallet = ({ onWalletConnect }) => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false);

  const targetChainId = 314159; // Filecoin - Calibration testnet
  const [isConnected, setIsConnected] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // useEffect(() => {
  //   // Check if the wallet is already connected when the component mounts
  //   if (window?.ethereum && window?.ethereum?.selectedAddress) {
  //     const web3Instance = new Web3(window.ethereum);
  //     const selectedAddress = window.ethereum.selectedAddress;
      
  //     setWeb3(web3Instance);
  //     setAccount(selectedAddress);
  //     setIsConnected(true);
  //   }
  // }, []);

  async function connectWallet() {
    setIsConnecting(true);
    setIsSwitchingNetwork(false);

    if (!window.ethereum) {
      alert("You need an ethereum compatible wallet to proceed")
    }

    if (window.ethereum) {
      try {
        const web3Instance = new Web3(window.ethereum);

        // Request the user to add the target chain to wallet
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x4CB2F',
              chainName: 'Filecoin - Calibration testnet',
              nativeCurrency: {
                name: 'attoFIL',
                symbol: 'tFIL',
                decimals: 18,
              },
              rpcUrls: ['https://api.calibration.node.glif.io/rpc/v1'],
              blockExplorerUrls: [
                'https://calibration.filscan.io',
              ],
            },
          ],
        }).catch((error) => {
          console.log(error);
        });

        // Request the user to switch to the target chain
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${targetChainId.toString(16)}` }],
        });

        await window.ethereum.on('accountsChanged', function (accounts) {
          // Time to reload your interface with accounts[0]!
          window.location.reload(false);
        });

        await window.ethereum.on('chainChanged', function (accounts) {
          // Time to reload your interface with accounts[0]!
          setIsSwitchingNetwork(true);
          setIsConnected(false);
          window.location.reload(false);
        });

        const accounts = await web3Instance.eth.getAccounts();
        setWeb3(web3Instance);
        setAccount(accounts[0]);
        onWalletConnect(true); // Notify the parent component of the wallet connection status
        setIsConnecting(false);
        setIsConnected(true);
      } catch (error) {
        console.error('Error connecting wallet:', error);
        onWalletConnect(false); // Notify the parent component of the failed connection
        setIsConnecting(false);
        setIsConnected(false);
      }
    } else {
      console.error('MetaMask not detected.');
      onWalletConnect(false); // Notify the parent component of the failed connection
      setIsConnecting(false);
      setIsConnected(false);
    }
  }

  const handleDisconnect = async () => {
    setDisconnecting(true);
  };

  const confirmDisconnect = async () => {
    if (window?.ethereum && isConnected) {
      try {
        await window.ethereum.request({
          method: 'eth_requestAccounts',
          params: [{ eth_accounts: {} }],
        });
        setIsConnected(false);
        setDisconnecting(false);
        setShowDropdown(false);
        window.location.reload(false);
      } catch (error) {
        console.error('Error disconnecting wallet:', error);
        setDisconnecting(false);
      }
    }
  };

  return (
    <div>
      {isConnected ? (
        <div className="relative inline-block text-left ">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className={`bg-blue-500 hover:bg-blue-700 border border-white text-white  font-bold py-2 px-4 rounded ${disconnecting ? 'cursor-not-allowed' : ''
              }`}
          >
            {disconnecting
              ? 'Disconnecting...'
              : `Connected: ${account?.slice(0, 4)}...${account?.slice(-4)}`}
          </button>
          {showDropdown && (
            <div className="absolute mt-2 py-2 w-48 bg-white border rounded shadow-xl">
              <button
                onClick={confirmDisconnect}
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={connectWallet}
          disabled={isConnecting || isSwitchingNetwork}
          className={`bg-blue-500 hover:bg-blue-700 border border-white text-white font-bold py-2 px-4 rounded ${isConnecting || isSwitchingNetwork ? 'cursor-not-allowed' : ''
            }`}
        >
          {isConnecting
            ? 'Connecting...'
            : isSwitchingNetwork
              ? 'Switching networks...'
              : 'Connect Wallet'}
        </button>
      )}
    </div>
  );
};

export default ConnectWallet;
