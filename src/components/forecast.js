import React, {Component} from 'react'
var moment = require('moment');

class Forecast extends Component {
    
    constructor() {
        super();
        this.state = {
            forecast: []
        }
    }

    render () {
        if (!this.state.forecast.current || !this.state.forecast.daily || !this.state.forecast.daily[0].weather) { return <span>Loading...</span>; }
        else {
            return (
                <div>
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">{this.state.forecast.timezone}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">{this.state.forecast.current.weather[0].main}</h6>
                            <p class="card-text">
                            temp: {this.state.forecast.current.temp} C <br/>
                            feels like: {this.state.forecast.current.feels_like} C
                            </p>
                        </div>
                    </div>
                    <center><h1>Weather</h1></center>
                    {this.state.forecast.daily.map((w) => (
                        
                        <div key={w.dt} class="card">
                            <div class="card-body">
                                <h6 class="card-subtitle mb-2 text-muted">{ moment(new Date(w.dt * 1000)).format('ddd, MMM D') }</h6>
                                <h5 class="card-title">{w.weather[0].main} <img src={"http://openweathermap.org/img/wn/" + w.weather[0].icon + "@2x.png"}></img></h5>
                                <h6 class="card-subtitle mb-2 text-muted">{w.weather[0].description}</h6>
                                <p class="card-text">
                                    max: {w.temp.max} C <br/>
                                    min: {w.temp.min} C</p>
                            </div>
                        </div>
                    
                    ))}
                </div>
            )
        }   
    }
    
    componentDidMount() {
        // fetch('http://api.openweathermap.org/data/2.5/weather?q=Halifax&appid=a28eff83ec6108abef556025bece0213')
        fetch('http://api.openweathermap.org/data/2.5/onecall?lat=44.648618&lon=-63.5859487&exclude=minutely,hourly&units=metric&appid=a28eff83ec6108abef556025bece0213')
        .then(res => res.json())
        .then((data) => {
            this.setState({ forecast: data })
            console.log(data)
    
        }).catch(console.log)   
    } 
};

export default Forecast;