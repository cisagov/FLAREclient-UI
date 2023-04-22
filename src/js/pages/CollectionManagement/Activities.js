import React, {
  useCallback,
  useEffect,
  useState
} from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  Box,
  Button,
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
import {
  Play,
  Square as Stop
} from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { getActivities } from "../../redux/actions/collections";
import {convertIsoDate} from "../../utils/helpers";
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

function Activities({className, server, collection, ...rest}) {
  const classes = useStyles();
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('time');
  const [numPerPage, setNumPerPage] = useState(20);
  const [page, setPage] = useState(1);
  const [retrievedData, setRetrievedData]=useState(false);
  const [automaticRefresh, setAutomaticRefresh]=useState(true);
  const [render, setRender]=useState(false);
  const activities = useSelector(state => state.collections.activities);
  const count = useSelector(state => state.collections.activitiesCount);
  const [choosePage, setChoosePage] = useState(1);

  const dispatch = useDispatch();

  const camelToSnakeCase = str => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

  useEffect(() => {
    if (count===0) {
      setChoosePage(0);
    } else {
      setChoosePage(1);
    }
  }, [count]);

  const fetchActivities = useCallback(async () => {
    let ob = camelToSnakeCase(orderBy);
    if (orderBy==='logged') {
      ob = 'time';
    }
    try {
      await dispatch(getActivities(server,collection.id,page-1,numPerPage,ob,order));
    } catch (err) {
      if (page>1) {
        setPage(page-1);
        setChoosePage(page);
      }
    }
  }, [dispatch,server,collection,page,numPerPage,orderBy,order]);

  useEffect(() => {
    if (!retrievedData) {
      fetchActivities();
      setRetrievedData(true);
    }
  }, [retrievedData,fetchActivities,activities]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities,page,numPerPage,orderBy,order,render]);

  useEffect(() => {
    if (automaticRefresh) {
      const timeout = setTimeout(() => {
        setRender(!render);
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [render,automaticRefresh]);

  const displayActivities= activities[collection.id] ? activities[collection.id] : [];

  const updateSort = (column) => {
    if (column === orderBy)
    {
      setOrder(order==='desc'?'asc':'desc')
    } else {
      setOrder('asc')
      setOrderBy(column)
    }
  }

  const toggleRefresh = () => {
    automaticRefresh ? stopRefresh() : startRefresh();
  };

  const startRefresh = () => {
    setAutomaticRefresh(true);
  };

  const stopRefresh = () => {
    setAutomaticRefresh(false);
  };

  return (
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
                    numItems={displayActivities.length}
                    count={count}
                  />
                  <Button style={{position:'relative',right:'0px'}} color="primary" variant="outlined" onClick={toggleRefresh}>
                    {automaticRefresh ? (
                      <>
                        <Stop/>&nbsp;&nbsp;Stop automatic updating
                      </>
                    ) : (
                      <>
                        <Play/>&nbsp;&nbsp;Start automatic updating
                      </>
                    )}
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
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
                  <Tooltip
                    enterDelay={300}
                    title="Sort Details"
                  >
                    <TableSortLabel
                      active={orderBy==='details'}
                      direction={order}
                      onClick={() => updateSort('details')}
                    >
                      Details
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip
                    enterDelay={300}
                    title="Sort Timestamp"
                  >
                    <TableSortLabel
                      active={orderBy==='time'}
                      direction={order}
                      onClick={() => updateSort('time')}
                    >
                      Timestamp
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip
                    enterDelay={300}
                    title="Sort Logged"
                  >
                    <TableSortLabel
                      active={orderBy==='logged'}
                      direction={order}
                      onClick={() => updateSort('logged')}
                    >
                      Logged
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayActivities.map((activity) => (
                <TableRow
                  hover
                  key={activity.id}
                >
                  <TableCell id={"type"}>
                    {activity.type}
                  </TableCell>
                  <TableCell id={"details"}>
                    {activity.details}
                  </TableCell>
                  <TableCell id={"time"} style={{whiteSpace:'nowrap'}}>
                    {convertIsoDate(activity.time)}
                  </TableCell>
                  <TableCell id={"logged"}>
                    {moment(activity.time).fromNow()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
    </Card>
  );
}

Activities.propTypes = {
  className: PropTypes.string,
  server: PropTypes.string,
  collection: PropTypes.object
};

Activities.defaultProps = {
  server: "",
  collection: {}
};

export default Activities;
