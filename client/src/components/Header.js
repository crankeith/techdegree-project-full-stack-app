import React from 'react';
import { Link } from 'react-router-dom'
import { AuthConsumer } from './Context'

export default function Header(){
    return(
        <AuthConsumer>
            { ({ user }) => { return(
                <>
                    <div className="header">
                        <div className="bounds">
                            <h1 className="header--logo">
                                <Link to="/" >Courses</Link>
                            </h1>
                            { user.id 
                                ? <nav>
                                    <span>{`Welcome ${user.firstName} ${user.lastName}!`}</span>
                                    <Link className="signout" to="/signout">Sign Out</Link>
                                </nav>
                                : <nav>
                                    <Link className="signup" to="/signup">Sign Up</Link>
                                    <Link className="signin" to="/signin">Sign In</Link>
                                </nav>
                            }
                        </div>
                    </div>
                    <hr />
                </>
            )}}
      </AuthConsumer>
    )
}