# call the JS file
steacc_ @args

$cmd = Join-Path $env:temp steacc-exit-temp.ps1
if (Test-Path $cmd) { 
    Invoke-Expression $cmd
    Remove-Item $cmd
}
