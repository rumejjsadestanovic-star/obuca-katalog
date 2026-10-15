<#
  Prati folder katalog-sajt\slike i sam pokrece dodaj-slike.ps1 kad se slike dodaju,
  obrisu ili preimenuju. Prozor treba ostaviti otvoren; zatvaranjem se pracenje gasi.

  Pokretanje: dvoklik na prati-slike.cmd (ili .\prati-slike.ps1)
#>
param(
  [string]$Sajt = (Join-Path $PSScriptRoot 'katalog-sajt'),
  [int]$Sekundi = 3
)

$folderSlika = Join-Path $Sajt 'slike'
$dodaj = Join-Path $PSScriptRoot 'dodaj-slike.ps1'
if (-not (Test-Path $folderSlika)) { New-Item -ItemType Directory -Path $folderSlika | Out-Null }

# Otisak foldera: sve putanje, velicine i vremena izmjene
function Get-Otisak {
  (Get-ChildItem -LiteralPath $folderSlika -Recurse -ErrorAction SilentlyContinue |
    ForEach-Object { '{0}|{1}|{2}' -f $_.FullName, $(if ($_.PSIsContainer) { '' } else { $_.Length }), $_.LastWriteTimeUtc.Ticks }) -join "`n"
}

function Invoke-Dodaj {
  Write-Host ''
  Write-Host ('[{0:HH:mm:ss}] Azuriram proizvodi.js...' -f (Get-Date)) -ForegroundColor Cyan
  try { & $dodaj -Sajt $Sajt } catch { Write-Host "Greska: $_" -ForegroundColor Red }
}

$Host.UI.RawUI.WindowTitle = 'Pracenje slika - katalog'
Write-Host "Pratim $folderSlika"
Write-Host 'Ubaci slike u slike\<id-proizvoda>\<boja>-1.jpg ... proizvodi.js se azurira sam. Zatvori prozor za kraj.'

Invoke-Dodaj
$zadnji = Get-Otisak
while ($true) {
  Start-Sleep -Seconds $Sekundi
  $sada = Get-Otisak
  if ($sada -eq $zadnji) { continue }
  # Sacekaj da se kopiranje zavrsi (otisak se prestane mijenjati)
  do { $zadnji = $sada; Start-Sleep -Seconds $Sekundi; $sada = Get-Otisak } while ($sada -ne $zadnji)
  Invoke-Dodaj
}
