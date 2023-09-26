import { useEffect, useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { tokenAddress, tokenAbi, customRpcUrl } from './constants';
import { ethers } from 'ethers';


const useToken = () => {
    const { walletAddress } = useWallet();
    const [ethereumBalance, setEthereumBalance] = useState(null);
    const [stakedBalance, setStakedBalance] = useState(null);
    const [unStakedBalance, setUnStakedBalance] = useState(null);
    const [tokenPriceInEther, setTokenPriceInEther] = useState(null);
    const [table, setTable] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Initialize the Ethereum provider with custom RPC URL
    const provider = new ethers.JsonRpcProvider(customRpcUrl);
    // Initialize the contract instance with the token ABI and address
    const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, provider);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            // Fetch token price in Wei using .call()
            const tokenPriceWei = await tokenContract.tokenPriceInEther();
            // Convert token price from Wei to Ether
            const tokenPriceEther = ethers.formatEther(tokenPriceWei);
            setTokenPriceInEther(tokenPriceEther);
            // Fetch table 
            const table = await tokenContract.getTable();
            setTable(table);
            setLoading(false);
        }
        fetchData();
    }, []);

    useEffect(() => {
        async function fetchData() {
            if (!walletAddress) return;
            setLoading(true);
            try {
                // Fetch staked balance
                const stakedBalance = await tokenContract.getStakedBalance(walletAddress);
                // Convert stakedBalance from Wei to Ether
                const stakedBalanceEther = ethers.formatEther(stakedBalance);
                setStakedBalance(stakedBalanceEther);
                // Fetch staked balance
                const unstakedBalance = await tokenContract.balanceOf(walletAddress);
                // Convert stakedBalance from Wei to Ether
                const unstakedBalanceEther = ethers.formatEther(unstakedBalance);
                setUnStakedBalance(unstakedBalanceEther);
                // Fetch Ethereum balance
                const balance = await provider.getBalance(walletAddress);
                const etherBalance = ethers.formatEther(balance);
                setEthereumBalance(etherBalance);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [walletAddress]);

    // Function to submit data
    const submitData = async (imageCid, material, isNew, brand, barcode, userProvider) => {
        try {
            setLoading(true);
            const signer = await userProvider.getSigner()
            const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);
            const type = "New" ? isNew : "Waste"
            const tx = await tokenContract.submitData(imageCid, material,type, brand, barcode);
            await tx.wait(); // Wait for transaction confirmation
            return true;
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Function to stake tokens
    const stakeTokens = async (amountInWei, userProvider) => {
        try {
            setLoading(true);
            const signer = await userProvider.getSigner()
            const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);
            const tx = await tokenContract.stakeTokens(amountInWei);
            await tx.wait(); // Wait for transaction confirmation
            return true;
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Function to decrease stake
    const decreaseStake = async (amountInWei, userProvider) => {
        try {
            setLoading(true);
            const signer = await userProvider.getSigner()
            const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);
            const tx = await tokenContract.decreaseStake(amountInWei);
            await tx.wait(); // Wait for transaction confirmation
            return true;
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Function to purchase tokens
    const purchaseTokens = async (amountInWei, userProvider) => {
        try {
            setLoading(true);
            const signer = await userProvider.getSigner()
            const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);
            const tx = await tokenContract.purchaseTokens({ value: amountInWei });
            await tx.wait(); // Wait for transaction confirmation
            return true;

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        ethereumBalance,
        stakedBalance,
        unStakedBalance,
        tokenPriceInEther,
        table,
        error,
        loading,
        stakeTokens,
        decreaseStake,
        purchaseTokens,
        submitData,
    };
};

export default useToken;
