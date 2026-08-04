// src/sections/Pizza.tsx
import Section from '../../components/Section';
import Slideshow from '../../components/Slideshow'; // we’ll build this too

function Pizza() {
  return (
    <Section>
      <div style={styles.container}>
        <div style={styles.text}>
          <h2 style={styles.heading}>Pizza</h2>
          <p style={styles.paragraph}>
            Every Sunday, I make pizza from scratch. What started as a Covid exploration has become a little ritual that blends creativity, fermentation, and carbs. Here's a taste:
          </p>
        </div>

        <div style={styles.slideshow}>
          <Slideshow />
        </div>
      </div>
    </Section>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '2rem',
    textAlign: 'center' as const,
  },
  text: {
    maxWidth: '600px',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '1rem',
  },
  paragraph: {
    fontSize: '1.125rem',
    lineHeight: 1.6,
  },
  slideshow: {
    maxWidth: '640px',
    width: '100%',
  },
};

export default Pizza;
