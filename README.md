# S.T.E.A.C.C.
Sci-Tech Electronic Assistant for Coding Campers

A utility for starting projects and managing files on shared computers at [URJ 6 Points Sci-Tech Academy](https://6pointsscitech.org/).

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
st upload
```
Google Drive uploader

```
st version
```
Get the version number.

```
st hello
```
*I wonder what this does?*

## TODO
* Onboarding Experience
   * ASCII art
   * Rules, etc.
* Add a command to open the "web board". (Might have some set-up function so we don't hard-code this URL into github.)
* project selection as a menu (includes new project option by default) - use readline-sync
   * Deprecate/remove question-asker in favor of readline sync
* Install p5.vscode (or, a replacement/update for it)
   * 4 spaces
   * no semicolons
   * install P5 and P5.sound via NPM instead?
* Install p5play (via NPM)
* Install p5play VSCode extension?
* Uploader
   * Unit test including that all files are uploaded in the correct folder structure
   * Refactor, convert to EJS module
   * progress bar in the browser before redirecting to Google
