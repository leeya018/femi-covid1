import React from 'react'

export default function Client({ firstName, lastName }) {
    return (
        <div>
            <p>{firstName}</p>
            <p>{lastName}</p>
            <hr />
        </div>
    )
}
