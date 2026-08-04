import { Link, useLocation } from 'react-router-dom';
import * as Popover from '@radix-ui/react-popover';
import { useState } from 'react';

function Navbar() {
    const location = useLocation();
    const [open, setOpen] = useState(false);
  
    return (
      <nav className="navbar">
        <div className="navbar-inner">
            {/* Left side: always visible */}
            <Link to="/" className="nav-name">Nathaniel Adams</Link>
    
            {/* Right side: responsive nav controls */}
            <div className="nav-controls">
            {/* Desktop links */}
            <div className="desktop-nav">
                <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
                <Link to="/coding" className={`nav-link ${location.pathname === '/coding' ? 'active' : ''}`}>Coding</Link>
                <Link to="/music" className={`nav-link ${location.pathname === '/music' ? 'active' : ''}`}>Music</Link>
                <Link to="/pizza" className={`nav-link ${location.pathname === '/pizza' ? 'active' : ''}`}>Pizza</Link>
            </div>
    
            {/* Mobile hamburger */}
            <div className="mobile-nav">
                <Popover.Root open={open} onOpenChange={setOpen}>
                <Popover.Trigger asChild>
                    <button className="hamburger">☰</button>
                </Popover.Trigger>
                <Popover.Portal>
                <Popover.Content
                    className="popover-content"
                    side="bottom"
                    align="end"
                    sideOffset={8}
                    >
                    <Link to="/" onClick={() => setOpen(false)} className="popover-link">Home</Link>
                    <Link to="/coding" onClick={() => setOpen(false)} className="popover-link">Coding</Link>
                    <Link to="/music" onClick={() => setOpen(false)} className="popover-link">Music</Link>
                    <Link to="/pizza" onClick={() => setOpen(false)} className="popover-link">Pizza</Link>
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
