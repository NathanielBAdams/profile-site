export default function Home() {
  return (
    <div className='container'>
      <p>
        I'm Nathaniel (but you can call me Nate). I'm originally from the
        suburbs of Chicago and now live in New York.
      </p>
      <p>
        <a href='/music' className='anti-link'>
          I compose and publish music
        </a>{' '}
        for choirs and vocal ensembles.
      </p>
      <p>
        <a href='/music' className='anti-link'>
          I create and maintain software
        </a>{' '}
        for modern web applications.
      </p>
      <p>I also make pizza from scratch on a weekly basis.</p>
    </div>
  );
}
