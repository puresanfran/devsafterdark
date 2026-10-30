/**
 * Generates public/feed.xml — a valid iTunes/podcast RSS feed.
 * Run with: node scripts/generate-feed.mjs
 * Re-run whenever episodes are added or metadata changes.
 */

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Episode data (keep in sync with app/page.tsx) ────────────────────────────

const EPISODE_TITLES = [
  'You Should Have Been An Astronaut (Pilot)',
  'No higher than Buckingham Palace with Hannah Seligson',
  'The Riches are in the Niches with David Roma',
  "I don't just read. I lead. with Bree Hall",
  'You need the Highlights magazine with Jon McLaren',
  'The Lost (Now Found) Holiday Episode',
  'Shaving the Yak with Chris Riley',
  'Printers Are My Arch Nemesis with Carter McKay',
  'CTRL-ALT-SUGAR with Jana Babouder-Matta',
  '800 Pound Elephant with Isaac Takushi',
  'Community Onion with SJ Morris',
  'The Sad Accountant with BJ Szyjakowski',
  "A Baker's Dozen with Brooke Bond",
  'The Last ActionScript Hero with Teun Rutten',
  "GarageBand Isn't Just a Garage Band with Branden Rogers",
  'A is apple J is for Joomla with Nathan Gifford',
  'Hall of Fame Edition with Anton Bujanowski',
  'Eat Your Vegetables with Caitlin Siegrist',
  'To Be Or Not To Be...Comfortable with Ricky Diep',
  'Spinning Confidence with Ashley Webster',
  'Ride of The Valkyries with Melinda Green',
  'A Cut Above the Rest with Chris Conant',
  'Knight in shining PromptArmor with Vikram Jayanthi',
  'Community Architecture with Jennifer Nixon',
  'Crafting Success with Steve Laham',
  'Rolling In The Deep (Research) with Daniel Jacobson',
  null, // Ep 27 — no audio
  'Be the Hero with Paul Maxwell',
  'SEO in the AI World with Victor Pan',
  'Sandboxes and Smile Files with Denise Thijzen',
  'SEO in the AI World (Part 2) with Michelle Jensen',
  'HubSpot Dev Site: An Origin Story with A.J. and Brooke',
  'Elevate Your (Theme) Game with Elevate Team',
  'A Design Link To The Future with Chad Pierce',
  'Agency Owner to App Builder with Nicole Pereira',
  'Justin In A Box with Justin Givens',
  'Platform first with Karen Ng',
  'Center of Developer Excellence with Zack Wolfson',
  'Intro to Introw with Simon Van Den Hende',
  'Content Creation with Marc D. Hans',
  'The Legend of hapily with Dax Miller',
  'App Certification with The Ecosystem Quality Team',
];

const VOL1_DURATIONS = {
  1:'1:40:13', 2:'1:43:33', 3:'2:04:23', 4:'1:29:17', 5:'1:52:56',
  6:'1:43:26', 7:'1:19:55', 8:'1:10:17', 9:'1:15:59', 10:'1:12:54',
  11:'1:07:01', 12:'1:16:02', 13:'1:06:41', 14:'1:01:57', 15:'1:17:21',
  16:'1:06:29', 17:'1:12:14', 18:'57:16',  19:'1:07:52', 20:'1:00:23',
  21:'1:07:46', 22:'1:07:55', 23:'1:06:06', 24:'1:04:05', 25:'1:06:46',
  26:'1:06:03', 27:'',        28:'1:01:12', 29:'1:06:10', 30:'1:12:29',
  31:'1:08:12', 32:'1:11:50', 33:'1:25:32', 34:'1:18:03', 35:'48:01',
  36:'57:44',  37:'53:53',   38:'1:13:10', 39:'41:53',   40:'56:21',
  41:'57:52',  42:'1:03:53',
};

// Vol 1 YouTube IDs for the 6 most recent episodes
const YT_IDS = {
  42: 'e7jr6gBK7lY',
  41: 'ZexG_hbA17k',
  40: 'gZwRwm1VM9g',
  39: '4r-L2k5tXxU',
  38: 'slH0Iq94axc',
  37: 'ZF08M3-jCYo',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const BLOB_BASE = 'https://pqftev3ixyccqz09.public.blob.vercel-storage.com/episodes/vol1';
const SITE_URL  = 'https://devsafterdark.com';

// Vol 1 started roughly June 2023, ~one episode every 10 days
const VOL1_START = new Date('2023-06-01T02:00:00Z');

function pubDate(epNum) {
  const d = new Date(VOL1_START);
  d.setDate(d.getDate() + (epNum - 1) * 10);
  return d.toUTCString();
}

function pad(n) { return String(n).padStart(3, '0'); }

// Parse "H:MM:SS" or "MM:SS" → total seconds
function toSeconds(dur) {
  if (!dur) return 0;
  const p = dur.split(':').map(Number);
  return p.length === 3 ? p[0]*3600 + p[1]*60 + p[2] : p[0]*60 + p[1];
}

// iTunes expects HH:MM:SS
function itunesDur(dur) {
  if (!dur) return '';
  return dur.split(':').length === 2 ? `00:${dur}` : dur;
}

// Rough MP3 size estimate at 128 kbps (16000 bytes/sec)
function estimateBytes(dur) {
  return toSeconds(dur) * 16000;
}

function esc(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Build episodes ────────────────────────────────────────────────────────────

const episodes = EPISODE_TITLES
  .map((title, i) => {
    const epNum  = i + 1;
    if (!title) return null;                          // skip ep 27
    const dur    = VOL1_DURATIONS[epNum] || '';
    const audio  = epNum !== 27
      ? `${BLOB_BASE}/ep-${pad(epNum)}.mp3`
      : null;
    const ytId   = YT_IDS[epNum] || null;
    return { epNum, title, dur, audio, ytId };
  })
  .filter(Boolean)
  .reverse();                                         // newest first

// ── Render XML ────────────────────────────────────────────────────────────────

const items = episodes.map(ep => {
  const link  = ep.ytId
    ? `https://www.youtube.com/watch?v=${ep.ytId}`
    : `${SITE_URL}/#archive`;
  const bytes = estimateBytes(ep.dur);

  return `
    <item>
      <title>${esc(ep.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="false">devsafterdark-vol1-ep${pad(ep.epNum)}</guid>
      <pubDate>${pubDate(ep.epNum)}</pubDate>
      <description><![CDATA[${ep.title} — Developers After Dark, Volume 1, Episode ${ep.epNum}.]]></description>
      <itunes:episode>${ep.epNum}</itunes:episode>
      <itunes:season>1</itunes:season>
      <itunes:title>${esc(ep.title)}</itunes:title>
      <itunes:duration>${itunesDur(ep.dur)}</itunes:duration>
      <itunes:explicit>no</itunes:explicit>${ep.audio ? `
      <enclosure url="${ep.audio}" length="${bytes}" type="audio/mpeg"/>` : ''}
    </item>`;
}).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
  xmlns:content="http://purl.org/rss/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Developers After Dark</title>
    <link>${SITE_URL}</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>Late-night conversations with the people who keep the internet running while you sleep — the founders, the maintainers, the on-call engineers, and the friends-of-friends with one truly weird production story.</description>
    <language>en-us</language>
    <copyright>© ${new Date().getFullYear()} Developers After Dark</copyright>
    <itunes:author>Nick James LaPorte</itunes:author>
    <itunes:owner>
      <itunes:name>Nick James LaPorte</itunes:name>
      <itunes:email>puresanfran@gmail.com</itunes:email>
    </itunes:owner>
    <itunes:image href="${SITE_URL}/assets/podcast-cover.jpg"/>
    <image>
      <url>${SITE_URL}/assets/podcast-cover.jpg</url>
      <title>Developers After Dark</title>
      <link>${SITE_URL}</link>
    </image>
    <itunes:category text="Technology"/>
    <itunes:explicit>no</itunes:explicit>
    <itunes:type>episodic</itunes:type>
${items}
  </channel>
</rss>`;

const out = join(__dirname, '..', 'public', 'feed.xml');
writeFileSync(out, xml, 'utf8');
console.log(`✓ feed.xml written — ${episodes.length} episodes`);
