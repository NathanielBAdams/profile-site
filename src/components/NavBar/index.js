import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <div className='navbar'>
      <nav className='menu'>
        <Link className='link' to='/'>
          <h5 className='title'>Nathaniel Adams</h5>
        </Link>
        <div className='sub-menu'>
          <Link className='link' to='/music'>
            Music
          </Link>
          <Link className='link' to='/software'>
            Software
          </Link>
          <Link className='link' to='/contact'>
            Contact
          </Link>
        </div>
      </nav>
    </div>
  );
}
