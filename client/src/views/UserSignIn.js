import React from 'react';
import { Link } from 'react-router-dom'
import { AuthContext } from '../components/Context'

class UserSignIn extends React.Component {

    state = {
        emailAddress: "",
        password: "",
        displayError: false
    }

    //Function for handling all input changes and storing them in state
    handleChange = ( e ) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    //Users context function to sign in user and handles any errors from the Promise
    handleSubmit = (e) => {
        e.preventDefault();
        this.context.signIn(this.state.emailAddress, this.state.password)
            .then( response => {
                if(response instanceof Error){
                    throw response;
                } else {
                    this.props.history.goBack();
                }
            })
            .catch( err => {
                //Handle 401 error with special error message
                if( err.response.status === 401){
                    this.setState({ displayError: true})
                } else {
                    this.props.history.push('/error')
                }
            })
    }

    render(){

        const { emailAddress, password, displayError } = this.state;

        return(
            <div className="bounds">
                <div className="grid-33 centered signin">
                    <h1>Sign In</h1>
                    <div>
                        <form onSubmit={ this.handleSubmit } >
                            <div>
                                <input 
                                    onChange={this.handleChange} 
                                    id="emailAddress" 
                                    name="emailAddress" 
                                    type="text" 
                                    className="" 
                                    placeholder="Email Address" 
                                    value={ emailAddress } 
                                />
                            </div>
                            <div>
                                <input 
                                    onChange={this.handleChange} 
                                    id="password" 
                                    name="password" 
                                    type="password" 
                                    className="" 
                                    placeholder="Password" 
                                    value={ password } 
                                />
                            </div>
                            { displayError ? <p className="confirmPassword">Credentials provided are incorrect. Please try again.</p> : null }
                            <div className="grid-100 pad-bottom">
                                <button className="button" type="submit">Sign In</button>
                                <button onClick={ (e) => { e.preventDefault(); this.props.history.push('/')}} className="button button-secondary">Cancel</button>
                            </div>
                        </form>
                    </div>
                    <p>&nbsp;</p>
                    <p>Don't have a user account? <Link to="/signup">Click here</Link> to sign up!</p>
                </div>
            </div>
        )
    }
}

UserSignIn.contextType = AuthContext;

export default UserSignIn