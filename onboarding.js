import * as fs from "fs";
import { marked } from "marked";
import { markedTerminal } from "marked-terminal";
import { createDirectives } from "marked-directive";
import { askQuestion } from "./question-asker.js";
import stripAnsi from "strip-ansi";
import path from "node:path";
import figlet from "figlet";
import { fileURLToPath } from "node:url";

const CAMPER_ROOT_DIR = "C:\\camper";

let contentDir = "";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function typewriterLog(message, options = {}) {
  const { delay = 25, newlineDelay = 300, stream = process.stdout } = options;
  const text = String(message);

  for (const char of text) {
    stream.write(char);
    await sleep(delay);
  }

  stream.write("\n");
  await sleep(newlineDelay);
}

async function main(name, cd) {
  contentDir = cd;

  // page 0

  console.clear();

  console.log(
    figlet.textSync(`Welcome,`, {
      width: process.stdout.columns,
    })
  );
  console.log(
    figlet.textSync(`${name}`, {
      font: "Small Keyboard",
      width: process.stdout.columns,
    })
  );

  await typewriterLog("\n");

  // TODO: actual word-wrap to terminal width or a max instead of hard-coded line breaks (here and with .md files)
  // TODO: use marked to render this text
  await typewriterLog(
    "\nBefore we get started, you need to agree to some rules. \n" +
      "The rules for using technology are sometimes called an *Acceptable Use Policy*. \n" +
      "Press Enter to view our Acceptable Use Policy."
  );

  await pause();

  // page 1

  console.clear();

  const text = fs.readFileSync(path.join(contentDir, "aup.md"), "utf8");

  marked.use(
    markedTerminal(),
    createDirectives([
      {
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
          return false;
        },
      },
    ])
  );

  const parsedText = marked.parse(text);
  await typewriterLog("\n" + parsedText);

  await askToAgree();

  // page 2 - "hardware rules"

  await displayPage2();

  await askToAgree();

  // page 3

  await displayPage3();

  await askToAgree();

  console.log("Thank you for agreeing to the rules.\n\n"); // not a typewriter

  // NOTE: Do this before runLearnTerminal since the lesson refers to this directory having been created.
  createCamperDirectory(name);

  await pause(); // so that user can see directory creation message before screen is cleared

  await runLearnTerminal(path.join(CAMPER_ROOT_DIR, name));

  // NOTE: Don't clear terminal after running so we can see the text "Rick ASCII"
}

async function pause() {
  // cf. pause command in batch files
  // TODO: any key
  await askQuestion("\n\nPress ENTER to continue...");
}

function createCamperDirectory(name) {
  const camperDir = path.join(CAMPER_ROOT_DIR, name);

  console.log("\n\nCreating camper directory...");
  console.log(`mkdir ${camperDir}\\`);
  fs.mkdirSync(camperDir, { recursive: true });

  const data = {
    all: Date.now(),
  };

  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync(path.join(camperDir, "agreed.json"), jsonData);

  const sampleProjectDir = path.join(camperDir, "sampleproject");
  fs.mkdirSync(sampleProjectDir, { recursive: true });

  const samplePython = `# python code goes here
`;
  fs.writeFileSync(path.join(sampleProjectDir, "sample.py"), samplePython);
}

async function displayPage2() {
  console.clear();

  const text = fs.readFileSync(path.join(contentDir, "aup_p2.md"), "utf8");
  const parsedText = marked.parse(text);
  await typewriterLog("\n" + parsedText);
}

async function displayPage3() {
  console.clear();

  const text = fs.readFileSync(path.join(contentDir, "onboarding3.md"), "utf8");
  const parsedText = marked.parse(text);
  await typewriterLog("\n" + parsedText);
}

async function askToAgree(prompt = "\nType YES to agree: ") {
  const answer = await askQuestion(prompt);
  // This does not accept lowercase or just "Y" or "N" because we make how to handle that
  // a teachable moment later.
  const agree = answer === "YES";
  if (!agree) {
    console.log(
      "\nSorry, you must agree by typing YES to participate in the workshop."
    );
    console.log(
      marked.parse(
        "You can run the **st** program again if you change your mind.\n"
      )
    );
    process.exit(1);
  }
}

async function runLearnTerminal(camperDir) {
  console.clear();

  await typewriterLog(
    "Now you will learn how to use the terminal and file system.\n\n"
  );

  const { spawn } = await import("child_process");
  await new Promise((resolve, reject) => {
    // find the directory of the current file
    // and run the learn-terminal.ps1 script in that directory
    const currentDir = path.dirname(fileURLToPath(import.meta.url));
    console.log(`Running learn-terminal.ps1 in ${currentDir}`);

    const child = spawn(
      "powershell.exe",
      ["-File", path.join(currentDir, "learn-terminal.ps1")],
      {
        stdio: "inherit",
        env: { ...process.env, STEACC_CAMPER_DIR: camperDir },
      }
    );
    child.on("close", (code) => {
      process.stdout.write("\x1b[0m"); // Reset terminal colors
      if (code === 0) resolve();
      else reject(new Error(`learn-terminal.ps1 exited with code ${code}`));
    });
    child.on("error", reject);
  });
}

export default { main };
export { CAMPER_ROOT_DIR, typewriterLog };
