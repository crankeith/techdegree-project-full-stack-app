import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../components/Context';
import ReactMarkdown  from 'react-markdown';

class CourseDetails extends React.Component {

    state = {
        course: null
      }
    
    componentDidMount(){
      axios.get(`http://localhost:5000/api/courses/${this.props.match.params.id}`)
        .then( response => {
          this.setState({
            course: response.data
          })
        })
        .catch(err => {
          console.log(err)
          if(err.response.status === 404){
            this.props.history.push('/notfound')
          } else {
            this.props.history.push('/error');
          }
        })
    }

    //Function for deleting a course by making a DELETE request to api
    handleDeleteCourse = () => {
      axios.delete(`http://localhost:5000/api/courses/${this.props.match.params.id}`, {
        auth: {
          username: this.context.user.emailAddress,
          password: this.context.user.password
        }
      })
        .then( () => {
          this.props.history.push('/');
        })
        .catch(err => {
          console.log(err)
          this.props.history.push('/error');
        })
    }

    render(){
        const { course } = this.state;
        return(
            <div>
              <div className="actions--bar">
                <div className="bounds">
                  <div className="grid-100">
                    { (course && this.context.user.id && this.context.user.id === course.User.id) ?
                      <span>
                        <Link className="button" to={`/courses/${ this.props.match.params.id }/update`}>Update Course</Link>
                        <button className="button button--link" onClick={this.handleDeleteCourse}>Delete Course</button>
                      </span>
                    : null }
                    <Link className="button button-secondary" to="/">Return to List</Link>
                  </div>
                </div>
              </div> 
              { course ? 
                  <div className="bounds course--detail">
                    <div className="grid-66">
                      <div className="course--header">
                        <h4 className="course--label">Course</h4>
                        <h3 className="course--title">{course.title}</h3>
                        <p>By {course.User.firstName} {course.User.lastName}</p>
                      </div>
                      <div className="course--description">
                        <ReactMarkdown source={ course.description } />
                      </div>
                    </div>
                    <div className="grid-25 grid-right">
                      <div className="course--stats">
                        <ul className="course--stats--list">
                          <li className="course--stats--list--item">
                            <h4>Estimated Time</h4>
                            <h3>{course.estimatedTime}</h3>
                          </li>
                          <li className="course--stats--list--item">
                            <h4>Materials Needed</h4>
                            <ReactMarkdown source={course.materialsNeeded} />
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                : <h2>Loading...</h2>
              }
            </div>
        )
    }
}

CourseDetails.contextType = AuthContext;

export default CourseDetails;