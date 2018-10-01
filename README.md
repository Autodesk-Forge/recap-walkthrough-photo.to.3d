# Photo to 3D (photogrammetry) sample

[![Node.js](https://img.shields.io/badge/Node.js-8.11.1-blue.svg)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-6.1.0-blue.svg)](https://www.npmjs.com/)
[![License](http://img.shields.io/:license-mit-blue.svg)](http://opensource.org/licenses/MIT)

[![oAuth2](https://img.shields.io/badge/oAuth2-v1-green.svg)](http://developer.autodesk.com/)
[![Reality-Capture](https://img.shields.io/badge/Reality%20Capture-v1-green.svg)](http://developer.autodesk.com/)

## Description
This sample illustrates the Reality Capture API's photogrammetry workflow:
- Create a photoscene
- Add images to the photoscene
- Initiate processing
- Check for progress
- Retrieve the generated 3D file
- Delete the photoscene

## Setup & Run
1. Setup
   - Install `npm` (if you haven't already).
   - Install `npm` packages using the command `npm install`.
     - Make sure that the current directory contains `package.json`.
   - Ensure that in your hosts file you have mapped:
     - `127.0.0.1 localhost`
   - Replace the `FORGE_CLIENT_ID` and `FORGE_CLIENT_SECRET` variable values in `start.js` with your Forge credentials.

2. Execute `node start.js`
   - The node server will listen on on port `5000`.

3. Open a browser and navigate to `http://localhost:5000/`.

4. Click on the `Authorize me` link and login to your Autodesk account.
   - In your console, you should see `Server listening on port 5000`.
   - Once authenticated, click through the links on the browser to:
      - Add a photoscene
      - Upload files to photoscene
      - Begin processing photoscene
      - Check progress of photoscene (you will see the progress in percentage, keep refreshing until it's DONE)
      - Delete photoscene

*NOTE:* _It may take several minutes to complete processing a photoscene._

_For a small project (< 20 photos), it shouldn’t take more than 15 minutes to complete, otherwise it takes about 6 hours for 500 photos, and less than 16 hours for 1000 photos. The percentage progress is calibrated for larger projects (that take a few hours to process)._

### Thumbnail
![thumbnail](/thumbnail.png)
