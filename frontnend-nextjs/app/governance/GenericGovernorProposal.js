import React, { useState } from 'react';
import { ethers } from 'ethers';
import { governorAddress, governorAbi } from '../hooks/constants';

const GenericGovernorProposal = () => {
  const [proposalDescription, setProposalDescription] = useState('');
  const [proposalPayload, setProposalPayload] = useState('');

  const handleDescriptionChange = (event) => {
    setProposalDescription(event.target.value);
  };

  const handlePayloadChange = (event) => {
    setProposalPayload(event.target.value);
  };

  const createProposal = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = provider.getSigner();
      const governorContract = new ethers.Contract(governorAddress, governorAbi, signer);

      // Encode the function call with the payload
      const encodedProposalPayload = proposalPayload; // Replace with actual payload encoding

      // Create the proposal
      const tx = await governorContract.propose(
        [proposalPayload], // Replace with target addresses
        [0], // Replace with values
        [encodedProposalPayload],
        proposalDescription
      );

      // Wait for the proposal transaction to be mined
      await tx.wait();

      // Proposal successfully created
      alert('Proposal created successfully!');
    } catch (error) {
      console.error('Error creating proposal:', error);
      alert('Error creating proposal. Please check the console for details.');
    }
  };

  return (
    <div className="bg-white p-6 mt-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold">Generic Governor Proposal</h2>
      <div className="mb-4">
        <label htmlFor="proposalDescription" className="block text-sm font-medium text-gray-700">
          Proposal Description:
        </label>
        <input
          type="text"
          id="proposalDescription"
          name="proposalDescription"
          value={proposalDescription}
          onChange={handleDescriptionChange}
          className="mt-1 p-2 border rounded-md w-full"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="proposalPayload" className="block text-sm font-medium text-gray-700">
          Proposal Payload:
        </label>
        <textarea
          id="proposalPayload"
          name="proposalPayload"
          value={proposalPayload}
          onChange={handlePayloadChange}
          rows="4"
          className="mt-1 p-2 border rounded-md w-full"
        />
      </div>
      <div className="mt-6">
        <button
          onClick={createProposal}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
        >
          Create Proposal
        </button>
      </div>
    </div>
  );
};

export default GenericGovernorProposal;
