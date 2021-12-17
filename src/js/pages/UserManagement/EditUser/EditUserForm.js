import React, {
  useState,
  useEffect,
  useCallback
} from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {getUser} from "../../../redux/actions/users";
import clsx from 'clsx';
import * as _ from 'lodash';
import { useHistory } from 'react-router';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
//  Tooltip,
//  Typography,
  makeStyles
} from '@material-ui/core';
//import Visibility from '@material-ui/icons/Visibility';
//import VisibilityOff from '@material-ui/icons/VisibilityOff';
//import AppConfig from '../../../config/appConfig';
import DoneIcon from '@material-ui/icons/Done'
//import IconButton from "@material-ui/core/IconButton";
import { useDispatch, useSelector } from 'react-redux';
import { getAuthorities, addUser, updateUser } from '../../../redux/actions/users';

const useStyles = makeStyles((theme) => ({
  root: {},
  pwweak: {
    fontSize: "0.75rem",
    fontFamily: ["Roboto", "Helvetica", "Arial", "sans-serif"],
    fontWeight: 400,
    marginLeft: "14px",
    color: "#f44336"
  },
  pwmedium: {
    fontSize: "0.75rem",
    fontFamily: ["Roboto", "Helvetica", "Arial", "sans-serif"],
    fontWeight: 400,
    marginLeft: "14px",
    color: "#ffd700"
  },
  pwstrong: {
    fontSize: "0.75rem",
    fontFamily: ["Roboto", "Helvetica", "Arial", "sans-serif"],
    fontWeight: 400,
    marginLeft: "14px",
    color: "#4caf50"
  }
}));

//const minimumPasswordLength = 8;
const minimumLoginLength = 4;

function EditUserForm({className, ...rest}) {
  const classes = useStyles();

  // Get the user if supplied
  // If user is supplied, this is an edit, otherwise this is an add
  const location = useLocation();
  let edituser =
    (typeof location==='undefined')?{}:
      ((location.props && location.props.edituser) || {});
  let addOrUpdate="add";
  if (Object.keys(edituser).length!==0) {
    addOrUpdate="update";
  }

  const login = edituser.login || '';
  const firstName = edituser.firstName || '';
  const lastName = edituser.lastName || '';
  const email = edituser.email || '';

  const [testUsername,setTestUsername] = useState('');
  const [loginTouched,setLoginTouched] = useState(false);
  const [loginValidated,setLoginValidated] = useState((addOrUpdate==="update")?true:false);
//  const [showPasswordRequirements,setShowPasswordRequirements] = useState(false);
//  const [showPassword,setShowPassword] = useState(false);
//  const [passwordStrength,setPasswordStrength] = useState('');
  const [roles,setRoles] = useState(edituser.authorities || [])
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const authorities = useSelector(state => {
    if (state.users!==undefined && state.users.authorities!==undefined && state.users.authorities!==null) {
      let roles = []
      state.users.authorities.map((role) => {
        let name=role[5].toUpperCase()+role.slice(6).toLowerCase()
        return roles.push({name: name, value: role})
      })
      return roles
    } else {
      return null
    }
  });

  const fetchAuthorities = useCallback(() => {
    dispatch(getAuthorities());
  }, [dispatch]);

  useEffect(() => {
    if(!authorities){
      fetchAuthorities();
    }
  });

  if(!authorities){
    return  null
  }

  function getLoginInputAdornment() {
    if (loginValidated) {
      return (
        <DoneIcon style={{color: 'green'}}/>
      )
    } else {
      return ''
    }
  }

//  function getPasswordAdornment() {
//    if (passwordStrength==='medium' || passwordStrength==='strong') {
//      return (
//        <DoneIcon style={{color: 'green'}}/>
//      )
//    } else {
//      return ''
//    }
//  }

//  const passwordRequirements = (password) => {
//    let lower = new RegExp("[a-z]")
//    let upper = new RegExp("[A-Z]")
//    let number = new RegExp("[0-9]")
//    let special = new RegExp("\\W|_")
//    let passwordlength = (password.length >= minimumPasswordLength);
//    return (
//      <div>
//        <ul>
//          <li>
//            <Typography style={lower.test(password)?{color:'#4caf50'}:{}}>
//              One lowercase character
//            </Typography>
//          </li>
//          <li>
//            <Typography style={upper.test(password)?{color:'#4caf50'}:{}}>
//              One uppercase character
//            </Typography>
//          </li>
//          <li>
//            <Typography style={number.test(password)?{color:'#4caf50'}:{}}>
//              One number
//            </Typography>
//          </li>
//          <li>
//            <Typography style={special.test(password)?{color:'#4caf50'}:{}}>
//              One special character
//            </Typography>
//          </li>
//          <li>
//            <Typography style={passwordlength?{color:'#4caf50'}:{}}>
//              {minimumPasswordLength} characters minimum
//            </Typography>
//          </li>
//        </ul>
//      </div>
//    )
//  };

  return (
    <Formik
      initialValues={{
        login: login,
/*      password: '', */
        firstName: firstName,
        lastName: lastName,
        email: email
      }}
      validationSchema={Yup.object().shape({
        login: Yup.string()
          .min(minimumLoginLength)
          .max(50)
          .test('reset-login-validated','no error',
            // This is here so that the Login Validated check is always redone
            function(value) {
              if (value!==testUsername) {
                setLoginValidated(false);
              }
              return true;
            }
          )
          .test('does-login-contain-invalid-characters','Login can not contain spaces and can only contain letters numbers - _ . @',
            function(value) {
              if (value!==undefined && !(value.match(/^[_.@A-Za-z0-9-]*$/))) {
                return false;
              }
              return true;
            }
          )
          .test('does-login-exist', 'Login is already taken',
            async function(value) {
              // If we are updating a user and they haven't changed their username,
              // then it's already valid.
              if (addOrUpdate==="update" && value===login) {
                setLoginValidated(true);
                return true;
              } else if (value!==undefined && value.length >= minimumLoginLength && value!==testUsername) {
                setTestUsername(value);
                try {
                  await dispatch(getUser(value));
                  setLoginTouched(true);
                  return false;
                } catch (error) {
                  setLoginValidated(true);
                  return true;
                }
              }
              return true;
            }
          )
          .required(),
/*      password: Yup.string()
          .min(minimumPasswordLength)
          .max(255)
          .test('reset-show-password-requirements','no error',
            // This is here so that the Password Requirements are closed on blur
            function(value) {
              setShowPasswordRequirements(false);
              return true;
            }
          )
          .test('password-strength','',
            function(value) {
              let strongRegex = new RegExp("^(?=.{14,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
              let mediumRegex = new RegExp("^(?=.{8,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
              if (value.length < minimumPasswordLength) {
                setPasswordStrength(null);
              } else if (strongRegex.test(value) === true) {
                setPasswordStrength('strong')
                return true;
              }
              else if (mediumRegex.test(value) === true) {
                setPasswordStrength('medium')
                return true;
              }
              else {
                setPasswordStrength('weak')
              }
            }
          )
          .required() */
        firstName: Yup.string()
          .max(50,'First Name must not be longer than 50 characters'),
        lastName: Yup.string()
          .max(50,'Last Name must not be longer than 50 characters'),
        email: Yup.string()
          .email('Email must be a valid email address')
          .max(254,'Email must not be longer than 254 characters')
          .required('Email is a required field')
      })}
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
          // Do api call
          console.log("Submitting Add User");
          // We need to add the authorities entry in here
          if (addOrUpdate==='add') {
            values['authorities']=roles;
            dispatch(addUser(values))
          } else {
            let updateuser=JSON.parse(JSON.stringify(edituser));
            _.merge(updateuser,values);
            updateuser['authorities']=roles;
            dispatch(updateUser(updateuser))
          }

          setStatus({ success: true });
          setSubmitting(false);
          enqueueSnackbar((addOrUpdate==='add')?'User Added':'User Updated', {
            variant: 'success'
          });
          history.push('/app/management/users');
        } catch (err) {
          setErrors({ submit: err.message });
          setStatus({ success: false });
          setSubmitting(false);
        }
      }}
    > 
      {({
        errors,
        setErrors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        setFieldValue,
        touched,
        values
      }) => (
        <form
          onSubmit={handleSubmit}
          className={clsx(classes.root, className)}
          {...rest}
        > 
          <Card
            className={clsx(classes.root, className)}
            {...rest}
          >
            <Grid container={true}
              style={{maxWidth: '1200px'}}>
              <Box mt={2} mb={1} ml={2} mr={2} width={1}>
                <TextField
                  id="login"
                  error={Boolean((touched.login || loginTouched) && errors.login)}
                  fullWidth
                  helperText={(touched.login || loginTouched) && errors.login}
                  label="Login"
                  name="login"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.login}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {getLoginInputAdornment()}
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
{/*           <Box mt={3} mb={1} ml={2} mr={2} width={1}>
                <Tooltip placement={"right"} title={passwordRequirements(values.password)}
                  open={showPasswordRequirements}>
                  <div>
                  <TextField
                    id="password"
                    error={Boolean(touched.password && errors.password)}
                    fullWidth
                    helperText={touched.password && errors.password}
                    label="Password"
                    name="password"
                    onFocus={() => {
                      setShowPasswordRequirements(true)
                    }}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    variant="outlined"
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {getPasswordAdornment()}
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            onMouseDown={(event) => event.preventDefault()}
                          >
                            {showPassword ? <VisibilityOff/> : <Visibility/>}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                  { passwordStrength=='weak' && (
                    <span className={classes.pwweak}>Password Strength: Weak</span>
                  )}
                  { passwordStrength=='medium' && (
                    <span className={classes.pwmedium}>Password Strength: Medium</span>
                  )}
                  { passwordStrength=='strong' && (
                    <span className={classes.pwstrong}>Password Strength: Strong</span>
                  )}
                  </div>
                </Tooltip>
              </Box> */}
              <Box mt={3} mb={1} ml={2} mr={2} width={1}>
                <TextField
                  id="firstName"
                  error={Boolean(touched.firstName && errors.firstName)}
                  fullWidth
                  helperText={touched.firstName && errors.firstName}
                  label="First Name"
                  name="firstName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  variant="outlined"
                />
              </Box>
              <Box mt={3} mb={1} ml={2} mr={2} width={1}>
                <TextField
                  id="lastName"
                  error={Boolean(touched.lastName && errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  variant="outlined"
                />
              </Box>
              <Box mt={3} mb={1} ml={2} mr={2} width={1}>
                <TextField
                  id="email"
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label="Email"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  variant="outlined"
                />
              </Box>
              <Box mt={3} mb={1} ml={2} mr={2} width={1}>
                <InputLabel htmlFor="Roles" style={{padding: '0 0 7px 0'}}>&nbsp;&nbsp;&nbsp;Roles</InputLabel>
                <Select
                  id="roles"
                  fullWidth
                  multiple={true}
                  value={roles}
                  onChange={(event) => {
                    setRoles(event.target.value)
                  }}
                  variant="outlined"
                >   
                {authorities.map((item) => (
                  <MenuItem
                    label={"Roles"}
                    value={item.value}
                    key={item.name}
                    name={item.name}>
                    {item.name}
                  </MenuItem>
                ))}
                </Select>
              </Box>
              <Box mt={2} mb={2} ml={2} mr={2}>
                <Button
                  id="performSubmit"
                  color="secondary"
                  variant="contained"
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !loginValidated ||
                    Object.keys(errors).length!==0}
                > 
                  {(addOrUpdate==='add')?'Add user':'Update User'}
                </Button>
              </Box>
              <Box mt={2} mb={2}>
                <Button
                  id="cancelSubmit"
                  variant="contained"
                  component={RouterLink}
                  to="/app/management/users"
                > 
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Card>
        </form>
      )}
    </Formik>
  );
}

EditUserForm.propTypes = {
  className: PropTypes.string
};

export default EditUserForm;
