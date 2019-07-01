import React from 'react';
import { Route, Redirect } from 'react-router-dom'
import { AuthConsumer } from './Context'

export default function PrivateRoute({ component: Component, ...rest }) {
    return (
        <AuthConsumer>
            { ({user}) => (
                <Route
                    {...rest}
                    render={props =>
                    user.id ? (
                        <Component {...props} />
                    ) : (
                        <Redirect
                        to={{
                            pathname: "/signin",
                            state: { from: props.location }
                        }}
                        />
                    )
                    }
                />
            )}
      </AuthConsumer>
    );
  }