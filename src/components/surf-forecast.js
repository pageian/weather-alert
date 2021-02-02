import React, {Component} from 'react'
var moment = require('moment');

class SurfForecast extends Component {

    constructor() {
        super();
        this.state = {
            forecast: []
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

    render () {

        if (!this.state.forecast || !this.state.forecast.data || !this.state.forecast.data.wave) {
            return <span>Loading...</span>;
        }

        var periods = []


        return (
            <div>
                <center><div>Surf Forcast</div></center>
                {this.state.forecast.data.wave.map((f) => (
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

    componentDidMount() {
        // lawrencetown forecast
        fetch('https://services.surfline.com/kbyg/spots/forecasts/wave?spotId=584204204e65fad6a77094cf&intervalHours=24')
        .then(res => res.json())
        .then((data) => {
            this.setState(
                { forecast: data })
            console.log(data)
        })
        .catch(console.log)
    } 
};

export default SurfForecast;