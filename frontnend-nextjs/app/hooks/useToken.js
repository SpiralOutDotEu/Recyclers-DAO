import { useEffect, useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { tokenAddress, tokenAbi, customRpcUrl } from './constants';
import { ethers } from 'ethers';

const useToken = () => {
    const { walletAddress } = useWallet();
    const [ethereumBalance, setEthereumBalance] = useState(null);
    const [stakedBalance, setStakedBalance] = useState(null);

    useEffect(() => {
        async function fetchData() {
            if (!walletAddress) return;

            // Initialize the Ethereum provider with custom RPC URL
            const provider = new ethers.JsonRpcProvider(customRpcUrl);

            // Fetch Ethereum balance
            const balance = await provider.getBalance(walletAddress);
            const etherBalance = ethers.formatEther(balance);
            setEthereumBalance(etherBalance);

            // Initialize the contract instance with the token ABI and address
            const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, provider);

            // Fetch staked balance
            const stakedBalance = await tokenContract.getStakedBalance(walletAddress);
            setStakedBalance(stakedBalance);
        }

        fetchData();
    }, [walletAddress]);

    return {
        ethereumBalance,
        stakedBalance,
    };
};

export default useToken;
