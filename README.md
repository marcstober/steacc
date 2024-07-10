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
st backup
```
Backup to Google Drive. (Was `st upload`.)

```
st version
```
Get the version number.

```
st hello
```
*I wonder what this does?*

## Change Log

### 0.8.0
* **st backup:** Start uploading without user needing to "Click to continue", and redirect browser to the actual Google Drive folder we uploaded to when done. 

## TODO
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
* Use `ascii-art` for text and images, and remove `figlet`.
* Onboarding Experience
   * ASCII art - add an image?
   * Rules, etc. - make them look nicer?
* Add a command to open the "web board"? (Might have some set-up function so we don't hard-code this URL into github.)
* Make question-asker it's own published npm package? Might be overkill?

## Design Decisions

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
