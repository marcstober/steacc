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
    case "surprise":
        const surprisePs = child_process.spawn(
            'powershell', ['-File', path.join(__dirname, 'content', 'surprise.ps1')],
            { stdio: "inherit", cwd: __dirname });

        surprisePs.on('close', (code) => {
            console.log("I hope you enjoyed your surprise. :)");
        });
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
        const ps = child_process.spawn('powershell', ['-File', 'run-winget.ps1'], { stdio: "inherit", cwd: __dirname });

        ps.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });
        break
    case "help":
        console.log("Available commands:\n" +
            "  update, up         Update this application\n" +
            "  backup             Backup project to Google Drive\n" +
            "  hello              Print a hello message\n" +
            "  surprise           Try this your own risk!\n" +
            "  version            Show version\n" +
            // this still works, but is deprecated
            // "  figlet-fonts       List figlet fonts\n" +
            "  winget             Install other software\n" +
            "  help               Show this help message\n");
        break
    case undefined:
        // No arguments provided - run the default interactive mode
        let name, projectName

        console.log('\x1b[2J\x1b[0f');

        // TODO: force it not to wrap in the console 
        const splashPath = path.join(__dirname, "content", "splash.txt");
        const splash = fs.readFileSync(splashPath, "utf-16le");
        console.log(splash);

        while (true) {
            name = await askQuestion("Coder name: ")

            if (name === "") {
                continue
            }

            if (/\s/.test(name)) {
                console.log("No spaces allowed")
                continue
            }
            break
        }

        // see if directory exists
        let isOnboarding = false
        if (fs.existsSync(`C:\\${name}\\`)) {
            console.clear();
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
                console.log("\n\nNow you must choose a name for your first project.")
                console.log("Remember the name you choose; you will use it to load your code.")
            }
            else {
                const subdirectories = fs.readdirSync(`C:\\${name}`).filter(
                    file => fs.statSync(`C:\\${name}\\${file}`).isDirectory());
                console.log("\nExisting projects:\n\n")
                // NOTE: NOT using backticks or other string in the line below
                // so that it's logged as in the more raw way that an array is logged
                // (e.g., [ "foo", "bar" ])
                // so learners get used to seeing that.
                console.log(subdirectories)
                console.log("\n\nEnter a name from the list above, a new name to create a new project.")
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
                console.log(`Loading project: ${name}\\${projectName}`)
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
        console.log('\x1b[33m%s\x1b[0m', cdCommand)
        // the wrapper script will look for this
        const tmpCdFile = path.join(process.env.TEMP, "steacc-exit-temp.ps1")
        fs.writeFileSync(tmpCdFile, cdCommand)
        break
    default:
        // Invalid command provided
        console.error(`Error: Unknown command '${process.argv[2]}'`);
        console.log("Run 'steacc help' to see available commands.");
        process.exit(1);
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
