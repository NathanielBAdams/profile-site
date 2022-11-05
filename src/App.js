import Amplify, { Storage } from 'aws-amplify';
import awsconfig from './aws-exports';

import './App.css';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import Music from './pages/Music';
import Software from './pages/Software';
import Contact from './pages/Contact';
import Pizza from './pages/Pizza';
import NavBar from './components/NavBar';

Amplify.configure(awsconfig);

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
          <Route path='/pizza'>
            <Pizza />
          </Route>
          <Route path='/'>
            <Home />
          </Route>
        </Switch>
      </Router>
      <div className='footer'>@naaadams</div>
    </div>
  );
}

export default App;
