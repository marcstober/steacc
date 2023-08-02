#!/usr/bin/env node

import child_process from 'child_process'
import { askQuestion } from './question-asker.js'
import * as fs from 'fs'

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import upload from './drive.cjs';

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
    case "upload":
        upload()
        break
    case "hello":
        console.log("Hello S.T.E.A.C.C.")
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

        while (true) {
            projectName = await askQuestion("Project name: ")
            if (/\s/.test(projectName)) {
                console.log("No spaces allowed")
                continue
            }
            break
        }

        // see if directory exists
        if (fs.existsSync(`C:\\${name}\\`)) {
            console.log(`Welcome back, ${name}!`)
        }
        else {
            console.log(`Welcome, ${name}!`)
            console.log("Creating directory...")
            console.log(`mkdir C:\\${name}\\`)
            fs.mkdirSync(`C:\\${name}\\`)
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