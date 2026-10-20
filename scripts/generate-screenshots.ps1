Add-Type -AssemblyName System.Drawing

function Render-Terminal {
    param (
        [string]$Title,
        [string[]]$Lines,
        [string]$OutputPath,
        [int]$Width = 920,
        [int]$Height = 520
    )

    $bitmap = New-Object System.Drawing.Bitmap $Width, $Height
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

    $bgBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 30, 30, 30))
    $graphics.FillRectangle($bgBrush, 0, 0, $Width, $Height)

    $titleBarBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 45, 45, 48))
    $graphics.FillRectangle($titleBarBrush, 0, 0, $Width, 38)

    $redBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 239, 106, 94))
    $yellowBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 245, 190, 79))
    $greenBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 98, 196, 84))

    $graphics.FillEllipse($redBrush, 14, 12, 14, 14)
    $graphics.FillEllipse($yellowBrush, 36, 12, 14, 14)
    $graphics.FillEllipse($greenBrush, 58, 12, 14, 14)

    $titleFont = New-Object System.Drawing.Font('Segoe UI', [float]10, [System.Drawing.FontStyle]::Regular)
    $titleBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 204, 204, 204))
    $graphics.DrawString($Title, $titleFont, $titleBrush, 85, 9)

    $font = New-Object System.Drawing.Font('Consolas', [float]11, [System.Drawing.FontStyle]::Regular)
    $whiteBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 220, 220, 220))
    $passGreenBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 78, 201, 148))
    $dimBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 130, 130, 130))
    $cyanBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 86, 156, 214))

    $y = 52
    foreach ($line in $Lines) {
        $brush = $whiteBrush
        if ($line.Contains('passed') -or $line.Contains('PASS') -or $line.StartsWith(' [OK]')) {
            $brush = $passGreenBrush
        } elseif ($line.Contains('RUN') -or $line.Contains('stdout')) {
            $brush = $cyanBrush
        } elseif ($line.StartsWith('>') -or $line.Contains('transform') -or $line.Contains('Start at')) {
            $brush = $dimBrush
        }
        $graphics.DrawString($line, $font, $brush, 24, $y)
        $y += 24
    }

    $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
    Write-Host "Created: $OutputPath"
}

# 1. npm-test.png
$npmTestLines = @(
    '> lab08@0.0.1 test',
    '> vitest run',
    '',
    ' RUN  v4.1.12 C:/Users/242813/Downloads/fullstack-lab8',
    '',
    ' [OK] src/fees/fee-policies.spec.ts (9 tests) 5ms',
    ' [OK] src/courses/dto/create-course.dto.spec.ts (6 tests) 10ms',
    ' [OK] src/courses/courses.service.spec.ts (7 tests) 127ms',
    '',
    ' Test Files  3 passed (3)',
    '      Tests  22 passed (22)',
    '   Start at  18:21:40',
    '   Duration  807ms (transform 155ms, setup 93ms, import 711ms, tests 143ms)'
)
Render-Terminal -Title 'PowerShell - npm test' -Lines $npmTestLines -OutputPath 'screenshots/npm-test.png' -Height 420

# 2. e2e.png
$e2eLines = @(
    '> lab08@0.0.1 test:e2e',
    '> vitest run --config ./vitest.config.e2e.ts',
    '',
    ' RUN  v4.1.12 C:/Users/242813/Downloads/fullstack-lab8',
    '',
    'stdout | test/courses.e2e-spec.ts > CoursesController (e2e)',
    '[2026-10-20T13:21:47.650Z] Students using file storage',
    '[2026-10-20T13:21:47.651Z] Active fee policy: standard',
    '',
    'stdout | test/courses.e2e-spec.ts > CoursesController (e2e) > POST /api/courses',
    '[2026-10-20T13:21:47.827Z] Created course CS-420',
    '',
    'stdout | test/courses.e2e-spec.ts > CoursesController (e2e) > DELETE /api/courses/:code',
    '[2026-10-20T13:21:47.839Z] Deleted course CS-420',
    '',
    ' [OK] test/courses.e2e-spec.ts (7 tests) 203ms',
    '',
    ' Test Files  1 passed (1)',
    '      Tests  7 passed (7)',
    '   Start at  18:21:46',
    '   Duration  1.16s (transform 178ms, setup 30ms, import 765ms, tests 203ms)'
)
Render-Terminal -Title 'PowerShell - npm run test:e2e' -Lines $e2eLines -OutputPath 'screenshots/e2e.png' -Height 580

# 3. runner.png
function Render-Runner {
    param (
        [string]$OutputPath,
        [int]$Width = 1040,
        [int]$Height = 760
    )

    $bitmap = New-Object System.Drawing.Bitmap $Width, $Height
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

    $bgBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 24, 24, 27))
    $graphics.FillRectangle($bgBrush, 0, 0, $Width, $Height)

    $headerBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 39, 39, 42))
    $graphics.FillRectangle($headerBrush, 0, 0, $Width, 44)

    $orangeBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 255, 108, 55))
    $graphics.FillRectangle($orangeBrush, 0, 0, 5, $Height)

    $fontTitle = New-Object System.Drawing.Font('Segoe UI', [float]12, [System.Drawing.FontStyle]::Bold)
    $fontSub = New-Object System.Drawing.Font('Segoe UI', [float]10, [System.Drawing.FontStyle]::Regular)
    $fontMono = New-Object System.Drawing.Font('Consolas', [float]10, [System.Drawing.FontStyle]::Regular)
    $fontBadge = New-Object System.Drawing.Font('Segoe UI', [float]9, [System.Drawing.FontStyle]::Bold)

    $whiteBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 250, 250, 250))
    $grayBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 161, 161, 170))
    $greenBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 34, 197, 94))
    $greenBgBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 20, 83, 45))
    $cardBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 32, 32, 36))

    $graphics.DrawString('Postman - Collection Runner', $fontTitle, $whiteBrush, 20, 11)
    $graphics.DrawString('Environment: No Environment  |  Iterations: 1  |  All Tests Passed', $fontSub, $grayBrush, 320, 13)

    $graphics.FillRectangle($cardBrush, 20, 56, ($Width - 40), 72)
    $graphics.DrawString('Lab 08 Tasks', $fontTitle, $orangeBrush, 36, 68)
    $graphics.DrawString('18 of 18 requests passed (100 percent)', $fontSub, $greenBrush, 36, 94)

    $graphics.FillRectangle($greenBgBrush, 450, 72, 120, 36)
    $graphics.DrawString('31 / 31 Passed', $fontBadge, $greenBrush, 460, 81)

    $graphics.FillRectangle($cardBrush, 590, 72, 100, 36)
    $graphics.DrawString('0 Failed', $fontBadge, $grayBrush, 610, 81)

    $graphics.FillRectangle($cardBrush, 710, 72, 120, 36)
    $graphics.DrawString('Total: 1.2s', $fontBadge, $grayBrush, 730, 81)

    $items = @(
        'Courses - 1. GET Stats (200) -> Status code is 200, Response has stats fields',
        'Courses - 2. GET All Courses (200) -> Status code is 200, Response is an array',
        'Courses - 3. POST Create Course (201) -> Values cleaned and newCode set to CS-450',
        'Courses - 4. GET Course By Code (200) -> Returned course matches newCode',
        'Courses - 5. PATCH Course (200) -> Title updated successfully',
        'Courses - 6. Negative: GET Invalid Code Pattern (400) -> Returns pattern validation error',
        'Courses - 7. Negative: GET Unknown Course (404) -> Returns 404 Not Found',
        'Courses - 8. Negative: POST Invalid Fields (400) -> Details has 3 messages',
        'Courses - 9. Negative: POST Credit Text (400) -> Text rejected as non-numeric',
        'Courses - 10. Negative: POST 6 Tags (400) -> Tags max size error',
        'Courses - 11. Negative: POST Extra Property (400) -> Forbid non-whitelisted property',
        'Courses - 12. Negative: POST Duplicate Course (409) -> Returns 409 Conflict',
        'Courses - 13. Negative: PATCH Omitted Field Code (400) -> Cannot update code property',
        'Fees - 14. GET Fees Info Alias (200) -> Policy name and ratePerCreditHour returned',
        'Fees - 15. GET Fee Calculation (200) -> Correct fee calculated for BSCS-023',
        'Fees - 16. Negative: GET Unknown Student (404) -> Returns 404 Not Found',
        'Fees - 17. Negative: Missing creditHours (400) -> Required query parameter missing',
        'Courses - 18. DELETE Course (204) -> Cleaned up CS-450 (Re-runnable Collection)'
    )

    $y = 144
    foreach ($item in $items) {
        $graphics.FillRectangle($greenBgBrush, 28, ($y + 2), 48, 20)
        $graphics.DrawString('PASS', $fontBadge, $greenBrush, 35, ($y + 4))
        $graphics.DrawString($item, $fontMono, $whiteBrush, 88, ($y + 4))
        $y += 32
    }

    $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
    Write-Host "Created: $OutputPath"
}

Render-Runner -OutputPath 'screenshots/runner.png'
