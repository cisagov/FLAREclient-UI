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

import CancelIcon from '@material-ui/icons/Cancel';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import WarningIcon from '@material-ui/icons/Warning';

import { useDispatch, useSelector } from 'react-redux';
import Header from './Header';
import { getStatus } from '../../redux/actions/status';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {convertIsoDate} from "../../utils/helpers";
import { Link } from 'react-router-dom';
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

function Statuses({className, staticContext, ...rest}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const statuses = useSelector(state => state.status.status);
  const count = useSelector(state => state.status.statusCount);
  const [retrievedStatus, setRetrievedStatus] = useState(false);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('request_timestamp');
  const [numPerPage, setNumPerPage] = useState(20);
  const [page, setPage] = useState(1);
  const [choosePage, setChoosePage] = useState(1);

  const fetchStatus= useCallback(async () => {
    try {
      await dispatch(getStatus(page-1,numPerPage,orderBy,order));
    } catch (err) {
      if (page>1) {
        setPage(page-1);
        setChoosePage(page);
      }
    }
  }, [dispatch,page,numPerPage,orderBy,order]);

  useEffect(() => {
    if (!retrievedStatus) {
      if (sessionStorage.getItem('returnFromStatusDetail')) {
        try {
          const oldPage = parseInt(sessionStorage.getItem('currentPage'));
          if (oldPage) {
            setPage(oldPage);
            setChoosePage(oldPage);
            setNumPerPage(sessionStorage.getItem('currentNumPerPage'));
            setOrderBy(sessionStorage.getItem('currentOrderBy'));
            setOrder(sessionStorage.getItem('currentOrder'));
          }
        } catch (error) {
          setPage(1);
          setChoosePage(1);
          setNumPerPage(20);
          setOrderBy('lastRetrieved');
          setOrder('desc');
        }
      }
      sessionStorage.removeItem('returnFromStatusDetail');
      sessionStorage.removeItem('currentPage');
      sessionStorage.removeItem('currentNumPerPage');
      sessionStorage.removeItem('currentOrderBy');
      sessionStorage.removeItem('currentOrder');
      fetchStatus();
      setRetrievedStatus(true);

    }
  }, [fetchStatus,retrievedStatus,statuses]);

  useEffect(() => {
    if (count===0) {
      setChoosePage(0);
    } else {
      setChoosePage(1);
    }
  }, [count]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus,page,numPerPage,orderBy,order]);

  if (!statuses) {
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

  const saveCurrentState = () => {
    sessionStorage.setItem('currentPage',page);
    sessionStorage.setItem('currentNumPerPage',numPerPage);
    sessionStorage.setItem('currentOrderBy',orderBy);
    sessionStorage.setItem('currentOrder',order);
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
              <Table id="status-table">
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={6} style={{textAlign: 'center'}}>
                      <Pagination
                        page={page}
                        setPage={setPage}
                        choosePage={choosePage}
                        setChoosePage={setChoosePage}
                        numPerPage={numPerPage}
                        setNumPerPage={setNumPerPage}
                        numItems={statuses.length}
                        count={count}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Tooltip
                        enterDelay={300}
                        title="Sort ID"
                      >
                        <TableSortLabel
                          active={orderBy==='id'}
                          direction={order}
                          onClick={() => updateSort('id')}
                        >
                          ID
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        enterDelay={300}
                        title="Warning Status">
                          <InfoOutlinedIcon />
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        enterDelay={300}
                        title="Sort Last Updated"
                      >
                        <TableSortLabel
                          active={orderBy==='request_timestamp'}
                          direction={order}
                          onClick={() => updateSort('request_timestamp')}
                        >
                          Last Updated
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        enterDelay={300}
                        title="Sort Total Objects"
                      >
                        <TableSortLabel
                          active={orderBy==='total_count'}
                          direction={order}
                          onClick={() => updateSort('total_count')}
                        >
                          Total Objects
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        enterDelay={300}
                        title="Sort Successes"
                      >
                        <TableSortLabel
                          active={orderBy==='success_count'}
                          direction={order}
                          onClick={() => updateSort('success_count')}
                        >
                          Successes
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        enterDelay={300}
                        title="Sort Failures"
                      >
                        <TableSortLabel
                          active={orderBy==='failure_count'}
                          direction={order}
                          onClick={() => updateSort('failure_count')}
                        >
                          Failures
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        enterDelay={300}
                        title="Sort Status"
                      >
                        <TableSortLabel
                          active={orderBy==='status'}
                          direction={order}
                          onClick={() => updateSort('status')}
                        >
                          Status
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {statuses.map((status) => (
                    <TableRow hover key={status.id}>
                      <TableCell id={"id"}>
                        <Link style={{color: '#FFF'}} onClick={() => saveCurrentState()} to={`/app/reports/status/${status.id}`}>
                          {status.id}
                        </Link>
                      </TableCell>
                      <TableCell id={"warnings"}>
                        {status.errorCount > 0 ?
                          (status.errorCount >= 10 ?
                            (<Tooltip title={"Error: Error getting status " + status.errorCount + " times."}><CancelIcon /></Tooltip>) :
                            (<Tooltip title={"Warning: Error getting status " + status.errorCount + " times."}><WarningIcon /></Tooltip>)
                          ):
                          ""}
                      </TableCell>
                      <TableCell id={"lastUpdated"}>
                        {convertIsoDate(status.requestTimestamp)}
                      </TableCell>
                      <TableCell id={"totalObjects"}>
                        {status.totalCount}
                      </TableCell>
                      <TableCell id={"successes"}>
                        {status.successCount}
                      </TableCell>
                      <TableCell id={"failures"}>
                        {status.failureCount}
                      </TableCell>
                      <TableCell id={"status"}>
                        {status.status}
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

export default Statuses;
