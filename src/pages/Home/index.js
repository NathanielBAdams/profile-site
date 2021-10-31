import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className='container'>
      <p>
        I'm Nathaniel (but you can call me Nate). I'm originally from the
        suburbs of Chicago and now live in New York.
      </p>
      <p>
        <Link className='anti-link' to='/music'>
          I compose and publish music
        </Link>{' '}
        for choirs and vocal ensembles.
      </p>
      <p>
        <Link className='anti-link' to='/software'>
          I create and maintain software
        </Link>{' '}
        for modern web applications.
      </p>
      <p>I also make pizza from scratch on a weekly basis.</p>
    </div>
  );
}
