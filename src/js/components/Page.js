import React, {
    forwardRef,
} from 'react';
import PropTypes from 'prop-types';


// https://reactjs.org/docs/forwarding-refs.html

const Page = forwardRef(({
                             children,
                             ...rest
                         }, ref) => {

    return (
        <div
            ref={ref}
            {...rest}
        >
            {children}
        </div>
    );
});

Page.propTypes = {
    children: PropTypes.node,
};

export default Page;
