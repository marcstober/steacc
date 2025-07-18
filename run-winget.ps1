winget install -e --id Microsoft.VisualStudioCode
winget install -e --id Python.Python.3.13 # I'd like to specify "latest Python 3", but it seems like we have to specify a version
winget install -e --id Microsoft.WindowsTerminal # should already be installed
code --install-extension ms-python.python
pause