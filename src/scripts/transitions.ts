// Page-to-page motion, with Astro's client router (see Layout.astro).
//
// - Direction: the pages have an order (Home, Choral contracting, Music,
//   Software), so a move to a later page slides the content in from the
//   right and a move back slides it in from the left (global.css).
// - The staff stays put (Staff.astro).

const ORDER = ['/', '/choral-contracting/', '/music/', '/software/'];
const index = (u: URL) => ORDER.indexOf(u.pathname.endsWith('/') ? u.pathname : `${u.pathname}/`);

document.addEventListener('astro:before-preparation', (e) => {
  const from = index(e.from);
  const to = index(e.to);
  if (from >= 0 && to >= 0 && from !== to) e.direction = to > from ? 'forward' : 'back';

  // The staff holds still only when the page is at the top, where it sits in
  // the same place on every page. Scrolled down, it would jump to the new
  // page's top, so it arrives with the new page instead.
  const staff = document.querySelector<HTMLCanvasElement>('canvas.staff');
  if (staff && window.scrollY > 2) staff.style.viewTransitionName = 'none';
});

document.addEventListener('astro:before-swap', (e) => {
  const staff = document.querySelector<HTMLCanvasElement>('canvas.staff');
  if (staff?.style.viewTransitionName) {
    e.viewTransition.finished.finally(() => (staff.style.viewTransitionName = ''));
  }
});

// The router swaps in the new page's <html> attributes. Mark it as reached by
// the router, so entrance animations meant for a fresh load stay put.
document.addEventListener('astro:after-swap', () => {
  document.documentElement.classList.add('routed');
});
