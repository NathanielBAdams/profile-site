import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
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
        <Switch>
          <Route path='/music'>
            <Music />
          </Route>
          <Route path='/software'>
            <Software />
          </Route>
          <Route path='/contact'>
            <Contact />
          </Route>
          <Route path='/'>
            <Home />
          </Route>
        </Switch>
      </Router>
      <div class='footer'>@naaadams</div>
    </div>
  );
}

export default App;
