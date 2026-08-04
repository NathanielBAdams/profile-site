// src/sections/Home.tsx

import Section from "../../components/Section";

function Home() {
  return (
    <Section>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Hi, I’m Nathaniel 👋</h1>
      <p style={{ fontSize: '1.25rem', lineHeight: 1.6, color: '#333' }}>
        I’m a software engineer, musician, and pizza obsessive based in NYC. 
        This site is a little corner for my work, music, and weekly dough rituals.
      </p>
    </Section>
  );
}

export default Home;
