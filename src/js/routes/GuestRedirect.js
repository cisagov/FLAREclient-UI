import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import { login } from '../redux/actions/account';

// A functional component that will redirect if a user is already logged in

function GuestRedirect({ children }) {
  const account = useSelector((state) => state.account);
  const dispatch = useDispatch();

  const attemptLogin = async (jwt_token, dispatch) => {
    try {
      await dispatch(login(undefined,undefined,jwt_token));
    } catch (error) {
      Cookies.remove('jwt_token');
      return <Redirect to="/login" />;
    }
  };

  if (account.user) {
    return <Redirect to="/app" />;
  } else {
    const jwt_token = Cookies.get('jwt_token');
    if (jwt_token) {
      attemptLogin(jwt_token,dispatch);
    }
  }

  return children;
}

GuestRedirect.propTypes = {
  children: PropTypes.any
};

export default GuestRedirect;
