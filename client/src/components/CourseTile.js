import React from 'react';
import { Link } from 'react-router-dom'

export default function CourseTile(props){
    const { id, title } = props.course;
    return(
        <Link className="course--module course--link" to={`/courses/${ id }`}>
            <h4 className="course--label">Course</h4>
            <h3 className="course--title">{ title }</h3>
        </Link>
    )
}