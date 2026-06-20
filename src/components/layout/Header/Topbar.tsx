import React from 'react';

export const Topbar: React.FC = () => {
  return (
    <div className="bg-[#3fbbc0] text-white h-10 px-0 transition-all duration-500 flex items-center">
      <div className="container mx-auto px-4 flex justify-center md:justify-between items-center w-full">
        <div className="hidden md:flex items-center text-sm">
          <i className="bi bi-clock mr-1"></i> Monday - Saturday, 8AM to 10PM
        </div>
        <div className="flex items-center text-sm">
          <i className="bi bi-phone mr-1"></i> Call us now +1 5589 55488 55
        </div>
      </div>
    </div>
  );
};
