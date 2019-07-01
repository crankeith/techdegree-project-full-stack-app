import React from 'react';
import axios from 'axios';
import { AuthContext } from '../components/Context'
import ErrorMessage from '../components/ErrorMessage'

class CreateCourse extends React.Component {
    
    state = {
        title: "",
        description: "",
        estimatedTime: "",
        materialsNeeded: "",
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
        const { title, description, estimatedTime, materialsNeeded } = this.state;

        axios.post(
            "http://localhost:5000/api/courses", 
            { title, description, estimatedTime, materialsNeeded},{
                auth: {
                    username: this.context.user.emailAddress,
                    password: this.context.user.password
                }
            }
        ).then( (response) => {
            this.props.history.push(`/courses/${response.data.id}`);
        }).catch( err => {
            this.handleError(err);
        })
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
        const { title, description, estimatedTime, materialsNeeded } = this.state;
        const { firstName, lastName } = this.context.user;

        return(
            <div className="bounds course--detail">
                <h1>Create Course</h1>
                <div>
                { this.state.errors.length > 0 ? 
                    <ErrorMessage label="Validation errors" errors={this.state.errors} />
                    : null }
                <form onSubmit={this.handleSubmit}>
                    <div className="grid-66">
                        <div className="course--header">
                            <h4 className="course--label">Course</h4>
                            <div>
                                <input onChange={this.handleChange} id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..." value={title} />
                            </div>
                            <p>By {firstName} {lastName}</p>
                        </div>
                        <div className="course--description">
                            <div>
                                <textarea onChange={this.handleChange} id="description" name="description" className="" placeholder="Course description..." value={description}></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="grid-25 grid-right">
                        <div className="course--stats">
                            <ul className="course--stats--list">
                                <li className="course--stats--list--item">
                                    <h4>Estimated Time</h4>
                                    <div>
                                        <input onChange={this.handleChange} id="estimatedTime" name="estimatedTime" type="text" className="course--time--input" placeholder="Hours" value={estimatedTime} />
                                    </div>
                                </li>
                                <li className="course--stats--list--item">
                                    <h4>Materials Needed</h4>
                                    <div>
                                        <textarea onChange={this.handleChange} id="materialsNeeded" name="materialsNeeded" className="" placeholder="List materials..." value={materialsNeeded}></textarea>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="grid-100 pad-bottom">
                        <button className="button" type="submit">Create Course</button>
                        <button className="button button-secondary" onClick={ (e) => { e.preventDefault(); this.props.history.push('/')}}>Cancel</button>
                    </div>
                </form>
                </div>
            </div>
        )
    }
}

CreateCourse.contextType = AuthContext;

export default CreateCourse;