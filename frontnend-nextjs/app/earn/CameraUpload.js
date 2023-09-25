import React, { useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Web3Storage } from 'web3.storage';
import lighthouse from '@lighthouse-web3/sdk';

const CameraUpload = ({ onUpload }) => {
    const [capturedImage, setCapturedImage] = useState(null);
    const [isPreview, setIsPreview] = useState(false);
    const [storedSelectedProvider, setStoredSelectedProvider] = useState(null);
    const [storedLighthouseApiKey, setStoredLighthouseApiKey] = useState(null);
    const [storedWeb3StorageApiKey, setStoredWeb3StorageApiKey] = useState(null);

    useEffect(() => {
        // Retrieve stored settings from browser's local storage
        const selectedProvider = localStorage.getItem('selectedProvider');
        const lighthouseApiKey = localStorage.getItem('lighthouseApiKey');
        const web3StorageApiKey = localStorage.getItem('web3StorageApiKey');

        setStoredSelectedProvider(selectedProvider);
        setStoredLighthouseApiKey(lighthouseApiKey);
        setStoredWeb3StorageApiKey(web3StorageApiKey);
    }, []);


    const webcamRef = React.createRef();

    const generateUniqueName = () => {
        const timestamp = Date.now();
        const randomNumber = Math.floor(Math.random() * 1000);
        return `photo_${timestamp}_${randomNumber}.jpg`;
    };
    const captureImage = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setCapturedImage(imageSrc);
        setIsPreview(true);
    };

    const retakeImage = () => {
        setCapturedImage(null);
        setIsPreview(false);
    };

    const uploadImage = async () => {
        if (capturedImage) {
            const filename = generateUniqueName();
            try {
                fetch(capturedImage)
                    .then(res => res.blob())
                    .then(blob => {
                        const file = new File([blob], filename, { type: "image/jpeg" })
                        lighthouse.uploadBuffer(file, storedLighthouseApiKey)
                            .then(res => {
                                onUpload(res.data.Hash);
                            })
                    })
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className="mb-4">
                {isPreview ? (
                    <img src={capturedImage} alt="Captured" className="w-64 h-48" />
                ) : (
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="w-64 h-48"
                    />
                )}
            </div>
            <div className="flex justify-center space-x-4">
                {!isPreview && (
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={captureImage}
                    >
                        Capture
                    </button>
                )}
                {isPreview && (
                    <>
                        <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            onClick={retakeImage}
                        >
                            Retake
                        </button>
                        <button
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                            onClick={uploadImage}
                        >
                            Upload
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default CameraUpload;
