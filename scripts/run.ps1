param(
    [string]$df = "docker-compose.yml",
    [string]$ef = ".env.docker",
    [switch]$wm = $false
)

Set-Location (Resolve-Path "$PSScriptRoot\..")

if (Test-Path $ef) {
    Write-Host "Loading environment variables from $ef..." -ForegroundColor Cyan
    Get-Content $ef | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            [System.Environment]::SetEnvironmentVariable($key, $value, "Process")
        }
    }
}
else {
    Write-Host "Env file $ef not found. Skipping environment loading." -ForegroundColor Yellow
}

Write-Host "Starting docker-compose with file $df..." -ForegroundColor Green
docker compose -f $df --env-file $ef up -d

if ($wm) {
    Write-Host "Running database migrations with Liquibase..." -ForegroundColor Magenta

    $migrations = @(
        @{ Name = "profile"; VolumeRelative = "./backend/profile/migrations/changelog"; DbNameEnv = $env:PROFILE_DB_NAME; DbUserEnv = $env:PROFILE_DB_USER; DbPassEnv = $env:PROFILE_DB_PASS },
        @{ Name = "learning"; VolumeRelative = "./backend/learning/migrations/changelog"; DbNameEnv = $env:LEARNING_DB_NAME; DbUserEnv = $env:LEARNING_DB_USER; DbPassEnv = $env:LEARNING_DB_PASS },
        @{ Name = "scheduling"; VolumeRelative = "./backend/scheduling/migrations/changelog"; DbNameEnv = $env:SCHEDULING_DB_NAME; DbUserEnv = $env:SCHEDULING_DB_USER; DbPassEnv = $env:SCHEDULING_DB_PASS },
        @{ Name = "payment"; VolumeRelative = "./backend/payment/migrations/changelog"; DbNameEnv = $env:PAYMENT_DB_NAME; DbUserEnv = $env:PAYMENT_DB_USER; DbPassEnv = $env:PAYMENT_DB_PASS }
    )

    function Invoke-LiquibaseMigration {
        param(
            [string]$Name,
            [string]$VolumeRelative,
            [string]$DbNameEnv,
            [string]$DbUserEnv,
            [string]$DbPassEnv
        )
    
        $volumeAbsolute = (Resolve-Path $VolumeRelative).Path
    
        Write-Host "Running migration for $Name... $volumeAbsolute" -ForegroundColor Cyan
    
        docker run --rm `
            --network "microservices-net" `
            -v "${volumeAbsolute}:/liquibase/changelog" `
            liquibase/liquibase:4.31.1-alpine `
            --search-path=/liquibase/changelog `
            --changelog-file=db.changelog-master.xml `
            --url="jdbc:postgresql://postgres:5432/$DbNameEnv" `
            --username="$DbUserEnv" `
            --password="$DbPassEnv" `
            update
    
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Migration for $Name failed." -ForegroundColor Red
        }
        else {
            Write-Host "Migration for $Name completed successfully." -ForegroundColor Green
        }
    }

    foreach ($migration in $migrations) {
        Invoke-LiquibaseMigration -Name $migration.Name `
            -VolumeRelative $migration.VolumeRelative `
            -DbNameEnv $migration.DbNameEnv `
            -DbUserEnv $migration.DbUserEnv `
            -DbPassEnv $migration.DbPassEnv
    }
}