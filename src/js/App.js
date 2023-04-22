import React from 'react';
import { Router } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import {
    createStyles,
    jssPreset,
    makeStyles,
    StylesProvider,
    ThemeProvider
} from '@material-ui/core';
import { create } from 'jss';
import rtl from 'jss-rtl';
import MomentUtils from '@date-io/moment';
import theme from './config/theme'
import { createBrowserHistory } from 'history';
import Routes from './routes/Routes'
import {ENABLE_ROUTER_DEBUG_LOGGING} from './config/appConfig'

import {useDispatch} from 'react-redux'
import { useIdleTimer } from 'react-idle-timer'
import AppConfig from './config/appConfig';
import {logout} from './redux/actions/account';

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
const history = createBrowserHistory();

if (ENABLE_ROUTER_DEBUG_LOGGING){
    history.listen((location, action) => {
        console.log(`The current URL is ${location.pathname}${location.search}${location.hash}`);
        console.log(`The last navigation action was ${action}`)
    })
}

const useStyles = makeStyles(() => createStyles({
    '@global': {
        '*': {
            boxSizing: 'border-box',
            margin: 0,
            padding: 0,
        },
        html: {
            '-webkit-font-smoothing': 'antialiased',
            '-moz-osx-font-smoothing': 'grayscale',
            height: '100%',
            width: '100%'
        },
        body: {
            height: '100%',
            width: '100%'
        },
        '#root': {
            height: '100%',
            width: '100%'
        }
    }
}));

export default function App() {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      history.push('/');
    } catch (error) {
      console.log('Unable to logout',error);
    }
  };

  const handleOnIdle = event => {
    handleLogout();
  }
 
  //const { getRemainingTime, getLastActiveTime } = useIdleTimer({
  useIdleTimer({
    timeout: AppConfig.userIdleTimeout,
    onIdle: handleOnIdle,
    debounce: 500
  })

    useStyles();
    return (
      <ThemeProvider theme={theme}>
        <StylesProvider jss={jss}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <SnackbarProvider maxSnack={1}>
              <Router history={history}>
                  <Routes/>
              </Router>
            </SnackbarProvider>
          </MuiPickersUtilsProvider>
        </StylesProvider>
      </ThemeProvider>
  );
}
