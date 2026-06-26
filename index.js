#!/usr/bin/env node

import child_process from "child_process";
import { askQuestion } from "./question-asker.js";
import * as fs from "fs";

import path from "node:path";
import { fileURLToPath } from "node:url";

import upload from "./drive.cjs";

import { version } from "./version.js";

import onboarding, { CAMPER_ROOT_DIR } from "./onboarding.js";

import figlet from "figlet";

import AdmZip from "adm-zip";

// from stackoverflow, but
// TODO: do this without fileURLToPath? I think the "real" node way is to use URLs throughout
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function spawnPowershellScript(scriptPath, camperDir = "") {
  return child_process.spawn(
    "powershell",
    ["-File", path.basename(scriptPath)],
    {
      stdio: "inherit",
      cwd: path.dirname(scriptPath),
      env: {
        ...process.env,
        CAMPER_ROOT_DIR,
        STEACC_CAMPER_DIR: camperDir,
      },
    }
  );
}

// function log(msg) {
//     console.log(`STEACC>> ${msg}`)
// }

switch (process.argv[2]) {
  case "learn":
    await learn(process.argv[3]);
    break;
  case "update":
  case "up":
    update();
    break;
  case "backup":
    upload();
    break;
  case "hello":
    console.log("Hello S.T.E.A.C.C.");
    break;
  case "surprise":
    // Check for custom surprise first
    const customSurprisePath = path.join(
      process.env.USERPROFILE || process.env.HOME,
      ".steacc",
      "surprise",
      "surprise.ps1"
    );
    let surprisePath;

    if (fs.existsSync(customSurprisePath)) {
      surprisePath = customSurprisePath;
    } else {
      surprisePath = path.join(__dirname, "content", "surprise.ps1");
    }

    const surprisePs = spawnPowershellScript(surprisePath);

    surprisePs.on("close", (code) => {
      console.log("I hope you enjoyed your surprise. :)");
    });
    break;
  case "version":
    console.log(version);
    break;
  case "figlet-fonts":
    child_process.exec("figlet -l", (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return;
      }
      for (let line of stdout.split("\n")) {
        console.log(line);
        const fancyText = figlet.textSync("Hello, World!", {
          font: line,
          width: 80,
        });
        console.log(fancyText);
      }
    });
    break;
  case "winget":
    const ps = spawnPowershellScript(path.join(__dirname, "run-winget.ps1"));

    ps.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
    });
    break;
  case "cs":
    await configSurprise();
    break;
  case "help":
    console.log(
      "Available commands:\n" +
        "  learn <topic>      Learn using an interactive tutorial\n" +
        "  backup             Backup project to Google Drive\n" +
        "  hello              Print a hello message\n" +
        "  surprise           Try this your own risk!\n" +
        "  update, up         Update this application\n" +
        "  winget             Install other software\n" +
        // this is a hidden command
        // "  cs <zipfile>       Config surprise - install custom surprise\n" +
        "  version            Show version\n" +
        // this still works, but is deprecated
        // "  figlet-fonts       List figlet fonts\n" +
        "  help               Show this help message\n"
    );
    break;
  case undefined:
    // No arguments provided - run the default interactive mode
    let name, projectName;

    let isOnboarding;
    let camperDir;
    ({ isOnboarding, camperDir, name } = await promptForCoderName(name));

    if (isOnboarding) {
      const contentDir = path.join(__dirname, "content");

      await onboarding.main(name, contentDir);
    } else {
      console.clear();
      console.log(
        figlet.textSync(`Welcome back,`, {
          width: process.stdout.columns,
        })
      );
      console.log(
        figlet.textSync(`${name}`, {
          font: "Small Keyboard",
          width: process.stdout.columns,
        })
      );
    }

    while (true) {
      if (isOnboarding) {
        console.log("\n\nNow you must choose a name for your first project.");
        console.log(
          "Remember the name you choose; you will use it to load your code."
        );
      } else {
        const subdirectories = fs
          .readdirSync(camperDir)
          .filter((file) =>
            fs.statSync(path.join(camperDir, file)).isDirectory()
          );
        console.log("\nExisting projects:\n\n");
        // NOTE: NOT using backticks or other string in the line below
        // so that it's logged as in the more raw way that an array is logged
        // (e.g., [ "foo", "bar" ])
        // so learners get used to seeing that.
        console.log(subdirectories);
        console.log(
          "\n\nEnter a name from the list above, a new name to create a new project."
        );
      }
      projectName = await askQuestion("Project name: ");
      if (/\s/.test(projectName)) {
        console.log("No spaces allowed");
        continue;
      }
      if (projectName === "") {
        continue;
      }
      break;
    }

    function shell_command_color(command) {
      return `\x1b[33m${command}\x1b[0m`;
    }

    if (projectName) {
      const projectDir = path.join(camperDir, projectName);
      // see if directory exists
      if (fs.existsSync(projectDir)) {
        console.log(`Loading project: ${name}\\${projectName}`);
      } else {
        console.log("Creating project...");
        console.log(shell_command_color(`mkdir ${projectDir}\\`));
        fs.mkdirSync(projectDir);
        // TODO: create a more complete package.json?
        fs.writeFileSync(
          path.join(projectDir, "package.json"),
          JSON.stringify({
            type: "module",
          })
        );
        fs.copyFileSync(
          __dirname + "\\question-asker.js",
          path.join(projectDir, "question-asker.js")
        );
        fs.copyFileSync(
          __dirname + "\\favicon.ico",
          path.join(projectDir, "favicon.ico")
        );
      }
    }

    console.log("Changing working directory...");
    let cdCommand = `pushd ${camperDir}\\`;
    if (projectName) {
      cdCommand += `${projectName}\\`;
    }
    console.log(shell_command_color(cdCommand));
    console.log(
      "Run " +
        shell_command_color("code .") +
        " (don't forget the space and the dot!) to open your project in VS Code."
    );
    // the wrapper script will look for this
    const tmpCdFile = path.join(process.env.TEMP, "steacc-exit-temp.ps1");
    const escapedCamperDir = camperDir.replaceAll("'", "''");
    fs.writeFileSync(
      tmpCdFile,
      `$env:STEACC_CAMPER_DIR='${escapedCamperDir}'\n${cdCommand}`
    );
    break;
  default:
    // Invalid command provided
    console.error(`Error: Unknown command '${process.argv[2]}'`);
    console.log("Run 'steacc help' to see available commands.");
    process.exit(1);
}

async function promptForCoderName(name) {
  // clear the screen and move cursor to top-left corner
  console.log("\x1b[2J\x1b[0f");

  // TODO: force it not to wrap in the console (use aaart? it does this)
  const splashPath = path.join(__dirname, "content", "splash.txt");
  const splash = fs.readFileSync(splashPath, "utf-16le");
  console.log(splash);

  while (true) {
    name = await askQuestion("Coder name: ");

    if (name === "") {
      continue;
    }

    if (/\s/.test(name)) {
      console.log("No spaces allowed");
      continue;
    }
    break;
  }

  // see if directory exists
  const camperDir = path.join(CAMPER_ROOT_DIR, name);
  let isOnboarding = true;
  if (fs.existsSync(camperDir)) {
    isOnboarding = false;
  }
  return { isOnboarding, camperDir, name };
}

function update() {
  child_process.exec(
    "npm update -g @marcstober/steacc",
    (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(stdout);
    }
  );
}

async function learn(topic) {
  let isOnboarding, camperDir, name;
  ({ isOnboarding, camperDir, name } = await promptForCoderName(name));

  switch (topic) {
    case "terminal":
      const ps = spawnPowershellScript(
        path.join(__dirname, "learn-terminal.ps1"),
        camperDir
      );

      ps.on("close", (code) => {
        console.log(`learn-terminal.ps1 exited with code ${code}`);
      });
      break;
    default:
      console.error(
        "Error: Unknown learning topic. Available topics: terminal"
      );
      break;
  }
}

async function configSurprise() {
  const zipSource = process.argv[3];
  // Optional password for an encrypted zip file
  const password = process.argv[4];

  if (!zipSource) {
    console.error("Error: Please provide a path or https URL to a zip file.");
    console.log("Usage: steacc cs <path-or-url-to-zip-file> [password]");
    process.exit(1);
  }

  const isUrl = /^https:\/\//i.test(zipSource);

  // Build an AdmZip instance from either a downloaded buffer or a local file.
  let zip;
  if (isUrl) {
    console.log(`Downloading ${zipSource}...`);
    let buffer;
    try {
      const response = await fetch(zipSource);
      if (!response.ok) {
        console.error(
          `Error: Failed to download zip file (HTTP ${response.status} ${response.statusText}).`
        );
        process.exit(1);
      }
      buffer = Buffer.from(await response.arrayBuffer());
    } catch (err) {
      console.error(`Error: Failed to download zip file: ${err.message}`);
      process.exit(1);
    }
    zip = new AdmZip(buffer);
  } else {
    if (!fs.existsSync(zipSource)) {
      console.error(`Error: Zip file not found: ${zipSource}`);
      process.exit(1);
    }
    zip = new AdmZip(zipSource);
  }

  // Create .steacc directory in home folder if it doesn't exist
  const steaccDir = path.join(
    process.env.USERPROFILE || process.env.HOME,
    ".steacc"
  );
  if (!fs.existsSync(steaccDir)) {
    fs.mkdirSync(steaccDir, { recursive: true });
    console.log(`Created directory: ${steaccDir}`);
  }

  const extractDir = path.join(steaccDir, "surprise");

  // create the extraction directory if it does not already exist
  if (!fs.existsSync(extractDir)) {
    fs.mkdirSync(extractDir, { recursive: true });
  }

  console.log(`Extracting ${zipSource} to ${extractDir}...`);

  // Use adm-zip to extract the zip file
  try {
    // Extract each entry to the extractDir, flattening any top-level folder
    zip.getEntries().forEach((entry) => {
      // Remove the first folder from the entry name if present
      let entryName = entry.entryName;
      const parts = entryName.split(/[/\\]/);
      if (parts.length > 1) {
        // Remove the first part (top-level folder)
        entryName = parts.slice(1).join(path.sep);
      }
      const targetPath = path.join(extractDir, entryName);
      if (entry.isDirectory) {
        fs.mkdirSync(targetPath, { recursive: true });
      } else {
        fs.mkdirSync(path.dirname(targetPath), { recursive: true });
        // Pass the password through for encrypted entries; it's ignored for unencrypted ones.
        fs.writeFileSync(targetPath, entry.getData(password));
      }
    });
    console.log(`Successfully extracted surprise package to: ${extractDir}`);
    console.log("Contents of extracted directory:");
    const extractedFiles = fs.readdirSync(extractDir);
    extractedFiles.forEach((file) => {
      console.log(path.join(extractDir, file));
    });
  } catch (err) {
    console.error(`Failed to extract zip file: ${err.message}`);
    process.exit(1);
  }
}
