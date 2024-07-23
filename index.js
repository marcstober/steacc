#!/usr/bin/env node

import child_process from 'child_process'
import { askQuestion } from './question-asker.js'
import * as fs from 'fs'

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import upload from './drive.cjs';

import { version } from "./version.js";

import onboarding from "./onboarding.js";

import figlet from 'figlet';

import os from 'os';

// from stackoverflow, but
// TODO: do this without fileURLToPath? I think the "real" node way is to use URLs throughout
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

const userFolderPath = os.homedir();
const fileName = '.st.txt';

const filePath = path.join(userFolderPath, fileName);

// function log(msg) {
//     console.log(`STEACC>> ${msg}`)
// }

// log(process.argv[2]) // debugging
switch (process.argv[2]) {
    case "update":
    case "up":
        update()
        break
    case "backup":
    case "upload": // deprecated
        upload()
        break
    case "hello":
        console.log("Hello S.T.E.A.C.C.")
        break
    case "version":
        console.log(version);
        break
    case "ver":
        console.log(version);
        break
    case "figlet-fonts":
        child_process.exec('figlet -l', (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                return;
            }
            for (let line of stdout.split('\n')) {
                console.log(line)
                const fancyText = figlet.textSync('Hello, World!', { font: line, width: 80 });
                console.log(fancyText)
            }
        })
        break
    case "setup":
        setup()
        break
    case "webboard":
        if (process.argv[3] && process.argv[3] === "modify") {
            URL = await askQuestion("Enter the URL of the web board: ")
            const writeToFile = (filePath, content) => {
                fs.writeFile(filePath, content, (err) => {
                    if (err) {
                        console.error('Error writing to the file:', err);
                    } else {
                        console.log('File .st.txt written successfully in the user folder');
                    }
                });
            };
            const openURLInBrowser = (url) => {
                const start = process.platform == 'darwin' ? 'open' :
                              process.platform == 'win32' ? 'start' :
                              'xdg-open';
                exec(`${start} ${url}`, (err) => {
                    if (err) {
                        console.error('Error opening URL in browser:', err);
                    } else {
                        console.log('URL opened in browser successfully');
                    }
                });
            };
            
            // Check if the file already exists
            if (fs.existsSync(filePath)) {
                console.log('File .st.txt already exists. Clearing contents and writing new URL.');
                writeToFile(filePath, URL);
            } else {
                // Create the file '.st.txt' and write the URL to it
                console.log('Creating file .st.txt and writing URL.');
                writeToFile(filePath, URL);
            }
        } else {
            // open in browser
            if (fs.existsSync(filePath)) {
                const URL = fs.readFileSync(filePath, 'utf8').trim();
                openURLInBrowser(URL);
            }
        }
        break
    default:
        let name, projectName

        while (true) {
            name = await askQuestion("Coder name: ")
            if (/\s/.test(name)) {
                console.log("No spaces allowed")
                continue
            }
            break
        }

        // see if directory exists
        let isOnboarding = false
        if (fs.existsSync(`C:\\${name}\\`)) {
            console.log(
                figlet.textSync(`Welcome back,`, {
                    width: process.stdout.columns
                })
            )
            console.log(
                figlet.textSync(`${name}`, {
                    font: 'Small Keyboard',
                    width: process.stdout.columns
                })
            )
        }
        else {
            isOnboarding = true
            const contentDir = path.join(__dirname, "content")

            await onboarding.run(name, contentDir)
        }

        while (true) {
            if (isOnboarding) {
                console.log("Now you must choose a name for your first project.")
                console.log("Remember the name you choose; you will use it to get back to your code.")
            }
            else {
                const subdirectories = fs.readdirSync(`C:\\${name}`).filter(
                    file => fs.statSync(`C:\\${name}\\${file}`).isDirectory());
                console.log("\nExisting projects:\n")
                // NOTE: NOT using backticks or other string in the line below
                // so that it's logged as in the more raw way that an array is logged
                // (e.g., [ "foo", "bar" ])
                // so learners get used to seeing that.
                console.log(subdirectories)
            }
            projectName = await askQuestion("Project name: ")
            if (/\s/.test(projectName)) {
                console.log("No spaces allowed")
                continue
            }
            if (projectName === "") {
                continue
            }
            break
        }

        if (projectName) {
            // see if directory exists
            if (fs.existsSync(`C:\\${name}\\${projectName}\\`)) {
                console.log(`Loading project: ${name}`)
            }
            else {
                console.log("Creating project...")
                console.log(`mkdir C:\\${name}\\${projectName}\\`)
                fs.mkdirSync(`C:\\${name}\\${projectName}\\`)
                // TODO: create a more complete package.json?
                fs.writeFileSync(`C:\\${name}\\${projectName}\\package.json`, JSON.stringify({
                    "type": "module"
                }))
                fs.copyFileSync(__dirname + '\\question-asker.js',
                    `C:\\${name}\\${projectName}\\question-asker.js`)
                fs.copyFileSync(__dirname + '\\favicon.ico',
                    `C:\\${name}\\${projectName}\\favicon.ico`)

            }
        }

        console.log("Changing working directory...")
        let cdCommand = `cd C:\\${name}\\`
        if (projectName) {
            cdCommand += `${projectName}\\`
        }

        fs.writeFileSync(process.env.TEMP + '\\st-out.ps1', `"${cdCommand}"\n${cdCommand}\n`)
}


function update() {
    child_process.exec('npm update -g @marcstober/steacc', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
    })
}
function installp5p() {
    console.log("Installing p5.play...")  // TODO: replace with npm install p5play when it's available in npm.
    child_process.exec('npm i p5play', (err, stdout, stderr) => {
       if (err) {
           console.error(err);
           return;
       }
       console.log(stdout);
   })
}

function setup() {
    //  Made with <3 by GustyCube (Bennett Schwartz) and Joshua Kellman
    console.log("Initializing setup...")
        console.log("Starting App installation")
        const ps = child_process.spawn('powershell', ['-File', 'run-winget.ps1'], { stdio: "inherit", cwd: __dirname });
        console.log("Installing VS Code extentions")
        const ExentionInstall = child_process.spawn('powershell', ['-File', 'installExtention.ps1'], { stdio: "inherit", cwd: __dirname });
        installp5p()
        ps.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        }); 
        ExentionInstall.on('close', (code) => {
            console.log(`p5.play extention installation exited with code ${code}`);
        });
}
export { setup } 