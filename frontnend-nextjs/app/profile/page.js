
"use client"
import React, { useEffect, useState } from 'react';
import Web3 from 'web3'; // Import the Web3 library or Ethereum library of your choice
import Settings from './Settings';
import DaoParticipation from './DaoParticipation';


// Load Ethereum contract ABI and create a contract instance
const contractABI = ""; // Replace with your contract's ABI
const contractAddress = '0x...'; // Replace with your contract's address


const Profile = () => {
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
    <div>
      {/* Render child components and pass down web3 and contractInstance as props */}
    <DaoParticipation />
      <Settings />
    </div>
  );
};

export default Profile;
