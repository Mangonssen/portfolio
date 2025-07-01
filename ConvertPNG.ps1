Get-ChildItem -Path . -Recurse -Filter *.png | ForEach-Object {
    $webpPath = $_.FullName -replace '\.png$', '.webp'
    ffmpeg -y -i $_.FullName $webpPath
}