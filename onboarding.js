import * as fs from 'fs'
import { marked } from 'marked';
import { markedTerminal } from 'marked-terminal';
import { createDirectives } from 'marked-directive';
import { askQuestion } from './question-asker.js'
import stripAnsi from 'strip-ansi';
import path from 'node:path'
import figlet from 'figlet';

let contentDir = ""

async function run(name, cd) {

    contentDir = cd

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

    await askQuestion("Press ENTER to continue..."); // TODO: any key

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

    await askForAgreementWithRulesAndExitIfNotAgreed();

    displayHardwareRules()

    await askForAgreementWithRulesAndExitIfNotAgreed();

    console.log("Creating directory...");
    console.log(`mkdir C:\\${name}\\`);
    fs.mkdirSync(`C:\\${name}\\`);

    const data = {
        "all": Date.now()
    };

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

export default { run }