const fs = require('fs').promises;
const fs0 = require('fs');

const path = require('path');
const process = require('process');
// const { authenticate } = require('@google-cloud/local-auth');
const { OAuth2Client } = require('google-auth-library');
const { google } = require('googleapis');
const http = require('http');
const url = require('url');
// const open = require('open'); // see below

const destroyer = require('server-destroy'); // TODO: What does this do???
const { Console, dir } = require('console');
const dayjs = require("dayjs")

// If modifying these scopes, delete token.json.
const SCOPES = [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive.metadata.readonly'
];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
// const TOKEN_PATH = path.join(process.cwd(), 'token.json');
// const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

// Download your OAuth2 configuration from the Google
// const keys = require('./oauth2.keys.json')
// "iOS"
// const clientId = "937882195989-lhqgu9b7nto8qoi6bsbslnuu6qdrfhn8.apps.googleusercontent.com"
// Desktop
// const clientId = "937882195989-l56qvq9fisaug5d55c36k75bftfpaj6o.apps.googleusercontent.com"
// Web app
const clientId = "937882195989-e22mtha70bbiar37dhduuuenue1obta4.apps.googleusercontent.com"

/**
* Create a new OAuth2Client, and go through the OAuth2 content
* workflow.  Return the full client to the callback.
*/
function getAuthenticatedClient() {
    return new Promise((resolve, reject) => {
        // create an oAuth client to authorize the API call.  Secrets are kept in a `keys.json` file,
        // which should be downloaded from the Google Developers Console.
        const oAuth2Client = new OAuth2Client({
            clientId: clientId,
            redirectUri: "http://localhost:3000/oauth2callback",
            responseType: "token",
        });
        // // keys.web.client_secret,
        // keys.web.redirect_uris[0]
        // );

        // Generate the url that will be used for the consent dialog.
        // const authorizeUrl = oAuth2Client.generateAuthUrl({
        //     access_type: 'offline',
        //     scope: 'https://www.googleapis.com/auth/userinfo.profile',
        // });
        const authorizeUrl = "https://accounts.google.com/o/oauth2/v2/auth?" +
            "client_id=" + clientId +
            "&scope=" + SCOPES[0] + // TODO: Other scopes. URLEncode?
            "&redirect_uri=http://localhost:3000/oauth2callback" + // TODO: URLEncode?
            "&response_type=token"; // important!?

        // Open an http server to accept the oauth callback. In this simple example, the
        // only request to our webserver is to /oauth2callback?code=<code>
        const server = http
            .createServer(async (req, res) => {
                try {
                    console.log("req.url is:")
                    console.log(req.originalUrl)
                    if (req.url.indexOf('/oauth2callback') > -1) {
                        // acquire the code from the querystring, and close the web server.
                        const qs = new url.URL(req.url, 'http://localhost:3000').searchParams;
                        const code = qs.get('access_token');
                        console.log(`access_token is ${code}`); // can't get access_token in hash server side!
                        const fileData = await fs.readFile(path.join(__dirname, 'oauth2callback.html'), 'utf8')
                        res.writeHead(200, { 'Content-Type': 'text/html' })
                        // res.write(fileData)
                        res.end(fileData)
                        // res.end('Authentication successful! Please return to the console.');
                        // TODO: redirect to get the token server-side
                    } else if (req.url.indexOf('/step2') > -1) {
                        const qs = new url.URL(req.url, 'http://localhost:3000').searchParams;
                        const code = qs.get('access_token');
                        console.log(`access_token is ${code}`);
                        // redirect to google drive
                        res.writeHead(302, { 'Location': 'https://drive.google.com' })
                        res.end();
                        server.destroy();

                        // Now that we have the code, use that to acquire tokens.
                        // const r = await oAuth2Client.getToken(code);
                        // Make sure to set the credentials on the OAuth2 client.
                        // oAuth2Client.setCredentials(r.tokens);
                        oAuth2Client.setCredentials({ access_token: code })
                        console.info('Tokens acquired.');
                        resolve(oAuth2Client);
                    }
                } catch (e) {
                    reject(e);
                }
            })
            .listen(3000, () => {
                // open the browser to the authorize url to start the workflow
                console.log('Authorize this app by visiting this url:', authorizeUrl);
                open(authorizeUrl, { wait: false }).then(cp => cp.unref());
            });
        destroyer(server);
    });
}

function getAccessToken(x, client_id, client_secret, redirect_uri) {
    var postDataUrl = 'https://www.googleapis.com/oauth2/v4/token?' +
        'code=' + x +  //auth code received from the previous call
        '&client_id=' + client_id +
        '&client_secret=' + client_secret +
        '&redirect_uri=' + redirect_uri +
        '&grant_type=' + "authorization_code"

    var options = {
        uri: postDataUrl,
        method: 'POST'
    };

    request(options, function (err, res, body) {
        return body; //returns an object with an access token!!!
    });
}

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null;
    }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
        await saveCredentials(client);
    }
    return client;
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {OAuth2Client} authClient An authorized OAuth2 client.
 */
async function listFiles(authClient) {
    const drive = google.drive({ version: 'v3', auth: authClient });
    const res = await drive.files.list({
        pageSize: 10,
        fields: 'nextPageToken, files(id, name)',
    });
    const files = res.data.files;
    if (files.length === 0) {
        console.log('No files found.');
        return;
    }

    console.log('Files:');
    files.map((file) => {
        console.log(`${file.name} (${file.id})`);
    });
}

async function uploadBasic(authClient) {
    const drive = google.drive({ version: 'v3', auth: authClient });




    let fileId = await uploadDir(drive, process.cwd());


    return fileId

}


async function uploadDir(drive, dirname, fileId, parentFileId) {
    let name = path.basename(dirname)

    if (dirname === process.cwd()) {
        name = path.basename(process.cwd())
        name += dayjs().format("-YYYY-MM-DD-HH-mm-ss")
    }

    console.log(`Uploading '${dirname}' as '${name}'...`);
    const requestBody = {
        name: name,
        fields: 'id',
        mimeType: "application/vnd.google-apps.folder"
    };
    if (parentFileId) {
        requestBody.parents = [parentFileId]
    }
    // const media = {
    //     mimeType: 'image/jpeg',
    //     body: fs.createReadStream('README.md'),
    // };
    try {
        const file = await drive.files.create({
            requestBody,
            //  media: media,
        });
        console.log('File Id:', file.data.id);
        fileId = file.data.id;
    } catch (err) {
        // TODO(developer) - Handle error
        throw err;
    }

    const newParentFileId = fileId

    // now upload all the files in the directory

    // upload files in the directory
    let counter = 0
    console.log(`Reading '${dirname}'...`)
    const files = fs0.readdirSync(dirname)
    console.log(files)

    for (let fn of files) {
        fn = path.join(dirname, fn)
        console.log(fn)
        if (fs0.lstatSync(fn).isDirectory()) {
            console.log("is a directory") // TODO: create directory
            fileId = await uploadDir(drive, fn, newParentFileId, newParentFileId)
        }
        else {
            const requestBody = {
                name: path.basename(fn),
                fields: 'id',
                parents: [newParentFileId]
            };
            const media = {
                // mimeType: 'image/jpeg',
                body: fs0.createReadStream(fn),
            };
            try {
                const file = await drive.files.create({
                    requestBody,
                    media: media,
                });
                console.log('File Id:', file.data.id);
                counter++
            } catch (err) {
                // TODO(developer) - Handle error
                throw err;
            }
        }
    }
    console.log(`Uploaded ${counter} files.`)


    return newParentFileId;
}

let open
function upload() {

    import("open").then(obj => {
        open = obj.default
        console.log(open)
        // authorize().then(listFiles).catch(console.error);
        getAuthenticatedClient().then(uploadBasic).catch(console.error)
    })
}

module.exports = upload
