# Photo to 3D (photogrammetry) sample

[![Node.js](https://img.shields.io/badge/Node.js-8.11.1-blue.svg)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-6.1.0-blue.svg)](https://www.npmjs.com/)
![Platforms](https://img.shields.io/badge/platform-windows%20%7C%20osx%20%7C%20linux-lightgray.svg)
[![License](http://img.shields.io/:license-mit-blue.svg)](http://opensource.org/licenses/MIT)

[![oAuth2](https://img.shields.io/badge/oAuth2-v1-green.svg)](http://developer.autodesk.com/)
[![Reality-Capture](https://img.shields.io/badge/Reality%20Capture-v1-green.svg)](http://developer.autodesk.com/)

# Description
This sample is part of the [Photo to 3D Walkthrough](https://forge.autodesk.com/developer/learn/recap-app).

This sample illustrates the Reality Capture API's photogrammetry workflow:
- Create a photoscene
- Add images to the photoscene
- Initiate processing
- Check for progress
- Retrieve the generated 3D file
- Delete the photoscene

## Thumbnail
![thumbnail](/thumbnail.png)

# Setup

## Prerequisites

1. A Forge account: [Getting Started with Forge](https://forge.autodesk.com/developer/getting-started)
2. A text editor of your choice. (For example Brackets or Visual Studio Code are good choices.)
3. A basic knowledge of :
    - HTML and CSS
    - JavaScript ES6
    - Command-line programs
      - Node.js Command Line (for Windows users)
      - Terminal (for Mac/Linux/Unix users)

## Running locally

Install [NodeJS](https://nodejs.org/) (version 8 or newer).

Clone this project or download it. It's recommended to install [GitHub desktop](https://desktop.github.com/).

To run it, install the required packages, set the enviroment variables with your client ID & secret and finally start it. Via command line, navigate to the folder where this repository was cloned and use the following:

Mac OSX/Linux (Terminal)

```bash
npm install
export FORGE_CLIENT_ID=<<YOUR CLIENT ID FROM DEVELOPER PORTAL>>
export FORGE_CLIENT_SECRET=<<YOUR CLIENT SECRET>>
npm start
```

Windows (use Node.js command line from Start menu)

```bash
npm install
set FORGE_CLIENT_ID=<<YOUR CLIENT ID FROM DEVELOPER PORTAL>>
set FORGE_CLIENT_SECRET=<<YOUR CLIENT SECRET>>
npm start
```

Open a browser and navigate to http://localhost:3000.

Click on the `Authorize me` link and then click through the links on the browser to:
  - Add a photoscene
  - Upload files to photoscene
  - Begin processing photoscene
  - Check progress of photoscene (you will see the progress in percentage, keep refreshing until it's DONE)
  - Delete photoscene

*NOTE:* _It may take several minutes to complete processing a photoscene._

_For a small project (< 20 photos), it shouldn’t take more than 15 minutes to complete, otherwise it takes about 6 hours for 500 photos, and less than 16 hours for 1000 photos. The percentage progress is calibrated for larger projects (that take a few hours to process)._

# License
This sample is licensed under the terms of the [MIT License](http://opensource.org/licenses/MIT). Please see the [LICENSE](LICENSE) file for full details.

# Support
forge.help@autodesk.com
