import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Music from './pages/Music';
import Software from './pages/Software';
import Contact from './pages/Contact';
import NavBar from './components/NavBar';

function App() {
  return (
    <div className='App'>
      <Router>
        <NavBar />
        <Switch path='/music'>
          <Music />
        </Switch>
        <Switch path='/software'>
          <Software />
        </Switch>
        <Switch path='/contact'>
          <Contact />
        </Switch>
        <Switch path='/'>
          <Home />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
