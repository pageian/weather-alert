import React, {Component} from 'react'
var moment = require('moment');

class SurfForecast extends Component {

    constructor() {
        super();
        this.state = {
            surf_forecast: [],
            wind_forecast: []
        }
    }

    maxPeriod(swells) {
        
        // trimming empty records
        for(var i = 0; i < swells.length; i++){
            if(swells[i].height == 0) {
                swells.splice(i, 1);
            }
        }

        // retreiving main swell
        var maxi = -1;
        var maxheight = -1;
        for(var i = 0; i < swells.length; i++){
            if(swells[i].height > maxheight) {
                maxi = i;
                maxheight = swells[i].height;
            }
        }

        return swells[maxi].period
    }

    // adds windscore to surf forecast for full score
    addWindScore() {

        for(var i = 0; i < this.state.wind_forecast.data.wind.length; i++) {
            console.log(this.state.surf_forecast.data.wave[i].surf.optimalScore)
            
            
            console.log(this.state.surf_forecast.data.wave[i].surf.optimalScore, " + ", this.state.wind_forecast.data.wind[i].optimalScore,
            " = ", this.state.surf_forecast.data.wave[i].surf.optimalScore + this.state.wind_forecast.data.wind[i].optimalScore)
                
            this.state.surf_forecast.data.wave[i].surf.optimalScore += this.state.wind_forecast.data.wind[i].optimalScore;
    
        }
    }

    render () {

        if (!this.state.surf_forecast || !this.state.surf_forecast.data
            || !this.state.surf_forecast.data.wave || !this.state.wind_forecast
            || !this.state.wind_forecast.data || !this.state.wind_forecast.data.wind) {
            return <span>Loading...</span>;
        
        } else {
            this.addWindScore()
            return (
                <div>
                    <center><div>Surf Forcast</div></center>
                    {this.state.surf_forecast.data.wave.map((f) => (
                        <div key={f.timestamp} class="card">
                            <div class="card-body">
                                <h6 class="card-subtitle mb-2 text-muted">{ moment(new Date(f.timestamp * 1000)).format('ddd, MMM D') }</h6>
                                <h5 class="card-title">{f.surf.min}-{f.surf.max}m @ {this.maxPeriod(f.swells)}s</h5>
                                <h6 class="card-subtitle mb-2 text-muted">{f.surf.optimalScore}*</h6>
                                {/* <p class="card-text">
                                    max: {w.temp.max} C <br/>
                                    min: {w.temp.min} C</p> */}
                            </div>
                        </div>
                    ))}
                </div>
            );
        }
    }

    componentDidMount() {
        // lawrencetown forecast
        fetch('https://services.surfline.com/kbyg/spots/forecasts/wave?spotId=58bdfa7882d034001252e3d8&intervalHours=24')
        .then(res => res.json())
        .then((surf_data) => {

            this.setState({ surf_forecast: surf_data })
            console.log(surf_data)
        })
        .catch(console.log)

        // wind query
        fetch('https://services.surfline.com/kbyg/spots/forecasts/wind?spotId=58bdfa7882d034001252e3d8&intervalHours=24')
        .then(res => res.json())
        .then((data) => {
            this.setState({ wind_forecast: data })
            console.log(data)
        })
        .catch(console.log)
    } 
};

export default SurfForecast;