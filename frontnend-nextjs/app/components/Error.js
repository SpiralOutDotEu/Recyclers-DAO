"use client"
import React, { useEffect, useState } from 'react';
import {AiOutlineClose} from 'react-icons/ai'

const Success = ({ message, onClose, autoCloseTime = 8000 }) => {
    const [isVisible, setIsVisible] = useState(true);
  
    useEffect(() => {
      // Automatically close the success message after a specified time
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose(); // Call the onClose function when auto-closing
      }, autoCloseTime);
  
      return () => {
        clearTimeout(timer);
      };
    }, [autoCloseTime, onClose]);
  
    return (
      <div
        className={`fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 ${
          isVisible ? 'visible' : 'invisible'
        }`}
      >
        <div className="bg-red-400  bg-opacity-80 p-6 rounded-lg shadow-lg text-white text-center">
          <AiOutlineClose size="4x" className="mb-4 text-red-700" />
          <p className="text-lg font-semibold">{message}</p>
          <button onClick={() => setIsVisible(false)} className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
            OK
          </button>
        </div>
      </div>
    );
  };
  
  export default Success;