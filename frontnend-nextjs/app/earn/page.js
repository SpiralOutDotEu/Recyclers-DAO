
"use client"
import React, { useEffect, useState } from 'react';
import Web3 from 'web3'; // Import the Web3 library or Ethereum library of your choice
import ProductForm from './ProductForm';


// Load Ethereum contract ABI and create a contract instance
const contractABI = ""; // Replace with your contract's ABI
const contractAddress = '0x...'; // Replace with your contract's address


const Earn = () => {
  const [web3, setWeb3] = useState(null);
  const [contractInstance, setContractInstance] = useState(null);

  useEffect(() => {
    // Initialize Web3 and connect to Ethereum network
    async function initWeb3() {
      if (typeof window.ethereum !== 'undefined') {
        const _web3 = new Web3(window.ethereum);
        await window.ethereum.enable(); // Request user's permission to connect
        setWeb3(_web3);

        const _contractInstance = new _web3.eth.Contract(contractABI, contractAddress);
        setContractInstance(_contractInstance);
      }
    }

    initWeb3();
  }, []);

  return (
<div className="flex flex-col md:flex-row gap-4 p-4">
<div className="bg-blue-100 p-4 mb-4">
        <p> 
          <span className='font-bold'>How to earn: </span> In order to submit images you have to stake at least 10 RDAO and to be able to validate at least 100 RDAO. Go to <a href='/profile' className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600">profile </a> to check and update your account. After submission a validator should check your submission. In a valid submission both submitter and validator will earn 0.01 freshly minted RDAO while in an invalid submission submitter will lose 0.01 RDAO that will go to validators account.
        </p>
      </div>
  {/* Submit Data Section */}
  <div className="bg-blue-100 md:w-1/2 p-4 rounded-lg">
    <h2 className="text-gray-600 text-2xl font-semibold mb-2">Submit Image</h2>
    {/* Place your components for submitting data here */}
    <ProductForm />
  </div>

  {/* Validate Data Section */}
  <div className="bg-blue-100 md:w-1/2 p-4 rounded-lg">
    <h2 className="text-gray-600 text-2xl font-semibold mb-2">Validate Data</h2>
    {/* Place your components for validating data here */}
  </div>
</div>
  );
};

export default Earn;
