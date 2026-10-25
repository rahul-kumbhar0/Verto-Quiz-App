document.querySelectorAll('.cp').forEach(b => b.addEventListener('click', async () => {
  const box = b.parentElement, text = [...box.childNodes].filter(n => n !== b).map(n => n.textContent).join('').trim();
  let ok = false;
  try { await navigator.clipboard.writeText(text); ok = true; } catch (e) {}
  if (!ok) { const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select();
    try { ok = document.execCommand('copy'); } catch (e) {} ta.remove(); }
  b.textContent = ok ? 'Copied ✓' : 'Hold to copy'; b.classList.toggle('ok', ok);
  setTimeout(() => { b.textContent = 'Copy'; b.classList.remove('ok'); }, 1800);
}));
