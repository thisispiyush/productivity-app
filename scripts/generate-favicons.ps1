$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Windows.Forms

function New-RoundedRectPath {
  param(
    [System.Drawing.RectangleF] $Rect,
    [float] $Radius
  )

  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $d = $Radius * 2

  # Top-left
  $path.AddArc($Rect.X, $Rect.Y, $d, $d, 180, 90)
  # Top-right
  $path.AddArc($Rect.Right - $d, $Rect.Y, $d, $d, 270, 90)
  # Bottom-right
  $path.AddArc($Rect.Right - $d, $Rect.Bottom - $d, $d, $d, 0, 90)
  # Bottom-left
  $path.AddArc($Rect.X, $Rect.Bottom - $d, $d, $d, 90, 90)

  $path.CloseFigure()
  return $path
}

function New-PulseBitmap {
  param(
    [int] $Size
  )

  $bmp = New-Object System.Drawing.Bitmap $Size, $Size, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  try {
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    $g.Clear([System.Drawing.Color]::Transparent)

    $bg = [System.Drawing.ColorTranslator]::FromHtml('#111111')
    $stroke = [System.Drawing.ColorTranslator]::FromHtml('#4F6EF7')

    # SVG viewBox is 32x32 with rx=8.
    $radius = [float]($Size * (8.0 / 32.0))
    $rect = New-Object System.Drawing.RectangleF 0, 0, $Size, $Size

    $bgBrush = New-Object System.Drawing.SolidBrush $bg
    $path = New-RoundedRectPath -Rect $rect -Radius $radius
    try {
      $g.FillPath($bgBrush, $path)
    } finally {
      $bgBrush.Dispose()
      $path.Dispose()
    }

    $penWidth = [float]($Size * (2.5 / 32.0))
    $pen = New-Object System.Drawing.Pen $stroke, $penWidth
    $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

    try {
      $scale = [float]($Size / 32.0)
      $pts = @(
        New-Object System.Drawing.PointF (2 * $scale),  (16 * $scale)
        New-Object System.Drawing.PointF (8 * $scale),  (16 * $scale)
        New-Object System.Drawing.PointF (11 * $scale), (8 * $scale)
        New-Object System.Drawing.PointF (14 * $scale), (24 * $scale)
        New-Object System.Drawing.PointF (17 * $scale), (12 * $scale)
        New-Object System.Drawing.PointF (20 * $scale), (18 * $scale)
        New-Object System.Drawing.PointF (30 * $scale), (18 * $scale)
      )
      $g.DrawLines($pen, $pts)
    } finally {
      $pen.Dispose()
    }

    return $bmp
  } finally {
    $g.Dispose()
  }
}

function Get-PngBytes {
  param([System.Drawing.Bitmap] $Bitmap)
  $ms = New-Object System.IO.MemoryStream
  try {
    $Bitmap.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    return $ms.ToArray()
  } finally {
    $ms.Dispose()
  }
}

function Write-Ico {
  param(
    [string] $OutPath,
    [byte[]] $Png16,
    [byte[]] $Png32
  )

  # ICO header + 2 directory entries + PNG payloads.
  $fs = [System.IO.File]::Open($OutPath, [System.IO.FileMode]::Create, [System.IO.FileAccess]::Write)
  $bw = New-Object System.IO.BinaryWriter $fs
  try {
    $count = 2
    $dirSize = 16 * $count
    $headerSize = 6
    $offset16 = $headerSize + $dirSize
    $offset32 = $offset16 + $Png16.Length

    # ICONDIR
    $bw.Write([UInt16]0) # reserved
    $bw.Write([UInt16]1) # type: icon
    $bw.Write([UInt16]$count)

    function Write-Entry([int]$Size, [byte[]]$Png, [int]$Offset) {
      $bw.Write([byte]$Size) # width
      $bw.Write([byte]$Size) # height
      $bw.Write([byte]0)     # color count
      $bw.Write([byte]0)     # reserved
      $bw.Write([UInt16]1)   # planes
      $bw.Write([UInt16]32)  # bit count
      $bw.Write([UInt32]$Png.Length) # bytes in resource
      $bw.Write([UInt32]$Offset)     # offset
    }

    Write-Entry -Size 16 -Png $Png16 -Offset $offset16
    Write-Entry -Size 32 -Png $Png32 -Offset $offset32

    $bw.Write($Png16)
    $bw.Write($Png32)
  } finally {
    $bw.Dispose()
    $fs.Dispose()
  }
}

$publicDir = Join-Path (Get-Location) 'public'
New-Item -ItemType Directory -Force -Path $publicDir | Out-Null

$targets = @(
  @{ name = 'favicon-16x16.png'; size = 16 }
  @{ name = 'favicon-32x32.png'; size = 32 }
  @{ name = 'apple-touch-icon.png'; size = 180 }
  @{ name = 'android-chrome-192x192.png'; size = 192 }
  @{ name = 'android-chrome-512x512.png'; size = 512 }
)

$png16 = $null
$png32 = $null

foreach ($t in $targets) {
  $bmp = New-PulseBitmap -Size $t.size
  try {
    $outPath = Join-Path $publicDir $t.name
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)

    if ($t.size -eq 16) { $png16 = Get-PngBytes -Bitmap $bmp }
    if ($t.size -eq 32) { $png32 = Get-PngBytes -Bitmap $bmp }
  } finally {
    $bmp.Dispose()
  }
}

if (-not $png16 -or -not $png32) {
  throw "Failed to generate PNG buffers for ICO."
}

Write-Ico -OutPath (Join-Path $publicDir 'favicon.ico') -Png16 $png16 -Png32 $png32

Write-Host "Generated favicon assets in public/ (PNG + ICO)."

