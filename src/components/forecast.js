import React from 'react'
var moment = require('moment');

const Forecast = ({ forecast }) => {
    
    if (!forecast || !forecast[0].weather) {
        return <span>Loading...</span>;
      }
    
    return (
    <div>
        <center><h1>Weather</h1></center>
        {forecast.map((w) => (
            
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

export default Forecast