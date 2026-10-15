<#
  Salje izmene (nove slike, proizvodi.js...) na GitHub.
  Pokretanje: dvoklik na posalji-na-github.cmd
#>
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
$env:Path = [Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [Environment]::GetEnvironmentVariable('Path', 'User')

# Prvo osvezi proizvodi.js prema folderu sa slikama
& (Join-Path $PSScriptRoot 'dodaj-slike.ps1')

git add -A
$izmjene = @(git status --porcelain)
if (-not $izmjene.Count) { Write-Host ''; Write-Host 'Nema novih izmena za slanje.' -ForegroundColor Green; return }

$slike = @($izmjene | Where-Object { $_ -match 'katalog-sajt/slike/' })
$mb = 0
foreach ($r in $slike) {
  $p = $r.Substring(3).Trim('"')
  if (Test-Path -LiteralPath $p) { $mb += (Get-Item -LiteralPath $p).Length / 1MB }
}
Write-Host ''
Write-Host ("Za slanje: {0} izmena, od toga {1} slika ({2:N1} MB)." -f $izmjene.Count, $slike.Count, $mb)
$izmjene | Select-Object -First 15 | ForEach-Object { Write-Host "  $_" }
if ($izmjene.Count -gt 15) { Write-Host "  ... i jos $($izmjene.Count - 15)" }
Write-Host ''
Write-Host 'Na GitHub salji samo SVOJE fotografije.' -ForegroundColor Yellow
if ((Read-Host 'Poslati na GitHub? (d/n)') -notmatch '^[dDyY]') { git reset -q; Write-Host 'Nista nije poslato.'; return }

git commit -q -m ("Azuriranje kataloga {0:yyyy-MM-dd HH:mm}" -f (Get-Date))
git push -q
Write-Host 'Poslato na GitHub.' -ForegroundColor Green
