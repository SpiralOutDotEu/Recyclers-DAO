import React, { useState, useEffect } from 'react';
import useToken from '../hooks/useToken';
import { ethers } from 'ethers';
import Loading from '../components/Loading';
import Success from '../components/Success'
import Error from '../components/Error'

const DaoParticipation = () => {
  const [purchaseAmount, setPurchaseAmount] = useState(10);
  const [increaseAmount, setIncreaseAmount] = useState(0);
  const [decreaseAmount, setDecreaseAmount] = useState(0);
  const { ethereumBalance, stakedBalance, unStakedBalance,
    tokenPriceInEther, loading, error,
    stakeTokens, decreaseStake, purchaseTokens } = useToken();
  const [showSuccess, setShowSuccess] = useState(null);
  const [showError, setShowError] = useState(null);

  useEffect(() => {
    // You can load additional data here if needed
  }, [ethereumBalance, stakedBalance, tokenPriceInEther]);


  const handlePurchase = () => {
    if (window.ethereum == null) {
      setError("No Browser wallet detected");
      alert("You need an ethereum wallet")
      return
    } else {
      const provider = new ethers.BrowserProvider(window.ethereum)
      // Convert purchaseAmount to Wei (assuming purchaseAmount is in Ether)
      const amountInWei = ethers.parseEther(purchaseAmount.toString());
      // Ensure the tokenPriceInEther is valid
      if (tokenPriceInEther <= 0) {
        setError("Sale not set");
        return;
      }
      // Calculate the tokenAmount based on the provided amount and tokenPriceInEther
      const tokenPriceInEth = ethers.parseUnits(tokenPriceInEther, "ether")
      const tokenAmount = (amountInWei * BigInt(10 ** 18)) / (tokenPriceInEth);
      // Call the purchaseTokens function with the calculated tokenAmount
      const onPurchase = async (amountInWei, userProvider) => {
        const success = await purchaseTokens(amountInWei, userProvider);
        if (success) {
          // Set the purchase success state to true
          setShowSuccess("Purchase Successful!");
        } else {
          setShowError("Error! something went wrong")
        }

      };
      onPurchase(tokenAmount, provider)
    }
  };

  const handleIncreaseStake = () => {
    if (window.ethereum == null) {
      setError("No Browser wallet detected");
      alert("You need an ethereum wallet")
      return
    } else {
      const provider = new ethers.BrowserProvider(window.ethereum)
      // Convert purchaseAmount to Wei (assuming purchaseAmount is in Ether)
      const amountInWei = ethers.parseEther(increaseAmount.toString());
      // Call the purchaseTokens function with the calculated tokenAmount
      const onIncreaseStake = async (amount, userProvider) => {
        const success = await stakeTokens(amount, userProvider);
        if (success) {
          setShowSuccess("Staked Successful!");
        } else {
          setShowError("Error! something went wrong")
        }
      };
      onIncreaseStake(amountInWei, provider);
    }
  };

  const handleDecreaseStake = () => {
    if (window.ethereum == null) {
      setError("No Browser wallet detected");
      alert("You need an ethereum wallet")
      return
    } else {
      const provider = new ethers.BrowserProvider(window.ethereum)
      // Convert purchaseAmount to Wei (assuming purchaseAmount is in Ether)
      const amountInWei = ethers.parseEther(decreaseAmount.toString());
      // Call the purchaseTokens function with the calculated tokenAmount
      const onDecreaseStake = async (amount, userProvider) => {
        const success = await decreaseStake(amount, userProvider);
        if (success) {
          setShowSuccess("Reduced stake Successful!");
        } else {
          setShowError("Error! something went wrong")
        }
      };
      onDecreaseStake(amountInWei, provider);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-lg center-items">
      <Loading visible={loading} />
      <div className="bg-blue-100 p-4 mb-4">
        <p>
          To participate in the DAO and earn tokens, you need to stake 10 RDAO tokens. You can directly purchase and stake them below. The purchase price is {tokenPriceInEther} Ether.
        </p>
      </div>
      <div className="mb-4">
        <p className="text-lg font-semibold">
          Your Balances
        </p>
        <p>Your balance is {ethereumBalance} Ether and {unStakedBalance} RDAO.</p>
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Your Purchase Amount:</label>
        <div className="flex space-x-2">
          <input
            type="number"
            value={purchaseAmount}
            onChange={(e) => setPurchaseAmount(e.target.value)}
            className="w-1/2 px-3 py-2 border rounded-md"
          />
          <button onClick={handlePurchase} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Purchase
          </button>
        </div>
      </div>
      <div className="mb-4">
        <p className="text-lg font-semibold">Your Staked Amount</p>
        <p>Your staked amount is {stakedBalance} RDAO.</p>
        <div className="flex space-x-2">
          <div>
            <label className="block mb-2 font-semibold">Increase Stake:</label>
            <input
              type="number"
              value={increaseAmount}
              onChange={(e) => setIncreaseAmount(e.target.value)}
              className="w-1/2 px-3 py-2 border rounded-md"
            />
            <button onClick={handleIncreaseStake} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
              Increase
            </button>
          </div>
          <div>
            <label className="block mb-2 font-semibold">Decrease Stake:</label>
            <input
              type="number"
              value={decreaseAmount}
              onChange={(e) => setDecreaseAmount(e.target.value)}
              className="w-1/2 px-3 py-2 border rounded-md"
            />
            <button onClick={handleDecreaseStake} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
              Decrease
            </button>
          </div>
        </div>
      </div>
      {showSuccess && (
        <Success message={showSuccess} onClose={() => setShowSuccess(false)} />
      )}
      {showError && (
        <Error message={showError} onClose={() => setShowError(false)} />
      )}
    </div>
  );
};

export default DaoParticipation;
