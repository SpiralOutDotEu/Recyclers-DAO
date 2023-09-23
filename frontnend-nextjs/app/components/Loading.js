import React from 'react';
import '../loading.css'; // Import your CSS file for styling

const Loading = ({ visible }) => {
  // Use the "visible" prop to control the visibility of the loading component
  if (!visible) {
    return null; // Don't render anything if not visible
  }

  return (
    <div className="loading-overlay">
      <div className="loading-spinner"></div>
    </div>
  );
};

export default Loading;