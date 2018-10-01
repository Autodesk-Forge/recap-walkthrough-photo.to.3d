/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////

//-------------------------------------------------------------------
// These packages are included in package.json.
// Run `npm install` to install them.
// 'path' is part of Node.js and thus not inside package.json.
//-------------------------------------------------------------------
var express = require('express');           // For web server
var Axios = require('axios');               // A Promised base http client
var bodyParser = require('body-parser');    // Receive JSON format

// Set up Express web server
var app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + '/www'));

// This is for web server to start listening to port 5000
app.set('port', 5000);
var server = app.listen(app.get('port'), function () {
    console.log('Server listening on port ' + server.address().port);
});

//-------------------------------------------------------------------
// Configuration for your Forge account
// Initialize the 2-legged OAuth2 client, set specific scopes and
// set the token to auto refresh
//-------------------------------------------------------------------
var CLIENT_ID = '<REPLACE_WITH_FORGE_CLIENT_ID>';
var CLIENT_SECRET = '<REPLACE_WITH_FORGE_CLIENT_SECRET>';
var callback_uri = 'http://localhost:5000/callback';
var scopes = 'data:read data:write';
const querystring = require('querystring');

// Route /auth
// Redirect to Autodesk sign in page for end user to login
app.get('/auth', function (req, res) {
    var redirect_uri = 'https://developer.api.autodesk.com/authentication/v1/authorize?'
    + 'response_type=code'
    + '&client_id=' + CLIENT_ID
    + '&redirect_uri=' + encodeURIComponent(callback_uri)
    + '&scope=' + encodeURIComponent(scopes);
    res.redirect(redirect_uri);
});

// Route /callback
// Get Authorization code from Autodesk signin
app.get('/callback', function (req, res) {
    Axios({
        method: 'POST',
        url: 'https://developer.api.autodesk.com/authentication/v1/gettoken',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
        },
        data: querystring.stringify({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: req.query.code,
            redirect_uri: callback_uri
        })
    })
        .then(function (response) {
            // Success
            access_token = response.data.access_token;
            console.log(response);
            res.send('<p>Authentication success!</p><a href="/photoscene/add?token=' + access_token + '">Add a photoscene</a>');
        })
        .catch(function (error) {
            // Failed
            console.log(error);
            res.send('Failed to authenticate');
        });
});

// Route /photoscene/add
// Creates and initializes a photoscene for reconstruction.
app.get('/photoscene/add', function (req, res) {
    var access_token = req.query.token;
    Axios({
        method: 'POST',
        url: 'https://developer.api.autodesk.com/photo-to-3d/v1/photoscene',
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + access_token
        },
        data: querystring.stringify({
            scenename: 'myscenename',
            format: 'rcm'
        })
    })
        .then(function (response) {
            // Success
            console.log(response);
            if (response.data.Error) {
                res.send(response.data.Error.msg);
            }
            var photosceneId = response.data.Photoscene.photosceneid;
            var nextLink = '/photoscene/upload?token=' + access_token + '&photosceneid=' + photosceneId;
            res.send('<p>Photoscene added!</p><a href="' + nextLink + '">Upload files to photoscene</a>');
        })
        .catch(function (error) {
            // Failed
            console.log(error);
            res.send('Failed to create a photoscene');
        });
});

// Route /photoscene/upload
// Adds one or more files to a photoscene.
app.get('/photoscene/upload', function (req, res) {
    var access_token = req.query.token;
    var photosceneId = req.query.photosceneid;
    Axios({
        method: 'POST',
        url: 'https://developer.api.autodesk.com/photo-to-3d/v1/file',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + access_token
        },
        data: querystring.stringify({
            photosceneid: photosceneId,
            type: 'image',
            'file[0]': 'https://s3.amazonaws.com/adsk-recap-public/forge/lion/DSC_1158.JPG',
            'file[1]': 'https://s3.amazonaws.com/adsk-recap-public/forge/lion/DSC_1159.JPG',
            'file[2]': 'https://s3.amazonaws.com/adsk-recap-public/forge/lion/DSC_1160.JPG',
            'file[3]': 'https://s3.amazonaws.com/adsk-recap-public/forge/lion/DSC_1162.JPG',
            'file[4]': 'https://s3.amazonaws.com/adsk-recap-public/forge/lion/DSC_1163.JPG',
            'file[5]': 'https://s3.amazonaws.com/adsk-recap-public/forge/lion/DSC_1164.JPG',
            'file[6]': 'https://s3.amazonaws.com/adsk-recap-public/forge/lion/DSC_1165.JPG'
        })
    })
        .then(function (response) {
            // Success
            console.log(response);
            if (response.data.Error) {
                res.send(response.data.Error.msg);
            }
            console.log(JSON.stringify(response.data.Files));
            var nextLink = '/photoscene/process?token=' + access_token + '&photosceneid=' + photosceneId;
            res.send('<p>Files added to photoscene!</p><a href="' + nextLink + '">Begin processing photoscene</a>');
        })
        .catch(function (error) {
            // Failed
            console.log(error);
            res.send('Failed to upload files to photoscene');
        });
});

// Route /photoscene/process
// Starts photoscene processing.
app.get('/photoscene/process', function (req, res) {
    var access_token = req.query.token;
    var photosceneId = req.query.photosceneid;
    Axios({
        method: 'POST',
        url: 'https://developer.api.autodesk.com/photo-to-3d/v1/photoscene/' + photosceneId,
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + access_token
        }
    })
        .then(function (response) {
            // Success
            console.log(response);
            if (response.data.Error) {
                res.send(response.data.Error.msg);
            }
            var nextLink = '/photoscene/checkprogress?token=' + access_token + '&photosceneid=' + photosceneId;
            res.send('<p>Photoscene is being processed!</p><a href="' + nextLink + '">Check progress of photoscene</a>');
        })
        .catch(function (error) {
            // Failed
            console.log(error);
            res.send('Failed to process files in photoscene');
        });
});

// Route /photoscene/checkprogress
// Returns the processing progress and status of a photoscene.
app.get('/photoscene/checkprogress', function (req, res) {
    var access_token = req.query.token;
    var photosceneId = req.query.photosceneid;
    Axios({
        method: 'GET',
        url: 'https://developer.api.autodesk.com/photo-to-3d/v1/photoscene/' + photosceneId + '/progress',
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + access_token
        }
    })
        .then(function (response) {
            // Success
            console.log(response);
            if (response.data.Error) {
                res.send(response.data.Error.msg);
            }
            if (response.data.Photoscene && response.data.Photoscene.progressmsg == 'DONE') {
                var nextLink = '/photoscene/result?token=' + access_token + '&photosceneid=' + photosceneId;
                res.send('<p>Photoscene process is complete!</p><a href="' + nextLink + '">View result of photoscene</a>');
            } else {
                var nextLink = '/photoscene/delete?token=' + access_token + '&photosceneid=' + photosceneId;
                res.send('<p>Photoscene is not ready, this may take a while. Try refreshing this page. Progress: ' + response.data.Photoscene.progress + '%...</p>');
            }
            
        })
        .catch(function (error) {
            // Failed
            console.log(error);
            res.send('Failed to check progress of photoscene');
        });
});

// Route /photoscene/result
// Returns a time-limited HTTPS link to an output file of the specified format.
app.get('/photoscene/result', function (req, res) {
    var access_token = req.query.token;
    var photosceneId = req.query.photosceneid;
    Axios({
        method: 'GET',
        url: 'https://developer.api.autodesk.com/photo-to-3d/v1/photoscene/' + photosceneId + '?format=rcm',
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + access_token
        }
    })
        .then(function (response) {
            // Success
            console.log(response);
            if (response.data.Error) {
                res.send(response.data.Error.msg);
            }
            if (response.data.Photoscene && response.data.Photoscene.progressmsg == 'DONE') {
                var nextLink = '/photoscene/delete?token=' + access_token + '&photosceneid=' + photosceneId;
                res.send('<p>Success! This is the scene link:</p><p>' + response.data.Photoscene.scenelink + '</p>'
                    + 'Would you like to <a href="' + nextLink + '">delete photoscene</a>?');
            } else {
                res.send('Photoscene is not ready. Try refreshing this page. Progress: ' + response.data.Photoscene.progress + '%...');
            }
            
        })
        .catch(function (error) {
            // Failed
            console.log(error);
            res.send('Failed to get result of photoscene');
        });
});

// Route /photoscene/delete
// Deletes a photoscene and its associated assets (images, output files, ...).
app.get('/photoscene/delete', function (req, res) {
    var access_token = req.query.token;
    var photosceneId = req.query.photosceneid;
    Axios({
        method: 'DELETE',
        url: 'https://developer.api.autodesk.com/photo-to-3d/v1/photoscene/' + photosceneId,
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + access_token
        }
    })
        .then(function (response) {
            // Success
            console.log(response);
            if (response.data.Error) {
                res.send(response.data.Error.msg);
            }
            res.send('<p>Photoscene deleted!</p>');
        })
        .catch(function (error) {
            // Failed
            console.log(error);
            res.send('Failed to delete photoscene');
        });
});
