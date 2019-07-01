import React from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios';
import { AuthContext } from '../components/Context'
import ErrorMessage from '../components/ErrorMessage'


class UserSignUp extends React.Component {

    state = {
        firstName: "",
        lastName: "",
        emailAddress: "",
        password: "",
        confirmPassword: "",
        errors: []
    }

    //Function for handling all input changes and storing them in state
    handleChange = ( e ) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    
    //Function to make post request to api on form submission
    handleSubmit = ( e ) => {
        e.preventDefault();
        const { firstName, lastName, emailAddress, password, confirmPassword } = this.state;

        //Ensure they can continue by comparing passwords
        if(password === confirmPassword){
            //Create User
            axios.post(
                "http://localhost:5000/api/users", 
                { firstName, lastName, emailAddress, password }
            ).then( () => {
                this.setState({
                    errors: []
                });
                //Sign them in
                this.context.signIn(emailAddress, password)
                    .then( () => {
                        this.props.history.push('/');
                    })
            }).catch( err => {
                this.handleError(err);
            })
        }
    }

    //Function for handling all possible errors from api
    handleError = ( err ) => {
        let errorMessages = [];
        if(err.response){
            if(err.response.status === 400){
                if(err.response.data.error.errors){
                    errorMessages = err.response.data.error.errors.reduce( (acc, curr) => {
                        acc.push(curr.message);
                        return acc;
                    }, [])
                } else { errorMessages.push(err.message)}
            } else if(err.response.status !== 500) {
                errorMessages.push(err.message);
            } else {
                this.props.history.push('/error');
            }
        } else {
            this.props.history.push('/error');
        }

        console.log(err);
        this.setState({
            errors: errorMessages
        });
    }

    render(){
        const { firstName, lastName, emailAddress, password, confirmPassword } = this.state;
        const passwordMatch = password === confirmPassword;

        return(
            <div className="bounds">
                <div className="grid-33 centered signin">
                    <h1>Sign Up</h1>
                    { this.state.errors.length > 0 ? 
                    <ErrorMessage label="Validation errors" errors={this.state.errors} />
                    : null }
                    <div>
                        <form onSubmit={this.handleSubmit}>
                            <div>
                                <input onChange={this.handleChange} id="firstName" name="firstName" type="text" className="" placeholder="First Name" value={firstName} />
                            </div>
                            <div>
                                <input onChange={this.handleChange} id="lastName" name="lastName" type="text" className="" placeholder="Last Name" value={lastName} />
                            </div>
                            <div>
                                <input onChange={this.handleChange} id="emailAddress" name="emailAddress" type="text" className="" placeholder="Email Address" value={emailAddress} />
                            </div>
                            <div>
                                <input onChange={this.handleChange} id="password" name="password" type="password" className="" placeholder="Password" value={password} />
                            </div>
                            <div>
                                <input onChange={this.handleChange} id="confirmPassword" name="confirmPassword" type="password" className="" placeholder="Confirm Password" value={confirmPassword} />
                            </div>
                            { !passwordMatch ? <p className="confirmPassword">Password/Confirm Password do not match. Correct them to continue</p> : null }
                            <div className="grid-100 pad-bottom">
                                <button className="button" type="submit" disabled={!passwordMatch}>Sign Up</button>
                                <button className="button button-secondary" onClick={ (e) => { e.preventDefault(); this.props.history.push('/')}}>Cancel</button>
                            </div>
                        </form>
                    </div>
                    <p>&nbsp;</p>
                    <p>Already have a user account? <Link to="/signin">Click here</Link> to sign in!</p>
                </div>
            </div>
        )
    }
}

UserSignUp.contextType = AuthContext;

export default UserSignUp