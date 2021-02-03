import React, {Component} from 'react';
import { Link } from 'react-router-dom';

class Signup extends Component {

    constructor() {
        super();
        this.state = {
            name: "",
            email: "",
            conf_email: "",
            password: "",
            conf_password: ""
        }
    }

    updateField(event) {
        if(event.target.name == 'name') this.setState({name: event.target.value});
        else if(event.target.name == 'email') this.setState({email: event.target.value});
        else if(event.target.name == 'conf_email') this.setState({conf_email: event.target.value});
        else if(event.target.name == 'password') this.setState({password: event.target.value});
        else if(event.target.name == 'conf_password') this.setState({conf_password: event.target.value});
    }

    render () {
        return (
            
            <div class="container-fluid">
                <div class="row">
                    <div class="col-sm-2"></div>
                    <div class="col-lg-7 col-md-8 col-sm-6">
                        <h3 class="form-header">Please Sign Up with us</h3>
                        <hr></hr>
                    </div>

                </div>
                <div id="form-pad">
                    <div id="form-content">
                        <form>
                            <div class="form-group">
                                <input type="username" name="name" value={this.state.name} onChange={this.updateField.bind(this)} class="form-control" placeholder="Name" />
                            </div>
                            <div class="form-group">
                                <input type="email" name="email" value={this.state.email} onChange={this.updateField.bind(this)} class="form-control" placeholder="Email address" />
                            </div>
                            <div class="form-group">
                                <input type="email" name="conf_email" value={this.state.conf_email} onChange={this.updateField.bind(this)} class="form-control" placeholder="Confirm Email address" />
                            </div>
                            <div class="form-group">
                                <input type="password" name="password" value={this.state.password} onChange={this.updateField.bind(this)} class="form-control" placeholder="Password" />
                            </div>
                            <div class="form-group">
                                <input type="password" name="conf_password" value={this.state.conf_password} onChange={this.updateField.bind(this)} class="form-control" placeholder="Confirm Password" />
                            </div>
                            <button type="button" 
                                    class="btn btn-primary"
                                    >Sign Up</button>
                        </form>
                        <hr class="separator"></hr>
                        <Link to="login">Already a user? Sign In</Link>
                    </div>
                </div>
            </div>

        );
    }
}

export default Signup;