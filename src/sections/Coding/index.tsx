// src/sections/Coding.tsx
import Section from '../../components/Section';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { HiOutlineDocumentArrowDown } from 'react-icons/hi2';

function Coding() {
  return (
    <Section>
      <div style={styles.container}>
        {/* Optional image here */}

        <div style={styles.text}>
          <h2 style={styles.heading}>Engineering</h2>
          <p style={styles.paragraph}>
            I'm a front-end engineer focused on building intuitive, performant web apps using React, TypeScript, and modern tooling.
            I care deeply about design systems, accessibility, and making software feel simple.
          </p>

          <p style={styles.paragraph}>
            I’ve worked on projects at <strong>CLEAR</strong>, collaborated with cross-functional teams, and led migrations to new UI frameworks.
          </p>

          <div style={styles.links}>
            <a
              href="https://www.linkedin.com/in/adamsnathaniel/"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.link}
            >
              <FaLinkedin size={20} style={styles.icon} />
              LinkedIn
            </a>
            <a
              href="https://github.com/NathanielBAdams"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.link}
            >
              <FaGithub size={20} style={styles.icon} />
              GitHub
            </a>
            <a
              href="https://drive.google.com/uc?export=download&id=1NksGRtliCD9-qZrCR51xql0OxoeecOh0"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.link}
            >
              <HiOutlineDocumentArrowDown size={20} style={styles.icon} />
              Resume
            </a>
          </div>
        </div>
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
  links: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
    marginTop: '1.25rem',
  },
  link: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#1a1a1a',
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: '1rem',
    lineHeight: 1.4,
    transition: 'opacity 0.2s ease-in-out',
    cursor: 'pointer',
    opacity: 0.85,
  },
  icon: {
    display: 'inline-block',
    verticalAlign: 'middle',
    marginBottom: '2px',
  },
};

export default Coding;
