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
      <p>
        <Link to='/pizza'>
          I also make pizza from scratch on a weekly basis.
        </Link>
      </p>
    </div>
  );
}

/*
TODO: Next steps 
 - sync pizzaPics bucket to site - prebuild
 - Is this triggered differently through amplify?
 - Render all the pics in a custom pizzaPic components
 - Need a PizzaPicContainer as well

 - Make a wireframe for music and software - decide what you want to share.
 - flesh those out as well
  - get it all deployed to amplify URL
  - link it up to nathaniel-adams.com DNS record
  - PROFIT
*/
