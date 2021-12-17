import React, {
  useCallback,
  useEffect,
  useState
} from 'react';
import {
  Box,
  Card,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
  makeStyles
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import Header from './Header';
import { getAudits } from '../../redux/actions/audits';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {convertIsoDate} from "../../utils/helpers";
import { KeyboardDatePicker } from '@material-ui/pickers';
import moment from 'moment';
import Pagination from "../../utils/Pagination";
import { X as Times } from 'react-feather';

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

function Audits({className, staticContext, ...rest}) {
  const classes = useStyles();
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('auditEventDate');
  const [numPerPage, setNumPerPage] = useState(20);
  const [page, setPage] = useState(1);
  const [retrievedAudits, setRetrievedAudits] = useState(false);
  const audits = useSelector(state => state.audits.audits);
  const count = useSelector(state => state.audits.auditsCount);
  const [choosePage, setChoosePage] = useState(1);
  const [startDate, setStartDate] = useState(moment().subtract(1,'month'));
  const [endDate, setEndDate] = useState(moment());
  const [startDateError, setStartDateError] = useState(null);
  const [endDateError, setEndDateError] = useState(null);

  const dispatch = useDispatch();

  const checkDatesForErrors = useCallback(() => {
    let newStartDateError=null;
    let newEndDateError=null;
    const startMoment = startDate && parseInt(startDate.format('YYYYMMDD'));
    const endMoment = endDate && parseInt(endDate.format('YYYYMMDD'));
    const now = parseInt(moment().format('YYYYMMDD'));
    if (startDate) {
      if (startDate.format('YYYY-MM-DD')==='Invalid date') {
        newStartDateError=<span><br/>Invalid date</span>;
      } else if (startMoment>now) {
        newStartDateError=<span><br/>Cannot set a date greater than today</span>;
      }
    }
    if (endDate) {
      if (endDate.format('YYYY-MM-DD')==='Invalid date') {
        newEndDateError=<span><br/>Invalid date</span>;
      } else if (endMoment>now) {
        newEndDateError=<span><br/>Cannot set a date greater than today</span>;
      }
    }
    if (startDate && endDate && newStartDateError===null && newEndDateError===null) {
      if (startMoment>endMoment) {
        newStartDateError=<span><br/>Start time is greater than or equal to the end time</span>;
      }
    }
    return([newStartDateError,newEndDateError]);
  },[startDate,endDate]);


  const fetchAudits = useCallback(async () => {
    const errors = checkDatesForErrors();
    if (errors[0]===null && errors[1]===null) {
      try {
        await dispatch(getAudits(page-1,numPerPage,orderBy,order,startDate && startDate.format('YYYY-MM-DD'),endDate && endDate.format('YYYY-MM-DD')));
      } catch (err) {
        if (page>1) {
          setPage(page-1);
          setChoosePage(page);
        }
      }
    }
  }, [dispatch,page,numPerPage,orderBy,order,startDate,endDate,checkDatesForErrors]);

  useEffect(() => {
    if(!retrievedAudits){
      fetchAudits();
      setRetrievedAudits(true);
    }
  }, [fetchAudits,retrievedAudits,audits]);

  useEffect(() => {
    if (count===0) {
      setChoosePage(0);
    } else {
      setChoosePage(1);
    }
  }, [count]);

  useEffect(() => {
    fetchAudits();
  }, [fetchAudits,page,numPerPage,orderBy,order]);

  useEffect(() => {
    const errors=checkDatesForErrors();
    setStartDateError(errors[0]);
    setEndDateError(errors[1]);
  },[startDate,endDate,checkDatesForErrors]);

  if (!audits) {
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
                        numItems={audits.length}
                        count={count}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Grid container spacing={5}>
                        <Grid item xs={12} md={6} style={{textAlign: "center"}}>
                          <Typography gutterBottom variant="h3" component="h2">
                            From
                          </Typography>
                          <KeyboardDatePicker
                            id="startDate"
                            InputLabelProps={{shrink:true}}
                            format="MM/DD/YYYY"
                            value={startDate}
                            placeholder="mm/dd/yyyy"
                            style={{width:160}}
                            error={Boolean(startDateError)}
                            onChange={date => {setStartDate(date)}}
                            helperText={startDateError}
                          />
                          <Tooltip
                            enterDelay={300}
                            title="Clear From Date"
                          > 
                            <Times style={{cursor:'pointer',position:'relative',top:'7px'}} onClick={() => {setStartDate(null)}}/>
                          </Tooltip>
                        </Grid>
                        <Grid item xs={12} md={6} style={{textAlign: "center"}}>
                          <Typography gutterBottom variant="h3" component="h2">
                            To
                          </Typography>
                          <KeyboardDatePicker
                            id="endDate"
                            InputLabelProps={{shrink:true}}
                            format="MM/DD/YYYY"
                            value={endDate}
                            placeholder="mm/dd/yyyy"
                            style={{width:160}}
                            error={Boolean(endDateError)}
                            onChange={date => {setEndDate(date)}}
                            helperText={endDateError}
                          />
                          <Tooltip
                            enterDelay={300}
                            title="Clear To Date"
                          > 
                            <Times style={{cursor:'pointer',position:'relative',top:'7px'}} onClick={() => {setEndDate(null)}}/>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Tooltip
                        enterDelay={300}
                        title="Sort Date"
                      >
                        <TableSortLabel
                          active={orderBy==='auditEventDate'}
                          direction={order}
                          onClick={() => updateSort('auditEventDate')}
                        >
                          Date
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        enterDelay={300}
                        title="Sort User"
                      >
                        <TableSortLabel
                          active={orderBy==='principal'}
                          direction={order}
                          onClick={() => updateSort('principal')}
                        >
                          User
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        enterDelay={300}
                        title="Sort State"
                      >
                        <TableSortLabel
                          active={orderBy==='auditEventType'}
                          direction={order}
                          onClick={() => updateSort('auditEventType')}
                        >
                          State
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      Extra Data
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {audits.map((audit) => (
                    <TableRow
                      hover
                      key={audit.timestamp}
                    >
                      <TableCell id={"date"}>
                        {convertIsoDate(audit.timestamp)}
                      </TableCell>
                      <TableCell id={"user"}>
                        {audit.principal}
                      </TableCell>
                      <TableCell id={"state"}>
                        {audit.type}
                      </TableCell>
                      <TableCell id={"extraData"}>
                        {audit.data?audit.data.message:null}
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

export default Audits;
