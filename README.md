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

## Change Log

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

## Design Decisions

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
