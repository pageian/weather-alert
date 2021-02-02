import React, {Component} from 'react'

import Forecast from './forecast';

class Home extends Component {
    
    render () {

        if (!this.state.weather.current || !this.state.weather.daily) {
            return <span>Loading...</span>;
        }

        return (
            <div>
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">{this.state.weather.timezone}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">{this.state.weather.current.weather[0].main}</h6>
                        <p class="card-text">
                        temp: {this.state.weather.current.temp} C <br/>
                        feels like: {this.state.weather.current.feels_like} C
                        </p>
                        {/* <p class="card-text">feels like: {this.state.weather.current.feels_like} C</p> */}
                    </div>
                </div>
                <Forecast forecast={ this.state.weather.daily } />
            </div>
        );
    }
    
    state = {
        weather: []
    }

    componentDidMount() {
    // fetch('http://api.openweathermap.org/data/2.5/weather?q=Halifax&appid=a28eff83ec6108abef556025bece0213')
    fetch('http://api.openweathermap.org/data/2.5/onecall?lat=44.648618&lon=-63.5859487&exclude=minutely,hourly&units=metric&appid=a28eff83ec6108abef556025bece0213')
    .then(res => res.json())
    .then((data) => {
        this.setState({ weather: data })
        console.log(data)
    })
    .catch(console.log)
    }
    
};

export default Home;