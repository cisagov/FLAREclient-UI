import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  ListItem,
  ListItemText,
  makeStyles
} from '@material-ui/core';
import {convertIsoDate} from "../../../utils/helpers";

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    border: `3px solid ${theme.palette.background.default}`,
    marginLeft: -20,
    '&:hover': {
      zIndex: 2
    }
  },
  viewButton: {
    marginLeft: theme.spacing(2)
  }
}));

function EventItem({ event, className, ...rest }) {
  const classes = useStyles();

  return (
    <ListItem
      className={clsx(
        classes.root,
        className
      )}
      {...rest}
    >
      <ListItemText
        className={classes.listItemText}
        primary={event.details}
        secondary={convertIsoDate(event.time)}
        primaryTypographyProps={{ variant: 'h6', noWrap: true }}
      />
    </ListItem>
  );
}

EventItem.propTypes = {
  className: PropTypes.string,
  event: PropTypes.object.isRequired
};

export default EventItem;
