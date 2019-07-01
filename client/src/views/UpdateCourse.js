import React from 'react';
import axios from 'axios';
import { AuthContext } from '../components/Context'
import ErrorMessage from '../components/ErrorMessage'

class UpdateCourse extends React.Component {
    state = {
        title: "",
        description: "",
        estimatedTime: "",
        materialsNeeded: "",
        user: { firstName: "", lastName: "" },
        errors: []
    }

    componentDidMount(){
        axios.get(`http://localhost:5000/api/courses/${this.props.match.params.id}`)
            .then( response => {
                if(response.data.User.id !== this.context.user.id){
                    this.props.history.push('/forbidden')
                    return false;
                } else {
                    return response
                }
            }).then( response => {
                console.log(typeof response)
                if( typeof response === "object"){
                    const { title, description, estimatedTime, materialsNeeded, User } = response.data;
                    this.setState({
                        title, 
                        description, 
                        estimatedTime: estimatedTime || "", 
                        materialsNeeded: materialsNeeded || "", 
                        user: User
                    })
                } else {
                    return response
                }
            })
            .catch(err => {
                this.handleError(err);
            })
    }

    //Function to make put request to api on form submission
    handleSubmit = ( e ) => {
        e.preventDefault();
        const { title, description, estimatedTime, materialsNeeded } = this.state;
        
        axios.put(
            `http://localhost:5000/api/courses/${this.props.match.params.id}`, 
            {
                title, 
                description, 
                estimatedTime, 
                materialsNeeded
            }, 
            {
                auth: {
                    username: this.context.user.emailAddress,
                    password: this.context.user.password
                }
            }
        ).then( () => {
            this.props.history.push(`/courses/${this.props.match.params.id}`)
        }).catch(err => {
            this.handleError(err);
        })
    }

    //Function for handling all input changes and storing them in state
    handleChange = ( e ) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    
    //Function for handling all possible errors from api
    handleError = ( err ) => {
        let errorMessages = [];
        const { response } = err;
        const { status, data } = response;
        
        if(response && status){
            if(status === 400){
                if(data.error.errors){
                    errorMessages = data.error.errors.reduce( (acc, curr) => {
                        acc.push(curr.message);
                        return acc;
                    }, [])
                } else { errorMessages.push(err.message)}
            } else if(status !== 500) {
                if(status === 404){
                    this.props.history.push('/notfound')
                } else {
                    this.props.history.push('/error');
                }
            } else {
                this.props.history.push('/error');
            }
        } else {
            this.props.history.push('/error');
        }
        console.log(err);
        if(errorMessages.length > 0){
            this.setState({
                errors: errorMessages
            });
        }
    }

    render(){
        const { title, description, estimatedTime, materialsNeeded, user, errors } = this.state;
        return(
            <div className="bounds course--detail">
                <h1>Update Course</h1>
                <div>
                    { errors.length > 0 ? 
                        <ErrorMessage label="Validation errors" errors={this.state.errors} />
                    : null }
                    <form onSubmit={this.handleSubmit}>
                        <div className="grid-66">
                            <div className="course--header">
                                <h4 className="course--label">Course</h4>
                                <div>
                                    <input onChange={this.handleChange} id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..." value={ title } /></div>
                                <p>By {user.firstName} {user.lastName}</p>
                            </div>
                            <div className="course--description">
                                <div>
                                    <textarea onChange={this.handleChange} id="description" name="description" className="" placeholder="Course description..." value={ description }></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="grid-25 grid-right">
                            <div className="course--stats">
                                <ul className="course--stats--list">
                                    <li className="course--stats--list--item">
                                        <h4>Estimated Time</h4>
                                        <div>
                                            <input onChange={this.handleChange} id="estimatedTime" name="estimatedTime" type="text" className="course--time--input" placeholder="Hours" value={ estimatedTime } />
                                        </div>
                                    </li>
                                    <li className="course--stats--list--item">
                                        <h4>Materials Needed</h4>
                                        <div>
                                            <textarea onChange={this.handleChange} id="materialsNeeded" name="materialsNeeded" className="" placeholder="List materials..." value={ materialsNeeded }></textarea>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="grid-100 pad-bottom">
                            <button className="button" type="submit">Update Course</button>
                            <button className="button button-secondary" onClick={ (e) => { e.preventDefault(); this.props.history.push(`/courses/${this.props.match.params.id}`)}}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

UpdateCourse.contextType = AuthContext;

export default UpdateCourse;