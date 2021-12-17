import React, {useState, useEffect, useCallback} from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  InputLabel,
  Select,
  Switch,
  TextField,
  Typography
} from '@material-ui/core';
import {
  KeyboardDatePicker,
  KeyboardTimePicker
} from '@material-ui/pickers';
import Alert from '@material-ui/lab/Alert';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { requestDownload, getRecurring, stopRecurring } from "../../redux/actions/collections";
import { useSnackbar } from 'notistack';
import { AlertTriangle } from 'react-feather';
 
function Download1x({className, server, collection, ...rest}) {
  const stixContentVersions = ['1.0','1.0.1','1.1','1.1.1','1.2'];
  const [startDate, setStartDate] = useState(
    collection.latestFetch ?
      moment.utc(collection.latestFetch) :
      moment.utc().subtract(1,'day')
  );
  const [startTime, setStartTime] = useState(
    collection.latestFetch ?
      moment.utc(collection.latestFetch) :
      moment.utc()
  );
  const [endDate, setEndDate] = useState(moment.utc());
  const [endTime, setEndTime] = useState(moment.utc());
  const [startDateError, setStartDateError] = useState(null);
  const [startTimeError, setStartTimeError] = useState(null);
  const [endDateError, setEndDateError] = useState(null);
  const [endTimeError, setEndTimeError] = useState(null);
  const [contentVersions, setContentVersions] = useState(stixContentVersions);
  const [repeat, setRepeat] = useState(false);
  const [waitTime, setWaitTime] = useState(30);
  const [isSubmitting, setSubmitting] = useState(false);
  const [isDisabled, setDisabled] = useState(false);
  const [checkedRecurring, setCheckedRecurring] = useState(false);
  const [currentlyRecurring, setCurrentlyRecurring] = useState(false);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const fetchRecurring = useCallback(() => {
    dispatch(getRecurring(server,collection.id));
    setCheckedRecurring(true);
  }, [dispatch,server,collection.id]);

  moment.updateLocale('en', {
    longDateFormat : {
      LT: "h:mm:ss A", // <----------- add :ss
      L: "MM/DD/YYYY",
      l: "M/D/YYYY",
      LL: "MMMM Do YYYY",
      ll: "MMM D YYYY",
      LLL: "MMMM Do YYYY LT",
      lll: "MMM D YYYY LT",
      LLLL: "dddd, MMMM Do YYYY LT",
      llll: "ddd, MMM D YYYY LT"
    }
  });

  useEffect(() => {
    let newStartDateError=null;
    let newStartTimeError=null;
    let newEndDateError=null;
    let newEndTimeError=null;
    if (startDate===null) {
      newStartDateError=<span><br/>Start date must be specified</span>;
    }
    if (startTime===null) {
      newStartTimeError=<span><br/>Start date must be specified</span>;
    }
    if (endDate===null) {
      newEndDateError=<span><br/>Start date must be specified</span>;
    }
    if (endTime===null) {
      newEndTimeError=<span><br/>Start date must be specified</span>;
    }
    if (newStartDateError===null) {
      if (startDate.format('YYYY-MM-DD')==='Invalid date') {
        newStartDateError=<span><br/>Invalid date</span>;
      }
    }
    if (newStartTimeError===null) {
      if (startTime.format('HH:mm:ss')==='Invalid date') {
        newStartTimeError=<span><br/>Invalid time</span>;
      }
    }
    if (newEndDateError===null) {
      if (endDate.format('YYYY-MM-DD')==='Invalid date') {
        newEndDateError=<span><br/>Invalid date</span>;
      }
    }
    if (newEndTimeError===null) {
      if (endTime.format('HH:mm:ss')==='Invalid date') {
        newEndTimeError=<span><br/>Invalid time</span>;
      }
    }
    if (newStartDateError===null && newStartTimeError===null && newEndDateError===null && newEndTimeError===null) {
      const startMoment = moment(startDate.format('YYYY-MM-DD') + 'T' + startTime.format('HH:mm:ss'));
      const endMoment = moment(endDate.format('YYYY-MM-DD') + 'T' + endTime.format('HH:mm:ss'));
      const now = moment();
      if (startMoment.diff(now, 'seconds') > 0) {
        newStartDateError=<span><br/>Cannot set a date greater than now</span>;
        newStartTimeError=<span><br/>Cannot set a time greater than now</span>;
      } else if (startMoment.diff(endMoment, 'seconds') >= 0) {
        newStartDateError=<span><br/>Start time is greater than or equal to the end time</span>;
        newStartTimeError=<span><br/>Start time is greater than or equal to the end time</span>;
      } else if (startMoment.diff(endMoment, 'months') <= -6) {
        newStartDateError=<span><br/>You cannot request more than six months of data</span>;
        newStartTimeError=<span><br/>You cannot request more than six months of data</span>;
      }
    }
    setStartDateError(newStartDateError);
    setStartTimeError(newStartTimeError);
    setEndDateError(newEndDateError);
    setEndTimeError(newEndTimeError);
  },[startDate,startTime,endDate,endTime]);

  useEffect(() => {
    if (!checkedRecurring) {
      fetchRecurring();
    }
  });

  useEffect(() => {
    setDisabled(!collection.collectionObject.available);
  },[collection]);

  const handleChangeMultiple = (event) => {
    const { options } = event.target;
    const value = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setContentVersions(value);
  };

  const checkWaitTime = () => {
    return (isNaN(waitTime)||waitTime.toString().trim().length===0||Number(waitTime)<1||Number(waitTime)!==Number(Number(waitTime).toFixed(0)));
  }

  const validateWaitTime = checkWaitTime();

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      let formData = {
                       type: 'TAXII11',
                       contentBindings: contentVersions,
                       startDate: startDate.format('YYYY-MM-DD')+'T'+startTime.format('HH:mm:ss')+'.000Z',
                       endDate: endDate.format('YYYY-MM-DD')+'T'+endTime.format('HH:mm:ss')+'.000Z',
                       window: waitTime,
                       repeat
                     };
      if (!repeat) {
        delete formData['repeat'];
        delete formData['window'];
      }
      await dispatch(requestDownload(server,collection.id,formData))
      setSubmitting(false);
      enqueueSnackbar('Started async download', {variant: 'success'});
      setCurrentlyRecurring(repeat);
    } catch (err) {
      enqueueSnackbar('Problem requesting download', {variant: 'error'});
      setSubmitting(false);
    }
  }

  const handleStopRecurring = async() => {
    setSubmitting(true);
    try {
      await dispatch(stopRecurring(server,collection.id))
      setSubmitting(false);
      enqueueSnackbar('Stopped recurring fetch', {variant: 'success'});
      setCurrentlyRecurring(false);
    } catch (err) {
      enqueueSnackbar('Problem stopping recurring fetch', {variant: 'error'});
      setSubmitting(false);
    }
  }

  const submitDisabled = isDisabled || isSubmitting || Boolean(startDateError) || Boolean(startTimeError) || Boolean(endDateError) || Boolean(endTimeError);

  return (
    <form>
      <Grid container spacing={3}>
        {isDisabled ? <Grid item xs={12} md={12}>
          <Card style={{textAlign: "center"}}>
            <br/>
            <AlertTriangle style={{position: "relative",top: "7px"}} color="yellow"/> The server has indicated that this collection cannot be read from.<br/>
            <br/>
          </Card>
        </Grid> : null}
        <Grid item xs={12} md={12}>
          <Card>
            <CardContent>
              <Grid container spacing={5}>
                <Grid item xs={12} md={6} style={{textAlign: "center"}}>
                  <Typography gutterBottom variant="h3" component="h2">
                    Poll From
                  </Typography>
                  <KeyboardDatePicker
                    id="startDate"
                    label="Start Date"
                    InputLabelProps={{shrink:true}}
                    format="MM/DD/YYYY"
                    value={startDate}
                    placeholder="mm/dd/yyyy"
                    style={{width:160}}
                    error={Boolean(startDateError)}
                    helperText=<span>{collection.latestFetch ? <span>Default starts from end of last poll:<br/>{moment.utc(collection.latestFetch).format('lll')}</span> : "Default is 1 day prior to now"}{startDateError}</span>
                    onChange={date => {setStartDate(date)}}
                    disabled={isDisabled || isSubmitting}
                  />
                  &nbsp;&nbsp;
                  <KeyboardTimePicker
                    id="startTime"
                    label="Start Time"
                    InputLabelProps={{shrink:true}}
                    ampm={false}
                    openTo="hours"
                    views={["hours", "minutes", "seconds"]}
                    format="HH:mm:ss"
                    value={startTime}
                    placeholder="hh:mm:ss"
                    style={{width:160}}
                    error={Boolean(startTimeError)}
                    helperText=<span>{collection.latestFetch ? <span>Default starts from end of last poll:<br/>{moment.utc(collection.latestFetch).format('lll')}</span> : "Default is 24 hours prior to now"}{startTimeError}</span>
                    onChange={date => {setStartTime(date)}}
                    disabled={isDisabled || isSubmitting}
                  />
                </Grid>
                <Grid item xs={12} md={6} style={{textAlign: "center"}}>
                  <Typography gutterBottom variant="h3" component="h2">
                    To
                  </Typography>
                  <KeyboardDatePicker
                    id="endDate"
                    label="End Date"
                    InputLabelProps={{shrink:true}}
                    format="MM/DD/YYYY"
                    value={endDate}
                    placeholder="mm/dd/yyyy"
                    style={{width:160}}
                    error={Boolean(endDateError)}
                    helperText=<span>Default is now{endDateError}</span>
                    onChange={date => {setEndDate(date)}}
                    disabled={isDisabled || isSubmitting}
                  />
                  &nbsp;&nbsp;
                  <KeyboardTimePicker
                    id="endTime"
                    label="End Time"
                    InputLabelProps={{shrink:true}}
                    ampm={false}
                    openTo="hours"
                    views={["hours", "minutes", "seconds"]}
                    format="HH:mm:ss"
                    value={endTime}
                    placeholder="hh:mm:ss"
                    style={{width:160}}
                    error={Boolean(endTimeError)}
                    helperText=<span>Default is now{endTimeError}</span>
                    onChange={date => {setEndTime(date)}}
                    disabled={isDisabled || isSubmitting}
                  />
                </Grid>
                <Grid item xs={12} md={6} style={{textAlign: "center"}}>
                  <InputLabel>STIX Content Versions</InputLabel>
                  <Box mt={1}>
                    <Select
                      multiple
                      native
                      fullWidth
                      value={contentVersions}
                      onChange={handleChangeMultiple}
                      disabled={isDisabled || isSubmitting}
                      inputProps={{ size: 5 }}
                    >
                      {stixContentVersions.map(version => <option key={version}>{version}</option>)}
                    </Select>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6} style={{textAlign: "center"}}>
                  {(currentlyRecurring || collection.currentlyRecurring) ? <Container>
                    <Box display='flex' alignItems='center' justifyContent='center'>
                      <Alert variant="filled" severity="info">
                        There is an existing recurring poll for this collection
                      </Alert>
                    </Box>
                  </Container> :
                  <Container>
                    <Box>
                      <InputLabel>
                        <Switch
                          checked={repeat}
                          onChange={() => setRepeat(!repeat)}
                          color="primary"
                          disabled={isDisabled || isSubmitting}
                        />
                        &nbsp;&nbsp;Repeat?
                      </InputLabel>
                    </Box>
                    <Box ml={2} display={repeat?'inline':'none'}>
                      <TextField
                        id="waitTime"
                        type="waitTime"
                        error={validateWaitTime}
                        helperText="Number of minutes between repeats"
                        defaultValue={waitTime}
                        onChange={(e) => setWaitTime(e.target.value)}
                        disabled={isDisabled || isSubmitting}
                      />
                    </Box>
                  </Container>}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        {(currentlyRecurring || collection.currentlyRecurring) ? <Container style={{textAlign: "center"}}>
          <Button
            id="performStop"
            color="secondary"
            variant="contained"
            style={{width: "200px"}}
            disabled={isDisabled || isSubmitting}
            onClick={handleStopRecurring}
          >
            {isSubmitting ? 'Stopping...' : 'Stop Recurring Poll'}
          </Button>
        </Container> :
        <Container style={{textAlign: "center"}}>
          <Button
            id="performSubmit"
            color="secondary"
            variant="contained"
            style={{width: "200px"}}
            disabled={submitDisabled}
            onClick={handleSubmit}
          >
            {isSubmitting ? 'Submitting...' : repeat ? 'Start Recurring' : 'Submit'}
          </Button>
          <Grid item sm={12} md={12}>
            <Box mt={2} display={repeat?'flex':'none'} alignItems='center' justifyContent='center'>
              {validateWaitTime?
                (<Alert variant="filled" severity="error" style={{width: '40%'}}>
                  You must enter a positive whole number for repeat to function
                </Alert>):
                (<Alert variant="filled" severity="info" style={{width: '40%'}}>
                  This will start a recurring poll with a window of {waitTime} minute{(waitTime==='1')?'':'s'}.
                </Alert>)
              }
            </Box>
          </Grid>
        </Container>}
      </Grid>
    </form>
  )
}

Download1x.propTypes = {
  className: PropTypes.string,
  server: PropTypes.string,
  collection: PropTypes.object
};

export default Download1x
