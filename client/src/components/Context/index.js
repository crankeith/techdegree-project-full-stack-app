import React from 'react';
import axios from 'axios';

export const AuthContext = React.createContext();

export class AuthProvider extends React.Component {

    state = {
        user: {}
    }
    
    //Function that signs user in, sets localStorage and state with User info and returns Promise
    signIn = (username, password) => {
       return axios.get("http://localhost:5000/api/users", {
            auth: {
                username: username,
                password: password
            }
        }).then( response => {
            localStorage.setItem('user', JSON.stringify({ ...response.data, password }));
            this.setState({
                user: { ...response.data, password }
            })
            return response
        }).catch( err => {
            console.log(err);
            return err
        })
    }

    //Function to wipe out user info in both state and localStorage
    signOut = () => {
        this.setState({ user: {}})
        localStorage.removeItem('user');
    }

    render(){
        
        const providerValue = {
            signIn: this.signIn,
            signOut: this.signOut,
            user: this.state.user.id ? this.state.user : JSON.parse(localStorage.getItem('user')) || {}
        };

        return(
            <AuthContext.Provider value={providerValue}>
                { this.props.children }
            </AuthContext.Provider>
        )
    }
}

export const AuthConsumer = AuthContext.Consumer;