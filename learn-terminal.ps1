$content = @"

Greetings! You are current running what is known as a shell, terminal, console, or command prompt. We’ll call it “terminal.” In the terminal, you can type a command, press <ENTER>, and the computer will do something. Many of the things you can do with a computer can be done with terminal commands, and using terminal commands can be faster, more powerful, and easier to automate than performing the same tasks by pointing and clicking.

The most common terminal command is *ls*. What do you thing *ls* stands for?
"@
write-host -ForegroundColor Cyan -Object $content

$Host.UI.Write(  "Type your answer here> ")
$answer = $Host.UI.ReadLine()

$content = @"
The correct answer is “list.” 
"@
write-host -ForegroundColor Cyan -Object $content

if ($answer -eq "list") {
    write-host -ForegroundColor Green -Object "You got it!"
} 

$content = @"
Try the ls command now:
"@
write-host -ForegroundColor Cyan -Object $content

$Host.UI.Write( "PS " + $pwd + "> ")
$cmd = $Host.UI.ReadLine()

Invoke-Expression $cmd

$content = @"
What do you see? You should notice that this is a list of files. Files in computers are organized into directories, also called folders. If you want to use the terminal in a different directory, you can use the cd (change directory) command. Try entering: cd c:\. (Note that the final character is a backslash, which on many computers you can type with the key above the <ENTER> key):
"@
write-host -ForegroundColor Cyan -Object $content
$Host.UI.Write( "PS " + $pwd + "> ")
$cmd = $Host.UI.ReadLine()
Invoke-Expression $cmd

$content = @"

Now, try running ls in this directory:
"@
write-host -ForegroundColor Cyan -Object $content
$Host.UI.Write( "PS " + $pwd + "> ")
$cmd = $Host.UI.ReadLine()
Invoke-Expression $cmd

$content = @"
Great. You should see more files here, including your camper folder. After you're done with this lesson, see if you can `cd` back to your camper folder.

Directories are the same as folders. You may be familiar with using folders through a GUI, which means “Graphical User Interface.” If you want to see the current folder, in the terminal on this computer you can enter: ii . (don’t forget the “dot"). Try it now (and then switch back to the Terminal window):

Did you notice that you can see the same files and folders in a GUI window?

The st program, which you are running now, also runs in a terminal window. The st program also has subcommands--this means there is a second command that works with st, that you use by typing a space and then the name of the subcommand. For the final thing to try in this tutorial, see what this subcommand does: st surprise
"@
write-host -ForegroundColor Cyan -Object $content

$Host.UI.Write( "PS " + $pwd + "> ")
$cmd = $Host.UI.ReadLine()
Invoke-Expression $cmd