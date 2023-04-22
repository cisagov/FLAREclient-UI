import React, {
  useRef,
  useState,
} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Popover,
  SvgIcon,
  Tooltip,
  Typography,
  makeStyles
} from '@material-ui/core';
import {
  Bell as BellIcon,
  Package as PackageIcon,
  MessageCircle as MessageIcon,
  Truck as TruckIcon
} from 'react-feather';
import PropTypes from 'prop-types';

//import moment from 'moment';

const iconsMap = {
  order_placed: PackageIcon,
  new_message: MessageIcon,
  item_shipped: TruckIcon
};

const useStyles = makeStyles((theme) => ({
  popover: {
    width: 320
  },
  icon: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText
  }
}));

/**
 * This could have been changed to a variable and been exported then imported into the unit test to be mutated.
 * For a easy fix to solve the challenge another developer had is to simply take the variable and set it as a prop to be passed in.
 * With this attribute as a prop, we can simply unit test it with different notification counts by passing it in
 *
 *
 * const notificationsInitialState = [
 {
        id: '5e8883f1b51cc1956a5a1ec0',
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
 *
 *
 */



const Notifications = (props) => {
  const classes = useStyles();
  const ref = useRef(null);
  const [isOpen, setOpen] = useState(false);

  /**
   * How to set internal state using hooks for notifications.
   * const [notifications, setNotifications] = useState(notificationsInitialState);
   **/
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  return (
    <>
      <Tooltip title="Notifications">
        <IconButton
          id={"NotificationsMenuButton"}
          color="inherit"
          ref={ref}
          onClick={handleOpen}
        >
          <SvgIcon>
            <BellIcon />
          </SvgIcon>
        </IconButton>
      </Tooltip>
      <Popover
          id={"NotificationMenuDropDown"}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        classes={{ paper: classes.popover }}
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
      >
        <Box p={2}>
          <Typography
            variant="h5"
            color="textPrimary"
          >
            Notifications
          </Typography>
        </Box>
        {props.notifications.length === 0 ? (
          <Box id={"NoNotificationsMessage"} p={2}>
            <Typography
              variant="h6"
              color="textPrimary"
            >
              There are no notifications
            </Typography>
          </Box>
        ) : (
          <>
            <List
              className={classes.list}
              disablePadding
            >
              {props.notifications.map((notification) => {
                const Icon = iconsMap[notification.type];

                return (
                  <ListItem
                    className={classes.listItem}
                    component={RouterLink}
                    divider
                    key={notification.id}
                    to="#"
                  >
                    <ListItemAvatar>
                      <Avatar
                        className={classes.icon}
                      >
                        <SvgIcon fontSize="small">
                          <Icon />
                        </SvgIcon>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={notification.title}
                      primaryTypographyProps={{ variant: 'subtitle2', color: 'textPrimary' }}
                      secondary={notification.description}
                    />
                  </ListItem>
                );
              })}
            </List>
            <Box
              p={1}
              display="flex"
              justifyContent="center"
            >
              <Button
                component={RouterLink}
                size="small"
                to="#"
              >
                Mark all as read
              </Button>
            </Box>
          </>
        )}
      </Popover>
    </>
  );
}

Notifications.propTypes = {
  notifications: PropTypes.array.isRequired
}

export default Notifications;
