import React, {Component} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
var moment = require('moment');

class SurfForecast extends Component {

    constructor() {
        super();
        this.state = {
            surf_spots: [],
            active_spot_index: 0
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
        if (!this.state.surf_spots.length > 0 || !this.state.surf_spots[0].data|| !this.state.surf_spots[0].data.waves.length > 0) { return <span>Loading...</span>; }
        else {
            return (
                <div>
                    <center><div>Surf Forcast</div></center>
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            {this.state.surf_spots[this.state.active_spot_index].name}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {this.state.surf_spots.map((surf_spot) => (
                                <Dropdown.Item key={surf_spot.id} onClick={() => this.setState({active_spot_index: this.state.surf_spots.indexOf(surf_spot)})}>{surf_spot.name}</Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                    

                    {this.state.surf_spots[this.state.active_spot_index].data.waves.map((f) => (
                        <div key={f.timestamp} class="card">
                            <div class="card-body">
                                <h6 class="card-subtitle mb-2 text-muted">{ moment(new Date(f.timestamp * 1000)).format('ddd, MMM D') }</h6>
                                <h5 class="card-title">{f.surf.min}-{f.surf.max}m @ {this.maxPeriod(f.swells)}s</h5>
                                <h6 class="card-subtitle mb-2 text-muted">{ /* summing wave and wind scores for total */
                                        f.surf.optimalScore
                                        + this.state.surf_spots[this.state.active_spot_index]
                                        .data.winds[this.state.surf_spots[this.state.active_spot_index]
                                        .data.waves.indexOf(f)].optimalScore
                                    }*
                                </h6>
                                {/* <p class="card-text">
                                    max: {w.temp.max} C <br/>
                                    min: {w.temp.min} C
                                </p> */}
                            </div>
                         </div>
                    ))}
                </div>
            );
        }
    }

    componentDidMount() {
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

        //email notif call
        // fetch("http://localhost:3001/testAPI")
        // .then(res => res.text())
        // .then(res => console.log("TEST",res));
    } 
};

export default SurfForecast;