import React from 'react';
//import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import {
  Avatar,
  Card,
  Typography,
//  Link,
  makeStyles,
  colors
} from '@material-ui/core';
import {
  PieChart as PieChartIcon,
  Users as UsersIcon,
  Settings as SettingsIcon,
} from "react-feather";

import ComputerIcon from '@material-ui/icons/Computer';
import NotificationIcon from '@material-ui/icons/Notifications';
import EventIcon from '@material-ui/icons/Policy';
import ContentIcon from '@material-ui/icons/BlurOn'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center'
  },
  card: {
    marginLeft: theme.spacing(2),
    flexGrow: 1,
    display: 'flex',
    padding: theme.spacing(2),
    alignItems: 'center'
  },
  date: {
    marginLeft: 'auto',
    flexShrink: 0
  },
  avatar: {
    color: colors.common.white
  },
  avatarBlue: {
    backgroundColor: colors.blue[500]
  },
  avatarGreen: {
    backgroundColor: colors.green[500]
  },
  avatarOrange: {
    backgroundColor: colors.orange[500]
  },
  avatarIndigo: {
    backgroundColor: colors.indigo[500]
  },
  avatarGrey: {
    backgroundColor: colors.grey[500]
  },
  avatarPurple: {
    backgroundColor: colors.purple[500]
  }
}));

const avatarsMap = {
  content_management: {
    icon: ContentIcon,
    className: 'avatarBlue'
  },
  user_management: {
    icon: UsersIcon,
    className: 'avatarOrange'
  },
  server_management: {
    icon: ComputerIcon,
    className: 'avatarIndigo'
  },
  notification_management: {
    icon: NotificationIcon,
    className: 'avatarPurple'
  },
  report: {
    icon: PieChartIcon,
    className: 'avatarGreen'
  },
  app_config: {
    icon: SettingsIcon,
    className: 'avatarGrey'
  }
};

function Event({ activity, className, ...rest }) {
  const classes = useStyles();
  let avatar = avatarsMap[activity.type];

  //Check if the returned avatar is null or not, if so, default to the events icon
  const defaultAvatar = {
    icon: EventIcon,
    className: 'avatarOrange'
  };

  if (!avatar){
    avatar = {...defaultAvatar}
  }

  return (
      <div
          className={clsx(classes.root, className)}
          {...rest}
      >
        <Avatar className={clsx(classes.avatar, classes[avatar.className])}>
          <avatar.icon />
        </Avatar>
        <Card className={classes.card}>
          <div>
            <Typography variant="h5">
              <b>{activity.user}</b>
            </Typography>
            <br/>
            <Typography variant="body1" color="textPrimary">
              {' '}
              {activity.description}
            </Typography>
          </div>
          <Typography
              className={classes.date}
              variant="caption"
          >
            {moment(activity.createdAt).fromNow()}
          </Typography>
        </Card>
      </div>
  );
}

Event.propTypes = {
  activity: PropTypes.object.isRequired,
  className: PropTypes.string
};

export default Event;
