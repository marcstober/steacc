# S.T.E.A.C.C.
Sci-Tech Electronic Assistant for Coding Campers

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
Update S.T.E.A.C.C.

```
st hello
```
*I wonder what this does?*

## TODO
* project selection as a menu (includes new project option by default) - use readline-sync
   * Deprecate/remove question-asker in favor of readline sync
* Install p5.vscode (or, a replacement/update for it)
   * 4 spaces
   * no semicolons
   * install P5 and P5.sound via NPM instead?
* Install p5play (via NPM)
* Install p5play VSCode extension?
* Uploader
   * Uploader as `st upload`
   * Unit test including that all files are uploaded in the correct folder structure
   * Refactor, convert to EJS module
   * progress bar in the browser before redirecting to Google
* Onboarding Experience
   * ASCII art
   * Rules, etc.