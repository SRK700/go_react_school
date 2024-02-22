import React from 'react';

const Footer = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 border-gray-200 dark:bg-gray-900 py-8">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex justify-center items-center">
            <p style={{ color: 'white' }}>© 2024 SRK Website. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
