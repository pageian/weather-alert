import React, {Component} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Cookies from 'universal-cookie';

class User extends Component {
    
    constructor () {
        super();
        this.state = {
            name: "",
            min_height: 0,
            max_height: 0,
            min_period: 0,
            max_period: 0,
            metric: true,
            notifs: false
        }
    }

    updateField (event) {
        if(event.target.name == 'user_name') this.setState({name: event.target.value});
        else if(event.target.name == 'min_height') this.setState({min_height: event.target.value});
        else if(event.target.name == 'max_height') this.setState({max_height: event.target.value});
        else if(event.target.name == 'min_period') this.setState({min_period: event.target.value});
        else if(event.target.name == 'max_period') this.setState({max_period: event.target.value});
        else if(event.target.name == 'notifs') this.setState({notifs: event.target.value});
        else if(event.target.name == 'metric') this.setState({metric: event.target.value});
    }

    submitForm () {
        const cookies = new Cookies();
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                uid: cookies.get('uid'),
                name: this.state.name,
                min_height: this.state.min_height,
                max_height: this.state.max_height,
                min_period: this.state.min_period,
                max_period: this.state.max_period,
                metric: this.state.metric,
                notifs: this.state.notifs
            })
        };
        fetch("http://localhost:3001/testAPI/settings", requestOptions)
        .then(res => res.json())
        .then(res => {
            console.log(res);

        });
    }

    render () {
        return(
            <div>
                <h1>Settings</h1>
                <Form>
                    <Form.Group controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" name="user_name" value={this.state.name} onChange={this.updateField.bind(this)} />
                    </Form.Group>

                    <Form.Group controlId="formWaveHeight">
                        <Form.Label>Min. wave height</Form.Label>
                        <Form.Control type="number" name="min_height" value={this.state.min_height} onChange={this.updateField.bind(this)} />
                        <Form.Label>Max. wave height</Form.Label>
                        <Form.Control type="number" name="max_height" value={this.state.max_height} onChange={this.updateField.bind(this)} />
                    </Form.Group>

                    <Form.Group controlId="formWavePeriod">
                        <Form.Label>Min. wave period</Form.Label>
                        <Form.Control type="number" name="min_period" value={this.state.min_period} onChange={this.updateField.bind(this)} />
                        <Form.Label>Max. wave period</Form.Label>
                        <Form.Control type="number" name="max_period" value={this.state.max_period} onChange={this.updateField.bind(this)} />
                    </Form.Group>

                    <Form.Group controlId="formNotifs">
                        <Form.Check type="checkbox" name="notifs" checked={this.state.notifs} onChange={this.updateField.bind(this)} label="activate notifications" />
                    </Form.Group>

                    <Form.Group controlId="formUnits">
                        <Form.Check type="radio" name="" checked={this.state.metric} onChange={this.updateField.bind(this)} label="metric" />
                        <Form.Check type="radio" name="" label="imperial" />
                    </Form.Group>
                    <Button variant="primary" type="button" onClick={() => this.submitForm()}>
                        Submit
                    </Button>
                </Form>

            </div>
        );
    }

    // retrieve user settings
    componentDidMount() {
        const cookies = new Cookies();
        fetch('http://localhost:3001/testAPI/settings?uid=' + cookies.get('uid'))
        .then(res => res.json())
        .then((data) => {
            console.log(data);
            this.setState({
                name: data.name,
                min_height: data.min_height,
                max_height: data.max_height,
                min_period: data.min_period,
                max_period: data.max_period,
                metric: data.metric,
                notifs: data.notifs
            });
        });
    }
}

export default User;