// src/sections/Music.tsx
import Section from '../../components/Section';

function Music() {
  return (
    <Section>
      <div style={styles.container}>
        <div style={styles.text}>
          <h2 style={styles.heading}>Music</h2>
          <p style={styles.paragraph}>
            Outside of tech, I’m a choral conductor and composer. I’ve led choirs of all sizes, collaborated with ensembles across NYC, and written music for voices and instruments.
          </p>

          <p style={styles.paragraph}>
            You can listen to some of my choral work on{' '}
            <a href="https://soundcloud.com/your-soundcloud-profile" target="_blank" rel="noopener noreferrer" style={styles.link}>
              SoundCloud
            </a>.
          </p>

          <p style={styles.paragraph}>
            My published works include pieces for SATB choir, chamber ensembles, and solo voices. I’m also available for contracting singers for studio or live performances.
            Feel free to <a href="mailto:your@email.com" style={styles.link}>get in touch</a>!
          </p>

          <ul style={styles.list}>
            <li>🗂 "Lumen" – SATB, piano (available via [Publisher Name])</li>
            <li>🎶 "Evening Prayer" – SSA, string quartet</li>
            <li>📄 Full list available on request</li>
          </ul>
        </div>

        {/* Optional image area */}
        {/* 
        <img 
          src={yourImage} 
          alt="Conducting" 
          style={styles.image} 
        /> 
        */}
      </div>
    </Section>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row' as const,
    gap: '2rem',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexWrap: 'wrap' as const,
  },
  text: {
    maxWidth: '500px',
    textAlign: 'left' as const,
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '1rem',
  },
  paragraph: {
    fontSize: '1.125rem',
    lineHeight: 1.6,
    marginBottom: '1rem',
  },
  link: {
    color: '#1a1a1a',
    textDecoration: 'underline',
  },
  list: {
    fontSize: '1rem',
    marginTop: '1rem',
    paddingLeft: '1.2rem',
  },
  image: {
    maxWidth: '240px',
    borderRadius: '8px',
    objectFit: 'cover' as const,
  },
};

export default Music;
