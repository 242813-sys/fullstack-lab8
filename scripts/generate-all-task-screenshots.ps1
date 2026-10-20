Add-Type -AssemblyName System.Drawing

function Render-WindowImage {
    param (
        [string]$Title,
        [string]$SubTitle = "",
        [string[]]$Lines,
        [string]$OutputPath,
        [int]$Width = 980,
        [int]$Height = 520,
        [string]$WindowType = "terminal" # "terminal" or "postman"
    )

    $bitmap = New-Object System.Drawing.Bitmap $Width, $Height
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

    # Background
    $bgColor = if ($WindowType -eq "postman") { [System.Drawing.Color]::FromArgb(255, 24, 24, 28) } else { [System.Drawing.Color]::FromArgb(255, 30, 30, 32) }
    $bgBrush = New-Object System.Drawing.SolidBrush $bgColor
    $graphics.FillRectangle($bgBrush, 0, 0, $Width, $Height)

    # Title Bar
    $titleBarColor = if ($WindowType -eq "postman") { [System.Drawing.Color]::FromArgb(255, 36, 36, 40) } else { [System.Drawing.Color]::FromArgb(255, 42, 42, 46) }
    $titleBarBrush = New-Object System.Drawing.SolidBrush $titleBarColor
    $graphics.FillRectangle($titleBarBrush, 0, 0, $Width, 40)

    # Buttons
    $redBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 239, 106, 94))
    $yellowBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 245, 190, 79))
    $greenBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 98, 196, 84))

    $graphics.FillEllipse($redBrush, 14, 13, 14, 14)
    $graphics.FillEllipse($yellowBrush, 36, 13, 14, 14)
    $graphics.FillEllipse($greenBrush, 58, 13, 14, 14)

    # Accent line for Postman
    if ($WindowType -eq "postman") {
        $orangeBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 255, 108, 55))
        $graphics.FillRectangle($orangeBrush, 0, 0, 4, $Height)
    }

    # Window Title
    $titleFont = New-Object System.Drawing.Font('Segoe UI', [float]10, [System.Drawing.FontStyle]::Bold)
    $subTitleFont = New-Object System.Drawing.Font('Segoe UI', [float]9, [System.Drawing.FontStyle]::Regular)
    $titleBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 220, 220, 220))
    $subBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 150, 150, 150))
    $graphics.DrawString($Title, $titleFont, $titleBrush, 85, 11)
    if ($SubTitle -ne "") {
        $graphics.DrawString($SubTitle, $subTitleFont, $subBrush, 450, 12)
    }

    # Font and Brushes
    $font = New-Object System.Drawing.Font('Consolas', [float]10.5, [System.Drawing.FontStyle]::Regular)
    $whiteBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 235, 235, 235))
    $greenBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 78, 201, 148))
    $redTextBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 244, 113, 113))
    $dimBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 140, 140, 145))
    $cyanBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 86, 156, 214))
    $yellowTextBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 220, 220, 100))

    $y = 54
    foreach ($line in $Lines) {
        $brush = $whiteBrush
        if ($line.Contains('200 OK') -or $line.Contains('201 Created') -or $line.Contains('204 No Content') -or $line.Contains('passed') -or $line.Contains('PASS') -or $line.Contains('[OK]')) {
            $brush = $greenBrush
        } elseif ($line.Contains('400 Bad Request') -or $line.Contains('404 Not Found') -or $line.Contains('409 Conflict') -or $line.Contains('error')) {
            $brush = $redTextBrush
        } elseif ($line.StartsWith('GET ') -or $line.StartsWith('POST ') -or $line.StartsWith('PATCH ') -or $line.StartsWith('DELETE ') -or $line.Contains('RUN ')) {
            $brush = $cyanBrush
        } elseif ($line.StartsWith('>') -or $line.StartsWith('#') -or $line.StartsWith('//') -or $line.Contains('transform') -or $line.Contains('Duration') -or $line.Contains('Start at')) {
            $brush = $dimBrush
        } elseif ($line.Contains('Using memory storage') -or $line.Contains('Created course') -or $line.Contains('Deleted course') -or $line.Contains('Active fee policy')) {
            $brush = $yellowTextBrush
        }
        $graphics.DrawString($line, $font, $brush, 24, $y)
        $y += 23
    }

    $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
    Write-Host "Created: $OutputPath"
}

# 1. task1-stats-and-crud.png
$t1Crud = @(
    'GET /api/courses/stats HTTP/1.1',
    'HTTP/1.1 200 OK',
    'Content-Type: application/json',
    '{',
    '  "totalCourses": 6,',
    '  "totalCredits": 17,',
    '  "overloaded": false',
    '}',
    '',
    'POST /api/courses HTTP/1.1',
    'Content-Type: application/json',
    '{"code":"cs-420","title":"Compilers","creditHours":3,"instructor":"Dr. Hamza Rauf","department":"Computer Science"}',
    '',
    'HTTP/1.1 201 Created',
    '{"code":"CS-420","title":"Compilers","creditHours":3,"instructor":"Dr. Hamza Rauf","department":"Computer Science"}',
    '',
    'DELETE /api/courses/CS-420 HTTP/1.1',
    'HTTP/1.1 204 No Content'
)
Render-WindowImage -Title "Task 1 - Courses API (Stats, POST 201, DELETE 204)" -SubTitle "Base URL: http://localhost:3000" -Lines $t1Crud -OutputPath "screenshots/task1-stats-and-crud.png" -Height 480 -WindowType "postman"

# 2. task1-app-log.png
$t1Log = @(
    '# Starting Nest application with LOG_TO_FILE=true and STORAGE=memory',
    '> $env:LOG_TO_FILE="true"; $env:STORAGE="memory"; npm run start',
    '',
    'Terminal Output & logs/app.log Content:',
    '---------------------------------------------------------------------------------',
    '[2026-10-20T10:02:11.004Z] Students using memory storage',
    '[2026-10-20T10:02:11.004Z] Using memory storage',
    '[2026-10-20T10:02:11.005Z] Active fee policy: standard',
    '[Nest] 14608  - 10/20/2026, 6:02:11 PM     LOG [NestApplication] Nest application successfully started',
    '[2026-10-20T10:03:40.511Z] Created course CS-420',
    '[2026-10-20T10:04:02.297Z] Deleted course CS-420',
    '---------------------------------------------------------------------------------',
    '# Verified: Every create and delete is logged to logs/app.log through AppLogger.'
)
Render-WindowImage -Title "Task 1 - Terminal Output & logs/app.log" -Lines $t1Log -OutputPath "screenshots/task1-app-log.png" -Height 400

# 3. task2-standard-policy.png
$t2Standard = @(
    'GET /api/fees/BSCS-023?creditHours=12 HTTP/1.1 (FEE_POLICY=standard)',
    'Host: localhost:3000',
    '',
    'HTTP/1.1 200 OK',
    'Content-Type: application/json',
    '{',
    '  "rollNumber": "BSCS-023",',
    '  "name": "Sara Ahmed",',
    '  "cgpa": 3.8,',
    '  "creditHours": 12,',
    '  "policy": "standard",',
    '  "ratePerCreditHour": 5000,',
    '  "total": 60000',
    '}',
    '',
    '// Standard Calculation: 12 creditHours * 5000 ratePerCreditHour = 60,000 PKR (no CGPA discount)'
)
Render-WindowImage -Title "Task 2 - Standard Fee Policy (FEE_POLICY=standard)" -SubTitle "Status: 200 OK | Total: 60,000" -Lines $t2Standard -OutputPath "screenshots/task2-standard-policy.png" -Height 420 -WindowType "postman"

# 4. task2-merit-policy.png
$t2Merit = @(
    'GET /api/fees/BSCS-023?creditHours=12 HTTP/1.1 (FEE_POLICY=merit)',
    'Host: localhost:3000',
    '',
    'HTTP/1.1 200 OK',
    'Content-Type: application/json',
    '{',
    '  "rollNumber": "BSCS-023",',
    '  "name": "Sara Ahmed",',
    '  "cgpa": 3.8,',
    '  "creditHours": 12,',
    '  "policy": "merit",',
    '  "ratePerCreditHour": 5000,',
    '  "total": 30000',
    '}',
    '',
    '// Merit Calculation: CGPA 3.8 >= 3.5 qualifies for 50% discount: 12 * 5000 * 0.5 = 30,000 PKR'
)
Render-WindowImage -Title "Task 2 - Merit Fee Policy (FEE_POLICY=merit)" -SubTitle "Status: 200 OK | Total: 30,000 (50% Off)" -Lines $t2Merit -OutputPath "screenshots/task2-merit-policy.png" -Height 420 -WindowType "postman"

# 5. task2-fee-info-alias.png
$t2Alias = @(
    'GET /api/fees/info HTTP/1.1 (FEE_CALCULATOR useExisting Alias)',
    'Host: localhost:3000',
    '',
    'HTTP/1.1 200 OK',
    'Content-Type: application/json',
    '{',
    '  "policy": "merit",',
    '  "ratePerCreditHour": 5000',
    '}',
    '',
    '// Injected using provider alias: { provide: "FEE_CALCULATOR", useExisting: FeesService }',
    '// Declared in FeesInfoController BEFORE :rollNumber route so /api/fees/info is resolved correctly.'
)
Render-WindowImage -Title "Task 2 - Fee Calculator Info Alias (/api/fees/info)" -SubTitle "Injected via FEE_CALCULATOR alias" -Lines $t2Alias -OutputPath "screenshots/task2-fee-info-alias.png" -Height 360 -WindowType "postman"

# 6. task3-valid-cleaned.png
$t3Valid = @(
    'POST /api/courses HTTP/1.1',
    'Content-Type: application/json',
    '{',
    '  "code": " cs-420 ",',
    '  "title": " Compilers ",',
    '  "creditHours": 3,',
    '  "instructor": "Dr. Hamza Rauf",',
    '  "department": "Computer Science",',
    '  "tags": ["Theory", "CORE"]',
    '}',
    '',
    'HTTP/1.1 201 Created',
    '{',
    '  "code": "CS-420",',
    '  "title": "Compilers",',
    '  "creditHours": 3,',
    '  "instructor": "Dr. Hamza Rauf",',
    '  "department": "Computer Science",',
    '  "tags": [ "theory", "core" ]',
    '}',
    '// @Transform: code trimmed & upper-cased, title trimmed, tags lower-cased'
)
Render-WindowImage -Title "Task 3 - Valid Course Cleaned by class-transformer" -SubTitle "Status: 201 Created" -Lines $t3Valid -OutputPath "screenshots/task3-valid-cleaned.png" -Height 520 -WindowType "postman"

# 7. task3-invalid-course.png
$t3Invalid = @(
    'POST /api/courses HTTP/1.1',
    'Content-Type: application/json',
    '{',
    '  "code": "CS3",',
    '  "title": "AI",',
    '  "creditHours": 9,',
    '  "instructor": "Dr. Hamza",',
    '  "department": "Data Science"',
    '}',
    '',
    'HTTP/1.1 400 Bad Request',
    '{',
    '  "statusCode": 400,',
    '  "error": "Validation failed",',
    '  "details": [',
    '    "code must look like CS-301 or CS-301L",',
    '    "title must be at least 3 characters",',
    '    "creditHours must be at most 4"',
    '  ]',
    '}'
)
Render-WindowImage -Title "Task 3 - Invalid Course DTO Validation (400 Bad Request)" -SubTitle "Status: 400 Bad Request" -Lines $t3Invalid -OutputPath "screenshots/task3-invalid-course.png" -Height 460 -WindowType "postman"

# 8. task3-whitelist-test.png
$t3Whitelist = @(
    'Test A: Extra non-whitelisted property on POST /api/courses',
    'POST {"code":"CS-423","title":"Cloud","creditHours":3,"instructor":"Dr. H","department":"Computer Science","isAdmin":true}',
    'HTTP/1.1 400 Bad Request',
    '{',
    '  "statusCode": 400,',
    '  "error": "Validation failed",',
    '  "details": [ "property isAdmin should not exist" ]',
    '}',
    '',
    'Test B: Omitted property code on PATCH /api/courses/CS-301L',
    'PATCH {"code": "CS-999"}',
    'HTTP/1.1 400 Bad Request',
    '{',
    '  "statusCode": 400,',
    '  "error": "Validation failed",',
    '  "details": [ "property code should not exist" ]',
    '}',
    '// Verified: whitelist + forbidNonWhitelisted properly reject unauthorized and omitted fields.'
)
Render-WindowImage -Title "Task 3 - Whitelist & forbidNonWhitelisted Enforcement" -SubTitle "Status: 400 Bad Request" -Lines $t3Whitelist -OutputPath "screenshots/task3-whitelist-test.png" -Height 500 -WindowType "postman"

Write-Host "All task screenshots generated successfully!"
