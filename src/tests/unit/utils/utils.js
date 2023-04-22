import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import { createShallow } from '@material-ui/core/test-utils';

/*
Note that with mount, it will render the component and all its children
including material UI components which will require the theme context
to be available as props. this will be passed down as part of the context,
just like the store.
 */

export const shallowWithStore = (component, store) => {
    let shallow;
    shallow = createShallow()
    const context = {
        store,
    };
    return shallow(component, { context });
};


export const mountWithStore = (component, store) => {
    const context = {
        store,
    };

    const childContextTypes = {store: PropTypes.object}

    return mount(component, {context, childContextTypes});
};

