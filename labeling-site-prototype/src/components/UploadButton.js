// src/components/UploadButton.js
import React, { useState } from 'react';
import AWS from 'aws-sdk';

const S3_BUCKET = 'demo-bucket-labels'
const REGION = process.env.REACT_APP_AWS_REGION;

AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: REGION,
});

const s3 = new AWS.S3();

const UploadButton = () => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileInput = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const uploadFile = (file) => {
        const params = {
            Bucket: S3_BUCKET,
            Key: file.name,
            Body: file,
            ContentType: file.type,
        };

        s3.upload(params, (err, data) => {
            if (err) {
                console.error('Error uploading file:', err);
                alert('Error uploading file: ' + err.message);
            } else {
                console.log('File uploaded successfully:', data);
                alert('File uploaded successfully!');
            }
        });
    };

    const handleUpload = () => {
        if (selectedFile) {
            uploadFile(selectedFile);
        } else {
            alert('Please select a file to upload.');
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileInput} />
            <button class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center border border-black" onClick={handleUpload}>Upload to S3</button>
        </div>
    );
};

export default UploadButton;

