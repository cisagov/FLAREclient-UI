import React from 'react';
import Notifications from "../../../../../js/layouts/App/AppBar/Notifications";
import {createShallow} from '@material-ui/core/test-utils';
import {ListItem} from '@material-ui/core'
import moment from "moment";

/**
 *
 * With functional components that are utilizing REACT HOOKS to manage states, you should be using the testing
 * library mentioned below. Most of the time when developers choose to implement a FUNCTIONAL component VS CLASS component,
 * its usually because the business logic warrants one or the other. For stateless or simple internal states (such as opening and closing a dialog)
 * use functional, anything else extend from the React.Component CLASS
 *
 * Heres a resource to test components that use hooks
 *
 * https://reactjs.org/docs/hooks-faq.html#how-to-test-components-that-use-hooks
 * https://testing-library.com/docs/react-testing-library/intro
 * https://www.newline.co/@jamesfulford/testing-custom-react-hooks-with-jest--8372a502
 *
 */
describe('Notifications', ()=> {
    let shallow;

    /**
     * Sample Setup for the Test Runner
     */
    beforeAll(()=>{
        shallow = createShallow();
    })


    const notificationsInitialState = [
        {
            id: '5e8883f1b51cc1956a5a1ec1',
            title: 'Poll is complete',
            description: 'Server: FLAREcloud',
            type: 'order_placed',
            createdAt: moment()
                .subtract(2, 'hours')
                .toDate()
                .getTime()
        },
        {
            id: '5e8883f7ed1486d665d8be1e',
            title: 'New User Request',
            description: 'Username: Ziyad',
            type: 'new_message',
            createdAt: moment()
                .subtract(1, 'day')
                .toDate()
                .getTime()
        },
        {
            id: '5e8883fca0e8612044248ecf',
            title: 'Poll in progress',
            description: 'Server: Hail A TAXII',
            type: 'item_shipped',
            createdAt: moment()
                .subtract(3, 'days')
                .toDate()
                .getTime()
        },
    ]

    it('Check render and child components do not throw exceptions', ()=> {

        //initialize the component with a standard amount of notifications
        const wrapper = shallow(<Notifications notifications={notificationsInitialState}/>)

        expect(wrapper.exists()).toBe(true);
    })

    it('Check initial props of the functional component', ()=> {
        const wrapper = shallow(<Notifications notifications={notificationsInitialState}/>);

        // we know based on the above initialization of the component there should be 3 notifications
        expect(wrapper.find(ListItem).length).toBe(3)


        // test that the menu is closed (since that should be the initial state)
        expect(wrapper.find("#NotificationMenuDropDown").props().open).toBe(false)
    })


    it('Check initial props of the functional component with ZERO notifications', ()=> {
        const wrapper = shallow(<Notifications notifications={[]}/>);

        // we know based on the above initialization of the component there should be 0 notifications
        // we also know that based on the ternary operator if no notifications are there, then we display a message
        expect(wrapper.find(ListItem).length).toBe(0)
        expect(wrapper.find("#NoNotificationsMessage").length).toBe(1)
    })


    it('Check state changes for opening Notification menu', ()=> {
        const wrapper = shallow(<Notifications notifications={notificationsInitialState}/>);

        // Check initial state
        expect(wrapper.find("#NotificationMenuDropDown").props().open).toBe(false);

        // Trigger State Change
        wrapper.find("#NotificationsMenuButton").simulate("click");

        // Check final state
        expect(wrapper.find("#NotificationMenuDropDown").props().open).toBe(true);
    })


})