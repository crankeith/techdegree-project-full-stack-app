import React from 'react';
import { AuthConsumer } from './Context'
import { Redirect } from 'react-router-dom'

export default function UserSignOut(props){
    return (
        <AuthConsumer>
            {({signOut}) => {
                signOut();
                return(
                    <Redirect to='/' />
                )
            }}
        </AuthConsumer>
        
    )
}