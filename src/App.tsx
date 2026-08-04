// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './sections/Home';
import Coding from './sections/Coding';
import Music from './sections/Music';
import Pizza from './sections/Pizza';

function App() {
  return (
    <Router>
      <div style={{ backgroundColor: '#f9f9f9', color: '#1a1a1a', fontFamily: 'sans-serif' }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/coding" element={<Coding />} />
          <Route path="/music" element={<Music />} />
          <Route path="/pizza" element={<Pizza />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
