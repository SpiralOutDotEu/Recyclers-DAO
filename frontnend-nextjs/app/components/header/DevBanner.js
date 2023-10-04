import React from 'react';

const DevBanner = () => {
  return (
    <div>
      {(process.env.ENVIRONMENT === "test") && (
        <div className="bg-red-500 text-black p-1 italic text-xs text-center">
          🚀 This is the Developer&apos;s Playground 🧪 Expect the Unexpected! 🌀 
          ⚠️ Looking for the Main Site? Visit <a href="recyclersdao.org" className='underline'>recyclersdao.org</a> ⚠️
        </div>
      )}
    </div>
  );
};

export default DevBanner;