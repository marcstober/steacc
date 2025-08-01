$startingDir = Get-Location

function Show-Content($Content) {
    # NOTE: Using JS to format markdown so this works in PowerShell 5.x
    #   which we can expect to be installed on Windows; PowerShell 7+ 
    #   would have this built-in.
    $scriptPath = Join-Path $PSScriptRoot "showmarkdown.js"
    write-host ""
    $Content | node $scriptPath
    write-host ""
}

function Show-Prompt($prompt = $null) {
    $Host.UI.Write($prompt)
    $cmd = $Host.UI.ReadLine()
    return $cmd
}

function Show-PromptWithTries($prompt, $correctAnswer, $capture = $false, $maxTries = 3) {
    $tries = 0
    while ($true) {
        $answer = Show-Prompt $prompt 
        $answer = $answer.TrimEnd() # allows trailing spaces
        if ($answer -eq $correctAnswer) {
            if ($capture) {
                write-host -ForegroundColor Green -Object "`nYou got it!"
            }
            else {
                Invoke-Expression $answer
            }
            break
        }
        else {
            $tries++
            if ($tries -ge $maxTries) {
                write-host ""
                $choice = Show-Prompt "This is a tough one! Do you want to try again? (yes/no)> " $true
                if ($choice -eq "no") {
                    Write-Host "`nThe correct answer is '$correctAnswer.'"  -ForegroundColor Green 
                    break
                }
                else {
                    $tries = 0 # reset tries for next round
                    write-host ""
                }
            }
            else {
                write-host -ForegroundColor Red -Object "`nNot quite. Try again.`n"
            }
        }
    }
}


$content = @"

Greetings! 

You are currently running the **terminal**. It is sometimes also referred to as a shell, console, or command prompt.

In the terminal, you can type a command, press ``ENTER``, and the 
computer will do something.

Many of the things you can do with a computer can be done with terminal 
commands! Programmers use terminal because it can be faster, more powerful, and easier to automate than 
performing the same tasks in a graphical user interface with a mouse.

---

TIP: 
You can't use the mouse to move the cursor in the terminal, but you can 
use the left and right arrow keys.

---

A common terminal command is ``ls``. 
What do you think ``ls`` stands for?
"@

Show-Content $content
Show-PromptWithTries "Type your answer here> " "list" $true

$content = @"
Try the ``ls`` command now:
"@
Show-Content $content
Show-PromptWithTries "PS $pwd> " "ls"

$content = @"
What do you see? You should notice that this is a list of files. Files in computers are organized into **directories**, also called folders. If you want to use the terminal in a different directory, 
you can use the ``cd`` (change directory) command. 

Try entering: ``cd c:\``. 
(Note that the final character is a backslash, 
which on many computers you can type with the key above the ``ENTER`` key):
"@
Show-Content $content
Show-PromptWithTries ("PS " + $pwd + "> ") "cd c:\"


$content = @"
Now, try running ``ls`` in this directory:
"@
Show-Content $content
Show-PromptWithTries ("PS " + $pwd + "> ") "ls"

# TODO: say something about not being able to move with a mouse, you can use arrows, and the up-arrow to recall previous commands
# TODO: ensure camper folder has been created!
$content = @"
Great. You should see more files here, including your camper folder. After you're done with this lesson, 
see if you can ``cd`` back to your camper folder.

You may be familiar with seeing folders in a GUI, 
which means "Graphical User Interface." If you want to see the current folder, 
in the terminal on this computer you can enter: ``ii .``. (Don't forget both the space and the "dot"!). 

Try it now (and then switch back to the Terminal window):
"@
Show-Content $content
Show-PromptWithTries ("PS " + $pwd + "> ") "ii ."

$content = @"
Did you notice that you can see the same files and folders?

The **st** program, which you are running now, runs in a terminal window. 
You can always use the st program to get back to your camper folder.
This will help make sure your files are saved in the right place and don't get lost or deleted.

The st program also has commands. This means there is another word you type after st.
To complete this tutorial, trying running st with the "surprise" subcommand, like this: ``st surprise``
"@
Show-Content $content
Show-PromptWithTries ("PS " + $pwd + "> ") "st surprise"

# At the end, return to the starting directory
Set-Location $startingDir
write-host -ForegroundColor Cyan -Object "`nReturning to your original directory: $startingDir"
