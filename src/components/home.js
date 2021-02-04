import React, {Component} from 'react'
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import Nav from 'react-bootstrap/Nav'

import Forecast from './forecast';
import SurfForecast from './surf-forecast';

class Home extends Component {
    
    constructor() {
        super();
        this.state = {
            weather: [],
            active_page: ""
        }
    }

    logout() {
        console.log("TEST")
        const cookies = new Cookies();
        cookies.set('uid', "");
        this.forceUpdate()
    }

    render_active_page () {
        switch(this.state.active_page) {
            case '': return <Forecast />    // defines default page
            case 'forecast': return <Forecast />
            case 'surf-forecast': return <SurfForecast />
        }
    }

    render () {
        // redirecting to login if no active user
        const cookies = new Cookies();
        if(cookies.get('uid') == "" || !cookies.get('uid')){ return <Redirect to="/login" />; }
        else {
            return (
                <div>
                    <Nav
                        activeKey="/">
                        <Nav.Item>
                            <Nav.Link href="/">Surf Alert</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link onClick={() => this.setState({active_page:'forecast'}) }>Weather Forecast</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link onClick={() => this.setState({active_page:'surf-forecast'}) }>Surf Forecast</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="/surf">Settings</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link onClick={() => this.logout()}>Logout</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    {this.render_active_page()}
                </div>
            );
        }
    }
}

export default Home;