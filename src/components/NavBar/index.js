import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <div className='navbar'>
      <nav className='menu'>
        <Link to='/'>
          <h5 className='title link'>Nathaniel Adams</h5>
        </Link>
        <Link to='/music'>
          <h5 className='link'>Music</h5>
        </Link>
        <Link to='/software'>
          <h5 className='link'>Software</h5>
        </Link>
        <Link to='/contact'>
          <h5 className='link'>Contact</h5>
        </Link>
      </nav>
    </div>
  );
}
