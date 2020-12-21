import './App.css';
import React from 'react';
import './components/Sidebar';
import './components/Chat';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom';


function App() {

  

  return (
    <div className="app">
      <div className='app__body'>
        <Router>

        
        <Sidebar />
        <Switch>
          <Route path = '/rooms/:roomId'>
              <Chat messages/>
          </Route>
          <Route path = '/'>
              <Chat messages/>
          </Route>

        </Switch>

        </Router>
      </div>
    </div>
  );
}

export default App;
