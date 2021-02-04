import React, {Component} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Cookies from 'universal-cookie';

class User extends Component {
    
    constructor () {
        super();
        this.state = {
            settings: []
        }
    }

    render () {
        return(
            <div>
                <h1>Settings</h1>
                <Form>
                    <Form.Group controlId="formWaveHeight">
                        <Form.Label>Min. wave height</Form.Label>
                        <Form.Control type="number" value={this.state.settings.min_height} />
                        <Form.Label>Max. wave height</Form.Label>
                        <Form.Control type="number" value={this.state.settings.max_height} />
                    </Form.Group>

                    <Form.Group controlId="formWavePeriod">
                        <Form.Label>Min. wave period</Form.Label>
                        <Form.Control type="number" value={this.state.settings.min_period} />
                        <Form.Label>Max. wave period</Form.Label>
                        <Form.Control type="number" value={this.state.settings.max_period} />
                    </Form.Group>

                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" checked={this.state.settings.notifs} label="activate notifications" />
                    </Form.Group>

                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Check type="radio" checked={this.state.settings.metric} label="metric" />
                        <Form.Check type="radio" label="imperial" />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>

            </div>
        );
    }

    componentDidMount() {
        const cookies = new Cookies();
        fetch('http://localhost:3001/testAPI/settings?uid=' + cookies.get('uid'))
        .then(res => res.json())
        .then((data) => {
            console.log(data);
            this.setState({settings: data})
            console.log(this.state.settings)
        });
    }
}

export default User;