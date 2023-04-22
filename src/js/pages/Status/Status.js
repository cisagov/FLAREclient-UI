import React from 'react';
import {
  Box,
  Button,
  Typography
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { useSelector } from 'react-redux';
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  XCircle
} from 'react-feather';
import { Link } from 'react-router-dom';

function Status(props) {
  const statusId = props.match.params.statusId;

  const statuses = useSelector(state => state.status.status);
  const status = statuses.find(s => s.id === statusId);

  console.log('[ ] status=', status);
  return (
    <Box p={4} component="div" whiteSpace="normal">
      <Button variant="outlined" component={Link} onClick={() => sessionStorage.setItem('returnFromStatusDetail',1)} to={'/app/reports/status'} color="primary">
        <ArrowLeft/> Back
      </Button><br/><br/>
      <Typography color='textPrimary' variant='h2'>Details for {statusId}</Typography>
      {status.errorCount > 0 ?
        (status.errorCount >= 10 ?
          (<Alert severity="error">{"Error getting status " + status.errorCount + " times. It likely does not exist on the TAXII server."}</Alert>) :
          (<Alert severity="warning">{"Error getting status " + status.errorCount + " times."}</Alert>)
        ):
        null}
      <br/>
      <Typography color='textPrimary' variant='h4'>Status: {status.status}</Typography><br/>
      {status.successes ? status.successes.map(details => (
          <span key={details.id}>
            <Typography style={{color:'green'}} variant='h5'>
              <CheckCircle/> {details.id}
            </Typography>
            <Typography variant='h5' color='textPrimary'>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {details.message}
            </Typography>
          </span>
      )) : null}
      {status.failures ? status.failures.map(details => (
          <span key={details.id}>
            <Typography style={{color:'red'}} variant='h5'>
              <XCircle/> {details.id}
            </Typography>
            <Typography variant='h5' color='textPrimary'>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {details.message}
            </Typography>
          </span>
      )) : null}
      {status.pendings ? status.pendings.map(details => (
          <span key={details.id}>
            <Typography style={{color:'gray'}} variant='h5'>
              <Clock/> {details.id}
            </Typography>
            <Typography variant='h5' color='textPrimary'>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {details.message}
            </Typography>
          </span>
      )) : null}
    </Box>
  )
}

export default Status
