import React from 'react';
import './App.css';
import { Switch, Route, Redirect } from 'react-router-dom'
import Courses from './views/Courses'
import CreateCourse from './views/CreateCourse'
import CourseDetails from './views/CourseDetails'
import UpdateCourse from './views/UpdateCourse'
import UserSignUp from './views/UserSignUp'
import UserSignIn from './views/UserSignIn'
import UserSignOut from './components/UserSignOut'
import NotFound from './views/NotFound'
import Forbidden from './views/Forbidden'
import ErrorPage from './views/ErrorPage'
import Header from './components/Header'
import PrivacteRoute from './components/PrivateRoute'

class App extends React.Component {

  render(){

    return (
      <div>
        <Header />
          <Switch>
            <Route path="/" exact component={ Courses } />
            <Route path="/courses" exact render={() => ( <Redirect to="/"/>)} />
            <PrivacteRoute path="/courses/create" exact component={ CreateCourse } />
            <Route path="/courses/:id" exact component={ CourseDetails } />
            <PrivacteRoute path="/courses/:id/update" exact component={ UpdateCourse } />
            <Route path="/signup" component={ UserSignUp } />
            <Route path="/signin" component={ UserSignIn } />
            <Route path="/signout" component={ UserSignOut } />
            <Route path="/notfound" component={NotFound} />
            <Route path="/forbidden" component={Forbidden} />
            <Route path="/error" component={ErrorPage} />
            <Route component={NotFound} />
          </Switch>
      </div>
    )
  }
}

export default App;
