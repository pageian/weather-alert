import React, {Component} from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

class User extends Component {
    
    constructor () {
        super();
        this.state = {

        }
    }

    render () {
        return(
            <div>
                <h1>Settings</h1>
                <Form>
                    <Form.Group controlId="formWaveHeight">
                        <Form.Label>Min. wave height</Form.Label>
                        <Form.Control type="number" placeholder="min. wave height" />
                        <Form.Label>Max. wave height</Form.Label>
                        <Form.Control type="number" placeholder="max. wave height" />
                    </Form.Group>

                    <Form.Group controlId="formWavePeriod">
                        <Form.Label>Min. wave period</Form.Label>
                        <Form.Control type="number" placeholder="min. wave period" />
                        <Form.Label>Max. wave period</Form.Label>
                        <Form.Control type="number" placeholder="max. wave period" />
                    </Form.Group>

                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="activate notifications" />
                    </Form.Group>

                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Check type="radio" label="metric" />
                        <Form.Check type="radio" label="imperial" />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>

            </div>
        );
    }
}

export default User;