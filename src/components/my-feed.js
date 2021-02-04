import React, {Component} from 'react';
import Card from 'react-bootstrap/Card'
var moment = require('moment');

class MyFeed extends Component {

    constructor () {
        super();
        this.state = {
            forecast: []
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
        if (!this.state.forecast.current || !this.state.forecast.daily || !this.state.forecast.daily[0].weather) { return <span>Loading...</span>; }
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
                    
                </div>
            );
        }
    }
    componentDidMount() {
        fetch('http://localhost:3001/testAPI/weather')
        .then(res => res.json())
        .then((data) => {
            this.setState({ forecast: data });
            console.log(data);
        }).catch(console.log)   
    } 
};

export default MyFeed;