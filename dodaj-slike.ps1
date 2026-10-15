<#
  Popunjava polje "slike" u katalog-sajt\proizvodi.js na osnovu foldera katalog-sajt\slike.

  Raspored fotografija:
    katalog-sajt\slike\<id-proizvoda>\<boja>-1.jpg, <boja>-2.jpg, ...
  npr.
    katalog-sajt\slike\runner-one\bijela-1.jpg
    katalog-sajt\slike\runner-one\bijela-2.jpg
    katalog-sajt\slike\court-classic\bijela-i-zelena-1.webp

  <boja> je naziv boje iz proizvodi.js malim slovima, bez kvacica, razmaci su crtice
  ("Teget semis" -> teget-semis, "Sumska" -> sumska). Umjesto boje moze i SKU (nl-r1-wht-1.jpg).
  Redoslijed je po broju na kraju imena; slika 1 je glavna.

  Pokretanje:
    .\dodaj-slike.ps1           upisuje u proizvodi.js (prije toga pravi proizvodi.js.bak)
    .\dodaj-slike.ps1 -Proba    samo pokazuje sta bi uradio, nista ne mijenja
#>
param(
  [string]$Sajt = (Join-Path $PSScriptRoot 'katalog-sajt'),
  [switch]$Proba
)

$ErrorActionPreference = 'Stop'
$ekstenzije = @('.jpg', '.jpeg', '.png', '.webp', '.avif')

function Get-Slug([string]$tekst) {
  $t = $tekst.ToLowerInvariant().Replace([string][char]0x0111, 'dj')   # d sa crtom
  $t = $t.Normalize([Text.NormalizationForm]::FormD)
  $t = -join ($t.ToCharArray() | Where-Object {
    [Globalization.CharUnicodeInfo]::GetUnicodeCategory($_) -ne [Globalization.UnicodeCategory]::NonSpacingMark })
  $t = [regex]::Replace($t, '[^a-z0-9]+', '-')
  return $t.Trim('-')
}

$putanjaJs = Join-Path $Sajt 'proizvodi.js'
$folderSlika = Join-Path $Sajt 'slike'
if (-not (Test-Path $putanjaJs)) { throw "Nema fajla $putanjaJs" }
if (-not (Test-Path $folderSlika)) { throw "Nema foldera $folderSlika - napravi ga i stavi slike u podfoldere po id-u proizvoda." }

# Citanje uz cuvanje BOM-a i krajeva redova
$bajtovi = [IO.File]::ReadAllBytes($putanjaJs)
$imaBom = $bajtovi.Length -ge 3 -and $bajtovi[0] -eq 0xEF -and $bajtovi[1] -eq 0xBB -and $bajtovi[2] -eq 0xBF
$tekst = (New-Object Text.UTF8Encoding($false)).GetString($bajtovi)
if ($imaBom) { $tekst = $tekst.Substring(1) }
$kraj = if ($tekst.Contains("`r`n")) { "`r`n" } else { "`n" }
$redovi = $tekst -split "`r?`n"

# Folderi sa slikama: id -> stvarno ime foldera (hosting razlikuje velika i mala slova)
$folderi = @{}
Get-ChildItem -LiteralPath $folderSlika -Directory | ForEach-Object { $folderi[$_.Name.ToLowerInvariant()] = $_ }

$rxId = '^\s*id:\s*"([^"]+)"'
$rxVarijanta = '^(\s*)\{\s*sku:\s*"([^"]+)"(.*)\}(\s*,?\s*)$'
$rxBoja = 'boja:\s*"([^"]*)"'
$rxSlike = ',?\s*slike:\s*\[[^\]]*\]'

$idProizvoda = $null
$iskoristeni = @{}        # puna putanja fajla -> $true
$idSaFolderom = @{}
$izmjena = 0; $popunjeno = 0; $uklonjeno = 0
$upozorenja = New-Object System.Collections.Generic.List[string]

for ($i = 0; $i -lt $redovi.Count; $i++) {
  $red = $redovi[$i]
  if ($red -match $rxId) { $idProizvoda = $Matches[1]; continue }
  if (-not $idProizvoda) { continue }
  $m = [regex]::Match($red, $rxVarijanta)
  if (-not $m.Success) { continue }

  $uvlaka = $m.Groups[1].Value; $sku = $m.Groups[2].Value
  $ostatak = $m.Groups[3].Value; $rep = $m.Groups[4].Value
  $boja = ''
  $mb = [regex]::Match($ostatak, $rxBoja)
  if ($mb.Success) { $boja = $mb.Groups[1].Value }
  $kljucevi = @((Get-Slug $boja), (Get-Slug $sku)) | Where-Object { $_ }

  $nadjene = @()
  $folder = $folderi[$idProizvoda.ToLowerInvariant()]
  if ($folder) {
    $idSaFolderom[$folder.Name.ToLowerInvariant()] = $true
    $nadjene = @(Get-ChildItem -LiteralPath $folder.FullName -File |
      Where-Object { $ekstenzije -contains $_.Extension.ToLowerInvariant() } |
      ForEach-Object {
        # bijela-1, bijela_1, bijela 1 i "bijela (1)" (Windows grupno preimenovanje sa F2)
        $mf = [regex]::Match($_.BaseName, '^(.+?)(?:[-_ ]+\(?(\d+)\)?)?$')
        [pscustomobject]@{
          Fajl = $_
          Kljuc = Get-Slug $mf.Groups[1].Value
          Broj = if ($mf.Groups[2].Success) { [int]$mf.Groups[2].Value } else { 0 }
        }
      } |
      Where-Object { $kljucevi -contains $_.Kljuc } |
      Sort-Object Broj, { $_.Fajl.Name })
  }

  $bezSlika = [regex]::Replace($ostatak, $rxSlike, '').TrimEnd()
  if ($nadjene.Count -gt 0) {
    foreach ($n in $nadjene) { $iskoristeni[$n.Fajl.FullName] = $true }
    $lista = ($nadjene | ForEach-Object { '"slike/' + $folder.Name + '/' + $_.Fajl.Name + '"' }) -join ', '
    $noviRed = "$uvlaka{ sku: `"$sku`"$bezSlika, slike: [$lista] }$rep"
    $popunjeno++
  } else {
    # Nema slika u folderu: zadrzi postojece osim lokalnih putanja koje vise ne postoje
    $ms = [regex]::Match($ostatak, 'slike:\s*\[([^\]]*)\]')
    if (-not $ms.Success) { continue }
    $stare = @([regex]::Matches($ms.Groups[1].Value, '"([^"]*)"') | ForEach-Object { $_.Groups[1].Value })
    $ostaju = @($stare | Where-Object { -not $_.StartsWith('slike/') -or (Test-Path -LiteralPath (Join-Path $Sajt $_)) })
    if ($ostaju.Count -eq $stare.Count) { continue }
    if ($ostaju.Count -gt 0) {
      $lista = ($ostaju | ForEach-Object { "`"$_`"" }) -join ', '
      $noviRed = "$uvlaka{ sku: `"$sku`"$bezSlika, slike: [$lista] }$rep"
    } else {
      $noviRed = "$uvlaka{ sku: `"$sku`"$bezSlika }$rep"
      $uklonjeno++
    }
    $upozorenja.Add("$idProizvoda / $boja ($sku): uklonjene putanje do slika koje vise ne postoje")
  }

  if ($noviRed -ne $red) {
    $redovi[$i] = $noviRed
    $izmjena++
    Write-Host ("{0} / {1} ({2}): {3} slika" -f $idProizvoda, $boja, $sku, $nadjene.Count)
  }
}

# Slike i folderi koji nisu nigdje upareni (najcesce greska u imenu)
foreach ($k in $folderi.Keys) {
  if (-not $idSaFolderom.ContainsKey($k)) {
    $upozorenja.Add("Folder slike\$($folderi[$k].Name) ne odgovara nijednom id-u proizvoda")
    continue
  }
  Get-ChildItem -LiteralPath $folderi[$k].FullName -File |
    Where-Object { $ekstenzije -contains $_.Extension.ToLowerInvariant() -and -not $iskoristeni.ContainsKey($_.FullName) } |
    ForEach-Object { $upozorenja.Add("slike\$($folderi[$k].Name)\$($_.Name) ne odgovara nijednoj boji ni SKU-u tog proizvoda") }
}

Write-Host ''
Write-Host "Varijanti sa slikama: $popunjeno, izmijenjenih redova: $izmjena, uklonjenih polja slike: $uklonjeno"
if ($upozorenja.Count) {
  Write-Host "Upozorenja ($($upozorenja.Count)):" -ForegroundColor Yellow
  $upozorenja | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
}

if ($Proba) { Write-Host 'Proba: proizvodi.js nije mijenjan.'; return }
if ($izmjena -eq 0) { Write-Host 'Nema izmjena.'; return }

Copy-Item -LiteralPath $putanjaJs -Destination "$putanjaJs.bak" -Force
$izlaz = $redovi -join $kraj
[IO.File]::WriteAllText($putanjaJs, $izlaz, (New-Object Text.UTF8Encoding($imaBom)))
Write-Host "Upisano u $putanjaJs (stara verzija: proizvodi.js.bak)" -ForegroundColor Green
