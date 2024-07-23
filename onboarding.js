import * as fs from 'fs'
import child_process from 'child_process'
import { marked } from 'marked';
import { markedTerminal } from 'marked-terminal';
import { createDirectives } from 'marked-directive';
import { askQuestion } from './question-asker.js'
import stripAnsi from 'strip-ansi';
import path from 'node:path'
import figlet from 'figlet';
import { fileURLToPath } from 'node:url';
import { setup } from './index.js';


let contentDir = ""
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

async function run(name, cd) {
    contentDir = cd

    console.log(figlet.textSync(`Welcome,`, { width: process.stdout.columns }));
    console.log(figlet.textSync(`${name}`, { font: 'Small Keyboard', width: process.stdout.columns }));

    await askQuestion("Press ENTER to continue...");
    console.clear();

    const text = fs.readFileSync(path.join(contentDir, 'aup.md'), 'utf8');
    marked.use(markedTerminal(), createDirectives([{
        level: "block",
        marker: "::",
        renderer(token) {
            if (token.meta.name === "center") {
                const parsedText = marked.parse(token.text);
                const len = stripAnsi(parsedText).trim().length;
                const pad = Math.floor((process.stdout.columns - len) / 2);
                return `${" ".repeat(pad)}${parsedText.trim()}\n`;
            }
            return false;
        }
    }]));

    const parsedText = marked.parse(text);
    console.log(parsedText);

    await askForAgreementWithRulesAndExitIfNotAgreed();

    displayHardwareRules();
    await askForAgreementWithRulesAndExitIfNotAgreed();

    await installDeps();  //! Ensure this completes before proceeding

    console.log("Creating directory...");
    console.log(`mkdir C:\\${name}\\`);
    fs.mkdirSync(`C:\\${name}\\`);

    const data = { "all": Date.now() };
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(`C:\\${name}\\agreed.json`, jsonData);
}

function displayHardwareRules() {
    console.clear();

    const text = fs.readFileSync(path.join(contentDir, 'hardwarerules.md'), 'utf8')
    const parsedText = marked.parse(text);
    console.log(parsedText);
}

async function askForAgreementWithRulesAndExitIfNotAgreed() {
    const answer = await askQuestion("Do you agree with these rules? Enter YES or NO: ")
    // This does not accept lowercase or just "Y" or "N" because we make how to handle that
    // a teachable moment later.
    const agree = answer === "YES"
    if (!agree) {
        console.log("Sorry, you must agree by typing YES to participate in the workshop.")
        console.log(marked.parse("You can run the **st** program again if you change your mind."))
        process.exit(1)
    }
}

async function installDeps() {
    //  Made with <3 by GustyCube (Bennett Schwartz) and Joshua Kellman
    const answer = await askQuestion("Do you want to install programs? Enter YES or NO: ")

    if (answer === "YES") {
    setup()
    }
}

export default { run }