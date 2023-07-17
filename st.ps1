# what are the parameters?
#Write-Output ($args -join " ") # debugging

# call the JS file
steacc ($args -join " ") # steacc-core??? do I actually need to install this as "bin" item???

# call the temporary shell file that the JS code created
# TODO: get this as a "stream" without writing a file;
#  maybe more secure because/and not leaving file around?
# steacc will write this file to the temp directory
if (Test-Path $env:temp\st-out.ps1) { 
    Invoke-Expression $env:temp\st-out.ps1
    Remove-Item $env:temp\st-out.ps1
}