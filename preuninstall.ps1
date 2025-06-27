$nodeBinDir = Join-Path $home 'AppData\Roaming\npm'
Write-Host "Removing S.T.E.A.C.C. wrapper scripts from global npm bin directory: $nodeBinDir"

$steaccScript = Join-Path $nodeBinDir 'steacc.ps1'
$stScript = Join-Path $nodeBinDir 'st.ps1'

if (Test-Path $steaccScript) {
    Remove-Item $steaccScript -Force
    Write-Host "Removed: $steaccScript"
}
else {
    Write-Host "File not found: $steaccScript"
}

if (Test-Path $stScript) {
    Remove-Item $stScript -Force
    Write-Host "Removed: $stScript"
}
else {
    Write-Host "File not found: $stScript"
}

Write-Host "S.T.E.A.C.C. cleanup completed."
