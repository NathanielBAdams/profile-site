// src/components/Section.tsx
import { ReactNode } from 'react';

type SectionProps = {
  children: ReactNode;
};

function Section({ children }: SectionProps) {
  return (
    <section style={styles.wrapper}>
      <div style={styles.content}>{children}</div>
    </section>
  );
}

const styles = {
  wrapper: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 2rem',
  },
  content: {
    maxWidth: '800px',
    width: '100%',
    textAlign: 'center' as const,
  },
};

export default Section;
