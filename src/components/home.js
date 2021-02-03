import React, {Component} from 'react'
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';

import Forecast from './forecast';
import SurfForecast from './surf-forecast';

class Home extends Component {
    
    constructor() {
        super();
        this.state = {
            weather: []
        }
    }

    logout() {
        console.log("TEST")
        const cookies = new Cookies();
        cookies.set('uid', "");
        this.forceUpdate()
    }

    render () {

        // redirecting to login if no active user
        const cookies = new Cookies();
        if(cookies.get('uid') == "" || !cookies.get('uid')){ return <Redirect to="/login" />; }
        else {

            
            return (
                <div>
                    <nav class="navbar navbar-expand-lg navbar-light bg-light">
                        <a class="navbar-brand" href="#">Surf Alert</a>
                        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarNavDropdown">
                            <ul class="navbar-nav">
                                <li class="nav-item active">
                                    <a class="nav-link" href="#">Weather Forecast <span class="sr-only">(current)</span></a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="#">Surf Forecast</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="#">Settings</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" onClick={() => this.logout()}>Logout</a>
                                </li>
                            </ul>
                        </div>
                    </nav>
                    <Forecast forecast={ this.state.weather } />
                    <SurfForecast></SurfForecast>
                </div>
            );
        }
    }

    componentDidMount() {
        // fetch('http://api.openweathermap.org/data/2.5/weather?q=Halifax&appid=a28eff83ec6108abef556025bece0213')
        fetch('http://api.openweathermap.org/data/2.5/onecall?lat=44.648618&lon=-63.5859487&exclude=minutely,hourly&units=metric&appid=a28eff83ec6108abef556025bece0213')
        .then(res => res.json())
        .then((data) => {
            this.setState({ weather: data })
            console.log(data)

        }).catch(console.log)     
    };
}

export default Home;