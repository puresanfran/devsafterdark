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
    const TAGS = ['craft','shipping','founders','ai','design','infra','career','storytelling'];
    const EPISODE_TITLES = [
      'The Bug That Ate My Weekend','Wireframes at 2am','Sleep Is For The Deployed',
      'How We Shipped a Side Project in 11 Days','The Ghost in the Staging Env',
      'I Built My CRM in a Bar','Confessions of a Reformed Architect',
      'The AI That Refactored My Marriage','Notes From The Pager Duty Trenches',
      'Why Your Side Project Is Stalled','Postgres, Whiskey, and Other Coping Mechanisms',
      'The Year I Stopped Writing Tests','Dependency Hell: A Love Story','Demo Day Disasters',
      'Cron Jobs at 3am: A Field Guide','How I Learned to Read Stack Traces Out Loud',
      'The Indie Hacker Who Almost Quit','Live Coding With Strangers',
      "The Pull Request Heard 'Round The World",'Inbox Zero Is a Lie',
      'Building in Public, Crying in Private','The Friday Deploy Hall of Fame',
      'Refactoring My Career','Off-By-One Hearts','How a Reddit Comment Changed My Life',
      'The Loneliness of the Long-Distance Maintainer','From Solopreneur to Co-Founder',
      "Designing Like Nobody's Watching","The Manager I Wish I'd Had",'Vibes-Driven Development',
      'Why I Quit My Six-Figure Job to Make Stickers','The Hardest Bug I Ever Loved',
      'Customer Calls After Midnight','The Unfinished Side Project Cemetery',
      'Selling Your Startup Without Losing Yourself','That Time We Broke Production For 47 Minutes',
      'Notes On Building A Tiny Empire','When Your Cofounder Ghosts You',
      'Saying No To The Pull Request','One More Feature',
      'Migrating Off The Monolith (And My 20s)','The Answer To Everything',"Tomorrow's Problem"
    ];
    const GUESTS = [
      {name:'Mara Chen',role:'Design lead, LunaCo'},{name:'Devon Hart',role:'Founder, Rivet'},
      {name:'Priya Anand',role:'Staff Eng, Polyglot'},{name:'Sam Okonkwo',role:'Indie hacker'},
      {name:'Jules Park',role:'VP Eng, Plotline'},{name:'Riley Voss',role:'Author'},
      {name:'Cass Imamura',role:'Solo founder, Lampshade'},{name:'Theo Brandt',role:'Game dev, Dot Studio'},
      {name:'Nina Reyes',role:'Tech essayist'},{name:'Marcus Lin',role:'DevTools, Tessera'},
      {name:'Iris Kapoor',role:'CEO, Halflight'},{name:'Owen Reilly',role:'Open source maintainer'},
      {name:'Sloane Park',role:'Reliability engineer, Atlas'},{name:'Bea Ortiz',role:'Founder, Smolbase'},
    ];
    const SUMMARIES = [
      'A 72-hour debugging spiral, two pots of coffee, and one humbling git blame.',
      'On designing things alone at night, the courage of the first draft, and why polish is overrated.',
      "What happens when the on-call phone rings and the room is dark and the bug isn't yours.",
      "A speedrun through a side project — the constraints, the cuts, the launch day panic.",
      "An intermittent failure that only happened on Tuesdays. We tried everything.",
      "A founder story that starts in a dive bar and ends with paying customers.",
      "Letting go of the perfect system diagram and learning to ship something messy.",
      "On using AI for the boring parts of life, and what it gave back to us.",
      "Real stories from the pager-duty trenches, plus a few coping mechanisms.",
      "If your side project has been 'almost ready' for six months, this one is for you.",
    ];

    const EPISODES = EPISODE_TITLES.map((title, i) => {
      const volume = i < 42 ? 1 : 2;
      const volEpNum = i < 42 ? i + 1 : i - 41;
      const guest = GUESTS[i % GUESTS.length];
      const minutes = 28 + ((i * 13) % 34);
      const seconds = (i * 7) % 60;
      return {
        num: i + 1, volume, volEpNum, title, guest: guest.name, guestRole: guest.role,
        duration: `${minutes}:${String(seconds).padStart(2,'0')}`,
        summary: SUMMARIES[i % SUMMARIES.length],
        tags: [TAGS[i % TAGS.length], TAGS[(i+3) % TAGS.length]],
      };
    }).sort((a, b) => b.num - a.num);

    /* ── Archive ── */
    let visibleCount = 10;
    let activeTag = 'all';
    let activeVol = 'all';
    let searchQ = '';
    let currentlyPlayingEl: HTMLButtonElement | null = null;

    function renderArchive() {
      const list = document.getElementById('archiveList') as HTMLElement;
      const countEl = document.getElementById('archiveCount') as HTMLElement;
      const showMoreBtn = document.getElementById('showMore') as HTMLButtonElement;

      const filtered = EPISODES.filter(ep => {
        const matchVol = activeVol === 'all' || ep.volume === Number(activeVol);
        const matchTag = activeTag === 'all' || ep.tags.includes(activeTag);
        const q = searchQ.toLowerCase();
        const matchSearch = !q || ep.title.toLowerCase().includes(q)
          || ep.guest.toLowerCase().includes(q) || ep.guestRole.toLowerCase().includes(q)
          || ep.summary.toLowerCase().includes(q) || ep.tags.some(t => t.includes(q));
        return matchVol && matchTag && matchSearch;
      });

      countEl.textContent = `${filtered.length} episode${filtered.length !== 1 ? 's' : ''}`;

      const headerEl = document.getElementById('archiveHeader') as HTMLElement;
      if (headerEl) {
        const volLabel = activeVol === 'all' ? 'All Volumes' : `Vol. ${activeVol}`;
        const count = filtered.length;
        headerEl.innerHTML = `${volLabel} — <em>${count}</em> episode${count !== 1 ? 's' : ''}.`;
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
            <div class="deck">${ep.summary}</div>
            <div class="card-tags" style="margin-top:8px;"><span class="tag">Vol. ${ep.volume}</span>${ep.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
          </div>
          <div class="guest">${ep.guest}<small>${ep.guestRole}</small></div>
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

    /* ── Mini player ── */
    let miniPaused = true;
    let miniProgress = 0;
    let miniInterval: ReturnType<typeof setInterval> | null = null;

    function triggerPlay(ep: typeof EPISODES[0], btnEl: HTMLButtonElement) {
      if (currentlyPlayingEl && currentlyPlayingEl !== btnEl) {
        currentlyPlayingEl.textContent = '▶';
        currentlyPlayingEl.classList.remove('playing');
      }
      const isPlaying = btnEl.classList.contains('playing');
      if (isPlaying) {
        btnEl.textContent = '▶';
        btnEl.classList.remove('playing');
        currentlyPlayingEl = null;
        miniPaused = true;
        (document.getElementById('miniPlayBtn') as HTMLButtonElement).textContent = '▶';
      } else {
        btnEl.textContent = '❚❚';
        btnEl.classList.add('playing');
        currentlyPlayingEl = btnEl;
        miniPaused = false;
        showMiniPlayer(ep);
      }
    }

    function showMiniPlayer(ep: typeof EPISODES[0]) {
      const mp = document.getElementById('miniPlayer') as HTMLElement;
      (document.querySelector('.mini-player-info .ep-label') as HTMLElement).textContent = `Vol. ${ep.volume} · EP ${String(ep.volEpNum).padStart(3,'0')}`;
      (document.querySelector('.mini-player-info .ep-title') as HTMLElement).textContent = `"${ep.title}" — ${ep.guest}`;
      mp.classList.add('visible');
      (document.getElementById('miniPlayBtn') as HTMLButtonElement).textContent = '❚❚';
      startMiniProgress();
    }

    function startMiniProgress() {
      if (miniInterval) clearInterval(miniInterval);
      miniInterval = setInterval(() => {
        if (!miniPaused) {
          miniProgress = Math.min(miniProgress + 0.15, 100);
          (document.getElementById('miniProgressFill') as HTMLElement).style.width = miniProgress + '%';
          (document.getElementById('miniProgress') as HTMLElement).setAttribute('aria-valuenow', String(Math.round(miniProgress)));
          if (miniProgress >= 100) { if (miniInterval) clearInterval(miniInterval); miniProgress = 0; }
        }
      }, 500);
    }

    document.getElementById('miniPlayBtn')?.addEventListener('click', () => {
      miniPaused = !miniPaused;
      (document.getElementById('miniPlayBtn') as HTMLButtonElement).textContent = miniPaused ? '▶' : '❚❚';
      if (!miniPaused) startMiniProgress();
    });

    document.getElementById('miniClose')?.addEventListener('click', () => {
      (document.getElementById('miniPlayer') as HTMLElement).classList.remove('visible');
      if (miniInterval) clearInterval(miniInterval);
      miniPaused = true; miniProgress = 0;
      (document.getElementById('miniProgressFill') as HTMLElement).style.width = '0%';
      if (currentlyPlayingEl) { currentlyPlayingEl.textContent = '▶'; currentlyPlayingEl.classList.remove('playing'); currentlyPlayingEl = null; }
      (document.getElementById('playBtn') as HTMLButtonElement).textContent = '▶';
      (document.getElementById('playBtn') as HTMLButtonElement).classList.remove('playing');
    });

    /* ── Hero play ── */
    let heroPlaying = false;
    document.getElementById('playBtn')?.addEventListener('click', () => {
      heroPlaying = !heroPlaying;
      (document.getElementById('playBtn') as HTMLButtonElement).textContent = heroPlaying ? '❚❚' : '▶';
      (document.getElementById('playBtn') as HTMLButtonElement).classList.toggle('playing', heroPlaying);
      (document.getElementById('miniPlayBtn') as HTMLButtonElement).textContent = heroPlaying ? '❚❚' : '▶';
      miniPaused = !heroPlaying;
      if (heroPlaying) { (document.getElementById('miniPlayer') as HTMLElement).classList.add('visible'); startMiniProgress(); }
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
      activeTag = chip.dataset.tag || 'all';
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
    document.getElementById('pitchChips')?.addEventListener('click', e => {
      const chip = (e.target as HTMLElement).closest('.chip');
      if (!chip) return;
      document.querySelectorAll('#pitchChips .chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });

    document.getElementById('pitchForm')?.addEventListener('submit', e => {
      e.preventDefault();
      (document.getElementById('pitchForm') as HTMLElement).style.display = 'none';
      const thanks = document.getElementById('thanks') as HTMLElement;
      thanks.classList.add('show');
      thanks.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    /* ── Shorts rail ── */
    const rail = document.getElementById('shortsRail') as HTMLElement;
    const prevBtn = document.getElementById('shortsPrev') as HTMLButtonElement;
    const nextBtn = document.getElementById('shortsNext') as HTMLButtonElement;
    const step = () => {
      const card = rail.querySelector('.short');
      const gap = parseFloat(getComputedStyle(rail).columnGap) || 18;
      return card ? card.getBoundingClientRect().width + gap : 280;
    };
    prevBtn?.addEventListener('click', () => rail.scrollBy({ left: -step() * 2, behavior: 'smooth' }));
    nextBtn?.addEventListener('click', () => rail.scrollBy({ left: step() * 2, behavior: 'smooth' }));
    const updateArrows = () => {
      prevBtn.disabled = rail.scrollLeft <= 4;
      nextBtn.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4;
    };
    rail?.addEventListener('scroll', updateArrows, { passive: true });
    updateArrows();

    /* ── Nav scroll + active section ── */
    const nav = document.getElementById('mainNav') as HTMLElement;
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = ['latest','archive','hosts','pitch','shorts'];
    const handleScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 80);
      const heroHeight = (document.querySelector('.hero') as HTMLElement).offsetHeight;
      if (window.scrollY > heroHeight * 0.8 && !miniPaused) {
        (document.getElementById('miniPlayer') as HTMLElement).classList.add('visible');
      }
      let current = 'latest';
      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 120) current = id;
      });
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    /* ── Mobile menu ── */
    document.getElementById('hamburgerBtn')?.addEventListener('click', () => {
      const open = (document.getElementById('mobileMenu') as HTMLElement).classList.toggle('open');
      (document.getElementById('hamburgerBtn') as HTMLButtonElement).setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    document.getElementById('mobileMenuClose')?.addEventListener('click', closeMobileMenu);

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

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleParallax);
      clearInterval(clockInterval);
      if (miniInterval) clearInterval(miniInterval);
    };
  }, []);

  return (
    <>
      {/* MOBILE MENU */}
      <div className="mobile-menu" id="mobileMenu" role="dialog" aria-label="Navigation menu">
        <button className="mobile-menu-close" id="mobileMenuClose" aria-label="Close menu">✕</button>
        <a href="#latest" onClick={closeMobileMenu}>The Latest</a>
        <a href="#archive" onClick={closeMobileMenu}>Archive</a>
        <a href="#hosts" onClick={closeMobileMenu}>The Hosts</a>
        <a href="#pitch" onClick={closeMobileMenu}>Be A Guest</a>
        <a href="#shorts" onClick={closeMobileMenu}>Shorts</a>
      </div>

      {/* NAV */}
      <header className="nav" id="mainNav">
        <div className="nav-brand">
          <a href="#" className="wordmark">Devs<em>After</em>Dark</a>
          <div className="mono issue">Vol. 02 · EP 001</div>
        </div>
        <nav className="nav-links" aria-label="Primary navigation">
          <a href="#latest" className="active">The Latest</a>
          <a href="#archive">Archive</a>
          <a href="#hosts">The Hosts</a>
          <a href="#pitch">Be A Guest</a>
          <a href="#shorts">Shorts</a>
        </nav>
        <div className="nav-cta">
          <button className="btn btn-ghost hide-sm">Listen ↗</button>
          <button className="btn">Subscribe</button>
          <button className="hamburger" id="hamburgerBtn" aria-label="Open menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="hero" aria-label="Hero">
        <div className="hero-bg" id="heroBg" aria-hidden="true"></div>
        <div className="hero-grain" aria-hidden="true"></div>
        <div className="hero-inner">
          <div className="coverline mono">
            <span>Vol. 02 · Issue №001</span>
            <span className="coverline-mid">· The After-Hours Edition ·</span>
            <span id="liveTime">Sunday · 02:14 AM</span>
          </div>
          <div className="hero-stage">
            <div className="eyebrow mono fade-up fade-up-1">A podcast for night-shift builders</div>
            <h1 className="headline fade-up fade-up-2">
              The internet,<br />
              <em>after</em> bedtime.
            </h1>
            <p className="deck fade-up fade-up-3">
              Late-night conversations with the people who keep the internet running while you sleep — the founders, the maintainers, the on-call engineers, and the friends-of-friends with one truly weird production story.
            </p>
            <div className="hero-actions fade-up fade-up-4">
              <div className="play-cluster">
                <button className="play-btn" id="playBtn" aria-label="Play latest episode">▶</button>
                <div className="play-meta">
                  <span className="ep">Now Playing · EP 001 · 47:13</span>
                  <span className="ttl">&quot;The Bug That Ate My Weekend&quot; — with Mara Chen</span>
                </div>
              </div>
              <a href="#archive" className="btn btn-ghost">Browse the archive →</a>
            </div>
          </div>
          <div className="hero-foot mono">
            <span>Recorded in a garage. Mixed in a kitchen.</span>
            <span className="scroll-cue" aria-hidden="true"><span>Scroll</span><span className="line"></span></span>
            <span className="col-r">New episodes · Tuesdays · 11 PM ET</span>
          </div>
        </div>
        <aside className="hero-meta-card" aria-label="Cover story">
          <div className="mono label">Vol. 02 · Cover Story</div>
          <div className="title">&quot;The Bug That Ate My Weekend&quot;</div>
          <div className="by">with Mara Chen, Design lead at LunaCo · 47 min</div>
        </aside>
      </section>

      {/* MINI PLAYER */}
      <div className="mini-player" id="miniPlayer" role="complementary" aria-label="Mini player">
        <button className="mini-play-btn" id="miniPlayBtn" aria-label="Play/pause">▶</button>
        <div className="mini-player-info">
          <div className="ep-label mono">EP 001</div>
          <div className="ep-title">&quot;The Bug That Ate My Weekend&quot; — Mara Chen</div>
        </div>
        <div className="mini-progress" id="miniProgress" role="progressbar" aria-valuenow={0} aria-valuemin={0} aria-valuemax={100}>
          <div className="mini-progress-fill" id="miniProgressFill"></div>
        </div>
        <button className="mini-close" id="miniClose" aria-label="Close player">✕</button>
      </div>

      {/* LATEST FEATURED */}
      <section className="frame latest" id="latest" aria-label="Latest episodes">
        <div className="section-head">
          <div>
            <div className="mono section-eyebrow">┘ This Week&apos;s Issue ────────────</div>
            <h2>The <em>latest</em> editions,<br />fresh off the late shift.</h2>
          </div>
          <a href="#archive" className="mono" style={{color:'var(--accent)'}}>All issues →</a>
        </div>
        <div className="featured-grid">
          <article className="card big" data-ep="001" tabIndex={0} role="button" aria-label="Episode 001: The Bug That Ate My Weekend">
            <div className="ph ph-stripe warm"><span className="mono lbl">[ cover · ep 001 ]</span></div>
            <div className="card-body">
              <div className="card-eyebrow">EP 001 · 47:13 · Tuesday</div>
              <div className="card-title">&quot;The Bug That Ate My Weekend&quot;</div>
              <div className="card-by">with Mara Chen, Design lead at LunaCo</div>
              <p className="card-deck">A 72-hour debugging spiral, two pots of coffee, and one humbling git blame.</p>
              <div className="card-tags"><span className="tag">craft</span><span className="tag">career</span></div>
            </div>
          </article>
          <article className="card" data-ep="002" tabIndex={0} role="button" aria-label="Episode 002: Wireframes at 2am">
            <div className="ph ph-stripe"><span className="mono lbl">[ cover · ep 002 ]</span></div>
            <div className="card-body">
              <div className="card-eyebrow">EP 002 · 38:08</div>
              <div className="card-title">&quot;Wireframes at 2am&quot;</div>
              <div className="card-by">with Devon Hart, Founder of Rivet</div>
              <div className="card-tags"><span className="tag">design</span></div>
            </div>
          </article>
          <article className="card" data-ep="003" tabIndex={0} role="button" aria-label="Episode 003: Sleep Is For The Deployed">
            <div className="ph ph-stripe red"><span className="mono lbl">[ cover · ep 003 ]</span></div>
            <div className="card-body">
              <div className="card-eyebrow">EP 003 · 42:55</div>
              <div className="card-title">&quot;Sleep Is For The Deployed&quot;</div>
              <div className="card-by">with Priya Anand, Staff Eng at Polyglot</div>
              <div className="card-tags"><span className="tag">infra</span></div>
            </div>
          </article>
        </div>

        {/* ARCHIVE */}
        <div id="archive" style={{marginTop:'64px'}}>
          <div className="section-head" style={{marginBottom:0}}>
            <div>
              <div className="mono section-eyebrow">┘ The Archive ────────────</div>
              <h2 id="archiveHeader">All Volumes — <em>43</em> episodes.</h2>
            </div>
          </div>
          <div className="filter-bar" style={{marginTop:'32px'}}>
            <input className="search-input" id="searchInput" type="search" placeholder="Search episodes, guests, topics…" aria-label="Search episodes" />
            <div className="filter-chips" id="volChips" role="group" aria-label="Filter by volume">
              <button className="fchip active" data-vol="all">All Volumes</button>
              <button className="fchip" data-vol="2">Vol. 2</button>
              <button className="fchip" data-vol="1">Vol. 1</button>
            </div>
            <div className="filter-chips" id="filterChips" role="group" aria-label="Filter by tag">
              <button className="fchip active" data-tag="all">All</button>
              <button className="fchip" data-tag="craft">Craft</button>
              <button className="fchip" data-tag="shipping">Shipping</button>
              <button className="fchip" data-tag="founders">Founders</button>
              <button className="fchip" data-tag="ai">AI</button>
              <button className="fchip" data-tag="infra">Infra</button>
              <button className="fchip" data-tag="career">Career</button>
            </div>
            <span className="archive-count mono" id="archiveCount">43 episodes</span>
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
            <div className="ph"><img src="/assets/nick-bio.png" alt="Nick James Laporte" /></div>
            <div className="host-row">
              <h3 className="host-name">Nick James Laporte</h3>
              <a className="mono host-handle" href="https://www.linkedin.com/in/nicklaporte/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
            </div>
            <div className="host-role">&quot;Recovering SEO. Designs by candlelight.&quot;</div>
            <p className="host-bio">Nick Laporte is the founder, host, and chaos coordinator of Developers:After Dark. When he&apos;s not convincing developers to open up about their fears on a podcast, he&apos;s building things out of PVC pipe and buying domain names no one asked for. He considers the show &quot;more than 1s and 0s,&quot; which is either very profound or a cry for help. Probably both.</p>
          </div>
          <div className="host">
            <div className="ph"><img src="/assets/dennis-bio.png" alt="Dennis Edson" /></div>
            <div className="host-row">
              <h3 className="host-name">Dennis Edson</h3>
            </div>
            <div className="host-role">&quot;He edits out our mistakes so we sound smarter than we are.&quot;</div>
            <p className="host-bio">Dennis Edson co-hosts, edits, and somehow keeps Developers:After Dark from sounding like a conference call gone wrong. Armed with a license to create awesome things, Dennis is the quiet backbone of the operation, the kind of person who writes &quot;very clear notes&quot; in the comments of a budget doc while everyone else is panicking. He is the show&apos;s signal-to-noise ratio.</p>
          </div>
          <div className="host">
            <div className="ph"><img src="/assets/aj-bio.png" alt="AJ" /></div>
            <div className="host-row">
              <h3 className="host-name">A.J. La Porte</h3>
              <span className="mono host-handle">@thewells</span>
            </div>
            <div className="host-role">&quot;Editor-in-chief. Lives on cold brew and red pen.&quot;</div>
            <p className="host-bio">Theo runs the cutting room — turns rambling 90-minute conversations into 40-minute episodes that feel like a tight short story. Former newsroom audio producer, occasional ghost-writer, full-time night owl.</p>
          </div>
        </div>
      </section>

      {/* PITCH */}
      <section className="frame pitch" id="pitch" aria-label="Be a guest">
        <div>
          <span className="tape" style={{marginBottom:'24px',display:'inline-block'}}>Open Submissions</span>
          <h2>Pitch us<br /><em>a story.</em></h2>
          <p className="deck-large">
            We&apos;re not interested in the polished version. We want the part you usually leave out — the bug that took two months, the bet that didn&apos;t pay off, the late-night decision that turned into a company.
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
              <div>
                <div className="field-label">What&apos;s the angle</div>
                <div className="chips" id="pitchChips" role="group" aria-label="Choose a topic">
                  <button type="button" className="chip active">shipping</button>
                  <button type="button" className="chip">founders</button>
                  <button type="button" className="chip">craft</button>
                  <button type="button" className="chip">ai</button>
                  <button type="button" className="chip">career</button>
                  <button type="button" className="chip">infra</button>
                </div>
              </div>
              <div className="field">
                <div className="field-label">The pitch</div>
                <textarea placeholder="Start with the moment something went sideways." required></textarea>
              </div>
              <button className="submit" type="submit"><span>Send the pitch</span><span>→</span></button>
            </div>
          </form>
          <div className="thanks" id="thanks" aria-live="polite">
            <div className="mono thanks-label">Received · pending review</div>
            <div className="thanks-h">Thanks, <em>friend.</em></div>
            <p className="thanks-p">We&apos;ll read your pitch this week and write back from a real inbox, not a bot. Save us a seat at the late-night table.</p>
          </div>
        </div>
      </section>

      {/* SHORTS */}
      <section className="shorts" id="shorts" aria-label="Sixty-second cuts">
        <div className="section-head">
          <div>
            <div className="mono section-eyebrow">┘ Bite-Sized ────────────</div>
            <h2>Sixty-second <em>cuts.</em></h2>
          </div>
          <div className="shorts-controls">
            <button className="shorts-arrow" id="shortsPrev" aria-label="Scroll left">←</button>
            <button className="shorts-arrow" id="shortsNext" aria-label="Scroll right">→</button>
          </div>
        </div>
        <div className="shorts-rail" id="shortsRail" role="list">
          {[
            {ep:'043',color:'warm',dur:'0:42',src:'The Bug That Ate My Weekend',ttl:'"I git-blamed myself."'},
            {ep:'042',color:'',dur:'0:58',src:'Wireframes at 2am',ttl:'The case for the ugly first draft.'},
            {ep:'041',color:'red',dur:'1:04',src:'Sleep Is For The Deployed',ttl:'The 3am pager rings differently.'},
            {ep:'040',color:'',dur:'0:36',src:'Side Project in 11 Days',ttl:'Cut the feature. Ship the demo.'},
            {ep:'039',color:'warm',dur:'0:51',src:'Ghost in the Staging Env',ttl:'It only broke on Tuesdays.'},
            {ep:'038',color:'red',dur:'1:12',src:'I Built My CRM in a Bar',ttl:'Cocktail napkin to checkout flow.'},
            {ep:'037',color:'',dur:'0:45',src:'Reformed Architect',ttl:'Throw away the diagram.'},
            {ep:'036',color:'warm',dur:'0:39',src:'AI Refactored My Marriage',ttl:'On boring chores and bandwidth.'},
          ].map(s => (
            <article key={s.ep} className="short" role="listitem" tabIndex={0} aria-label={`Short clip from EP ${s.ep}`}>
              <div className={`ph-stripe${s.color ? ' '+s.color : ''}`}></div>
              <div className="short-tl mono"><span className="dot" aria-hidden="true"></span>EP {s.ep}</div>
              <div className="short-tr mono">{s.dur}</div>
              <button className="short-play" aria-label="Play clip">▶</button>
              <div className="short-meta">
                <div className="mono src">{s.src}</div>
                <div className="ttl">{s.ttl}</div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SPONSORS */}
      <section className="frame" aria-label="Sponsors" style={{paddingTop:0}}>
        <div className="sponsors-bar">
          <div className="mono" style={{color:'var(--mute)'}}>── Underwritten By ──────────</div>
          <div className="rule"></div>
          <a href="#pitch" className="mono" style={{color:'var(--accent)',fontWeight:600}}>Sponsor a future episode →</a>
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
          <p className="deck-foot">A small magazine of late-night conversations with the people who build the internet you use every day.</p>
        </div>
        <div className="col">
          <h4 className="mono">Listen</h4>
          <a href="#">Apple Podcasts</a><a href="#">Spotify</a><a href="#">Overcast</a><a href="#">RSS</a>
        </div>
        <div className="col">
          <h4 className="mono">About</h4>
          <a href="#hosts">The hosts</a><a href="#pitch">Be a guest</a><a href="#">Sponsorships</a><a href="#">Press kit</a>
        </div>
        <div className="col">
          <h4 className="mono">Read</h4>
          <a href="#">Transcripts</a><a href="#">Newsletter</a><a href="#">Twitter</a><a href="#">Mastodon</a>
        </div>
      </footer>
      <div className="colophon mono">
        <span>© DevsAfterDark Studios — Brewed at unreasonable hours.</span>
        <span>v.02.43 · published Tuesday 02:14 AM</span>
      </div>
    </>
  );
}
