document.addEventListener('DOMContentLoaded', () => {
  const m = document.querySelector('#switch-settings');
  const d = document.querySelector('#settings');
  const u = document.querySelector('#advanced-settings');
  if (!m || !d || !u) return;

  // Capture the click early and prevent the original handler from running
  m.addEventListener(
    'click',
    ev => {
      ev.stopImmediatePropagation();
      ev.preventDefault();
      try {
        if (u.hidden) {
          u.hidden = false;
          d.style.display = 'none';
          m.textContent = 'Go back to settings';
        } else {
          u.hidden = true;
          d.style.display = 'flex';
          m.textContent = 'Advanced settings';
        }
      } catch (err) {
        console.warn('switch-fix: toggle failed', err);
      }
    },
    true
  );
});
