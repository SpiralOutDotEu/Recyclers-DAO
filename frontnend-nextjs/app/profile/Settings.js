// components/Settings.js
import React, { useState, useEffect } from 'react';
import DaoParticipation from './DaoParticipation';

const Settings = () => {
  const [lighthouseApiKey, setLighthouseApiKey] = useState('');
  const [web3StorageApiKey, setWeb3StorageApiKey] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('lighthouse');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Retrieve stored settings from browser's local storage
    const storedLighthouseApiKey = localStorage.getItem('lighthouseApiKey');
    const storedWeb3StorageApiKey = localStorage.getItem('web3StorageApiKey');
    const storedSelectedProvider = localStorage.getItem('selectedProvider');

    if (storedLighthouseApiKey) setLighthouseApiKey(storedLighthouseApiKey);
    if (storedWeb3StorageApiKey) setWeb3StorageApiKey(storedWeb3StorageApiKey);
    if (storedSelectedProvider) setSelectedProvider(storedSelectedProvider);
  }, []);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleSaveSettings = () => {
    // Store settings in browser's local storage
    localStorage.setItem('lighthouseApiKey', lighthouseApiKey);
    localStorage.setItem('web3StorageApiKey', web3StorageApiKey);
    localStorage.setItem('selectedProvider', selectedProvider);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-lg">

      <div className="mt-4">
        <div className="bg-blue-100 p-4 mb-4">
          <label htmlFor="settingsForm" >
            In order to temporary store your images you need an IPFS provider. Go and get a FREE account in one of them place your API key here and select which one you prefer. ΝΟΤΕ: One of them is sufficient
          </label>
        </div>
        <div className="mb-4" id='settingsForm'>
          <label htmlFor="lighthouseApiKey" className="block text-gray-700">
            Lighthouse API Key:
          </label>
          <input
            type="text"
            id="lighthouseApiKey"
            value={lighthouseApiKey}
            onChange={(e) => setLighthouseApiKey(e.target.value)}
            className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
          />
          <a
            href="https://www.lighthouse.storage/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 mt-2 block"
          >
            Get Lighthouse API Key
          </a>
        </div>
        <div className="mb-4">
          <label htmlFor="web3StorageApiKey" className="block text-gray-700">
            Web3.storage API Key:
          </label>
          <input
            type="text"
            id="web3StorageApiKey"
            value={web3StorageApiKey}
            onChange={(e) => setWeb3StorageApiKey(e.target.value)}
            className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
          />
          <a
            href="https://web3.storage"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 mt-2 block"
          >
            Get Web3.storage API Key
          </a>
        </div>
        <div className="mb-4">
          <label htmlFor="selectedProvider" className="block text-gray-700">
            Select Provider:
          </label>
          <select
            id="selectedProvider"
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
          >
            <option value="lighthouse">Lighthouse</option>
            <option value="web3storage">Web3.storage</option>
          </select>
        </div>
        <button
          onClick={handleSaveSettings}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;
