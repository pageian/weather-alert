import React, {Component} from 'react';
import { Link } from 'react-router-dom';

class Signup extends Component {

    constructor() {
        super();
        this.state = {
            
        }
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
                                <input type="username" class="form-control" placeholder="Name" />
                            </div>
                            <div class="form-group">
                                <input type="email" class="form-control" placeholder="Email address" />
                            </div>
                            <div class="form-group">
                                <input type="email" class="form-control" placeholder="Confirm Email address" />
                            </div>
                            <div class="form-group">
                                <input type="password" class="form-control" placeholder="Password" />
                            </div>
                            <div class="form-group">
                                <input type="password" class="form-control" placeholder="Confirm Password" />
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