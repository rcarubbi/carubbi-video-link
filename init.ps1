
docker-compose up -d signaling-server ngrok --build

Write-Host "Waiting for ngrok to start..."
Start-Sleep -Seconds 5

Write-Host "fetching signaling ngrok url..."
$response = Invoke-RestMethod -Uri http://localhost:4040/api/tunnels

$signalingUrl = $response.tunnels | Where-Object { $_.name -eq "signaling-server" } | Select-Object -ExpandProperty public_url

if (!$signalingUrl) {
    Write-Error "Error fetching ngrok url."
    exit 1
}

Write-Host "ngrok url for signaling server: $signalingUrl"
 
$signalingUrl = $signalingUrl -replace "https", "wss"
$signalingUrl = $signalingUrl -replace "http", "ws"


$env:SIGNALING_SERVER_URL = $signalingUrl
Write-Host "Variable SIGNALING_SERVER_URL set: $env:SIGNALING_SERVER_URL"

docker-compose up -d frontend --build
