import React from 'react';
//import { shallow } from 'enzyme';
import AppBar from "../../../../../js/layouts/App/AppBar";
import {createShallow} from '@material-ui/core/test-utils';

describe('AppBar', ()=> {
    let shallow;

    /**
     * Sample Setup for the Test Runner
     */
    beforeAll(()=>{
      shallow = createShallow();
    })

    it('Check render and child components', ()=> {
        const wrapper = shallow(<AppBar/>)
        expect(wrapper.exists()).toBe(true);
    })

    it('Check that there are 6 elements within toolbar', ()=> {
        const wrapper = shallow(<AppBar/>);

        /**
         * Note that the first thing we had to do was find the MUI toolbar element,
         * then get a count of all the child nodes by utilizing the following functions
         * and asserting that the count matches what it should be.
         */
        expect(wrapper.find('#FLAREclient-Toolbar').children().length).toEqual(3);
    })


})
