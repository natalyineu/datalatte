#!/usr/bin/env node
/**
 * One-time script to get a GSC OAuth2 refresh token.
 * Run locally: node scripts/get-gsc-token.js path/to/oauth-client.json
 *
 * Then add to GitHub Secrets:
 *   GSC_OAUTH_CLIENT_ID
 *   GSC_OAUTH_CLIENT_SECRET
 *   GSC_OAUTH_REFRESH_TOKEN
 */

const https = require('https');
const http  = require('http');
const fs    = require('fs');
const { execSync } = require('child_process');

const clientFile = process.argv[2];
if (!clientFile) {
  console.error('Usage: node scripts/get-gsc-token.js path/to/oauth-client.json');
  process.exit(1);
}

const { installed } = JSON.parse(fs.readFileSync(clientFile, 'utf8'));
const CLIENT_ID     = installed.client_id;
const CLIENT_SECRET = installed.client_secret;
const REDIRECT_URI  = 'http://localhost:4567';

const SCOPES = [
  'https://www.googleapis.com/auth/webmasters.readonly',
  'https://www.googleapis.com/auth/analytics.readonly',
].join(' ');

const authUrl =
  `https://accounts.google.com/o/oauth2/v2/auth` +
  `?client_id=${CLIENT_ID}` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&response_type=code` +
  `&scope=${encodeURIComponent(SCOPES)}` +
  `&access_type=offline` +
  `&prompt=consent`;

console.log('\n📋 Open this URL in your browser:\n');
console.log(authUrl);
console.log('\nWaiting for redirect on http://localhost:4567 ...\n');

// Try to open browser automatically
try { execSync(`open "${authUrl}" 2>/dev/null || xdg-open "${authUrl}" 2>/dev/null || start "${authUrl}"`, { stdio: 'ignore' }); } catch {}

// Local server to catch the redirect
const server = http.createServer(async (req, res) => {
  const code = new URL(req.url, REDIRECT_URI).searchParams.get('code');
  if (!code) { res.end('No code found'); return; }

  res.end('<h2>✅ Authorized! You can close this tab.</h2>');
  server.close();

  // Exchange code for tokens
  const body = new URLSearchParams({
    code,
    client_id:     CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri:  REDIRECT_URI,
    grant_type:    'authorization_code',
  }).toString();

  const tokenRes = await new Promise((resolve, reject) => {
    const r = https.request('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': body.length },
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(JSON.parse(d)));
    });
    r.on('error', reject);
    r.write(body);
    r.end();
  });

  if (!tokenRes.refresh_token) {
    console.error('❌ No refresh_token in response:', tokenRes);
    process.exit(1);
  }

  console.log('\n✅ Success! Add these 3 secrets to GitHub:\n');
  console.log('Secret name              Value');
  console.log('─────────────────────────────────────────────────────');
  console.log(`GSC_OAUTH_CLIENT_ID      ${CLIENT_ID}`);
  console.log(`GSC_OAUTH_CLIENT_SECRET  ${CLIENT_SECRET}`);
  console.log(`GSC_OAUTH_REFRESH_TOKEN  ${tokenRes.refresh_token}`);
  console.log('\nGitHub → Settings → Secrets → Actions → New secret');
});

server.listen(4567);
