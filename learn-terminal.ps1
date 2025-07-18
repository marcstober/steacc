$startingDir = Get-Location

function Show-Content($content) {
    write-host -ForegroundColor DarkGreen -Object $content
}

function Show-Prompt($prompt = $null) {
    $Host.UI.Write($prompt)
    $cmd = $Host.UI.ReadLine()
    return $cmd
}

function Ask-QuestionWithTries($prompt, $correctAnswer, $capture = $false, $maxTries = 3) {
    $tries = 0
    # write-host "You have $maxTries tries."
    while ($true) {
        $answer = Show-Prompt $prompt 
        $answer = $answer.TrimEnd() # allows trailing spaces
        if ($answer -eq $correctAnswer) {
            if ($capture) {
                write-host -ForegroundColor Green -Object "You got it!"
            }
            else {
                Invoke-Expression $answer
            }
            break
        }
        else {
            $tries++
            if ($tries -ge $maxTries) {
                $choice = Show-Prompt "This is a tough one! Do you want to try again? (yes/no)>" $true
                if ($choice -eq "no") {
                    write-host -ForegroundColor Yellow -Object "The correct answer is '$correctAnswer.'"
                    break
                }
                else {
                    $tries = 0 # reset tries for next round
                }
            }
            else {
                write-host -ForegroundColor Red -Object "Not quite. Try again."
            }
        }
    }
}


$content = @"

Greetings! You are current running what is known as a shell, 
terminal, console, or command prompt. We'll call it "terminal." 
In the terminal, you can type a command, press <ENTER>, and the 
computer will do something. Many of the things you can do with a 
computer can be done with terminal commands, and using terminal 
commands can be faster, more powerful, and easier to automate 
than performing the same tasks by pointing and clicking.

The most common terminal command is *ls*. 
What do you think *ls* stands for?
"@

Show-Content $content
Ask-QuestionWithTries "Type your answer here> " "list" $true

$content = @"
Try the ls command now:
"@
Show-Content $content
Ask-QuestionWithTries "PS $pwd> " "ls"

$content = @"
What do you see? You should notice that this is a list of files. Files in computers are organized into directories, also called folders. If you want to use the terminal in a different directory, you can use the cd (change directory) command. Try entering: cd c:\. 
(Note that the final character is a backslash, 
which on many computers you can type with the key above the <ENTER> key):
"@
Show-Content $content
Ask-QuestionWithTries ("PS " + $pwd + "> ") "cd c:\"


$content = @"
Now, try running ls in this directory:
"@
Show-Content $content
Ask-QuestionWithTries ("PS " + $pwd + "> ") "ls"

# TODO: say something about not being able to move with a mouse, you can use arrows, and the up-arrow to recall previous commands
# TODO: ensure camper folder has been created!
$content = @"
Great. You should see more files here, including your camper folder. After you're done with this lesson, see if you can `cd` back to your camper folder.

Directories are the same as folders. You may be familiar with using folders through a GUI, 
which means "Graphical User Interface." If you want to see the current folder, 
in the terminal on this computer you can enter: ii . (don't forget the "dot"). 
Try it now (and then switch back to the Terminal window):
"@
Show-Content $content
Ask-QuestionWithTries ("PS " + $pwd + "> ") "ii ."

$content = @"
Did you notice that you can see the same files and folders in a GUI window?

The st program, which you are running now, also runs in a terminal window. The st program also has subcommands--this means there is a second command that works with st, that you use by typing a space and then the name of the subcommand. For the final thing to try in this tutorial, see what this subcommand does: st surprise
"@
Show-Content $content
Ask-QuestionWithTries ("PS " + $pwd + "> ") "st surprise"

# At the end, return to the starting directory
Set-Location $startingDir
write-host -ForegroundColor Cyan -Object "`nReturning to your original directory: $startingDir"