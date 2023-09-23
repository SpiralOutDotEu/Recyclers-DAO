import React, { useState } from 'react';
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

const PhotoShot = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const handleTakePhoto = (dataUri) => {
    setCapturedPhoto(dataUri);
    setImagePreview(dataUri);
  };

  const handleRetakePhoto = () => {
    setCapturedPhoto(null);
    setImagePreview(null);
  };

  const handleSendPhoto = async () => {
    // Prepare the captured photo for sending to an API
    if (capturedPhoto) {
      setIsSending(true);

      // Example API call to send the captured photo and receive a result
      try {
        const response = await sendPhotoToAPI(capturedPhoto);
        console.log('API Response:', response);

        // Handle the API response here
      } catch (error) {
        console.error('API Error:', error);
      } finally {
        setIsSending(false);
      }
    }
  };

  const handleCancel = () => {
    // Close the live camera stream and reset
    setShowCamera(false);
    setCapturedPhoto(null);
    setImagePreview(null);
  };

  const sendPhotoToAPI = async (photoData) => {
    // Simulate sending the photo to an API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulated API response
        resolve({ result: 'Success' });
      }, 2000);
    });
  };

  return (
    <div>
      {!showCamera && !imagePreview && (
        <button
          onClick={() => setShowCamera(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Take Photo
        </button>
      )}

      {showCamera && !capturedPhoto && (
        <div>
          <Camera
            onTakePhoto={handleTakePhoto}
            idealFacingMode={FACING_MODES.ENVIRONMENT}
            idealResolution={{ width: 640, height: 480 }}
            imageType={IMAGE_TYPES.JPG}
            isImageMirror={false}
            isFullscreen={false}
          />
          <button
            onClick={handleCancel}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleTakePhoto}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Take Photo
          </button>
        </div>
      )}

      {imagePreview && (
        <div>
          <img src={imagePreview} alt="Captured Photo" />
          <button
            onClick={handleRetakePhoto}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Retake
          </button>
          <button
            onClick={handleSendPhoto}
            className={`${
              isSending ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-700'
            } text-white font-bold py-2 px-4 rounded`}
            disabled={isSending}
          >
            {isSending ? 'Sending...' : 'OK'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PhotoShot;
