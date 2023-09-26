"use client"

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { governorAddress, governorAbi, timelockAddress, timelockAbi, customRpcUrl } from '../hooks/constants';
import StorageDealProposal from './StorageDealProposal';
import GenericGovernorProposal from './GenericGovernorProposal';

const Governance = () => {
    const [provider, setProvider] = useState(null);
    const [governorContract, setGovernorContract] = useState(null);
    const [timelockContract, setTimelockContract] = useState(null);
    const [treasuryBalance, setTreasuryBalance] = useState(null);

    useEffect(() => {
        const init = async () => {
            try {
                // Connect to Ethereum provider
                const customProvider = new ethers.JsonRpcProvider(customRpcUrl);
                setProvider(customProvider);

                // Initialize Governor and Timelock contracts
                const govContract = new ethers.Contract(governorAddress, governorAbi, customProvider);
                const timelockContract = new ethers.Contract(timelockAddress, timelockAbi, customProvider);

                setGovernorContract(govContract);
                setTimelockContract(timelockContract);

                // Fetch treasury balance
                const balance = await customProvider.getBalance(timelockAddress);
                // Convert the balance from Wei to Ether
                const treasuryBalance = ethers.formatEther(balance);

                setTreasuryBalance(treasuryBalance);

            } catch (error) {
                console.error('Error initializing contracts:', error);
            }
        };

        init();
    }, []);

    // Define functions for proposal creation, voting, etc.

    return (
        <div className="bg-gray-100 min-h-screen p-8">
            <h1 className="text-3xl font-semibold mb-4">Recyclers DAO Governance </h1>
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-2">Treasury Balance:</h2>
                <p className="text-lg">{treasuryBalance} tFil</p>
            </div>
            {/* propose, vote, dao deal etc */}
            <StorageDealProposal />
            <GenericGovernorProposal />
        </div>
    );
};

export default Governance;
