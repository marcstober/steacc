import * as fs from 'fs'
import { marked } from 'marked';
import { markedTerminal } from 'marked-terminal';
import { createDirectives } from 'marked-directive';
import { askQuestion } from './question-asker.js'
import stripAnsi from 'strip-ansi';
import path from 'node:path'
import figlet from 'figlet';
import { fileURLToPath } from 'node:url';

let contentDir = ""

async function run(name, cd) {

    contentDir = cd

    console.clear();

    console.log(
        figlet.textSync(`Welcome,`, {
            width: process.stdout.columns
        })
    )
    console.log(
        figlet.textSync(`${name}`, {
            font: 'Small Keyboard',
            width: process.stdout.columns
        })
    )

    await pause();

    console.clear();



    const text = fs.readFileSync(path.join(contentDir, 'aup.md'), 'utf8');

    marked.use(markedTerminal(), createDirectives([{
        // TODO: I don't love this syntax. 
        // It seems to violate John Gruber's original principle of 
        // Markdown being readable as plain text.
        // I'd prefer something that looks like HTML, e.g., <center>...</center>.
        level: "block",
        marker: "::",
        renderer(token) {
            if (token.meta.name === "center") {
                const parsedText = marked.parse(token.text);
                const len = stripAnsi(parsedText).trim().length;
                const pad = Math.floor((process.stdout.columns - len) / 2);
                return `${" ".repeat(pad)}${parsedText.trim()}\n`;
            }
            return false
        }
    }]));

    const parsedText = marked.parse(text);
    console.log(parsedText);

    await askQuestion("Press ENTER to continue..."); // TODO: any key

    displayPage2()

    await askForAgreementWithRulesAndExitIfNotAgreed("\nTo continue, type YES to indicate you will use the computers responsibly: ");


    displayHardwareRules()

    await askForAgreementWithRulesAndExitIfNotAgreed("\nTo continue, enter YES to agree to follow these rules: ");

    // NOTE: Do this before runLearnTerminal since the lesson refers to this directory having been created.
    createCamperDirectory(name);

    console.log("Thank you for agreeing to the rules. Now we will learn how to use the terminal.\n\n");
    await pause(); // so that user can see directory creation message before screen is cleared

    await runLearnTerminal();

    // NOTE: Don't clear terminal after running so we can see the text "Rick ASCII"
}

async function pause() {
    // cf. pause command in batch files
    // TODO: any key
    await askQuestion("\nPress ENTER to continue...");
}

function createCamperDirectory(name) {
    console.log("\n\nCreating directory...");
    console.log(`mkdir C:\\${name}\\`);
    fs.mkdirSync(`C:\\${name}\\`);

    const data = {
        "all": Date.now()
    };

    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(`C:\\${name}\\agreed.json`, jsonData);
}

function displayPage2() {
    console.clear();

    const text = fs.readFileSync(path.join(contentDir, 'aup_p2.md'), 'utf8')
    const parsedText = marked.parse(text);
    console.log(parsedText);
}


function displayHardwareRules() {
    console.clear();

    const text = fs.readFileSync(path.join(contentDir, 'hardwarerules.md'), 'utf8')
    const parsedText = marked.parse(text);
    console.log(parsedText);
}

async function askForAgreementWithRulesAndExitIfNotAgreed(prompt) {
    const answer = await askQuestion(prompt);
    // This does not accept lowercase or just "Y" or "N" because we make how to handle that
    // a teachable moment later.
    const agree = answer === "YES"
    if (!agree) {
        console.log("\nSorry, you must agree by typing YES to participate in the workshop.")
        console.log(marked.parse("You can run the **st** program again if you change your mind.\n"))
        process.exit(1)
    }
}

async function runLearnTerminal() {
    console.clear();

    const { spawn } = await import('child_process');
    await new Promise((resolve, reject) => {
        // find the directory of the current file
        // and run the learn-terminal.ps1 script in that directory
        const currentDir = path.dirname(fileURLToPath(import.meta.url));
        console.log(`Running learn-terminal.ps1 in ${currentDir}`);

        const child = spawn('powershell.exe', ['-File', path.join(currentDir, 'learn-terminal.ps1')], {
            stdio: 'inherit'
        });
        child.on('close', (code) => {
            process.stdout.write('\x1b[0m'); // Reset terminal colors
            if (code === 0) resolve();
            else reject(new Error(`learn-terminal.ps1 exited with code ${code}`));
        });
        child.on('error', reject);
    });

}

export default { run }