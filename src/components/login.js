import React, {Component} from 'react';
import { Link } from 'react-router-dom';

class Login extends Component {

    constructor() {
        super();
        this.state = {
            email: "",
            password: ""
        }
    }

    updateField(event) {
        if(event.target.name == 'email') this.setState({email: event.target.value});
        else if(event.target.name == 'password') this.setState({password: event.target.value});
    }

    login() {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: this.state.email, password: this.state.password })
        };
        fetch("http://localhost:3001/testAPI/login", requestOptions)
            .then(res => res.json())
            .then(res => console.log(res));
    }

    render () {

        return (
            <div class="container-fluid">
                <div class="row">
                    <div class="col-sm-2"></div>
                    <div class="col-lg-7 col-md-8 col-sm-6">
                        <h2>Welcome!!!</h2>
                        <br></br>
                        <h3 class="form-header">Please login to continue</h3>
                        <hr></hr>
                    </div>

                </div>
                <div class="row">
                    <div class="col-sm-2"></div>
                    <div class="col-lg-7 col-md-8 col-sm-6" id="form-pad">
                        <div id="form-content">
                            <form>
                                <div class="form-group">
                                    <input type="email" name="email" value={this.state.email} onChange={this.updateField.bind(this)} class="form-control" placeholder="Email address"/>
                                </div>
                                <div class="form-group">
                                    <input type="password" name="password" value={this.state.password} onChange={this.updateField.bind(this)} class="form-control" placeholder="Password"/>
                                </div>
                                <button
                                    type="button"
                                    class="btn btn-primary"
                                    onClick={() => this.login()}
                                    >Log In</button>
                            </form>
                            <hr class="separator"/>
                            <Link to="/signup">Create New Account</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default Login;