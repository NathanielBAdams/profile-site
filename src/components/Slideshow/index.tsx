import { useEffect, useRef, useState } from 'react';
import image1 from '../../assets/pizza_1.jpeg';
import image2 from '../../assets/pizza_2.jpeg';
import image3 from '../../assets/pizza_3.jpeg';

const images = [image1, image2, image3];
const AUTO_CYCLE_INTERVAL = 4000;

function Slideshow() {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [isFading, setIsFading] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const startAutoCycle = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      triggerNext();
    }, AUTO_CYCLE_INTERVAL);
  };

  const triggerNext = () => {
    setPrevIndex(index);
    setIsFading(true);
    setIndex((prev) => (prev + 1) % images.length);
  };

  const triggerPrev = () => {
    setPrevIndex(index);
    setIsFading(true);
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    startAutoCycle();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isFading) return;
    const timeout = setTimeout(() => {
      setIsFading(false);
      setPrevIndex(null);
    }, 500); // match transition duration
    return () => clearTimeout(timeout);
  }, [isFading]);

  const handleNext = () => {
    triggerNext();
    startAutoCycle(); // restart interval
  };

  const handlePrev = () => {
    triggerPrev();
    startAutoCycle(); // restart interval
  };

  return (
    <div style={styles.wrapper}>
      {/* Previous image fades out */}
      {prevIndex !== null && (
        <img
          src={images[prevIndex]}
          alt={`Pizza ${prevIndex + 1}`}
          style={{
            ...styles.image,
            opacity: isFading ? 0 : 1,
            zIndex: 1,
          }}
        />
      )}

      {/* Current image fades in */}
      <img
        src={images[index]}
        alt={`Pizza ${index + 1}`}
        style={{
          ...styles.image,
          opacity: 1,
          zIndex: 2,
        }}
      />

      <div style={styles.controls}>
        <button onClick={handlePrev} style={styles.button}>←</button>
        <button onClick={handleNext} style={styles.button}>→</button>
      </div>
    </div>
  );
}

const baseImageStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const, // ✅ keeps images from squishing
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'opacity 0.5s ease-in-out',
  };
  

const styles = {
    wrapper: {
        position: 'relative' as const,
        width: '100%',
        aspectRatio: '4 / 3', // or '16 / 9', depending on your photos
        overflow: 'hidden' as const,
      },
  image: {
    ...baseImageStyle,
  },
  controls: {
    marginTop: '0.5rem',
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    position: 'relative' as const,
    zIndex: 10,
  },
  button: {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    cursor: 'pointer',
    backgroundColor: '#f0f0f0',
    border: 'none',
    borderRadius: '4px',
    transition: 'background 0.2s',
  },
};

export default Slideshow;
