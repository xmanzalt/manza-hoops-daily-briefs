#!/usr/bin/env node
/*
 * Manza Hoops — Daily News Database
 * A tiny zero-dependency local server that live-reads the NBA brief files
 * in ../briefs and serves a reader + teleprompter web app.
 *
 * Run:  node server.js   (or double-click the "Start Manza Hoops News.command" file)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const ROOT = __dirname;                                  // .../NBA-Daily/app
const BRIEFS_DIR = path.resolve(ROOT, '..', 'briefs');   // .../NBA-Daily/briefs
const PUBLIC_DIR = path.join(ROOT, 'public');
const DATE_RE = /^\d{4}-\d{2}-\d{2}\.md$/;
const START_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4321;

// ---------- brief parsing ----------
function listBriefFiles() {
  if (!fs.existsSync(BRIEFS_DIR)) return [];
  return fs.readdirSync(BRIEFS_DIR)
    .filter(f => DATE_RE.test(f))
    .sort()
    .reverse();
}

function parseBrief(file) {
  const full = path.join(BRIEFS_DIR, file);
  const md = fs.readFileSync(full, 'utf8');
  const date = file.replace(/\.md$/, '');

  const phaseMatch = md.match(/Phase:\s*\*\*([^*]+)\*\*/i);
  const phase = phaseMatch ? phaseMatch[1].trim() : '';

  const titleMatch = md.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].replace(/[🏀]/g, '').trim() : date;

  // Split off the teleprompter script section
  const scriptHeadingRe = /^##\s*.*TELEPROMPTER SCRIPT.*$/im;
  let script = '';
  const hIdx = md.search(scriptHeadingRe);
  if (hIdx !== -1) {
    let after = md.slice(hIdx).split('\n').slice(1).join('\n');
    script = after
      .split('\n')
      .filter(line => !/^\s*\*[^*].*\*\s*$/.test(line.trim()))
      .filter(line => !/^\s*---\s*$/.test(line))
      .join('\n')
      .trim();
  }

  const youtube = parseYoutube(md, date, phase);

  return { file, date, phase, title, markdown: md, script, youtube };
}

function parseYoutube(md, date, phase) {
  // --- CONTENT ANGLES section ---
  const anglesStart = md.search(/^##\s*.*CONTENT ANGLES/im);
  const titles = [], thumbnails = [], angles = [];
  if (anglesStart !== -1) {
    const lines = md.slice(anglesStart).split('\n').slice(1);
    for (const line of lines) {
      if (/^##\s+/.test(line)) break;
      const titleM = line.match(/Title ideas?:\s*(.*)/i);
      if (titleM) {
        for (const m of titleM[1].matchAll(/\*?"([^"*\n]+)"\*?/g)) {
          const t = m[1].trim(); if (t) titles.push(t);
        }
        continue;
      }
      const thumbM = line.match(/Thumbnail(?:\s+text)?:\s*(.*)/i);
      if (thumbM) {
        for (const m of thumbM[1].matchAll(/`([^`]+)`/g)) {
          const t = m[1].trim(); if (t) thumbnails.push(t);
        }
        continue;
      }
      const bulletM = line.match(/^\s*[-*]\s+(.*)/);
      if (bulletM) {
        const clean = bulletM[1]
          .replace(/\*\*([^*]+)\*\*/g, '$1')
          .replace(/\*([^*]+)\*/g, '$1')
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
          .trim();
        angles.push(clean);
      }
    }
  }

  // --- BREAKING stories for description body ---
  const breakStart = md.search(/^##\s*.*BREAKING/im);
  const breakingBullets = [];
  if (breakStart !== -1) {
    const lines = md.slice(breakStart).split('\n').slice(1);
    for (const line of lines) {
      if (/^##\s+/.test(line) || /^\s*---\s*$/.test(line)) break;
      const m = line.match(/^\s*[-*]\s+(.*)/);
      if (m) {
        const clean = m[1]
          .replace(/\*\*([^*]+)\*\*/g, '$1')
          .replace(/\*([^*]+)\*/g, '$1')
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
          .replace(/→\s*/g, '— ')
          .trim();
        breakingBullets.push(clean);
      }
    }
  }

  // --- Tags: pull bold names + phase keywords ---
  const nameSet = new Set(['NBA', 'basketball', 'Manza Hoops', 'NBA highlights']);
  const skipWords = /^(CONFIRMED|RUMOR|DONE|MAX|BREAKING|FREE AGENCY|AGENT|INJURY|REPORT|LOOKING|CONTENT|SOURCE|TELEPROMPTER|OFFSEASON|REGULAR|SEASON|PLAYOFFS|DRAFT|SUMMER LEAGUE|PRESEASON)$/i;
  for (const m of md.matchAll(/\*\*([A-Z][A-Za-zé'À-ɏ .]{2,28})\*\*/g)) {
    const name = m[1].trim();
    if (!skipWords.test(name) && name.split(/\s+/).length <= 4) nameSet.add(name);
  }
  const year = date.split('-')[0];
  const p = (phase || '').toUpperCase();
  if (p.includes('FREE AGENCY')) { nameSet.add(`NBA free agency ${year}`); nameSet.add(`NBA offseason ${year}`); }
  if (p.includes('SUMMER LEAGUE')) nameSet.add(`NBA Summer League ${year}`);
  if (p.includes('PLAYOFF')) nameSet.add(`NBA playoffs ${year}`);
  if (p.includes('DRAFT')) nameSet.add(`NBA Draft ${year}`);

  const tags = Array.from(nameSet);

  return { titles, thumbnails, angles, breakingBullets, tags };
}

// ---------- http helpers ----------
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };

function sendJson(res, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(body);
}
function send404(res) { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('Not found'); }

function serveStatic(res, file) {
  const ext = path.extname(file).toLowerCase();
  fs.readFile(file, (err, data) => {
    if (err) return send404(res);
    const headers = { 'Content-Type': MIME[ext] || 'application/octet-stream' };
    if (ext === '.html') headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
    res.writeHead(200, headers);
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = decodeURIComponent(parsed.pathname);

  try {
    if (pathname === '/api/briefs') {
      const items = listBriefFiles().map(f => {
        const b = parseBrief(f);
        return { file: b.file, date: b.date, phase: b.phase, title: b.title, hasScript: !!b.script };
      });
      return sendJson(res, { count: items.length, briefs: items });
    }

    if (pathname === '/api/brief') {
      const file = (parsed.query.file || '').toString();
      if (!DATE_RE.test(file)) return send404(res);           // path-safety: only YYYY-MM-DD.md
      const full = path.join(BRIEFS_DIR, file);
      if (!full.startsWith(BRIEFS_DIR) || !fs.existsSync(full)) return send404(res);
      return sendJson(res, parseBrief(file));
    }

    // static
    let rel = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    const filePath = path.join(PUBLIC_DIR, rel);
    if (!filePath.startsWith(PUBLIC_DIR)) return send404(res);
    return serveStatic(res, filePath);
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Server error: ' + e.message);
  }
});

function start(port) {
  server.listen(port);
  server.on('error', err => {
    if (err.code === 'EADDRINUSE' && port < START_PORT + 20) {
      start(port + 1);
    } else {
      console.error('Could not start server:', err.message);
      process.exit(1);
    }
  });
  server.on('listening', () => {
    const p = server.address().port;
    console.log('\n  🏀  Manza Hoops Daily Briefs');
    console.log('  ----------------------------');
    console.log('  Open in your browser:  http://localhost:' + p);
    console.log('  Reading briefs from :  ' + BRIEFS_DIR);
    console.log('  (Press Ctrl+C to stop)\n');
  });
}

start(START_PORT);
