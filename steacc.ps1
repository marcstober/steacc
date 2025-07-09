# call the JS file

# sometimes we need to unpack the args like this
$args_ = $args
if ($args_.Count -eq 1 -and $args_[0] -is [System.Object[]]) {
    $args_ = $args_[0]
}

Invoke-Expression "steacc_ $args_"

$cmd = Join-Path $env:temp steacc-exit-temp.ps1
if (Test-Path $cmd) { 
    Invoke-Expression $cmd
    Remove-Item $cmd
}
