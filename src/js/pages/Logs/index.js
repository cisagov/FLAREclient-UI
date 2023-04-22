import React, {
  useCallback,
  useEffect,
  useState
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import Header from './Header';
import { getLogs, updateLogs } from '../../redux/actions/logs';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useSnackbar } from 'notistack';

// Material UI Button is VERY slow for this page since there are
// so many of them.  So, using HTML button and applying this CSS
// so they look like the Material UI version
const buttoncss = {
  fontSize: '0.875rem',
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  fontWeight: '500',
  lineHeight: '1.75',
  letterSpacing: '0.02857em',
  textTransform: 'uppercase',
  borderRadius: '5px',
  border: '0px',
  padding: '4px 8px'
};

const useStyles = makeStyles((theme) => ({
  root: {},
  trace: {...buttoncss, color:'white',backgroundColor:'#007bff'},
  debug: {...buttoncss, color:'white',backgroundColor:'#28a745'},
  info: {...buttoncss, color:'white',backgroundColor:'#17a2b8'},
  warn: {...buttoncss, color:'black',backgroundColor:'#ffc107'},
  error: {...buttoncss, color:'white',backgroundColor:'#dc3545'},
  off: {...buttoncss, color:'white',backgroundColor:'#6c757d'},
  normal: {...buttoncss, color:'black',backgroundColor:'#f8f9fa'}
}));

function Logs({className, staticContext, ...rest}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [retrievedLogs,setRetrievedLogs] = useState(false);
  const [filter,setFilter] = useState('');
  const logs = useSelector(state => state.logs.logs);
  const { enqueueSnackbar } = useSnackbar();

  const fetchLogs = useCallback(async () => {
    await dispatch(getLogs());
  }, [dispatch]);

  useEffect(() => {
    if (!retrievedLogs) {
      fetchLogs();
      setRetrievedLogs(true);
    }
  }, [fetchLogs,retrievedLogs]);

  if (!logs) {
    return null;
  }

  const changeLevel = async (name,level) => {
    try {
      await dispatch(updateLogs(name, level));
      fetchLogs();
    } catch (error) {
      enqueueSnackbar("The update failed.", {variant: 'error'});
    }
  }

  const filterLogs = l => l.name.toUpperCase().includes(filter.toUpperCase());

  const getClassName = (level, check) => (level === check.toUpperCase() ? classes[check] : classes.normal);

  return (
    <Box p={3}>
      <Header/>
      <Typography color='textPrimary'>Total number of logged items: {logs.length}</Typography>
      <Typography color='textPrimary'>Number of filtered logged items: {logs.filter(filterLogs).length}</Typography>
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
                    <TableCell colSpan={2}>
                      <TextField fullWidth placeholder="FILTER" onChange={(e) => setFilter(e.target.value)} defaultValue={filter}/>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      Name
                    </TableCell>
                    <TableCell>
                      Level
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow
                      hover
                      key={log.name}
                      style={log.name.toUpperCase().includes(filter.toUpperCase())?null:{display:"none"}}
                    >
                      <TableCell id="name">
                        {log.name}
                      </TableCell>
                      <TableCell id={"trace"}>
                        <button
                          id="trace"
                          onClick={() => changeLevel(log.name, 'TRACE')}
                          className={getClassName(log.level,'trace')}
                        > 
                          TRACE
                        </button>
                        &nbsp;
                        <button
                          id="debug"
                          onClick={() => changeLevel(log.name, 'DEBUG')}
                          className={getClassName(log.level,'debug')}
                        > 
                          DEBUG
                        </button>
                        &nbsp;
                        <button
                          id="info"
                          onClick={() => changeLevel(log.name, 'INFO')}
                          className={getClassName(log.level,'info')}
                        > 
                          INFO
                        </button>
                        &nbsp;
                        <button
                          id="warn"
                          onClick={() => changeLevel(log.name, 'WARN')}
                          className={getClassName(log.level,'warn')}
                        > 
                          WARN
                        </button>
                        &nbsp;
                        <button
                          id="error"
                          onClick={() => changeLevel(log.name, 'ERROR')}
                          className={getClassName(log.level,'error')}
                        > 
                          ERROR
                        </button>
                        &nbsp;
                        <button
                          id="off"
                          onClick={() => changeLevel(log.name, 'OFF')}
                          className={getClassName(log.level,'off')}
                        > 
                          OFF
                        </button>
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

export default Logs;
