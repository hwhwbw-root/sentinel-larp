$targetDir = "$env:LOCALAPPDATA\Microsoft\Windows\Fonts"
if (!(Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
}

$fontFiles = Get-ChildItem "canva-bunting-assets\fonts\*.otf"
foreach ($f in $fontFiles) {
    Copy-Item $f.FullName -Destination $targetDir -Force
    $regName = $f.BaseName + " (OpenType)"
    Set-ItemProperty -Path "HKCU:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Fonts" -Name $regName -Value $f.FullName
    Write-Host "Installed and registered: $regName"
}
