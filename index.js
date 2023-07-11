#!/usr/bin/env node

import child_process from 'child_process'
import { askQuestion } from './input.js'
import * as fs from 'fs'

switch (process.argv[2]) {
    case 'update':
        update()
        break
    case 'hello':
        console.log("Hello S.T.E.A.C.C.")
    default:
        let name
        while (true) {
            name = await askQuestion("Coder name: ")
            if (/\s/.test(name)) {
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

        console.log("Changing working directory...")
        let cdCommand = `cd C:\\${name}\\`

        fs.writeFileSync(process.env.TEMP + '\\st-out.ps1', `"${cdCommand}"\n` + cdCommand + "\n")
}


function update() {
    child_process.exec('npm update steacc', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
    })
}