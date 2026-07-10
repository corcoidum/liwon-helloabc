# Generates all app audio as WAV files using Windows built-in voices
# (self-made audio, no licensing issues). Reads the same JSON data files
# the app uses, so content and audio never drift apart.
#
# Run once on Windows (PowerShell 7+):  pwsh -File scripts/make-audio.ps1

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech

$root = Split-Path -Parent $PSScriptRoot
$dataDir = Join-Path $root 'src/data'
$outDir = Join-Path $root 'public/audio'
New-Item -ItemType Directory -Force $outDir | Out-Null

$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$format = New-Object System.Speech.AudioFormat.SpeechAudioFormatInfo(16000, [System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen, [System.Speech.AudioFormat.AudioChannel]::Mono)

function Say($file, $text, $voice, $rate) {
  $path = Join-Path $outDir "$file.wav"
  $synth.SelectVoice($voice)
  $synth.Rate = $rate
  $synth.SetOutputToWaveFile($path, $format)
  $synth.Speak($text)
  $synth.SetOutputToNull()
}

$en = 'Microsoft Zira Desktop'
$ko = 'Microsoft Heami Desktop'

$letters = Get-Content -Encoding UTF8 (Join-Path $dataDir 'letters.json') -Raw | ConvertFrom-Json
foreach ($l in $letters) {
  Say "letter-$($l.letter)" "$($l.letter)." $en -1
  Say "sound-$($l.letter)" $l.soundText $en -2
}

$words = Get-Content -Encoding UTF8 (Join-Path $dataDir 'words.json') -Raw | ConvertFrom-Json
foreach ($w in $words) {
  Say "word-$($w.id)" $w.word $en -2
}

$phrases = Get-Content -Encoding UTF8 (Join-Path $dataDir 'phrases.json') -Raw | ConvertFrom-Json
foreach ($p in $phrases) {
  Say "phrase-$($p.id)" $p.text $en -1
}

# Chant lines: derive audio-id → text from the chant data itself
$chants = Get-Content -Encoding UTF8 (Join-Path $dataDir 'chants.json') -Raw | ConvertFrom-Json
$lines = @{}
foreach ($c in $chants) {
  foreach ($line in $c.lines) {
    if ($line.audio.Count -eq 1 -and -not $lines.ContainsKey($line.audio[0])) {
      $lines[$line.audio[0]] = $line.text
    }
  }
}
foreach ($id in $lines.Keys) {
  Say $id $lines[$id] $en 0
}

$feedback = Get-Content -Encoding UTF8 (Join-Path $dataDir 'feedback.json') -Raw | ConvertFrom-Json
foreach ($f in $feedback) {
  Say "ko-$($f.id)" $f.text $ko 0
}

$synth.Dispose()
$count = (Get-ChildItem $outDir -Filter '*.wav').Count
$size = [Math]::Round(((Get-ChildItem $outDir -Filter '*.wav' | Measure-Object Length -Sum).Sum) / 1MB, 1)
Write-Output "Generated $count wav files ($size MB) in $outDir"
