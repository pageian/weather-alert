import React from 'react'
var moment = require('moment');

const Forecast = ({ forecast }) => {
    
    if (!forecast.current || !forecast.daily || !forecast.daily[0].weather) {
        return <span>Loading...</span>;
      }
    
    return (
    <div>
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">{forecast.timezone}</h5>
                <h6 class="card-subtitle mb-2 text-muted">{forecast.current.weather[0].main}</h6>
                <p class="card-text">
                temp: {forecast.current.temp} C <br/>
                feels like: {forecast.current.feels_like} C
                </p>
            </div>
        </div>
        <center><h1>Weather</h1></center>
        {forecast.daily.map((w) => (
            
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
};

export default Forecast;