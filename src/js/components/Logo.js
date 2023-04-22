import React from 'react';

function Logo(props) {
    return (
        <img
            alt="Logo"
            src="../../images/favicon.png"
            {...props}
        />
    );
}

export default Logo;
