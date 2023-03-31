const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const pinataApiKey = '85f17a9895e253ece3a0';
const pinataSecretApiKey = '97652ef65abbf4ff881579222883af767c8bd1433c71397ba92c7689aa328b10';
const apiUrl = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

// Step 1: Create an empty file with content type "application/x-directory"
const dirData = new FormData();
dirData.append('file', '', { filename: 'myFolder', contentType: 'application/x-directory' });
dirData.append('pinataMetadata', JSON.stringify({ name: 'My Folder' }));
dirData.append('pinataOptions', JSON.stringify({ cidVersion: 1 }));

axios.post(apiUrl, dirData, {
  maxContentLength: 'Infinity',
  headers: {
    'Content-Type': `multipart/form-data; boundary=${dirData._boundary}`,
    'pinata_api_key': pinataApiKey,
    'pinata_secret_api_key': pinataSecretApiKey
  }
})
.then((response) => {
  // Step 2: Pin the directory to IPFS and get its CID
  const cid = response.data.IpfsHash;

  // Step 3: Upload a file to the directory using its CID
  const fileData = new FormData();
  fileData.append('file', fs.createReadStream('/home/melton/Desktop/nodeJs/pinata-folder/test-file.txt'), { filename: 'myFile.txt' });
  fileData.append('pinataMetadata', JSON.stringify({ name: 'My File' }));
  fileData.append('pinataOptions', JSON.stringify({ cidVersion: 1, wrapWithDirectory: true, directoryCID: cid }));

  axios.post(apiUrl, fileData, {
    maxContentLength: 'Infinity',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${fileData._boundary}`,
      'pinata_api_key': pinataApiKey,
      'pinata_secret_api_key': pinataSecretApiKey
    }
  })
  .then((response) => {
    console.log(response.data.IpfsHash);
  })
  .catch((error) => {
    console.error(error.response.data);
  });
})
.catch((error) => {
  console.error(error.response.data);
});
