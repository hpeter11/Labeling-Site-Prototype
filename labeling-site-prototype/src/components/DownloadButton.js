// src/components/DownloadButton.js
import React from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import AWS from 'aws-sdk';

const DownloadButton = () => {
  const handleDownload = async () => {
    const zip = new JSZip();

    // Fetch files from public directory
    const viaHtmlResponse = await fetch('/VGGPackage/via.html');
    const viaHtml = await viaHtmlResponse.text();

    const labelingTemplateJsonResponse = await fetch('/VGGPackage/Labeling_Template.json');
    const labelingTemplateJson = await labelingTemplateJsonResponse.json();

    // Add the public files to the zip
    const folder = zip.folder('download-folder');
    folder.file('via.html', viaHtml);
    folder.file('Labeling_Template.json', JSON.stringify(labelingTemplateJson, null, 2));

    // Configure AWS SDK
    AWS.config.update({
      region: process.env.REACT_APP_AWS_REGION, // e.g., 'us-west-2'
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    });

    const s3 = new AWS.S3();
    const bucketName = 'demo-bucket-targets';
    const folderName = 'demo-home-1/';

    try {
      const listObjectsResponse = await s3
        .listObjectsV2({
          Bucket: bucketName,
          Prefix: folderName,
        })
        .promise();

      const fetchS3Object = async (key) => {
        const objectResponse = await s3
          .getObject({
            Bucket: bucketName,
            Key: key,
          })
          .promise();
        return objectResponse.Body;
      };

      const s3Files = await Promise.all(
        listObjectsResponse.Contents.map(async (item) => {
          const fileContent = await fetchS3Object(item.Key);
          return { key: item.Key.replace(folderName, ''), content: fileContent };
        })
      );

      // Add S3 files to the zip
      s3Files.forEach((file) => {
        folder.file(file.key, file.content);
      });

      // Generate the zip file and trigger the download
      zip.generateAsync({ type: 'blob' }).then((content) => {
        saveAs(content, 'download-folder.zip');
      });
    } catch (error) {
      console.error('Error fetching S3 files:', error);
    }
  };

  return (
    <button class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center border border-black"
    onClick={handleDownload}>
  <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
  <span>Download</span>
</button>
  ); 
};

export default DownloadButton;



