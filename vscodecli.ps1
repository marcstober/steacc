# Made with <3 by GustyCube (Bennett Schwartz) and Joshua Kellman
$searchPath = "~\AppData\Local\Programs\Microsoft VS Code\bin"
if ($env:Path -split ";" -contains $searchPath) {
    Write-Output "Path exists in the PATH environment variable."
} else {
    Write-Output "Path does not exist in the PATH environment variable. You may need to install it."
}