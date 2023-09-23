import { useEffect, useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { tokenAddress, tokenAbi, customRpcUrl } from './constants';
import { ethers } from 'ethers';

const useToken = () => {
  const { walletAddress } = useWallet();
  const [ethereumBalance, setEthereumBalance] = useState(null);
  const [stakedBalance, setStakedBalance] = useState(null);
  const [tokenPriceInEther, setTokenPriceInEther] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (!walletAddress) return;

      try {
        // Initialize the Ethereum provider with custom RPC URL
        const provider = new ethers.JsonRpcProvider(customRpcUrl);

        // Fetch Ethereum balance
        const balance = await provider.getBalance(walletAddress);
        const etherBalance = ethers.formatEther(balance);
        setEthereumBalance(etherBalance);
        console.log("Ethereum Balance: ", etherBalance)

        // Initialize the contract instance with the token ABI and address
        const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, provider);

        // Fetch staked balance
        const stakedBalance = await tokenContract.getStakedBalance(walletAddress);
        setStakedBalance(ethers.formatEther(stakedBalance));
        console.log("Staked: ", stakedBalance)

        // Fetch token price in Ether
        const tokenPrice = await tokenContract.tokenPriceInEther();
        console.log("Token Price: ", tokenPrice)
        setTokenPriceInEther(ethers.formatEther(tokenPrice));
      } catch (error) {
        setError(error.message);
        console.log("Error: ", error.message)
      }
    }

    fetchData();
  }, [walletAddress]);

  return {
    ethereumBalance,
    stakedBalance,
    tokenPriceInEther,
    error,
  };
};

export default useToken;
