'use client';

import { useEffect } from 'react';

function closeMobileMenu() {
  document.getElementById('mobileMenu')?.classList.remove('open');
  const btn = document.getElementById('hamburgerBtn');
  if (btn) btn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

export default function Home() {
  useEffect(() => {
    const EPISODE_TITLES = [
      // Vol 1
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
      'Coming Soon', // Ep 27 — missing audio
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
    function extractGuest(title: string): string {
      const m = title.match(/\bwith\s+(.+)$/i);
      return m ? m[1] : '';
    }

    const VOL1_DURATIONS: Record<number, string> = {
      1:'1:40:13', 2:'1:43:33', 3:'2:04:23', 4:'1:29:17', 5:'1:52:56',
      6:'1:43:26', 7:'1:19:55', 8:'1:10:17', 9:'1:15:59', 10:'1:12:54',
      11:'1:07:01', 12:'1:16:02', 13:'1:06:41', 14:'1:01:57', 15:'1:17:21',
      16:'1:06:29', 17:'1:12:14', 18:'57:16',  19:'1:07:52', 20:'1:00:23',
      21:'1:07:46', 22:'1:07:55', 23:'1:06:06', 24:'1:04:05', 25:'1:06:46',
      26:'1:06:03', 27:'',         28:'1:01:12', 29:'1:06:10', 30:'1:12:29',
      31:'1:08:12', 32:'1:11:50', 33:'1:25:32', 34:'1:18:03', 35:'48:01',
      36:'57:44',   37:'53:53',   38:'1:13:10', 39:'41:53',   40:'56:21',
      41:'57:52',   42:'1:03:53',
    };

    const EPISODES = EPISODE_TITLES.map((title, i) => {
      const volume = 1;
      const volEpNum = i + 1;
      const guest = extractGuest(title);
      const paddedVolEp = String(volEpNum).padStart(3, '0');
      const audioUrl = volume === 1 && volEpNum !== 27
        ? `https://pqftev3ixyccqz09.public.blob.vercel-storage.com/episodes/vol1/ep-${paddedVolEp}.mp3`
        : null;
      return {
        num: i + 1, volume, volEpNum, title, guest,
        duration: volume === 1 ? (VOL1_DURATIONS[volEpNum] ?? '') : '',
        audioUrl,
      };
    }).sort((a, b) => b.num - a.num);

    /* ── Archive ── */
    let visibleCount = 10;
    let activeVol = 'all';
    let searchQ = '';
    let currentlyPlayingEl: HTMLButtonElement | null = null;

    function renderArchive() {
      const list = document.getElementById('archiveList') as HTMLElement;
      const countEl = document.getElementById('archiveCount') as HTMLElement;
      const showMoreBtn = document.getElementById('showMore') as HTMLButtonElement;

      const filtered = EPISODES.filter(ep => {
        const matchVol = activeVol === 'all' || ep.volume === Number(activeVol);
        const q = searchQ.toLowerCase();
        const matchSearch = !q || ep.title.toLowerCase().includes(q) || ep.guest.toLowerCase().includes(q);
        return matchVol && matchSearch;
      });

      countEl.textContent = `${filtered.length} episode${filtered.length !== 1 ? 's' : ''}`;

      const headerEl = document.getElementById('archiveHeader') as HTMLElement;
      if (headerEl) {
        const volLabel = activeVol === 'all' ? 'All Volumes' : `Vol. ${activeVol}`;
        const count = filtered.length;
        headerEl.innerHTML = `${volLabel}: <em>${count}</em> episode${count !== 1 ? 's' : ''}.`;
      }

      const showing = filtered.slice(0, visibleCount);

      if (filtered.length === 0) {
        list.innerHTML = '<div class="archive-empty">No episodes match that search.</div>';
        showMoreBtn.style.display = 'none';
        return;
      }

      list.innerHTML = showing.map(ep => `
        <div class="archive-row" data-ep="${ep.num}" role="listitem" tabindex="0" aria-label="Vol ${ep.volume} Episode ${ep.volEpNum}: ${ep.title}">
          <span class="num">${String(ep.volEpNum).padStart(3,'0')}</span>
          <button class="pp" data-ep="${ep.num}" aria-label="Play episode ${ep.volEpNum}">▶</button>
          <div>
            <div class="title">${ep.title}</div>
            <div class="card-tags" style="margin-top:8px;"><span class="tag">Vol. ${ep.volume}</span></div>
          </div>
          <div class="guest">${ep.guest ? ep.guest : '—'}</div>
          <div class="dur">${ep.duration}</div>
        </div>
      `).join('');

      showMoreBtn.style.display = filtered.length > visibleCount ? 'block' : 'none';

      list.querySelectorAll('.pp').forEach(btn => {
        btn.addEventListener('click', e => {
          e.stopPropagation();
          const epNum = (btn as HTMLElement).dataset.ep;
          const ep = EPISODES.find(e => String(e.num) === epNum);
          if (ep) triggerPlay(ep, btn as HTMLButtonElement);
        });
      });

      list.querySelectorAll('.archive-row').forEach(row => {
        row.addEventListener('keydown', e => {
          if ((e as KeyboardEvent).key === 'Enter') (row.querySelector('.pp') as HTMLElement)?.click();
        });
      });
    }

    /* ── Audio engine ── */
    const audio = new Audio();
    audio.preload = 'none';

    function formatTime(secs: number) {
      const m = Math.floor(secs / 60);
      const s = Math.floor(secs % 60);
      return `${m}:${String(s).padStart(2, '0')}`;
    }

    audio.addEventListener('timeupdate', () => {
      if (!audio.duration) return;
      const pct = (audio.currentTime / audio.duration) * 100;
      (document.getElementById('miniProgressFill') as HTMLElement).style.width = pct + '%';
      (document.getElementById('miniProgress') as HTMLElement)?.setAttribute('aria-valuenow', String(Math.round(pct)));
      const timeStr = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
      const timeEl = document.getElementById('miniTime');
      if (timeEl) timeEl.textContent = timeStr;
      const hpcTimeEl = document.getElementById('hpcTime');
      if (hpcTimeEl) hpcTimeEl.textContent = timeStr;
    });

    document.getElementById('miniProgress')?.addEventListener('click', (e) => {
      const bar = e.currentTarget as HTMLElement;
      const rect = bar.getBoundingClientRect();
      const pct = ((e as MouseEvent).clientX - rect.left) / rect.width;
      if (audio.duration) audio.currentTime = pct * audio.duration;
    });

    document.getElementById('miniVolume')?.addEventListener('input', (e) => {
      audio.volume = Number((e.target as HTMLInputElement).value);
    });

    document.getElementById('miniSkipBack')?.addEventListener('click', () => {
      audio.currentTime = Math.max(0, audio.currentTime - 15);
    });
    document.getElementById('hpcSkipBack')?.addEventListener('click', () => {
      audio.currentTime = Math.max(0, audio.currentTime - 15);
    });
    document.getElementById('hpcSkipFwd')?.addEventListener('click', () => {
      if (audio.duration) audio.currentTime = Math.min(audio.duration, audio.currentTime + 15);
    });

    document.getElementById('miniSkipFwd')?.addEventListener('click', () => {
      audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 15);
    });

    audio.addEventListener('ended', () => {
      (document.getElementById('miniProgressFill') as HTMLElement).style.width = '0%';
      (document.getElementById('miniPlayBtn') as HTMLButtonElement).textContent = '▶';
      if (currentlyPlayingEl) { currentlyPlayingEl.textContent = '▶'; currentlyPlayingEl.classList.remove('playing'); currentlyPlayingEl = null; }
      (document.getElementById('playBtn') as HTMLButtonElement).textContent = '▶';
      (document.getElementById('playBtn') as HTMLButtonElement).classList.remove('playing');
    });

    function triggerPlay(ep: typeof EPISODES[0], btnEl: HTMLButtonElement) {
      if (currentlyPlayingEl && currentlyPlayingEl !== btnEl) {
        currentlyPlayingEl.textContent = '▶';
        currentlyPlayingEl.classList.remove('playing');
      }
      const isPlaying = btnEl.classList.contains('playing');
      if (isPlaying) {
        audio.pause();
        btnEl.textContent = '▶';
        btnEl.classList.remove('playing');
        currentlyPlayingEl = null;
        (document.getElementById('miniPlayBtn') as HTMLButtonElement).textContent = '▶';
      } else {
        btnEl.textContent = '❚❚';
        btnEl.classList.add('playing');
        currentlyPlayingEl = btnEl;
        showMiniPlayer(ep);
        if (ep.audioUrl) { audio.src = ep.audioUrl; audio.play().catch(() => {}); }
      }
    }

    function showMiniPlayer(ep: typeof EPISODES[0]) {
      const mp = document.getElementById('miniPlayer') as HTMLElement;
      (document.querySelector('.mini-player-info .ep-label') as HTMLElement).textContent = `Vol. ${ep.volume} · EP ${String(ep.volEpNum).padStart(3,'0')}`;
      (document.querySelector('.mini-player-info .ep-title') as HTMLElement).textContent = `"${ep.title}" — ${ep.guest}`;
      mp.classList.add('visible');
      (document.getElementById('miniPlayBtn') as HTMLButtonElement).textContent = '❚❚';
      const hpcShowEl = document.getElementById('hpcShow');
      if (hpcShowEl) hpcShowEl.textContent = `EP ${String(ep.volEpNum).padStart(3,'0')} · Developers:After Dark`;
      const hpcTitleEl = document.getElementById('hpcTitle');
      if (hpcTitleEl) hpcTitleEl.textContent = ep.title;
      const hpcPlay = document.getElementById('playBtn') as HTMLButtonElement;
      if (hpcPlay) { hpcPlay.textContent = '❚❚'; hpcPlay.classList.add('playing'); }
    }

    document.getElementById('miniPlayBtn')?.addEventListener('click', () => {
      if (audio.paused) {
        audio.play().catch(() => {});
        (document.getElementById('miniPlayBtn') as HTMLButtonElement).textContent = '❚❚';
        if (currentlyPlayingEl) currentlyPlayingEl.textContent = '❚❚';
      } else {
        audio.pause();
        (document.getElementById('miniPlayBtn') as HTMLButtonElement).textContent = '▶';
        if (currentlyPlayingEl) currentlyPlayingEl.textContent = '▶';
      }
    });

    document.getElementById('miniClose')?.addEventListener('click', () => {
      audio.pause();
      audio.src = '';
      (document.getElementById('miniPlayer') as HTMLElement).classList.remove('visible');
      (document.getElementById('miniProgressFill') as HTMLElement).style.width = '0%';
      if (currentlyPlayingEl) { currentlyPlayingEl.textContent = '▶'; currentlyPlayingEl.classList.remove('playing'); currentlyPlayingEl = null; }
      (document.getElementById('playBtn') as HTMLButtonElement).textContent = '▶';
      (document.getElementById('playBtn') as HTMLButtonElement).classList.remove('playing');
    });

    /* ── Hero play (latest episode with audio) ── */
    const latestEp = [...EPISODES].reverse().find(ep => ep.audioUrl) ?? null;
    document.getElementById('playBtn')?.addEventListener('click', () => {
      if (!latestEp) return;
      const heroBtn = document.getElementById('playBtn') as HTMLButtonElement;
      const isPlaying = heroBtn.classList.contains('playing');
      if (isPlaying) {
        audio.pause();
        heroBtn.textContent = '▶';
        heroBtn.classList.remove('playing');
        (document.getElementById('miniPlayBtn') as HTMLButtonElement).textContent = '▶';
      } else {
        if (audio.src !== latestEp.audioUrl) { audio.src = latestEp.audioUrl!; }
        audio.play().catch(() => {});
        heroBtn.textContent = '❚❚';
        heroBtn.classList.add('playing');
        showMiniPlayer(latestEp);
      }
    });

    /* ── Filter + search ── */
    document.getElementById('volChips')?.addEventListener('click', e => {
      const chip = (e.target as HTMLElement).closest('.fchip') as HTMLElement;
      if (!chip) return;
      document.querySelectorAll('#volChips .fchip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeVol = chip.dataset.vol || 'all';
      visibleCount = 10;
      renderArchive();
    });

    document.getElementById('filterChips')?.addEventListener('click', e => {
      const chip = (e.target as HTMLElement).closest('.fchip') as HTMLElement;
      if (!chip) return;
      document.querySelectorAll('#filterChips .fchip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      visibleCount = 10;
      renderArchive();
    });

    let searchTimer: ReturnType<typeof setTimeout>;
    document.getElementById('searchInput')?.addEventListener('input', e => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => { searchQ = (e.target as HTMLInputElement).value; visibleCount = 10; renderArchive(); }, 200);
    });

    document.getElementById('showMore')?.addEventListener('click', () => { visibleCount += 10; renderArchive(); });

    /* ── Pitch form ── */
    document.getElementById('pitchForm')?.addEventListener('submit', e => {
      e.preventDefault();
      (document.getElementById('pitchForm') as HTMLElement).style.display = 'none';
      const thanks = document.getElementById('thanks') as HTMLElement;
      thanks.classList.add('show');
      thanks.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });


    /* ── Media masonry show-more ── */
    const MEDIA_INITIAL = 10;
    const mediaItems = document.querySelectorAll('[data-midx]');
    const mediaShowMoreBtn = document.getElementById('mediaShowMore') as HTMLButtonElement;
    mediaItems.forEach(el => {
      const idx = parseInt((el as HTMLElement).dataset.midx || '0', 10);
      if (idx >= MEDIA_INITIAL) el.classList.add('media-hidden');
    });
    if (mediaItems.length <= MEDIA_INITIAL) mediaShowMoreBtn.style.display = 'none';
    mediaShowMoreBtn?.addEventListener('click', () => {
      document.querySelectorAll('.media-hidden').forEach(el => el.classList.remove('media-hidden'));
      mediaShowMoreBtn.style.display = 'none';
    });

    /* ── Nav scroll + active section ── */
    const nav = document.getElementById('mainNav') as HTMLElement;
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = ['latest','archive','hosts','pitch','shorts'];
    const handleScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 80);
      const heroHeight = (document.querySelector('.hero') as HTMLElement).offsetHeight;
      if (window.scrollY > heroHeight * 0.8 && !audio.paused) {
        (document.getElementById('miniPlayer') as HTMLElement).classList.add('visible');
      }
      let current = '';
      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 120) current = id;
      });
      navLinks.forEach(a => a.classList.toggle('active', !!current && a.getAttribute('href') === '#' + current));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    /* ── Mobile menu ── */
    document.getElementById('hamburgerBtn')?.addEventListener('click', () => {
      const open = (document.getElementById('mobileMenu') as HTMLElement).classList.toggle('open');
      const btn = document.getElementById('hamburgerBtn') as HTMLButtonElement;
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.style.overflow = open ? 'hidden' : '';
    });

    /* ── Parallax ── */
    const heroBg = document.getElementById('heroBg') as HTMLElement;
    const handleParallax = () => {
      const y = window.scrollY;
      if (y < window.innerHeight * 1.3) heroBg.style.transform = `scale(1.04) translateY(${y * 0.1}px)`;
    };
    window.addEventListener('scroll', handleParallax, { passive: true });

    /* ── Live clock ── */
    function updateClock() {
      const now = new Date();
      const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      const h = now.getHours();
      const m = String(now.getMinutes()).padStart(2,'0');
      const ampm = h >= 12 ? 'PM' : 'AM';
      const h12 = String(h % 12 || 12).padStart(2,'0');
      const el = document.getElementById('liveTime');
      if (el) el.textContent = `${days[now.getDay()]} · ${h12}:${m} ${ampm}`;
    }
    updateClock();
    const clockInterval = setInterval(updateClock, 30000);

    renderArchive();

    /* ── Vol 2 countdown ── */
    const vol2Target = new Date('2026-08-01T00:00:00').getTime();
    function updateCountdown() {
      const diff = vol2Target - Date.now();
      if (diff <= 0) {
        document.getElementById('vol2Countdown')!.textContent = 'It\'s here!';
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      const pad = (n: number) => String(n).padStart(2, '0');
      (document.getElementById('cdDays') as HTMLElement).textContent = String(d);
      (document.getElementById('cdHours') as HTMLElement).textContent = pad(h);
      (document.getElementById('cdMins') as HTMLElement).textContent = pad(m);
      (document.getElementById('cdSecs') as HTMLElement).textContent = pad(s);
    }
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleParallax);
      clearInterval(clockInterval);
      clearInterval(countdownInterval);
      audio.pause();
    };
  }, []);

  return (
    <>
      {/* MOBILE MENU */}
      <div className="mobile-menu" id="mobileMenu" role="dialog" aria-label="Navigation menu">
        <button className="mobile-menu-close" id="mobileMenuClose" aria-label="Close menu">✕</button>
        <a href="#latest" onClick={closeMobileMenu}>The Latest</a>
        <a href="#archive" onClick={closeMobileMenu}>Audio Archive</a>
        <a href="#hosts" onClick={closeMobileMenu}>The Hosts</a>
        <a href="#pitch" onClick={closeMobileMenu}>Be a Guest</a>
        <a href="#shorts" onClick={closeMobileMenu}>Media</a>
      </div>

      {/* NAV */}
      <header className="nav" id="mainNav">
        <div className="nav-brand">
          <a href="#" className="wordmark">Devs<em>After</em>Dark</a>
        </div>
        <nav className="nav-links" aria-label="Primary navigation">
          <a href="#latest">The Latest</a>
          <a href="#archive">Audio Archive</a>
          <a href="#hosts">The Hosts</a>
          <a href="#pitch">Be a Guest</a>
          <a href="#shorts">Media</a>
        </nav>
        <div className="nav-cta">
          <a href="https://www.youtube.com/@devsafterdark" target="_blank" rel="noopener noreferrer" className="btn btn-ghost hide-sm" style={{display:'inline-flex',alignItems:'center',gap:'6px'}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/></svg>
            Watch
          </a>
          {/* <button className="btn">Subscribe</button> */}
          <button className="hamburger" id="hamburgerBtn" aria-label="Open menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="hero" aria-label="Hero">
        <div className="hero-bg-wrap">
          <div className="hero-bg" id="heroBg" aria-hidden="true"></div>
          <div className="hero-grain" aria-hidden="true"></div>
        </div>
        <div className="hero-inner">

          <div className="hero-stage">
            <div className="eyebrow mono fade-up fade-up-1">A podcast for night-shift builders</div>
            <h1 className="headline fade-up fade-up-2">
              The internet,<br />
              <em>after</em> bedtime.
            </h1>
            <p className="deck fade-up fade-up-3">
              Late-night conversations with the people who keep the internet running while you sleep: the founders, the maintainers, the on-call engineers, and the friends-of-friends with one truly weird production story.
            </p>
            <div className="hero-actions fade-up fade-up-4">
              <a href="#archive" className="btn btn-ghost">Browse the Audio Archive →</a>
              <div className="vol2-inline mono" aria-label="Volume 2 teaser">
                <span className="vol2-label">Vol. 02</span>
                <span className="vol2-countdown" id="vol2Countdown">
                  <span><span id="cdDays">--</span><span className="cd-unit">d</span></span>
                  <span className="cd-sep">:</span>
                  <span><span id="cdHours">--</span><span className="cd-unit">h</span></span>
                  <span className="cd-sep">:</span>
                  <span><span id="cdMins">--</span><span className="cd-unit">m</span></span>
                  <span className="cd-sep">:</span>
                  <span><span id="cdSecs">--</span><span className="cd-unit">s</span></span>
                </span>
              </div>
            </div>
          </div>
          <div className="hero-foot mono">
            <span>Recorded between deploys. Edited on cold brew.</span>
            <span className="scroll-cue" aria-hidden="true"><span>Scroll</span><span className="line"></span></span>
            <span className="col-r">New episodes · Weekly</span>
          </div>
        </div>
        <div className="hero-player-card" id="heroPlayerCard">
          <div className="hpc-art">
            <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect x="0" y="6" width="3" height="8" rx="1.5" fill="var(--accent)"/>
              <rect x="5" y="2" width="3" height="16" rx="1.5" fill="var(--accent)"/>
              <rect x="10" y="0" width="3" height="20" rx="1.5" fill="var(--accent)"/>
              <rect x="15" y="3" width="3" height="14" rx="1.5" fill="var(--accent)"/>
              <rect x="20" y="7" width="3" height="6" rx="1.5" fill="var(--accent)" opacity="0.6"/>
            </svg>
          </div>
          <div className="hpc-info">
            <div className="hpc-show mono" id="hpcShow">EP 042 · Developers:After Dark</div>
            <div className="hpc-title" id="hpcTitle">App Certification with The Ecosystem Quality Team</div>
          </div>
          <div className="hpc-right">
            <div className="hpc-time mono" id="hpcTime">0:00 / 1:03:53</div>
            <div className="hpc-btns">
              <button className="hpc-skip" id="hpcSkipBack" aria-label="Skip back 15 seconds">
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 4V1L8 5.5 13 10V7c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.14-7-7H4c0 4.97 4.03 9 9 9s9-4.03 9-9-4.03-9-9-9z" fill="currentColor"/>
                  <text x="13" y="17" fontSize="6.5" fontFamily="monospace" fontWeight="700" fill="currentColor" textAnchor="middle">15</text>
                </svg>
              </button>
              <button className="hpc-play" id="playBtn" aria-label="Play latest episode">
                <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor"><polygon points="0,0 14,8 0,16"/></svg>
              </button>
              <button className="hpc-skip" id="hpcSkipFwd" aria-label="Skip forward 15 seconds">
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 4V1l5 4.5L13 10V7c-3.86 0-7 3.14-7 7s3.14 7 7 7 7-3.14 7-7h2c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9z" fill="currentColor"/>
                  <text x="13" y="17" fontSize="6.5" fontFamily="monospace" fontWeight="700" fill="currentColor" textAnchor="middle">15</text>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* MINI PLAYER */}
      <div className="mini-player" id="miniPlayer" role="complementary" aria-label="Mini player">
        <button className="mini-skip-btn" id="miniSkipBack" aria-label="Skip back 15 seconds">⟨15</button>
        <button className="mini-play-btn" id="miniPlayBtn" aria-label="Play/pause">▶</button>
        <button className="mini-skip-btn" id="miniSkipFwd" aria-label="Skip forward 15 seconds">15⟩</button>
        <div className="mini-player-info">
          <div className="ep-label mono">EP 001</div>
          <div className="ep-title">&quot;The Bug That Ate My Weekend&quot; — Mara Chen</div>
        </div>
        <div className="mini-progress" id="miniProgress" role="progressbar" aria-valuenow={0} aria-valuemin={0} aria-valuemax={100}>
          <div className="mini-progress-fill" id="miniProgressFill"></div>
        </div>
        <div className="mini-time mono" id="miniTime">0:00 / 0:00</div>
        <span className="mini-vol-icon">&#128266;</span>
        <input className="mini-volume" id="miniVolume" type="range" min="0" max="1" step="0.05" defaultValue="1" aria-label="Volume" />
        <button className="mini-close" id="miniClose" aria-label="Close player">✕</button>
      </div>

      {/* LATEST FEATURED */}
      <section className="frame latest" id="latest" aria-label="Latest episodes">
        <div className="section-head">
          <div>
            <div className="mono section-eyebrow">┘ Latest Issues ────────────</div>
            <h2>The <em>latest</em> editions,<br />fresh off the late shift.</h2>
          </div>
          <a href="https://www.youtube.com/@devsafterdark" target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{display:'inline-flex',alignItems:'center',gap:'6px'}}><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/></svg>Watch on YouTube →</a>
        </div>
        <div className="ep-grid">
          {[
            { num:'042', id:'e7jr6gBK7lY', title:'App Certification with The Ecosystem Quality Team', dur:'1:03:53' },
            { num:'041', id:'ZexG_hbA17k', title:'The Legend of hapily with Dax Miller', dur:'57:52' },
            { num:'040', id:'gZwRwm1VM9g', title:'Content Creation with Marc D. Hans', dur:'56:21' },
            { num:'039', id:'4r-L2k5tXxU', title:'Intro to Introw with Simon Van Den Hende', dur:'41:53' },
            { num:'038', id:'slH0Iq94axc', title:'Center of Developer Excellence with Zack Wolfson', dur:'1:13:10' },
            { num:'037', id:'ZF08M3-jCYo', title:'Platform First with Karen Ng', dur:'53:53' },
          ].map(ep => (
            <a key={ep.num} className="ep-card" href={`https://www.youtube.com/watch?v=${ep.id}`} target="_blank" rel="noopener noreferrer" aria-label={`EP ${ep.num}: ${ep.title}`}>
              <div className="ep-thumb">
                <img src={`https://i.ytimg.com/vi/${ep.id}/hqdefault.jpg`} alt="" className="ep-thumb-img" loading="lazy" decoding="async" />
                <div className="ep-corners"><span/><span/><span/><span/></div>
                <div className="ep-rec mono"><span className="ep-rec-dot">●</span> REC</div>
                <div className="ep-play-circle">▶</div>
                <div className="ep-badge mono">Vol. 1</div>
              </div>
              <div className="ep-meta">
                <div className="ep-num mono">EP-{ep.num}</div>
                <div className="ep-title">{ep.title}</div>
                <div className="ep-show">Devs:After Dark · {ep.dur}</div>
              </div>
            </a>
          ))}
        </div>
        <div className="ep-cta">
          <a href="https://www.youtube.com/@devsafterdark" target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{display:'inline-flex',alignItems:'center',gap:'6px'}}><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/></svg>More on YouTube →</a>
        </div>

        {/* ARCHIVE */}
        <div id="archive" style={{marginTop:'64px'}}>
          <div className="section-head" style={{marginBottom:0}}>
            <div>
              <div className="mono section-eyebrow">┘ The Audio Archive ────────────</div>
              <h2 id="archiveHeader">Vol. 1: <em>42</em> episodes.</h2>
            </div>
          </div>
          <div className="filter-bar" style={{marginTop:'32px'}}>
            <input className="search-input" id="searchInput" type="search" placeholder="Search episodes, guests, topics…" aria-label="Search episodes" />
            <div className="filter-chips" id="volChips" role="group" aria-label="Filter by volume">
              <button className="fchip active" data-vol="all">All Episodes</button>
              <button className="fchip" data-vol="1">Vol. 1</button>
            </div>
            <span className="archive-count mono" id="archiveCount">42 episodes</span>
          </div>
          <div className="archive-list" id="archiveList" role="list" aria-label="Episode archive"></div>
          <button className="show-more" id="showMore">Show more episodes ↓</button>
        </div>
      </section>

      {/* HOSTS */}
      <section className="frame" id="hosts" aria-label="Hosts">
        <div className="section-head">
          <h2>Your <em>hosts,</em> after dark.</h2>
          <span className="tape">The Editors</span>
        </div>
        <div className="hosts-grid">
          <div className="host">
            <div className="ph"><img src="/assets/nick-bio.png" alt="Nick James Laporte" loading="lazy" decoding="async" /></div>
            <div className="host-row">
              <h3 className="host-name">Nick James Laporte</h3>
              <a className="mono host-handle" href="https://www.linkedin.com/in/nicklaporte/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
            </div>
            <div className="host-role">&quot;Recovering SEO. Designs by candlelight.&quot;</div>
            <p className="host-bio">Nick Laporte is the founder, host, and chaos coordinator of Developers:After Dark. When he&apos;s not convincing developers to open up about their fears on a podcast, he&apos;s building things out of PVC pipe and buying domain names no one asked for. He considers the show &quot;more than 1s and 0s,&quot; which is either very profound or a cry for help. Probably both.</p>
          </div>
          <div className="host">
            <div className="ph"><img src="/assets/dennis-bio.png" alt="Dennis Edson" loading="lazy" decoding="async" /></div>
            <div className="host-row">
              <h3 className="host-name">Dennis Edson</h3>
              <a className="mono host-handle" href="https://www.linkedin.com/in/dennisedson/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
            </div>
            <div className="host-role">&quot;He edits out our mistakes so we sound smarter than we are.&quot;</div>
            <p className="host-bio">Dennis Edson co-hosts, edits, and somehow keeps Developers:After Dark from sounding like a conference call gone wrong. Armed with a license to create awesome things, Dennis is the quiet backbone of the operation, the kind of person who writes &quot;very clear notes&quot; in the comments of a budget doc while everyone else is panicking. He is the show&apos;s signal-to-noise ratio.</p>
          </div>
          <div className="host">
            <div className="ph"><img src="/assets/aj-bio.png" alt="AJ" loading="lazy" decoding="async" /></div>
            <div className="host-row">
              <h3 className="host-name">A.J. La Porte</h3>
              <a className="mono host-handle" href="https://www.linkedin.com/in/ajlaporte/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
            </div>
            <div className="host-role">&quot;Co-host, producer, and the reason there&apos;s a plan.&quot;</div>
            <p className="host-bio">A.J. LaPorte is the producer and co-host of Developers:After Dark, which means he&apos;s the one making sure things actually happen while Nick talks and Dennis edits. Part of the legendary LaPorte duo on the show, A.J. brings the structure to the storytelling, the kind of behind-the-scenes energy that makes everyone else look organized. He has not yet bought a domain name for this.</p>
          </div>
        </div>
      </section>

      {/* PITCH */}
      <section className="frame pitch" id="pitch" aria-label="Be a guest">
        <div>
          <span className="tape" style={{marginBottom:'24px',display:'inline-block'}}>Open Submissions</span>
          <h2>Pitch us<br /><em>a story.</em></h2>
          <p className="deck-large">
            We&apos;re not interested in the polished version. We want the part you usually leave out: the bug that took two months, the bet that didn&apos;t pay off, the late-night decision that turned into a company.
          </p>
          <div className="steps">
            <div className="step"><span className="step-num">1.</span><div><div className="step-k">Pitch</div><div className="step-v">A paragraph or two. The arc, not the bullet points.</div></div></div>
            <div className="step"><span className="step-num">2.</span><div><div className="step-k">Read</div><div className="step-v">We reply within a week. Promise.</div></div></div>
            <div className="step"><span className="step-num">3.</span><div><div className="step-k">Record</div><div className="step-v">One hour over Zoom. Cocktails optional.</div></div></div>
            <div className="step"><span className="step-num">4.</span><div><div className="step-k">Run</div><div className="step-v">You see the edit. We publish. You brag.</div></div></div>
          </div>
        </div>
        <div>
          <form className="form-card" id="pitchForm" noValidate>
            <span className="tape cyan">The Form</span>
            <div className="form-grid">
              <div className="field">
                <div className="field-label">Your name</div>
                <input type="text" placeholder="The byline" required autoComplete="name" />
              </div>
              <div className="field">
                <div className="field-label">Email</div>
                <input type="email" placeholder="how we'll reach you" required autoComplete="email" />
              </div>
              <div className="field">
                <div className="field-label">What&apos;s the angle</div>
                <input type="text" placeholder="e.g. sponsoring ep. 044, series run, season 2 deal…" />
              </div>
              <div className="field">
                <div className="field-label">The pitch</div>
                <textarea placeholder="Start with the moment something went sideways." required></textarea>
              </div>
              <button className="submit" type="submit"><span>Send the Pitch</span><span>→</span></button>
            </div>
          </form>
          <div className="thanks" id="thanks" aria-live="polite">
            <div className="mono thanks-label">Received · pending review</div>
            <div className="thanks-h">Thanks, <em>friend.</em></div>
            <p className="thanks-p">We&apos;ll read your pitch this week and write back from a real inbox, not a bot. Save us a seat at the late-night table.</p>
          </div>
        </div>
      </section>

      {/* MEDIA */}
      <section className="frame media-section" id="shorts" aria-label="Media: After Dark">
        <div className="section-head">
          <div>
            <div className="mono section-eyebrow">┘ Media:After Dark ────────────</div>
            <h2>Shorts, clips <em>&amp; cursed AI.</em></h2>
          </div>
        </div>
        <div className="media-masonry">
          {([
            // ── Video clips (replace id with YouTube Short video ID) ──
            { type:'video', id:'vWV_-QywjRk', title:'Short clip 1' },
            { type:'video', id:'REPLACE_ME', title:'Short clip 2' },
            { type:'video', id:'REPLACE_ME', title:'Short clip 3' },
            { type:'video', id:'REPLACE_ME', title:'Short clip 4' },
            // ── AI images ──
            { type:'image', src:'https://r3tkg2hho6abm09m.public.blob.vercel-storage.com/spider-man.webp',   caption:'', aspect:'3/4' },
            { type:'image', src:'https://r3tkg2hho6abm09m.public.blob.vercel-storage.com/abbey-road.webp',   caption:'', aspect:'1/1' },
            { type:'image', src:'https://r3tkg2hho6abm09m.public.blob.vercel-storage.com/ghost-busters.webp',caption:'', aspect:'4/5' },
            { type:'image', src:'https://r3tkg2hho6abm09m.public.blob.vercel-storage.com/gta.webp',          caption:'', aspect:'3/4' },
            { type:'image', src:'https://r3tkg2hho6abm09m.public.blob.vercel-storage.com/top-gun.webp',      caption:'', aspect:'16/9' },
            { type:'image', src:'https://r3tkg2hho6abm09m.public.blob.vercel-storage.com/twilight.webp',     caption:'', aspect:'3/4' },
            { type:'image', src:'https://r3tkg2hho6abm09m.public.blob.vercel-storage.com/pirates.webp',      caption:'', aspect:'4/5' },
            { type:'image', src:'https://r3tkg2hho6abm09m.public.blob.vercel-storage.com/sherlock.webp',     caption:'', aspect:'1/1' },
            { type:'image', src:'https://r3tkg2hho6abm09m.public.blob.vercel-storage.com/star-trek.webp',    caption:'', aspect:'3/4' },
            { type:'image', src:'https://r3tkg2hho6abm09m.public.blob.vercel-storage.com/big-leb.webp',      caption:'', aspect:'4/5' },
            { type:'image', src:'https://r3tkg2hho6abm09m.public.blob.vercel-storage.com/dodgeball.webp',    caption:'', aspect:'1/1' },
            { type:'image', src:'https://r3tkg2hho6abm09m.public.blob.vercel-storage.com/robin-hood.webp',   caption:'', aspect:'3/4' },
            { type:'image', src:'https://r3tkg2hho6abm09m.public.blob.vercel-storage.com/a-ha.webp',         caption:'', aspect:'16/9' },
            { type:'image', src:'https://r3tkg2hho6abm09m.public.blob.vercel-storage.com/xmas.webp',         caption:'', aspect:'1/1' },
          ] as Array<{type:string,id?:string,title?:string,src?:string,caption?:string,aspect?:string}>).map((item, i) =>
            item.type === 'video' ? (
              <a key={i} className="media-item media-item-video"
                href={`https://www.youtube.com/shorts/${item.id}`}
                target="_blank" rel="noopener noreferrer"
                aria-label={item.title}
                data-midx={i}>
                <img src={`https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`} alt={item.title} loading="lazy" decoding="async" />
                <div className="media-play-overlay">
                  <div className="media-play-btn">▶</div>
                  <div className="media-short-badge mono">Short</div>
                </div>
              </a>
            ) : (
              <div key={i} className="media-item media-item-img" data-midx={i}>
                {item.src
                  ? <img src={item.src} alt={item.caption || ''} loading="lazy" decoding="async" />
                  : <div className="media-placeholder" style={{aspectRatio: item.aspect}} />
                }
                {item.caption && <div className="media-caption mono">{item.caption}</div>}
              </div>
            )
          )}
        </div>
        <button className="show-more" id="mediaShowMore">Show More ↓</button>
      </section>

      {/* SPONSORS */}
      <section className="frame" aria-label="Sponsors" style={{paddingTop:0}}>
        <div className="sponsors-bar">
          <div className="mono" style={{color:'var(--mute)'}}>── Sponsored By ──────────</div>
          <div className="rule"></div>
          <a href="#pitch" className="btn btn-ghost">Sponsor a Future Episode →</a>
        </div>
        <div className="sponsors-grid">
          {[
            {nm:'Linear',tg:'Issue tracking for builders'},
            {nm:'Resend',tg:'Email for developers'},
            {nm:'Neon',tg:'Serverless Postgres'},
            {nm:'Railway',tg:'Ship faster, host smarter'},
            {nm:'Pylon',tg:'Support that scales'},
            {nm:'Tigris',tg:'Globally distributed storage'},
          ].map(s => (
            <div key={s.nm} className="sponsor">
              <div className="nm">{s.nm}</div>
              <div className="tg mono">{s.tg}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="foot">
        <div>
          <div className="word">Devs<em>After</em>Dark</div>
          <p className="deck-foot">A collection of late-night conversations with the people who build the internet you use every day.</p>
        </div>
        <div className="col">
          <h4 className="mono">Watch/Listen</h4>
          <a href="#">Apple Podcasts</a><a href="#">Spotify</a><a href="https://www.youtube.com/@devsafterdark" target="_blank" rel="noopener noreferrer" style={{display:'inline-flex',alignItems:'center',gap:'5px'}}><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/></svg>YouTube</a><a href="/feed.xml" target="_blank" rel="noopener noreferrer">RSS</a>
        </div>
        <div className="col">
          <h4 className="mono">About</h4>
          <a href="#hosts">The hosts</a><a href="#pitch">Be a guest</a><a href="#">Sponsorships</a>
        </div>
        <div className="col">
          <h4 className="mono">Read</h4>
          <a href="#">Transcripts <em style={{fontStyle:'italic',opacity:0.6}}>(coming soon)</em></a><a href="#">Newsletter <em style={{fontStyle:'italic',opacity:0.6}}>(coming soon)</em></a>
        </div>
      </footer>
      <div className="colophon mono">
        <span>© {new Date().getFullYear()} Devs:AfterDark. Brewed at unreasonable hours.</span>
        <span>v.01.42</span>
      </div>
    </>
  );
}
