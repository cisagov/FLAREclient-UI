import React from 'react';
import ReactDOM from 'react-dom';
import App from '../../js/App'
import {shallow} from 'enzyme';

/**
 * This test is limited (in terms of UNIT) testing, since its basically the wrapper for the entire app.
 */

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

it('renders without crashing', () => {
    const wrapper = shallow(<App/>).dive();
});
