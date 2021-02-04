import React, {Component} from 'react';
import Card from 'react-bootstrap/Card'
var moment = require('moment');

class MyFeed extends Component {

    constructor () {
        super();
        this.state = {
            forecast: [],
            surf_spots: [],
            surf_data: []
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

    render () {
        if (!this.state.forecast.current || !this.state.forecast.daily || !this.state.forecast.daily[0].weather || !this.state.surf_spots.length > 0 || !this.state.surf_spots[0].waves) { return <span>Loading...</span>; }
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
                                id: {spot.id}
                            </Card.Text>
                            <hr />
                            <Card.Subtitle className="mb-2 text-muted">{spot.waves[0].surf.min}-{spot.waves[0].surf.max}</Card.Subtitle>
                            <Card.Text>
                                max: {this.getWeeklyHigh()[0]}c on {moment(new Date(this.getWeeklyHigh()[1] * 1000)).format('ddd, MMM D')}<br/>
                                min: {this.getWeeklyLow()[0]}c on {moment(new Date(this.getWeeklyLow()[1] * 1000)).format('ddd, MMM D')}
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
            
            //getting surf data for each spot
            spots.forEach(function(spot, i) {
                console.log("ID", spot.id)
                fetch('http://localhost:3001/testAPI/surfdata?spot_id=' + spot.id)
                .then(res => res.json())
                .then((waves) => {
                    console.log("DATA", waves);
                    spot.waves = waves.data.wave;
                    this.setState({surf_spots: this.state.surf_spots.concat(spot)});
                    console.log("TEST", this.state.surf_spots)
                });
            }, this);
            // for (var i = 0; i < spots.length; i++) {

            //     //console.log(spots[i].data = this.getSurfData(spots[i].id));


            //     //this.setState(surf_spots: this.state.surf_spots.concat())
            //     // fetch('http://localhost:3001/testAPI/surfdata?spot_id=' + spots[i].id)
            //     // .then(res => res.json())
            //     // .then((data) => {
            //     //     this.setState({surf_data: this.state.surf_data.concat(data)})
            //     //     console.log(this.state.surf_data)
            //     // }).catch(console.log) 
                
            // }
            //console.log("TEST", this.state.surf_spots)
        }).catch(console.log) 
    } 
};

export default MyFeed;