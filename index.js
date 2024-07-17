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

// from stackoverflow, but
// TODO: do this without fileURLToPath? I think the "real" node way is to use URLs throughout
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

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
    case "winget":
        child_process.spawn('powershell', ['-File', 'run-winget.ps1'], { shell: true, detached: true });
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
