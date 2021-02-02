import React, {Component} from 'react'
var moment = require('moment');

class SurfForecast extends Component {

    render () {

        if (!this.state.forecast || !this.state.forecast.data || !this.state.forecast.data.wave ) {
            return <span>Loading...</span>;
          }

        return (
            // <div>
            //     <div class="card">
            //         <div class="card-body">
            //             <h5 class="card-title">{this.state.weather.timezone}</h5>
            //             <h6 class="card-subtitle mb-2 text-muted">{this.state.weather.current.weather[0].main}</h6>
            //             <p class="card-text">
            //             temp: {this.state.weather.current.temp} C <br/>
            //             feels like: {this.state.weather.current.feels_like} C
            //             </p>
            //             {/* <p class="card-text">feels like: {this.state.weather.current.feels_like} C</p> */}
            //         </div>
            //     </div>
            //     <Forecast forecast={ this.state.weather.daily } /> 
            // </div>
            <div>
                <center><div>Surf Forcast</div></center>
                {this.state.forecast.data.wave.map((f) => (
                    <div key={f.timestamp} class="card">
                        <div class="card-body">
                            <h6 class="card-subtitle mb-2 text-muted">{ moment(new Date(f.timestamp * 1000)).format('ddd, MMM D') }</h6>
                            <h5 class="card-title">{f.surf.min} - {f.surf.max}</h5>
                            {/* <h6 class="card-subtitle mb-2 text-muted">{w.weather[0].description}</h6>
                            <p class="card-text">
                                max: {w.temp.max} C <br/>
                                min: {w.temp.min} C</p> */}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    state = {
        forecast: []
    }

    componentDidMount() {
        // lawrencetown forecast
        fetch('https://services.surfline.com/kbyg/spots/forecasts/wave?spotId=584204204e65fad6a77094cf&intervalHours=24')
        .then(res => res.json())
        .then((data) => {
            this.setState({ forecast: data })
            console.log(data)
        })
        .catch(console.log)
    }
    
};

export default SurfForecast;