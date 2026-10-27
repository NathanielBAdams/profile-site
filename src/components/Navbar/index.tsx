import * as Popover from '@radix-ui/react-popover';
import { useState } from 'react';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/choral-contracting/', label: 'Choral contracting' },
  { href: '/music/', label: 'Music' },
  { href: '/software/', label: 'Software' },
];

type NavbarProps = {
  currentPath: string;
};

const normalize = (p: string) => (p.endsWith('/') ? p : `${p}/`);

function Navbar({ currentPath }: NavbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <a href="/" className="nav-name">Nate Adams</a>

        <div className="nav-controls">
          <div className="desktop-nav">
            {NAV_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className={`nav-link ${normalize(currentPath) === href ? 'active' : ''}`}
              >
                {label}
              </a>
            ))}
          </div>

          <div className="mobile-nav">
            <Popover.Root open={open} onOpenChange={setOpen}>
              <Popover.Trigger asChild>
                <button className="hamburger" aria-label="Open menu">☰</button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  className="popover-content"
                  side="bottom"
                  align="end"
                  sideOffset={8}
                >
                  {NAV_LINKS.map(({ href, label }) => (
                    <a
                      key={href}
                      href={href}
                      onClick={() => setOpen(false)}
                      className="popover-link"
                    >
                      {label}
                    </a>
                  ))}
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
