// components/ProductForm.js
import React, { useEffect, useState } from 'react';
import CameraUpload from './CameraUpload';
import { useWallet } from '../contexts/WalletContext';
import useToken from '../hooks/useToken';
import { ethers } from 'ethers';
import Loading from '../components/Loading';
import Success from '../components/Success'
import Error from '../components/Error'

const ProductForm = () => {
    const { walletAddress } = useWallet();
    const [imageCid, setImageCid] = useState('');
    const [barcode, setBarcode] = useState('');
    const [brand, setBrand] = useState('');
    const [material, setMaterial] = useState('Paper');
    const [isNew, setIsNew] = useState(true);
    const [isEthereumConnected, setIsEthereumConnected] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(null);
    const [showError, setShowError] = useState(null);
    const { loading, error, submitData } = useToken();

    const handleUpload = async (cid) => {
        setImageCid(cid)
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = () => {
        if (window.ethereum == null) {
            setError("No Browser wallet detected");
            alert("You need an ethereum wallet")
            return
        } else {
            const userProvider = new ethers.BrowserProvider(window.ethereum)
            const onSubmit = async (imageCid, material, isNew, brand, barcode, userProvider) => {
                const success = await submitData(imageCid, material, isNew, brand, barcode, userProvider);
                if (success) {
                    // Set the purchase success state to true
                    setShowSuccess("Submitted Data Successful!");
                } else {
                    setShowError("Error! something went wrong" + error)
                }
            };
            onSubmit(imageCid, material, isNew, brand, barcode, userProvider)

        }
    };

    return (
        <div className="p-4 bg-gray-100 rounded-lg shadow-lg">
            {/* <img src="https://gateway.lighthouse.storage/ipfs/QmPyDSQpRux8jtEUrV95MFbpAVhLWjKPmEX8tkHNdWJEgp"></img> */}
            <div className="mb-4">
                <label htmlFor="Image" className="block text-gray-700">
                    Image Cid:
                </label>
                <div className="flex">
                    <input
                        type="text"
                        id="image"
                        value={imageCid}
                        onChange={(e) => setImageCid(e.target.value)}
                        className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
                    />
                    {isModalOpen ? (
                        <CameraUpload onUpload={handleUpload} isOpen={isModalOpen} onClose={closeModal} />
                    ) : (
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => openModal()}
                        >
                            Open Camera
                        </button>
                    )}
                </div>
            </div>

            <div className="mb-4">
                <label htmlFor="barcode" className="block text-gray-700">
                    Barcode:
                </label>
                <div className="flex">
                    <input
                        type="text"
                        id="barcode"
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                        className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
                    />
                </div>
            </div>
            <div className="mb-4">
                <label htmlFor="brand" className="block text-gray-700">
                    Brand:
                </label>
                <input
                    type="text"
                    id="brand"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="material" className="block text-gray-700">
                    Material:
                </label>
                <select
                    id="material"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
                >
                    <option value="Paper">Paper</option>
                    <option value="Plastic">Plastic</option>
                    <option value="Glass">Glass</option>
                    <option value="Metal">Metal</option>
                    <option value="Aluminum">Aluminum</option>
                    <option value="Mixed">Mixed</option>
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Material Type:</label>
                <div className="inline-block">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <span className="mr-2">New</span>
                            <label className="switch">
                                <input type="checkbox" checked={isNew} onChange={() => setIsNew(!isNew)} />
                                <span className="slider round"></span>
                            </label>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-2">Waste</span>
                            <label className="switch">
                                <input type="checkbox" checked={!isNew} onChange={() => setIsNew(!isNew)} />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={handleSubmit}
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${!walletAddress ? 'cursor-not-allowed opacity-50' : ''}`}
                disabled={!walletAddress}
            >
                Submit
            </button>
            {showSuccess && (
                <Success message={showSuccess} onClose={() => setShowSuccess(false)} />
            )}
            {showError && (
                <Error message={showError} onClose={() => setShowError(false)} />
            )}
            <Loading visible={loading} />
        </div>
    );
};

export default ProductForm;
