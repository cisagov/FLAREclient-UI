import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Card,
  CardHeader,
  Divider,
  List,
  makeStyles
} from '@material-ui/core';
import EventItem from './EventItem';
import { useHistory } from 'react-router';

const useStyles = makeStyles(() => ({
  root: {cursor: 'pointer'}
}));

function CanaryEvents({ className, events, ...rest }) {
  const classes = useStyles();
  const history = useHistory();

  if (!events) {
    return null;
  }

  return (
    <Card
      onClick={() => history.push('/app/reports/events')}
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardHeader
        title="Latest 10 Events (to see all, click here)"
      />
      <Divider />
      <PerfectScrollbar>
        <Box minWidth={400}>
          <List>
            {events.map((event, i) => (
              <EventItem
                divider={i < events.length - 1}
                key={event.id}
                event={event}
              />
            ))}
          </List>
        </Box>
      </PerfectScrollbar>
    </Card>
  );
}

CanaryEvents.propTypes = {
  className: PropTypes.string,
  events: PropTypes.array
};

export default CanaryEvents;
