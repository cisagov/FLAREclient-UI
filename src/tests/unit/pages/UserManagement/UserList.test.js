import React from 'react';
import UserList from "../../../../js/pages/UserManagement/UserList";
import Header from "../../../../js/pages/UserManagement/Header";
import {createShallow} from '@material-ui/core/test-utils';
import * as mock_user from '../../../../js/api/mock/mock_user.js';
import * as userSampleData from '../../../../js/api/mock/user/sampleData.js';

import {
  Card,
  Table
} from '@material-ui/core';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

const userSampleList = userSampleData.expected_payload;
const adminUser = userSampleList.filter(e=>e.login==='admin')[0];

describe('UserList', ()=> {
  let shallow;

  beforeAll(()=>{
    shallow = createShallow();
  })

  it('Check render and child components', ()=> {
    const wrapper = shallow(<UserList/>);
    expect(wrapper.exists()).toBe(true);
  })

  it('Renders a list of users', ()=> {
    const wrapper = shallow(<UserList users={userSampleList}/>);
    expect(wrapper.find(Card).exists()).toBe(true);
    expect(wrapper.find(Table).exists()).toBe(true);
    const rows = wrapper.find("#selectUser");
    expect(rows.length).toEqual(3);
  })

  it('Enables only Add Button when no items are selected', ()=> {
    const wrapper = shallow(<UserList users={userSampleList}/>);
    expect(wrapper.find("#AddUserButton").prop('disabled')).toBe(false);
    expect(wrapper.find("#EditUserButton").prop('disabled')).toBe(true);
    expect(wrapper.find("#DeleteUserButton").prop('disabled')).toBe(true);
  })

  it('Enables only Edit and Delete Buttons when one item is selected', ()=> {
    const wrapper = shallow(<UserList users={userSampleList}/>);
    const checkboxes = wrapper.find("#selectUser");
    checkboxes.at(0).simulate('click');
    expect(wrapper.find("#AddUserButton").prop('disabled')).toBe(true);
    expect(wrapper.find("#EditUserButton").prop('disabled')).toBe(false);
    expect(wrapper.find("#DeleteUserButton").prop('disabled')).toBe(false);
  })

  it('Enables only Edit Button when current user is selected', ()=> {
    const wrapper = shallow(<UserList users={userSampleList} currentUser={adminUser}/>);
    const checkboxes = wrapper.find("#selectUser");
    checkboxes.at(0).simulate('click');
    expect(wrapper.find("#AddUserButton").prop('disabled')).toBe(true);
    expect(wrapper.find("#EditUserButton").prop('disabled')).toBe(false);
    expect(wrapper.find("#DeleteUserButton").prop('disabled')).toBe(true);
  })

})
