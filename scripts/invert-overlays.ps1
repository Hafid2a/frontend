$rootPaths = @("app", "components")
$patterns = @(
    @{ From = 'bg-deep-night/'; To = 'bg-charcoal/' }
)

$totalFiles = 0
$totalReplacements = 0

foreach ($root in $rootPaths) {
    Get-ChildItem -Path $root -Recurse -Include *.tsx, *.ts, *.css -File | ForEach-Object {
        $file = $_
        $content = Get-Content -LiteralPath $file.FullName -Raw
        if ($null -eq $content) { return }
        $original = $content
        $fileCount = 0
        foreach ($p in $patterns) {
            $escaped = [regex]::Escape($p.From)
            $hits = ([regex]::Matches($content, $escaped)).Count
            if ($hits -gt 0) {
                $content = $content -replace $escaped, $p.To
                $fileCount += $hits
            }
        }
        if ($content -ne $original) {
            Set-Content -LiteralPath $file.FullName -Value $content -NoNewline
            Write-Host ("  {0,3} in {1}" -f $fileCount, $file.FullName.Substring((Get-Location).Path.Length + 1))
            $script:totalFiles++
            $script:totalReplacements += $fileCount
        }
    }
}

Write-Host ""
Write-Host ("Done. {0} files, {1} replacements." -f $totalFiles, $totalReplacements)
