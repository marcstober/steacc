# S.T.E.A.C.C.
Sci-Tech Electronic Assistant for Coding Campers

A utility for starting projects and managing files on shared computers at [URJ 6 Points Sci-Tech Academy](https://6pointsscitech.org/).

UPDATED FOR 2025: Now for the Python workshop, although this tool still uses JS (since I didn't have time to rewrite it all).

## Installation
`npm i -g @marcstober/steacc`

## Usage
```
st
```
Prompt for coder name and project, and switch to folder.

```
st update
```
Update S.T.E.A.C.C. `st up` also works.

```
st backup
```
Backup to Google Drive.

```
st version
```
Get the version number.

```
st hello
```
*I wonder what this does?*

```
st help
```
Display usage information.

```
st surprise
```
Run a surprise script. The surprise script can be configured with `st cs <zipfile>`. The actual surprise is not distributed with the package
because that would ruin the surprise and, also, it may contain
material that I can't share publicly.

This means users can:

* Use steacc `cs surprise.zip` to install a custom surprise package.
* The zip should contain a `surprise.ps1` file that will be extracted to `~/.steacc/surprise/`.
* From then on, `steacc surprise` will run their custom surprise instead of the built-in one.

## Change Log

### 2025.6.1

* Prevent UI from displaying "undefined" at beginning of backup.

### 2025.6.0

* Add progress tracking to `st backup`!
* Removed deprecated `upload` subcommand that did the exact same things as `backup`.
* Add Python extension installation to `st winget`.

### 2025.5.0

* Add learn command and terminal tutorial, and run as part of onboarding.

### 2025.4.0
* Restore (and reduce tech debt relating to) wrapper script, the lack of which
caused a regression in that changing directories did not function.
* Show an error, rather than defaulting to the no-args functionality, if an invalid command arg is given. (This especially
helps when users call `st suprise` instead of `st surprise`.)
* Add a hidden `st cs <zipfile>` feature to configure the surprise.'

### 2025.3.0
* Surprise feature.

### 2025.2.0
* Spash screen and onboarding updates.

### 2025.1.0
* Remove dependency on ascii-art because of error in installing (because of lack of prebuilt binaries)
in node > 20.

### 0.8.0
* **st backup:** Start uploading without user needing to "Click to continue", and redirect browser to the actual Google Drive folder we uploaded to when done. 

## TODO
* Install everything for the workshop. (See install-proco-apps.ps1 elsewhere, cf. winget-install.ps1) - BUT some things are not public and this is an open-source package?
* It would be nice if this pull request was merged: https://github.com/mikaelbr/marked-terminal/pull/367
* (Lower priority as of 2025) Install p5.vscode (or, a replacement/update for it)
   * 4 spaces
   * no semicolons
   * install P5 and P5.sound via NPM instead?
* Install p5play (via NPM)
* Install p5play VSCode extension?
* Uploader
   * Unit test including that all files are uploaded in the correct folder structure
   * Refactor, convert to EJS module
   * progress bar in the browser before redirecting to Google
* `ascii-art` has been replaced with our own `aaart` Python package, but some functionality from `ascii-art` and maybe even `figlet` should still be ported over.
* Onboarding Experience
   * ASCII art - add an image?
   * Rules, etc. - make them look nicer?
* Add a command to open the "web board"? (Might have some set-up function so we don't hard-code this URL into github.)
   * 2025: Replacing this with a folder with a bit.ly link, so I'm not sure this is quite so useful.
* Make question-asker it's own published npm package? Might be overkill?

## Testing

Ensure the full functionality of changing to a project directory works.

Ensure that uninstalling with `npm uninstall -g` cleans up the bin file (steacc_, steacc, st)

## Google Cloud OAuth & Drive API Setup

To use this tool with your own Google account or organization, you must create a Google Cloud project and configure OAuth credentials:

### 1. Create a Google Cloud Project
- Go to [Google Cloud Console](https://console.cloud.google.com/).
- Click the project dropdown (top left) and select **New Project**.
- Give your project a name and create it.

### 2. Enable the Google Drive API
- In your project, go to **APIs & Services > Library**.
- Search for **Google Drive API** and click **Enable**.

### 3. Configure OAuth Consent Screen
- Go to **APIs & Services > OAuth consent screen**.
- Choose **External** or **Internal** (depending on your needs).
- Fill out the required fields (app name, support email, etc.).
- Add scopes:  
  - `https://www.googleapis.com/auth/drive.file`
  - `https://www.googleapis.com/auth/drive.metadata.readonly`
- Add test users (your Google account email).

### 4. Create OAuth 2.0 Credentials
- Go to **APIs & Services > Credentials**.
- Click **Create Credentials > OAuth client ID**.
- Choose **Web application**.
- Set **Authorized redirect URIs** to:  
  - `http://localhost:3000/oauth2callback`
- Download the credentials JSON file and save it as `oauth2.keys.json` in your project directory.

### 5. Update Your Code
- Replace the `clientId` in your code with the one from your credentials file, or load it from the JSON.
- Make sure your code points to the correct credentials file.

### 6. (Optional) Share with Others
- Add their emails as test users in the OAuth consent screen if the app is not published.

---

**Tip:**  
Keep your credentials file (`oauth2.keys.json`) secure and never commit it to public repositories.

---

**Summary Table for README:**

| Step | Where | What to do |
|------|-------|------------|
| 1    | Google Cloud Console | Create a project |
| 2    | APIs & Services > Library | Enable Google Drive API |
| 3    | APIs & Services > OAuth consent screen | Configure consent screen & add scopes |
| 4    | APIs & Services > Credentials | Create OAuth client ID, set redirect URI, download JSON |
| 5    | Your project | Place JSON as `oauth2.keys.json` and update code if needed |

*This section was written by Copilot.*


## Notes

### wrapper script

To support the directory-changing functionality, 
`st` or `steacc` actually are PowerShell scripts 
that wrap `steacc_` which is not intended to be called 
directly.

### question-asker

I looked for an NPM package that would allow synchronous (i.e., blocking) user
input in the terminal so that learners could write simple programs that ask questions to the user without first having to learn about promises or callback functions (or even how to write functions yet at all, for that matter).
Like the old `input` command in BASIC. I didn't find anything that quite
met my needs and seemed to be in line with the state of the art for JavaScript
in 2024. 

Some other requirements I wanted to fullfill are:
* That the synchronous be called with `await`, because that's 
what you usually have to do to call a synchronous function in modern JavaScript,
so I wanted to teach it that way, and it's an appropriate gentle
introduction to synchronous JavaScript 
(even if the complexities of why this is needed or how it relates to promises 
is too advanced at this point) to simply explain, "you use await when you want the computer to wait for something."
* A simple "one liner" to invoke the prompt, and minimal boilerplate code.
(The built-in `readline` module requires too much boilerplate; essentially 
I'm just wrapping that up in a module.)
* Based on Node's built-in readline module, because there's no need to 
complicate this further.
* ESM module, because it's 2024.

Some NPM packages do similar things but don't meet these requirements:

* **readline-sync**: no longer maintained, not ESM.
* **inquirer**: too complicated and very "heavy" (installs **lots** of dependencies) for what I need.
* **picoprompt**: almost what I want, but doesn't use `await`, and on further inspect has a complex internal implementation.

I thought about publishing this as a package on its own, but any experienced
programmer should be able to write the few extra lines of boilerplate
required to use `readline` themselves rather than need a dependency.

## Credits

Steak ASCII art based on: Image by <a href="https://pixabay.com/users/ideativas-tlm-19346105/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=6600564">Raquel Candia</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=6600564">Pixabay</a>
