(function () {
  /* Nav morph on scroll — same behavior as the main site's floating pill nav */
  var navInner = document.getElementById('nav-inner');
  if (!navInner) return;
  function tick() { navInner.classList.toggle('scrolled', window.scrollY > 60); }
  tick();
  window.addEventListener('scroll', tick, { passive: true });
})();

(function () {
  /* Hero media video — lazy-load and only autoplay while it's actually on screen */
  var heroVids = document.querySelectorAll('.hero-vid');
  if (heroVids.length) {
    var vidIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) {
          if (!v.src && v.dataset.src) v.src = v.dataset.src;
          v.play().catch(function () {});
        } else {
          v.pause();
        }
      });
    }, { threshold: 0.25 });
    heroVids.forEach(function (v) { vidIO.observe(v); });
  }
})();

(function () {
  /* Scroll reveal — blur/fade in whole sections as they enter view, same treatment as the main site.
     Each h2 in the article body (plus everything under it until the next h2) is grouped into one
     reveal unit, so a heading never fades in separately from the text underneath it. */
  var body = document.querySelector('.article-body');
  if (body) {
    var kids = Array.prototype.slice.call(body.children);
    var section = null;
    kids.forEach(function (el) {
      if (el.tagName === 'H2') {
        section = document.createElement('div');
        section.className = 'reveal-section';
        el.parentNode.insertBefore(section, el);
        section.appendChild(el);
      } else if (section) {
        section.appendChild(el);
      }
    });
  }

  var revealSelectors = ['.quick-answer', '.reveal-section', '.faq-item', '.blog-cta', '.blog-featured', '.blog-latest'];
  var revealEls = document.querySelectorAll(revealSelectors.join(','));
  revealEls.forEach(function (el, i) {
    el.classList.add('blur-rv');
    if (el.classList.contains('faq-item') && i % 4) el.style.transitionDelay = Math.min(i % 4, 3) * 0.06 + 's';
  });
  var revealIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('vi'); revealIO.unobserve(e.target); } });
  }, { threshold: 0.1 });
  revealEls.forEach(function (el) { revealIO.observe(el); });
})();

(function () {
  var body = document.querySelector('.article-body');
  if (!body) return;

  var headings = Array.prototype.slice.call(body.querySelectorAll('h2'));
  if (headings.length < 2) return;

  var used = {};
  function slugify(text) {
    var base = text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'section';
    var slug = base, n = 2;
    while (used[slug]) { slug = base + '-' + n++; }
    used[slug] = true;
    return slug;
  }

  var island = document.createElement('nav');
  island.className = 'toc-island';
  island.setAttribute('aria-label', 'Table of contents');

  var links = headings.map(function (h) {
    if (!h.id) h.id = slugify(h.textContent);
    var a = document.createElement('a');
    a.href = '#' + h.id;
    var label = document.createElement('span');
    label.className = 'toc-label';
    label.textContent = h.textContent;
    a.appendChild(label);
    island.appendChild(a);
    return { link: a, heading: h };
  });

  document.body.appendChild(island);

  function setActive(id) {
    links.forEach(function (l) {
      l.link.classList.toggle('active', l.heading.id === id);
    });
  }
  setActive(headings[0].id);

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-15% 0px -70% 0px', threshold: 0 });
  headings.forEach(function (h) { observer.observe(h); });

  var footer = document.querySelector('.blog-footer');
  function updateVisibility() {
    var pastHero = window.scrollY > 400;
    var nearFooter = footer && footer.getBoundingClientRect().top < window.innerHeight;
    island.classList.toggle('visible', pastHero && !nearFooter);
  }
  updateVisibility();
  window.addEventListener('scroll', updateVisibility, { passive: true });
  window.addEventListener('resize', updateVisibility);
})();
