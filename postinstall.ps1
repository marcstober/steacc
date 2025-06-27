$nodeBinDir = Join-Path $home 'AppData\Roaming\npm'
Write-Host "Installing S.T.E.A.C.C. wrapper script to global npm bin directory: $nodeBinDir"
Copy-Item .\steacc.ps1 $nodeBinDir -PassThru | ForEach-Object {
    Write-Host "Copied: $($_.FullName)"
}
Copy-Item .\steacc.ps1 $nodeBinDir\st.ps1 -PassThru | ForEach-Object {
    Write-Host "Copied: $($_.FullName)"
}


