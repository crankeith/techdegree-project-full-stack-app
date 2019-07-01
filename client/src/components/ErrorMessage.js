import React from 'react';

export default function ErrorMessage(props){
    return(
        <div>
            <h2 className="validation--errors--label">{props.label}</h2>
            <div className="validation-errors">
            <ul>
                { props.errors.map( (error, index) => (
                    <li key={index}>{ error }</li>
                ))}
            </ul>
            </div>
        </div>
    )
}