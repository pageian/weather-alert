import React, {Component} from 'react';
import Card from 'react-bootstrap/Card'
var moment = require('moment');

class MyFeed extends Component {

    constructor () {
        super();
        this.state = {
            forecast: [],
            surf_spots: []
        }
    }

    getWeeklyHigh() {
        var week_high = this.state.forecast.daily[0].temp.max;
        var timestamp = this.state.forecast.daily[0].dt;

        for(var i = 1; i < this.state.forecast.daily.length; i++) {
            if(this.state.forecast.daily[i].temp.max > week_high) {
                week_high = this.state.forecast.daily[i].temp.max;
                timestamp = this.state.forecast.daily[i].dt;
            }
        }

        return [week_high, timestamp];
    }

    getWeeklyLow() {
        var week_low = this.state.forecast.daily[0].temp.min;
        var timestamp = this.state.forecast.daily[0].dt;

        for(var i = 1; i < this.state.forecast.daily.length; i++) {
            if(this.state.forecast.daily[i].temp.min < week_low) {
                week_low = this.state.forecast.daily[i].temp.min;
                timestamp = this.state.forecast.daily[i].dt;
            }
        }

        return [week_low, timestamp];
    }

    getHeightRange(waves) {
        var min = waves[0].surf.min;
        var max = waves[0].surf.max;

        for(var i = 1; i < waves.length; i++) {
            if(min > waves[i].surf.min) min = waves[i].surf.min;
            if(max < waves[i].surf.max) max = waves[i].surf.max;
        }

        return (min + "-" + max + "m");
    }

    getPeriodRange(waves) {
        var min = 111;
        var max = -1;

        for(var i = 0; i < waves.length; i++) {
            // trimming empty records
            for(var j = 0; j < waves[i].swells.length; j++) {
                if(waves[i].swells[j].height == 0) {
                    waves[i].swells.splice(j, 1);
                }
            }

            // retreiving main swell
            var max_i = -1;
            var max_height = -1;
            for(var j = 0; j < waves[i].swells.length; j++) {
                if(waves[i].swells[j].height > max_height) {
                    max_i = j;
                    max_height = waves[i].swells[j].height;
                }
            }

            // comparing main swell to current ranges
            if(min > waves[i].swells[max_i].period) min = waves[i].swells[max_i].period;
            if(max < waves[i].swells[max_i].period) max = waves[i].swells[max_i].period;
        }

        return (min + "-" + max + "s");
    }

    render () {
        if (!this.state.forecast.current || !this.state.forecast.daily || !this.state.forecast.daily[0].weather
            || !this.state.surf_spots.length > 0 || !this.state.surf_spots[0].data|| !this.state.surf_spots[0].data.waves.length > 0) { return <span>Loading...</span>; }
        else {
            return (
                <div>
                    
                    <Card style={{ width: '40%', margin: 'auto' }}>
                        <Card.Body>
                            <Card.Title>Current Conditions<img style={{ float: 'right' }} src={"http://openweathermap.org/img/wn/" + this.state.forecast.current.weather[0].icon + "@2x.png"}></img></Card.Title>
                            
                            <Card.Text>
                                temp: {this.state.forecast.current.temp} C <br/>
                                feels like: {this.state.forecast.current.feels_like} C
                            </Card.Text>
                            <hr />
                            <Card.Subtitle className="mb-2 text-muted">Week Summary</Card.Subtitle>
                            <Card.Text>
                                max: {this.getWeeklyHigh()[0]}c on {moment(new Date(this.getWeeklyHigh()[1] * 1000)).format('ddd, MMM D')}<br/>
                                min: {this.getWeeklyLow()[0]}c on {moment(new Date(this.getWeeklyLow()[1] * 1000)).format('ddd, MMM D')}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    
                    {this.state.surf_spots.map((spot) => (
                        <Card key={spot.id} style={{ width: '40%', margin: 'auto' }}>
                        <Card.Body>
                            <Card.Title>{spot.name}</Card.Title>
                            
                            <Card.Text>
                                id: {spot.id} <br/>
                                {spot.data.waves[0].surf.min}-{spot.data.waves[0].surf.max}m
                            </Card.Text>
                            <hr />
                            <Card.Subtitle className="mb-2 text-muted">Week Summary</Card.Subtitle>
                            <Card.Text>
                                swell height: {this.getHeightRange(spot.data.waves)}<br/>
                                swell period: {this.getPeriodRange(spot.data.waves)}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    ))}

                </div>
            );
        }
    }

    async getSurfData(id) {
        const response = await fetch('http://localhost:3001/testAPI/surfdata?spot_id=' + id);
        return response;
    }

    async componentDidMount() {



        // getting weather data
        fetch('http://localhost:3001/testAPI/weather')
        .then(res => res.json())
        .then((data) => {
            this.setState({ forecast: data });
            console.log(data);
        }).catch(console.log) 
        
        //getting surf spots
        fetch('http://localhost:3001/testAPI/surfspots')
        .then(res => res.json())
        .then((spots) => {
            
            //getting wave data for each spot
            spots.forEach(function(spot, i) {
                console.log("ID", spot.id)
                fetch('http://localhost:3001/testAPI/surfdata?spot_id=' + spot.id)
                .then(res => res.json())
                .then((data) => {
                    console.log("DATA", data);
                    spot.data = data;
                    this.setState({surf_spots: this.state.surf_spots.concat(spot)});
                    console.log("TEST", this.state.surf_spots)

                });
            }, this);
        }).catch(console.log) 
    } 
};

export default MyFeed;