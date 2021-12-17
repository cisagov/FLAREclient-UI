import React from 'react';
import {Redirect} from 'react-router-dom';

function Error404() {
    return (
        <Redirect to='/'/>
    );
}

export default Error404;
