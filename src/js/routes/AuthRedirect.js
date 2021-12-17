import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

function AuthRedirect({ children }) {
  const account = useSelector((state) => state.account);

  if (!account.user) {
    return <Redirect to="/login" />;
  }

  return children;
}

AuthRedirect.propTypes = {
  children: PropTypes.any
};

export default AuthRedirect;
