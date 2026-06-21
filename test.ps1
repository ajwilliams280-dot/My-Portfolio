$r = Invoke-WebRequest -Uri 'https://www.tiktok.com/@altons_tech_tips/video/7648751871364058388' -UseBasicParsing -Headers @{
  'User-Agent'='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
  'Accept-Language'='en-US,en;q=0.9';
  'Accept'='text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
}
if ($r.Content -match '<title[^>]*>([^<]+)</title>') {
  Write-Output $matches[1]
} else {
  Write-Output 'fail'
}
