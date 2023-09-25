// components/ProductForm.js
import React, { useState } from 'react';
import BarcodeReader from 'react-barcode-reader';
import CameraUpload from './CameraUpload';

const ProductForm = () => {
    const [photo, setPhoto] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const [imageCid, setImageCid] = useState('');
    const [barcode, setBarcode] = useState('');
    const [brand, setBrand] = useState('');
    const [material, setMaterial] = useState('Paper');
    const [isNew, setIsNew] = useState(true);
    const [isEthereumConnected, setIsEthereumConnected] = useState(false);

    const handleUpload = async (cid) => {
        setImageCid(cid)
    };

    const handleRetakePhoto = () => {
        setPhoto(null);
    };

    const handleScanBarcode = (data) => {
        if (data) {
            setBarcode(data);
        }
    };

    const handleSubmit = () => {
        // Handle form submission, including sending data to Ethereum
        // and checking Ethereum connection
        // Example: submitDataToEthereum(barcode, brand, material, isNew);
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
                    {showCamera ? (
                        <CameraUpload onUpload={handleUpload} />
                    ) : (
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => setShowCamera(true)}
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
                    <BarcodeReader
                        onScan={handleScanBarcode}
                        onError={(error) => console.error(error)}
                        className="ml-2"
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
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${!isEthereumConnected ? 'cursor-not-allowed opacity-50' : ''}`}
                disabled={!isEthereumConnected}
            >
                Submit
            </button>
        </div>
    );
};

export default ProductForm;
