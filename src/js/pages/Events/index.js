import React, {
  useCallback,
  useEffect,
  useState
} from 'react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  makeStyles
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import Header from './Header';
import { getEvents } from '../../redux/actions/events';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import moment from 'moment';
import Pagination from "../../utils/Pagination";

const useStyles = makeStyles((theme) => ({
  root: {},

  unselectable: {
    MozUserSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none'
  },

  pointer: {
    MozUserSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
    cursor: 'pointer'
  },

  invisible: { cursor: 'default', opacity: 0 }
}));

function Events({className, staticContext, ...rest}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const events = useSelector(state => state.events.events);
  const count = useSelector(state => state.events.eventsCount);
  const [retrievedEvents, setRetrievedEvents] = useState(false);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('time');
  const [numPerPage, setNumPerPage] = useState(20);
  const [page, setPage] = useState(1);
  const [choosePage, setChoosePage] = useState(1);

  const fetchEvents = useCallback(async () => {
    try {
      await dispatch(getEvents(page-1,numPerPage,orderBy,order));
    } catch (err) {
      if (page>1) {
        setPage(page-1);
        setChoosePage(page);
      }
    }
  }, [dispatch,page,numPerPage,orderBy,order]);

  useEffect(() => {
    if(!retrievedEvents){
      fetchEvents();
      setRetrievedEvents(true);
    }
  }, [fetchEvents,retrievedEvents,events]);

  useEffect(() => {
    if (count===0) {
      setChoosePage(0);
    } else {
      setChoosePage(1);
    }
  }, [count]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents,page,numPerPage,orderBy,order]);

  if (!events) {
    return null;
  }

  const updateSort = (column) => {
    if (column === orderBy)
    {
      setOrder(order==='desc'?'asc':'desc')
    } else {
      setOrder('asc')
      setOrderBy(column)
    }
  }

  return (
    <Box p={3}>
      <Header/>
      <Box mt={2}>
        <Card
          className={clsx(classes.root, className)}
          {...rest}
        >
          <PerfectScrollbar>
            <Box>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={4} style={{textAlign: 'center'}}>
                      <Pagination
                        page={page}
                        setPage={setPage}
                        choosePage={choosePage}
                        setChoosePage={setChoosePage}
                        numPerPage={numPerPage}
                        setNumPerPage={setNumPerPage}
                        numItems={events.length}
                        count={count}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Tooltip
                        enterDelay={300}
                        title="Sort Server"
                      >
                        <TableSortLabel
                          active={orderBy==='server'}
                          direction={order}
                          onClick={() => updateSort('server')}
                        >
                          Server
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        enterDelay={300}
                        title="Sort Type"
                      >
                        <TableSortLabel
                          active={orderBy==='type'}
                          direction={order}
                          onClick={() => updateSort('type')}
                        >
                          Type
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      Details
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        enterDelay={300}
                        title="Sort Logged"
                      >
                        <TableSortLabel
                          active={orderBy==='time'}
                          direction={order}
                          onClick={() => updateSort('time')}
                        >
                          Logged
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {events.map((event) => (
                    <TableRow
                      hover
                      key={event.id}
                    >
                      <TableCell id={"server"}>
                        {event.server}
                      </TableCell>
                      <TableCell id={"type"}>
                        {event.type}
                      </TableCell>
                      <TableCell id={"details"}>
                        {event.details}
                      </TableCell>
                      <TableCell id={"logged"}>
                        {moment(event.time).fromNow()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </PerfectScrollbar>
        </Card>
      </Box>
    </Box>
  );
}

export default Events;
