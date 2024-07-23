# Made with <3 by GustyCube (Bennett Schwartz) and Joshua Kellman
Write-Output "Installing Visual Studio Code"
winget install -e --id Microsoft.VisualStudioCode
Write-Output "Installing Python"
winget install -e --id Python.Python.3.13 # I'd like to specify "latest Python 3", but it seems like we have to specify a version
Write-Output "Installing Windows Terminal"
winget install -e --id Microsoft.WindowsTerminal # should already be installed

code --install-extension ms-python.python
Write-Output "App install complete."
pause
