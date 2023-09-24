
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

  }, []);

  return (
<div className="flex flex-col gap-4 p-4">
    {/* How to Earn Section */}
    <div className="bg-blue-100 p-4 mb-4 rounded-lg">
      <h2 className="text-gray-800 text-xl font-semibold mb-2">How to Earn</h2>
      <p className="text-gray-600">
        To participate in the image submission process and earn rewards, follow these steps:
      </p>
      <ul className="list-disc pl-6 text-gray-600">
        <li>Stake a minimum of 10 RDAO tokens in order to submit data.</li>
        <li>Stake a minimum of 100 RDAO tokens in order to validate data.</li>
        <li>Manage your account settings in your <a href="/profile" className="text-blue-600 hover:underline visited:text-purple-600">profile</a>.</li>
        <li>After submission, a validator must review your image.</li>
        <li>In a valid submission, both you and the validator will earn 0.01 freshly minted RDAO.</li>
        <li>In an invalid submission, you will lose 0.01 RDAO, which will be transferred to the validator's account.</li>
      </ul>
    </div>

    {/* Submit and Validate Sections */}
    <div className="flex flex-col md:flex-row gap-4">
      {/* Submit Data Section */}
      <div className="bg-blue-100 md:w-1/2 p-4 rounded-lg">
        <h2 className="text-gray-800 text-xl font-semibold mb-2">Submit Image</h2>
        {/* Place your components for submitting data here */}
        <ProductForm />
      </div>

      {/* Validate Data Section */}
      <div className="bg-blue-100 md:w-1/2 p-4 rounded-lg">
        <h2 className="text-gray-800 text-xl font-semibold mb-2">Validate Data</h2>
        {/* Place your components for validating data here */}
      </div>
    </div>
  </div>
  )
};

export default Earn;
