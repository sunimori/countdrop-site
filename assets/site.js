(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('[data-header]');
  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const reveals = document.querySelectorAll('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((item) => item.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    reveals.forEach((item) => observer.observe(item));
  }

  const tabs = [...document.querySelectorAll('.world-tab')];
  const stage = document.querySelector('[data-world-stage]');
  const image = document.querySelector('[data-world-image]');
  const name = document.querySelector('[data-world-name]');
  const kicker = document.querySelector('[data-world-kicker]');
  const copy = document.querySelector('[data-world-copy]');
  let worldIndex = 0;
  let worldTimer;

  const chooseWorld = (nextIndex, userInitiated = false) => {
    const tab = tabs[nextIndex];
    if (!tab || !stage || !image) return;
    worldIndex = nextIndex;
    tabs.forEach((item, index) => {
      const active = index === nextIndex;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', String(active));
    });
    stage.style.setProperty('--world-accent', tab.dataset.accent);
    stage.classList.add('is-changing');
    window.setTimeout(() => {
      image.src = tab.dataset.src;
      image.alt = `${tab.dataset.name} theme gameplay`;
      name.textContent = tab.dataset.name;
      kicker.textContent = tab.dataset.kicker;
      copy.textContent = tab.dataset.copy;
      stage.classList.remove('is-changing');
    }, reducedMotion ? 0 : 180);
    if (userInitiated) restartWorldTimer();
  };

  const restartWorldTimer = () => {
    window.clearInterval(worldTimer);
    if (!reducedMotion && tabs.length) worldTimer = window.setInterval(() => chooseWorld((worldIndex + 1) % tabs.length), 5200);
  };

  tabs.forEach((tab, index) => tab.addEventListener('click', () => chooseWorld(index, true)));
  const preloadWorlds = () => tabs.slice(1).forEach((tab) => {
    const preload = new Image();
    preload.src = tab.dataset.src;
  });
  if ('requestIdleCallback' in window) window.requestIdleCallback(preloadWorlds, { timeout: 2500 });
  else window.setTimeout(preloadWorlds, 1200);
  restartWorldTimer();

  const video = document.querySelector('video');
  if (video && !reducedMotion && 'IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    }, { threshold: .2 });
    videoObserver.observe(video);
  }
  document.querySelectorAll('[data-year]').forEach((node) => { node.textContent = String(new Date().getFullYear()); });

  document.querySelectorAll('[data-copy-email]').forEach((button) => {
    button.addEventListener('click', () => {
      const email = button.dataset.copyEmail;
      const originalLabel = button.textContent;
      const fallbackCopy = () => {
        const field = document.createElement('textarea');
        field.value = email;
        field.setAttribute('readonly', '');
        field.style.position = 'fixed';
        field.style.opacity = '0';
        document.body.appendChild(field);
        field.select();
        document.execCommand('copy');
        field.remove();
      };
      button.textContent = 'Email copied';
      if (navigator.clipboard?.writeText) navigator.clipboard.writeText(email).catch(fallbackCopy);
      else fallbackCopy();
      window.setTimeout(() => { button.textContent = originalLabel; }, 2200);
    });
  });
})();
