import React, { useState } from 'react';
import { ethers } from 'ethers';
import { governorAddress, customRpcUrl } from '../hooks/constants';

const StorageDealProposal = () => {
    const [dealRequestStruct, setDealRequestStruct] = useState({
        // Initialize with default values
        dealCID: '',
        pieceSize: 0,
        verifiedDeal: false,
        fastRetrieval: false,
        provider: '',
        startEpoch: 0,
        endEpoch: 0,
        pricePerEpoch: 0,
        collateral: 0,
        dealDuration: 0,
        storageProviderOptions: [],
    });
    const [dealDescription, setDealDescription] = useState('')
    const [isAccordionOpen, setAccordionOpen] = useState(false);
    const toggleAccordion = () => {
        setAccordionOpen(!isAccordionOpen);
      };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setDealRequestStruct({
            ...dealRequestStruct,
            [name]: value,
        });
    };

    const makeProposal = async () => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = provider.getSigner();

            // Create a DAO contract instance (replace with your actual contract)
            const daoContract = new ethers.Contract(governorAddress, [], signer);

            // Encode the function call for makeDealProposal
            const functionToCall = "makeDealProposal";
            const args = [Object.values(dealRequestStruct)];
            const encodedFunctionCall = daoContract.interface.encodeFunctionData(functionToCall, args);

            // Replace with your proposal description
            const PROPOSAL_DESCRIPTION = dealDescription;

            // Make the proposal
            const proposeTx = await daoContract.propose(
                [daoDealClient.address], // Replace with the target address
                [0],
                [encodedFunctionCall],
                PROPOSAL_DESCRIPTION
            );

            // Handle the proposal creation receipt here

        } catch (error) {
            console.error('Error creating proposal:', error);
        }
    };

    return (
        <div className="bg-white p-4 mt-4 rounded-lg shadow-md">
            
            <h2 className="text-xl font-semibold mb-2">Storage Deal Proposal</h2>
            <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Deal description:</label>
                <input
                    type="text"
                    id="description"
                    name="description"
                    value={dealDescription}
                    onChange={(e) => setDealDescription(e.target.value)}
                    className="mt-1 p-2 border rounded-md w-full"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="dealCID" className="block text-sm font-medium text-gray-700">Deal CID:</label>
                <input
                    type="text"
                    id="dealCID"
                    name="dealCID"
                    value={dealRequestStruct.dealCID}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border rounded-md w-full"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="pieceSize" className="block text-sm font-medium text-gray-700">Piece Size:</label>
                <input
                    type="number"
                    id="pieceSize"
                    name="pieceSize"
                    value={dealRequestStruct.pieceSize}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border rounded-md w-full"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Verified Deal:</label>
                <input
                    type="checkbox"
                    id="verifiedDeal"
                    name="verifiedDeal"
                    checked={dealRequestStruct.verifiedDeal}
                    onChange={handleInputChange}
                    className="mt-1"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Fast Retrieval:</label>
                <input
                    type="checkbox"
                    id="fastRetrieval"
                    name="fastRetrieval"
                    checked={dealRequestStruct.fastRetrieval}
                    onChange={handleInputChange}
                    className="mt-1"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="provider" className="block text-sm font-medium text-gray-700">
                    Provider:
                </label>
                <input
                    type="text"
                    id="provider"
                    name="provider"
                    value={dealRequestStruct.provider}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border rounded-md w-full"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="startEpoch" className="block text-sm font-medium text-gray-700">
                    Start Epoch:
                </label>
                <input
                    type="number"
                    id="startEpoch"
                    name="startEpoch"
                    value={dealRequestStruct.startEpoch}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border rounded-md w-full"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="endEpoch" className="block text-sm font-medium text-gray-700">
                    End Epoch:
                </label>
                <input
                    type="number"
                    id="endEpoch"
                    name="endEpoch"
                    value={dealRequestStruct.endEpoch}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border rounded-md w-full"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="pricePerEpoch" className="block text-sm font-medium text-gray-700">
                    Price Per Epoch:
                </label>
                <input
                    type="number"
                    id="pricePerEpoch"
                    name="pricePerEpoch"
                    value={dealRequestStruct.pricePerEpoch}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border rounded-md w-full"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="collateral" className="block text-sm font-medium text-gray-700">
                    Collateral:
                </label>
                <input
                    type="number"
                    id="collateral"
                    name="collateral"
                    value={dealRequestStruct.collateral}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border rounded-md w-full"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="dealDuration" className="block text-sm font-medium text-gray-700">
                    Deal Duration:
                </label>
                <input
                    type="number"
                    id="dealDuration"
                    name="dealDuration"
                    value={dealRequestStruct.dealDuration}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border rounded-md w-full"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="storageProviderOptions" className="block text-sm font-medium text-gray-700">
                    Storage Provider Options:
                </label>
                <input
                    type="text"
                    id="storageProviderOptions"
                    name="storageProviderOptions"
                    value={dealRequestStruct.storageProviderOptions}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border rounded-md w-full"
                />
            </div>
            <button onClick={makeProposal} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md">
                Create Proposal
            </button>
        </div>
    );
};

export default StorageDealProposal;
