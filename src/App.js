import logo from './logo.svg';
import './App.css';

import React, {Component} from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './components/home';
import SurfForecast from './components/surf-forecast';
import Login from './components/login';
import Signup from './components/signup';

class App extends Component {
  render () {

    return (
      <BrowserRouter>
        <div>
          <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/surf" component={SurfForecast} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
