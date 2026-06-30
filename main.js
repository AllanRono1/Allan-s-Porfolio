document.getElementById('yr').textContent = new Date().getFullYear();

// ---------- HERO H1 WORD REVEAL ----------
(function revealH1() {
  const h1 = document.querySelector('.hero h1');
  if (!h1 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // Walk child nodes so we preserve <span class="accent"> wrappers
  const wrap = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const words = node.textContent.split(/(\s+)/);
      const frag = document.createDocumentFragment();
      words.forEach((chunk, i) => {
        if (/^\s+$/.test(chunk) || chunk === '') {
          frag.appendChild(document.createTextNode(chunk));
        } else {
          const outer = document.createElement('span');
          outer.className = 'word';
          const inner = document.createElement('span');
          inner.className = 'word-inner';
          // delay increases by 60ms per word across the whole headline
          inner.style.animationDelay = `${(wordIndex++) * 60}ms`;
          inner.textContent = chunk;
          outer.appendChild(inner);
          frag.appendChild(outer);
        }
      });
      node.replaceWith(frag);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      Array.from(node.childNodes).forEach(wrap);
    }
  };
  let wordIndex = 0;
  Array.from(h1.childNodes).forEach(wrap);
})();

// ---------- THEME TOGGLE ----------
(function initTheme() {
  const root = document.documentElement;
  const btn = document.getElementById('theme-btn');
  const mq = window.matchMedia('(prefers-color-scheme: dark)');

  // storage may be unavailable (e.g. some sandboxes) — fail gracefully
  const store = {
    get() { try { return localStorage.getItem('theme'); } catch { return null; } },
    set(v) { try { localStorage.setItem('theme', v); } catch {} },
    clear() { try { localStorage.removeItem('theme'); } catch {} }
  };

  function resolved() {
    const saved = store.get();
    if (saved === 'dark' || saved === 'light') return saved;
    return mq.matches ? 'dark' : 'light';
  }

  function apply() {
    const saved = store.get();
    // explicit choice -> set data-theme; otherwise let the OS media query rule
    if (saved === 'dark' || saved === 'light') root.setAttribute('data-theme', saved);
    else root.removeAttribute('data-theme');
    const r = resolved();
    root.setAttribute('data-resolved', r);
    btn.setAttribute('aria-pressed', String(r === 'dark'));
    btn.setAttribute('aria-label', r === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  btn.addEventListener('click', () => {
    const next = resolved() === 'dark' ? 'light' : 'dark';
    store.set(next);
    apply();
  });

  // if user hasn't chosen manually, follow live OS changes
  mq.addEventListener('change', () => { if (!store.get()) apply(); });

  apply();
})();

// ---------- SCROLL REVEAL ----------
// Respects reduced motion
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const items = document.querySelectorAll('.reveal');
if (reduce || !('IntersectionObserver' in window)) {
  items.forEach(el => el.classList.add('in'));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach(el => io.observe(el));
}

// ---------- WRITING / BLOG ----------
// To add a post: copy a block below. `body` supports a light markdown:
//   ## Heading   ·   **bold**   ·   `code`   ·   [text](url)   ·   - bullet
//   Separate paragraphs with a blank line.
const POSTS = [
  {
    title: "Memoization is not a performance strategy",
    date: "2026-05-18",
    read: "5 min",
    blurb: "useMemo and useCallback are correctness tools that happen to help performance — reaching for them by reflex usually makes code slower to read and no faster to run.",
    body:
`Most React performance problems are not solved by wrapping things in **useMemo**. They're solved by rendering less, or rendering smaller. Memoization is a cache, and caches have a cost: the comparison, the retained reference, and the cognitive load on the next person reading the file.

## When it actually earns its place
I reach for memoization in three cases, and I try to be honest about whether I'm really in one of them:

- The value is referenced in a dependency array and must stay stable.
- The computation is genuinely expensive *and* runs often.
- A memoized child re-renders on every parent render for no reason.

## The trap
Wrapping a cheap calculation in \`useMemo\` doesn't make it free — you've added a dependency array to maintain and a hook to mislead the next reader into thinking something costly lives there. Measure first with the React Profiler. If you can't point at the flamegraph and say *this* is the work, the memo is decoration.

The durable version of this skill isn't knowing the API. It's knowing when **not** to use it.`
  },
  {
    title: "Accessibility is a deadline, not a phase",
    date: "2026-03-02",
    read: "4 min",
    blurb: "Treating a11y as a pass at the end of a project guarantees it gets cut. Built in from the first commit, it costs almost nothing and changes who gets to use what you ship.",
    body:
`The cheapest time to make something accessible is while you're writing it. The most expensive time is after a launch, when "add ARIA later" has quietly become "never."

## Start with the markup
Most of accessibility is just using the right element. A \`<button>\` is focusable, announces its role, and fires on Enter and Space for free. A \`<div>\` with an onClick is a small act of future debt. Semantic HTML is the largest a11y win available, and it's the one that costs the least.

## The non-negotiables I hold
- Every interactive element reachable and operable by keyboard.
- A visible focus style — never \`outline: none\` without a replacement.
- Color contrast that clears WCAG AA, checked, not eyeballed.
- Real screen-reader passes, not just an automated audit.

Reach comes with responsibility. If a few hundred people use what I build and I've locked some of them out, that's not an edge case — that's the job done badly.`
  },
  {
    title: "Why I read dead computer scientists",
    date: "2026-01-09",
    read: "3 min",
    blurb: "Ada Lovelace, Engelbart, Alan Kay. The frameworks change every eighteen months; the ideas underneath them are a century deep.",
    body:
`I spend real time with old writing — Lovelace's notes, Engelbart's *Augmenting Human Intellect*, Kay's talks. Not nostalgia. The opposite: the best way I know to stay current.

## The ideas outlast the syntax
Engelbart wasn't building a mouse. He was asking how tools could raise what humans are collectively capable of. Kay wasn't shipping a class hierarchy; he was arguing that the medium itself should be malleable by the person using it. Those questions are exactly the ones worth asking about AI tooling right now.

## Craft is a long conversation
Treating the field as if it started with my first framework makes me a worse engineer. The work is fundamentally human, and it's been human for a long time. Reading the people who set the standard before me is how I try to set one worth inheriting.`
  }
];

(function initBlog() {
  const listEl = document.getElementById('post-list');
  const articleEl = document.getElementById('post-article');
  const backBtn = document.getElementById('post-back');
  if (!listEl) return;

  const fmtDate = (iso) => {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // escape first — never trust text into innerHTML — then apply light markdown
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  function render(md) {
    const blocks = esc(md).split(/\n\s*\n/);
    let html = '';
    const inline = (t) => t
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    for (const b of blocks) {
      const lines = b.split('\n');
      if (lines.every(l => l.trim().startsWith('- '))) {
        html += '<ul>' + lines.map(l => '<li>' + inline(l.replace(/^\s*-\s/, '')) + '</li>').join('') + '</ul>';
      } else if (b.startsWith('## ')) {
        html += '<h2>' + inline(b.slice(3)) + '</h2>';
      } else {
        html += '<p>' + inline(b.replace(/\n/g, ' ')) + '</p>';
      }
    }
    return html;
  }

  POSTS.forEach((p, i) => {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'post-row';
    row.innerHTML =
      '<span class="post-date">' + fmtDate(p.date) + '</span>' +
      '<span class="post-main"><span class="post-title">' + esc(p.title) + '</span>' +
      '<span class="post-blurb">' + esc(p.blurb) + '</span></span>' +
      '<span class="post-read">' + esc(p.read) + ' <span class="arrow">→</span></span>';
    row.addEventListener('click', () => openPost(i));
    listEl.appendChild(row);
  });

  function openPost(i) {
    const p = POSTS[i];
    document.getElementById('a-date').textContent = fmtDate(p.date) + ' · ' + p.read + ' read';
    document.getElementById('a-title').textContent = p.title;
    document.getElementById('a-body').innerHTML = render(p.body);
    listEl.classList.add('hidden');
    articleEl.classList.remove('hidden');
    articleEl.focus();
    document.getElementById('writing').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  backBtn.addEventListener('click', () => {
    articleEl.classList.add('hidden');
    listEl.classList.remove('hidden');
    document.getElementById('writing').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();
