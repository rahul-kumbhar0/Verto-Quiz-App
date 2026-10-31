document.querySelectorAll('.cp').forEach(b => b.addEventListener('click', async () => {
  const box = b.parentElement, text = [...box.childNodes].filter(n => n !== b).map(n => n.textContent).join('').trim();
  let ok = false;
  try { await navigator.clipboard.writeText(text); ok = true; } catch (e) {}
  if (!ok) { const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select();
    try { ok = document.execCommand('copy'); } catch (e) {} ta.remove(); }
  b.textContent = ok ? 'Copied ✓' : 'Hold to copy'; b.classList.toggle('ok', ok);
  setTimeout(() => { b.textContent = 'Copy'; b.classList.remove('ok'); }, 1800);
}));

// Our-apps promo: injected on every page above the follow card (one place to edit for the whole site).
(function () {
  var el = document.createElement('div');
  el.className = 'apps';
  el.innerHTML = '<div class="hd">OUR APPS · MADE BY THE SAME TEAM</div>' +
    '<a class="app" href="https://play.google.com/store/apps/details?id=com.docxify.app" target="_blank" rel="noopener">' +
    '<span class="ic">📄</span><div><b>Docxify: 300+ PDF Tools, Offline</b>' +
    '<span>Resume under 200 KB for upload portals · exam-form photo & signature sizes (SSC, IBPS, UPSC…) · scan, merge, sign, convert. Files stay on your phone.</span></div><em>Google Play</em></a>' +
    '<a class="app" href="https://play.google.com/store/apps/details?id=com.codex.torrentx" target="_blank" rel="noopener">' +
    '<span class="ic">⚡</span><div><b>8XDL: Secure Download Manager</b>' +
    '<span>Private browser + fast download manager + media player & file manager. 4.8★ on Google Play.</span></div><em>Google Play</em></a>' +
    '<div class="note">Our own Android apps (CanWe.tech). Free to install; they contain ads and optional in-app purchases.</div>';
  var follow = document.querySelector('.follow');
  if (follow && follow.parentNode) follow.parentNode.insertBefore(el, follow);
  else { var w = document.querySelector('.wrap'), f = document.querySelector('footer'); if (w) w.insertBefore(el, f || null); }
})();
