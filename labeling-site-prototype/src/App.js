// src/App.js
import React from 'react';
import DownloadButton from './components/DownloadButton';
import UploadButton from './components/UploadButton';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="mr-8"> {/* Margin right to space between the buttons */}
        <DownloadButton />
      </div>
      <div>
        <UploadButton />
      </div>
    </div>
  );
}

export default App;



