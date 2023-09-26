import React from 'react';
import { FaRecycle } from 'react-icons/fa';

const Loading = ({ visible }) => {
  // Use the "visible" prop to control the visibility of the loading component
  if (!visible) {
    return null; // Don't render anything if not visible
  }

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-opacity-40 bg-white">
      <div className="relative">
      <div className="animate-spin">
        <FaRecycle className="h-16 w-16 text-gray-900" />
      </div>
        {/* <div className="animate-spin rounded-full h-24 w-24 border-t-8 border-b-8 border-blue-500"></div> */}
      </div>
    </div>
  );
};

export default Loading;
