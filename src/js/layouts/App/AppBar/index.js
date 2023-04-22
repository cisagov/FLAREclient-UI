import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  AppBar,
  Box,
  Toolbar,
  makeStyles,
  Typography
} from '@material-ui/core';
import Account from './Account';
//import Notifications from './Notifications';
//import Search from './Search';
//import Settings from './Settings';
//import moment from "moment";

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: theme.zIndex.drawer + 100,
    backgroundColor: theme.palette.background.default

  },
  toolbar: {
    minHeight: 64
  }
}));

//const notifications = [
//  {
//    id: '5e8883f1b51cc1956a5a1ec0',
//    title: 'Poll is complete',
//    description: 'Server: FLAREcloud',
//    type: 'order_placed',
//    createdAt: moment()
//        .subtract(2, 'hours')
//        .toDate()
//        .getTime()
//  },
//  {
//    id: '5e8883f7ed1486d665d8be1e',
//    title: 'New User Request',
//    description: 'Username: Ziyad',
//    type: 'new_message',
//    createdAt: moment()
//        .subtract(1, 'day')
//        .toDate()
//        .getTime()
//  },
//  {
//    id: '5e8883fca0e8612044248ecf',
//    title: 'Poll in progress',
//    description: 'Server: Hail A TAXII',
//    type: 'item_shipped',
//    createdAt: moment()
//        .subtract(3, 'days')
//        .toDate()
//        .getTime()
//  },
//]


function TopBar({
  className,
  ...rest
}) {
  const classes = useStyles();

  return (
    <AppBar
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Toolbar id='FLAREclient-Toolbar' className={classes.toolbar}>
        <Typography
            variant="h4"
            color="inherit"
        >
          FLAREclient
        </Typography>
        <Box
          ml={2}
          flexGrow={1}
        />
        {/*<Search />
        <Notifications notifications={notifications}/>
        <Settings />*/}
        <Box ml={2}>
          <Account />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

TopBar.propTypes = {
  className: PropTypes.string,
};

export default TopBar;
