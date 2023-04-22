import React,
{
  useEffect,
  useState,
  useCallback
} from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Container,
  FormControlLabel,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Tooltip,
  Typography
} from '@material-ui/core';
import {
  KeyboardDatePicker,
  KeyboardTimePicker
} from '@material-ui/pickers';
import Alert from '@material-ui/lab/Alert';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { requestDownload, getRecurring, stopRecurring } from "../../redux/actions/collections";
import { useSnackbar } from 'notistack';
import availableFilters from './object-filters';
import objectTypesList from './object-types';
import uuidv4 from 'uuid/v4';
import {
  Check,
  X as Times,
  AlertTriangle
} from 'react-feather';
 
function Download2x({className, server, collection, ...rest}) {
  const [addedAfterDate, setAddedAfterDate] = useState(
    collection.latestFetch ?
      moment.utc(collection.latestFetch) :
      moment.utc().subtract(1,'day')
  );
  const [addedAfterTime, setAddedAfterTime] = useState(
    collection.latestFetch ?
      moment.utc(collection.latestFetch) :
      moment.utc()
  );
  const [addedAfterDateError, setAddedAfterDateError] = useState(null);
  const [addedAfterTimeError, setAddedAfterTimeError] = useState(null);
  const [validOnAfterFromDateError, setValidOnAfterFromDateError] = useState(null);
  const [validOnAfterFromTimeError, setValidOnAfterFromTimeError] = useState(null);
  const [validOnAfterUntilDateError, setValidOnAfterUntilDateError] = useState(null);
  const [validOnAfterUntilTimeError, setValidOnAfterUntilTimeError] = useState(null);
  const [versionDateError, setVersionDateError] = useState(null);
  const [versionTimeError, setVersionTimeError] = useState(null);
  const [versionMillisecondsError, setVersionMillisecondsError] = useState(null);
  const [objectTypes, setObjectTypes] = useState([]);
  const [repeat, setRepeat] = useState(false);
  const [waitTime, setWaitTime] = useState(8);
  const [filters, setFilters] = useState([]);
  const [queryString, setQueryString] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);
  const [isDisabled, setDisabled] = useState(false);
  const [checkedRecurring, setCheckedRecurring] = useState(false);
  const [currentlyRecurring, setCurrentlyRecurring] = useState(false);
  const [objectId, setObjectId] = useState("");
  const [validOnAfterFromDate, setValidOnAfterFromDate] = useState(null);
  const [validOnAfterFromTime, setValidOnAfterFromTime] = useState(null);
  const [validOnAfterUntilDate, setValidOnAfterUntilDate] = useState(null);
  const [validOnAfterUntilTime, setValidOnAfterUntilTime] = useState(null);
  const [firstVersion, setFirstVersion] = useState(false);
  const [lastVersion, setLastVersion] = useState(false);
  const [allVersion, setAllVersion] = useState(false);
  const [versionDate, setVersionDate] = useState(null);
  const [versionTime, setVersionTime] = useState(null);
  const [versionMilliseconds, setVersionMilliseconds] = useState('');
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const autoFilter = createFilterOptions();
  const servers = useSelector(state => state.servers.servers);
  const currentServer = servers.find(s => s.label === server);

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
    let newAddedAfterDateError=null;
    let newAddedAfterTimeError=null;
    let newValidOnAfterFromDateError=null;
    let newValidOnAfterFromTimeError=null;
    let newValidOnAfterUntilDateError=null;
    let newValidOnAfterUntilTimeError=null;
    let newVersionDateError=null;
    let newVersionTimeError=null;
    let newVersionMillisecondsError=null;
    if (addedAfterDate===null) {
      newAddedAfterDateError=<span><br/>Added after date must be specified</span>;
    }
    if (addedAfterTime===null) {
      newAddedAfterTimeError=<span><br/>Added after time must be specified</span>;
    }
    if (newAddedAfterDateError===null) {
      if (addedAfterDate.format('YYYY-MM-DD')==='Invalid date') {
        newAddedAfterDateError=<span><br/>Invalid date</span>;
      }
    }
    if (newAddedAfterTimeError===null) {
      if (addedAfterTime.format('HH:mm:ss')==='Invalid date') {
        newAddedAfterTimeError=<span><br/>Invalid time</span>;
      }
    }
    if (validOnAfterFromDate!==null && validOnAfterFromDate.format('YYYY-MM-DD')==='Invalid date') {
          newValidOnAfterFromDateError=<span>Invalid date</span>;
    }
    if (validOnAfterFromTime!==null && validOnAfterFromTime.format('HH:mm:ss')==='Invalid time') {
      newValidOnAfterFromTimeError=<span>Invalid time</span>;
    }

    //valid_on_after until is optional
    if (validOnAfterUntilDate!==null && validOnAfterUntilDate.format('YYYY-MM-DD')==='Invalid date') {
      newValidOnAfterUntilDateError=<span>Invalid date</span>;
    }
    if (validOnAfterUntilTime!==null && validOnAfterUntilTime.format('HH:mm:ss')==='Invalid time') {
      newValidOnAfterUntilTimeError=<span>Invalid time</span>;
    }
    if (newAddedAfterDateError===null && newAddedAfterTimeError===null) {
      const startMoment = moment(addedAfterDate.format('YYYY-MM-DD') + 'T' + addedAfterTime.format('HH:mm:ss'));
      const now = moment.utc();
      if (startMoment.diff(now, 'seconds') > 0) {
        newAddedAfterDateError=<span><br/>Cannot set a date greater than now</span>;
        newAddedAfterTimeError=<span><br/>Cannot set a time greater than now</span>;
      }
    }
    if (validOnAfterFromDate!==null && validOnAfterFromTime!==null && newValidOnAfterFromDateError===null && newValidOnAfterFromTimeError===null) {
      const startMoment = moment(validOnAfterFromDate.format('YYYY-MM-DD') + 'T' + validOnAfterFromTime.format('HH:mm:ss'));
      const now = moment.utc();
      if (startMoment.diff(now, 'seconds') > 0) {
        newValidOnAfterFromDateError=<span>Cannot set a date greater than now</span>;
        newValidOnAfterFromTimeError=<span>Cannot set a time greater than now</span>;
      }
    }
    if (validOnAfterUntilDate!==null && validOnAfterUntilTime!==null && newValidOnAfterUntilDateError===null && newValidOnAfterUntilTimeError===null) {
      const startMoment = moment(validOnAfterUntilDate.format('YYYY-MM-DD') + 'T' + validOnAfterUntilTime.format('HH:mm:ss'));
      const now = moment.utc();
      if (startMoment.diff(now, 'seconds') > 0) {
        newValidOnAfterUntilDateError=<span>Cannot set a date greater than now</span>;
        newValidOnAfterUntilTimeError=<span>Cannot set a time greater than now</span>;
      }
    }
    if (versionDate && versionDate.format("YYYY-MM-DD")==='Invalid date') {
      newVersionDateError=<span>Invalid date</span>;
    }
    if (versionTime && versionTime.format('HH:mm:ss')==='Invalid date') {
      newVersionTimeError=<span>Invalid time</span>;
    }
    if (newVersionDateError===null && newVersionTimeError===null && ((versionDate && !versionTime) || (!versionDate && versionTime))) {
      newVersionDateError=<span>Both version date and time must be specified</span>;
      newVersionTimeError=<span>Both version date and time must be specified</span>;
    }
    if (((validOnAfterFromDate && !validOnAfterFromTime) || (!validOnAfterFromDate && validOnAfterFromTime))) {
      newValidOnAfterFromDateError=<span>Both added after date and time must be specified</span>;
      newValidOnAfterFromTimeError=<span>Both added after date and time must be specified</span>;
    }
    if (((validOnAfterUntilDate && !validOnAfterUntilTime) || (!validOnAfterUntilDate && validOnAfterUntilTime))) {
      newValidOnAfterUntilDateError=<span>Both added after date and time must be specified</span>;
      newValidOnAfterUntilTimeError=<span>Both added after date and time must be specified</span>;
    }
    if ((versionDate || versionTime) && !versionMilliseconds.match(/^[0-9][0-9][0-9]$/)) {
      newVersionMillisecondsError=<span>Milliseconds must be 3 digits</span>;
    }
    setAddedAfterDateError(newAddedAfterDateError);
    setAddedAfterTimeError(newAddedAfterTimeError);
    setValidOnAfterFromDateError(newValidOnAfterFromDateError);
    setValidOnAfterFromTimeError(newValidOnAfterFromTimeError);
    setValidOnAfterUntilDateError(newValidOnAfterUntilDateError);
    setValidOnAfterUntilTimeError(newValidOnAfterUntilTimeError);
    setVersionDateError(newVersionDateError);
    setVersionTimeError(newVersionTimeError);
    setVersionMillisecondsError(newVersionMillisecondsError);
  },[addedAfterDate,addedAfterTime,validOnAfterFromDate,validOnAfterFromTime,validOnAfterUntilDate,validOnAfterUntilTime,versionDate,versionTime,versionMilliseconds]);

  const addToQuery = (filter) => {
    let update='';
    switch (filter.filter.type) {
      case 'string':
        // There are 4 characters that need special encoding:  plus, equals, ampersand and comma
        update=filter.filter_value.replaceAll('+','%2B').replaceAll('=','%3D').replaceAll('&','%26').replaceAll(' ','+');
        break;
      case 'enum':
        update=filter.filter_value;
        break;
      case 'number':
        update=filter.tertiary_value;
        break;
      case 'vocab':
        if (filter.filter_value.length>0) {
          const valuesArray = availableFilters.find(f => f.name === filter.filter.name);
          const updatedValues = filter.filter_value.map(label => {try {
            return valuesArray.values.find(val => val.label===label).name
          } catch {
            return label
          }})

          update=encodeURIComponent(updatedValues.join(','));
        }
        break;
      default:
        return null
    }
    return(update);
  }

  useEffect (() => {
    let newQuery='';

    if (objectId) {
      newQuery+='&match[id]='+encodeURIComponent(objectId.trim());
    }
    if (addedAfterDate && addedAfterTime) {
      if (addedAfterDate.format("YYYY-MM-DD")!=='Invalid date' && addedAfterTime!=='Invalid date') {
        newQuery+='&added_after='+addedAfterDate.format("YYYY-MM-DD")+'T'+addedAfterTime.format("HH:mm:ss")+".000Z";
      }
    }
    if (validOnAfterFromDate && validOnAfterFromTime && !validOnAfterUntilDate && !validOnAfterUntilTime) {
        if (validOnAfterFromDate.format("YYYY-MM-DD")!=='Invalid date' && validOnAfterFromTime!=='Invalid date') {
          newQuery+='&match[valid_on_after]='+validOnAfterFromDate.format("YYYY-MM-DD")+'T'+validOnAfterFromTime.format("HH:mm:ss")+".000Z";
        }
      }
    if (validOnAfterFromDate && validOnAfterFromTime && validOnAfterUntilDate && validOnAfterUntilTime) {
        if ((validOnAfterFromDate.format("YYYY-MM-DD") & validOnAfterUntilDate.format("YYYY-MM-DD") !=='Invalid date') &&
            (validOnAfterFromTime & validOnAfterUntilTime !=='Invalid date' )) {
            newQuery+='&match[valid_on_after]='+validOnAfterFromDate.format("YYYY-MM-DD")+'T'+
                    validOnAfterFromTime.format("HH:mm:ss")+".000Z,"+
                    validOnAfterUntilDate.format("YYYY-MM-DD")+'T'+
                    validOnAfterUntilTime.format("YYYY-MM-DD")+".000Z";
        }
    }
    if (objectTypes.length>0) {
      newQuery+='&match[type]='+objectTypes.join(',');
    }
    let versionQuery='';
    if (allVersion) {
      versionQuery+='all';
    } else {
      if (versionDate && versionTime) {
        if (versionDate.format("YYYY-MM-DD")!=='Invalid date' && versionTime!=='Invalid date') {
          versionQuery=versionDate.format("YYYY-MM-DD")+'T'+versionTime.format("HH:mm:ss")+"."+versionMilliseconds+"Z";
        }
      }
      if (firstVersion) {
        if (versionQuery.length>0) {
          versionQuery+=',';
        }
        versionQuery+='first';
      }
      if (lastVersion) {
        if (versionQuery.length>0) {
          versionQuery+=',';
        }
        versionQuery+='last';
      }
    }
    if (versionQuery.length>0) {
      newQuery+='&match[version]='+versionQuery;
    }
    let queries = {};

    filters.map(filter => {
      let matchValue = filter.filter.name;
      if (filter.filter.type==='number') {
        matchValue = filter.filter_value;
      }

      if (queries[matchValue]===undefined) {
        queries[matchValue]='';
      } else {
        queries[matchValue]+=',';
       }
      queries[matchValue]+=addToQuery(filter);

      return null;
    });

    Object.keys(queries).forEach(function(query) {
      newQuery+='&match['+query+']='+queries[query];
    });

    setQueryString(newQuery.substr(1));
  },[filters,objectTypes,addedAfterDate,addedAfterTime,validOnAfterFromDate,validOnAfterFromTime,validOnAfterUntilDate,validOnAfterUntilTime,objectId,firstVersion,lastVersion,allVersion,versionDate,versionTime,versionMilliseconds]);

  useEffect(() => {
    if (!checkedRecurring) {
      fetchRecurring();
    }
  });

  useEffect(() => {
    setDisabled(!collection.collectionObject.canRead);
  },[collection]);

  const handleChangeMultiple = (event) => {
    const { options } = event.target;
    const value = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setObjectTypes(value);
  };

  const checkWaitTime = () => {
    return (isNaN(waitTime)||waitTime.toString().trim().length===0||Number(waitTime)<1||Number(waitTime)!==Number(Number(waitTime).toFixed(0)));
  }

  const validateWaitTime = checkWaitTime();

  const addFilter = () => {
    const filterValue = availableFilters.find(filter => filter.name === 'confidence');
    const newFilter = {
      id: `${uuidv4()}`,
      filter: filterValue,
      filter_value: filterValue.values[0].name,
      tertiary_value: '',
      valid: false
    };
    setFilters([...filters,newFilter]);
  }

  const deleteFilter = (uid) => {
    const newFilters = filters.filter(filter => filter.id !== uid);
    setFilters(JSON.parse(JSON.stringify(newFilters)));
  };

  const setFilterType = (event, id) => {
    const indexOfTargetObject = filters.findIndex(filter => filter.id === id);

    const filter = availableFilters.find(filter => filter.name === event.target.value);

    let newFilters = JSON.parse(JSON.stringify(filters));
    newFilters[indexOfTargetObject]['filter'] = filter;
    newFilters[indexOfTargetObject]['filter_value'] = (filter.type==='vocab') ? [] : Array.isArray(filter.values) ? filter.values[0].name : '';
    newFilters[indexOfTargetObject]['valid'] = (filter.type==='enum') ? true : false;
    newFilters[indexOfTargetObject]['tertiary_value'] = '';

    // If we change from one vocab to another vocab, we need to change the key so the values list is cleared
    if (filter.type==='vocab') {
      newFilters[indexOfTargetObject]['key'] = filters[indexOfTargetObject].key + 1 || 0;
    }

    setFilters(newFilters);
  };

  const getFilterDropDown = (id) => {
    return (
      <Select
        id={id}
        fullWidth
        onChange={e => setFilterType(e, id)}
        value={filters.find(filter => filter.id === id).filter.name}
      >
        {availableFilters.map((filter, index) => (
          <MenuItem key={index} value={filter.name}>
            {filter.label}
          </MenuItem>
        ))}
      </Select>
    );
  }

  const validateCommaSeparatedConfidenceValues = (value) => {
    // Split the potential comma separated list into an array
    let valuesArray = value.split(',');

    let valid = true;

    // Go through each value and make sure it's a number between 0 and 100
    valuesArray.forEach(function(val) {
      if (valid) {
        valid = Boolean(val.match(/^([0-9]|[1-9][0-9]|100)$/));
      }
    })

    return(valid);
  }

  const handleValueChange = (value, id) => {
    const indexOfTargetObject = filters.findIndex(filter => filter.id === id);

    if (Array.isArray(value)) {
      value = value.map((v) => v.replace(/^Add a new item: "(.+)"$/,`$1`));
    }

    let newFilters = JSON.parse(JSON.stringify(filters));
    newFilters[indexOfTargetObject].filter_value = value;

    switch (newFilters[indexOfTargetObject].filter.type) {
      case 'string':
      case 'vocab':
        newFilters[indexOfTargetObject].valid = value.length > 0 ? true : false;
        break;
      case 'number':
        // If we are doing confidence, when we change the type between <=, = and =>, we need to
        // validate the specified string.  If we are using <= or =>, the string cannot contain a
        // comma.  If it is =, then we need to call 'validateCommaSeparatedConfdenceValues' to
        // validate the data.
        if (newFilters[indexOfTargetObject].filter_value !== 'confidence') {
          newFilters[indexOfTargetObject].valid = !Boolean(newFilters[indexOfTargetObject].tertiary_value.match(','));
        } else {
          newFilters[indexOfTargetObject].valid = validateCommaSeparatedConfidenceValues(newFilters[indexOfTargetObject].tertiary_value);
        }
        break;
      default:
        // Do nothing
    }

    setFilters(newFilters);
  }

  const handleTertiaryValueChange = (value, id) => {
    const indexOfTargetObject = filters.findIndex(filter => filter.id === id);

    let newFilters = JSON.parse(JSON.stringify(filters));
    newFilters[indexOfTargetObject].tertiary_value = value;

    let valid = true;

    // Only 'confidence' (=) can have more than one number specified.
    // 'confidence.le' (<=) and 'confidence.ge' (>=) cannot.
    if (valid && newFilters[indexOfTargetObject].filter_value !== 'confidence' && newFilters[indexOfTargetObject].tertiary_value.match(',')) {
      valid = false;
    } else {
      valid = validateCommaSeparatedConfidenceValues(value);
    }

    newFilters[indexOfTargetObject].valid = valid;

    setFilters(newFilters);
  }

  const renderFilter = (filter) => {
    const theFilter = filter.filter;
    const id = filter.id;
    // render the secondary input in the second column based on the type
    switch (theFilter.type) {
      case 'string':
        return (
          <TextField
            type="text"
            fullWidth
            error={!filter.valid}
            value={filter.filter_value}
            onChange={e => handleValueChange(e.target.value, id)}
          />
        );
      case 'enum':
        return (
          <>
            <Select
              fullWidth
              value={filter.filter_value}
              onChange={e => handleValueChange(e.target.value, id)}
            >
              {filter.filter.values.map((value, index) => (
                <MenuItem key={index} value={value.name}>
                  {value.label}
                </MenuItem>
              ))}
            </Select>
          </>
        );
      case 'number':
        return (
          <Grid container spacing={1}>
            <Grid item sm={4} md={4}>
              <Select
                value={filter.filter_value}
                style={{ textAlign: 'center', textAlignLast: 'center' }}
                onChange={e => handleValueChange(e.target.value, id)}
              >
                {filter.filter.values.map((value, index) => (
                  <MenuItem key={index} value={value.name}>
                    {value.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item sm={8} md={8}>
              <TextField
                fullWidth
                type="text"
                error={!filter.valid}
                value={filter.tertiary_value}
                style={{ textAlign: 'center', textAlignLast: 'center' }}
                onChange={e => handleTertiaryValueChange(e.target.value, id)}
              />
            </Grid>
          </Grid>
        );
      case 'vocab':
        return (
          <Autocomplete
            key={filter.key}
            multiple
            id="tags-filled"
            options={filter.filter.values.map(value => value.label)}
            freeSolo
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                option = option.replace(/^Add a new item: "(.+)"$/,`$1`);
                return (<Chip variant="outlined" label={option} {...getTagProps({ index })} />)
              })
            }
            filterOptions={(options, params) => {
              const filtered = autoFilter(options, params);

              // Suggest the creation of a new value
              if (params.inputValue !== '') {
                filtered.push(`Add a new item: "${params.inputValue}"`);
              }

              return filtered;
            }}
            renderInput={(params) => (
              <TextField {...params}
                error={!filter.valid}
              />
            )}
            onChange={(event, values) => {handleValueChange(values, id)}}
          />
        );
      default:
        return null;
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      let formData = {
                       type: 'TAXII21',
                       types: objectTypes,
                       addedAfter: addedAfterDate.format('YYYY-MM-DD')+'T'+addedAfterTime.format('HH:mm:ss')+'.000Z',
                       queryString,
                       window: waitTime,
                       repeat
                     };
      if (!repeat) {
        delete formData['repeat'];
        delete formData['window'];
      }
      await dispatch(requestDownload(server,collection.id,formData));
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
      await dispatch(stopRecurring(server,collection.id));
      setSubmitting(false);
      enqueueSnackbar('Stopped recurring fetch', {variant: 'success'});
      setCurrentlyRecurring(false);
    } catch (err) {
      enqueueSnackbar('Problem stopping recurring fetch', {variant: 'error'});
      setSubmitting(false);
    }
  }

  const isSubmitDisabled = () => {
    let filters_valid = true;
    filters.forEach(filter => {
      if (!filter.valid) {
        filters_valid = false;
      }
    });
    return isDisabled || isSubmitting || Boolean(addedAfterDateError) || Boolean(addedAfterTimeError) || Boolean(versionDateError) || Boolean(versionTimeError) || Boolean(versionMillisecondsError) || !filters_valid;
  }

  const submitDisabled = isSubmitDisabled();

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
                  <TextField
                    fullWidth
                    id="objectIdFilter"
                    label="Object ID(s)"
                    type="text"
                    value={objectId}
                    disabled={isDisabled}
                    onChange={(e) => {setObjectId(e.target.value)}}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip
                            enterDelay={300}
                            title="Clear Object ID(s)"
                          > 
                            <Times style={{cursor:'pointer'}} onClick={() => setObjectId("")}/>
                          </Tooltip>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6} style={{textAlign: "center"}}>
                  <Typography>Added After</Typography>
                  <KeyboardDatePicker
                    id="addedAfterDateFilter"
                    label="Date"
                    InputLabelProps={{shrink:true}}
                    format="MM/DD/YYYY"
                    value={addedAfterDate}
                    placeholder="mm/dd/yyyy"
                    style={{width:160}}
                    disabled={isDisabled}
                    onChange={date => {setAddedAfterDate(date)}}
                    error={Boolean(addedAfterDateError)}
                    helperText=<span>{collection.latestFetch ? <span>Default starts from end of last poll:<br/>{moment.utc(collection.latestFetch).format('lll')}</span> : "Default is 1 day prior to now"}{addedAfterDateError}</span>
                  />
                  &nbsp;&nbsp;
                  <KeyboardTimePicker
                    id="addedAfterTimeFilter"
                    label="Time"
                    InputLabelProps={{shrink:true}}
                    ampm={false}
                    openTo="hours"
                    views={["hours", "minutes", "seconds"]}
                    format="HH:mm:ss"
                    value={addedAfterTime}
                    placeholder="hh:mm:ss"
                    style={{width:135}}
                    disabled={isDisabled}
                    onChange={date => {setAddedAfterTime(date)}}
                    error={Boolean(addedAfterTimeError)}
                    helperText=<span>{collection.latestFetch ? <span>Default starts from end of last poll:<br/>{moment.utc(collection.latestFetch).format('lll')}</span> : "Default is 1 day prior to now"}{addedAfterTimeError}</span>
                  />
                  <Tooltip
                    enterDelay={300}
                    title="Clear Added After Date/Time"
                  > 
                    <Times style={{cursor:'pointer',position:'relative',top:'22px'}} onClick={() => {setAddedAfterDate(null);setAddedAfterTime(null)}}/>
                  </Tooltip>
                </Grid>
                <Grid item xs={12} md={6} style={{textAlign: "center"}}>
                    <Typography>Valid on After</Typography>
                    From:&nbsp;&nbsp;
                    <KeyboardDatePicker
                        id="validOnAfterFromDateFilter"
                        label="Date"
                        InputLabelProps={{shrink:true}}
                        format="MM/DD/YYYY"
                        value={validOnAfterFromDate}
                        placeholder="mm/dd/yyyy"
                        style={{width:160}}
                        disabled={isDisabled}
                        onChange={date => {setValidOnAfterFromDate(date)}}
                        error={Boolean(validOnAfterFromDateError)}
                        helperText={validOnAfterFromDateError}
                    />
                    &nbsp;&nbsp;
                    <KeyboardTimePicker
                        id="validOnAfterFromTimeFilter"
                        label="Time"
                        InputLabelProps={{shrink:true}}
                        ampm={false}
                        openTo="hours"
                        views={["hours", "minutes", "seconds"]}
                        format="HH:mm:ss"
                        value={validOnAfterFromTime}
                        placeholder="hh:mm:ss"
                        style={{width:135}}
                        disabled={isDisabled}
                        onChange={date => {setValidOnAfterFromTime(date)}}
                        error={Boolean(validOnAfterFromTimeError)}
                        helperText={validOnAfterFromTimeError}
                    />
                    <Tooltip
                        enterDelay={300}
                        title="Clear Valid on After From Date/Time"
                    >
                      <Times style={{cursor:'pointer',position:'relative',top:'22px'}} onClick={() => {setValidOnAfterFromDate(null);setValidOnAfterFromTime(null)}}/>
                    </Tooltip>
                    <Grid item xs={12} md={6} style={{textAlign: "center"}}>
                    </Grid>
                    Until:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <KeyboardDatePicker
                        id="validOnAfterUntilDateFilter"
                        label="Date"
                        InputLabelProps={{shrink:true}}
                        format="MM/DD/YYYY"
                        value={validOnAfterUntilDate}
                        placeholder="mm/dd/yyyy"
                        style={{width:160}}
                        disabled={isDisabled}
                        onChange={date => {setValidOnAfterUntilDate(date)}}
                        error={Boolean(validOnAfterUntilDateError)}
                        helperText={validOnAfterUntilDateError}
                    />
                    &nbsp;&nbsp;
                    <KeyboardTimePicker
                        id="validOnAfterUntilTimeFilter"
                        label="Time"
                        InputLabelProps={{shrink:true}}
                        ampm={false}
                        openTo="hours"
                        views={["hours", "minutes", "seconds"]}
                        format="HH:mm:ss"
                        value={validOnAfterUntilTime}
                        placeholder="hh:mm:ss"
                        style={{width:135}}
                        disabled={isDisabled}
                        onChange={date => {setValidOnAfterUntilTime(date)}}
                        error={Boolean(validOnAfterUntilTimeError)}
                        helperText={validOnAfterUntilTimeError}
                    />
                    <Tooltip
                        enterDelay={300}
                        title="Clear Valid on After Until Date/Time"
                    >
                      <Times style={{cursor:'pointer',position:'relative',top:'22px'}} onClick={() => {setValidOnAfterUntilDate(null);setValidOnAfterUntilTime(null)}}/>
                    </Tooltip>
                </Grid>
                <Grid item xs={12} md={6} style={{textAlign: "center"}}>
                  <Typography>Version</Typography>
                  <KeyboardDatePicker
                    id="versionDateFilter"
                    label="Date"
                    InputLabelProps={{shrink:true}}
                    format="MM/DD/YYYY"
                    value={versionDate}
                    placeholder="mm/dd/yyyy"
                    style={{width:160}}
                    disabled={isDisabled||allVersion}
                    onChange={date => {setVersionDate(date)}}
                    error={Boolean(versionDateError)}
                    helperText={versionDateError}
                  />
                  &nbsp;&nbsp;
                  <KeyboardTimePicker
                    id="versionTimeFilter"
                    label="Time"
                    InputLabelProps={{shrink:true}}
                    ampm={false}
                    openTo="hours"
                    views={["hours", "minutes", "seconds"]}
                    format="HH:mm:ss"
                    value={versionTime}
                    placeholder="hh:mm:ss"
                    style={{width:135}}
                    disabled={isDisabled||allVersion}
                    onChange={date => {setVersionTime(date)}}
                    error={Boolean(versionTimeError)}
                    helperText={versionTimeError}
                  />
                  &nbsp;&nbsp;
                  <TextField
                    id="versionMilliseconds"
                    label="Milliseconds"
                    type="text"
                    value={versionMilliseconds}
                    disabled={isDisabled}
                    style={{width:75}}
                    onChange={(e) => {setVersionMilliseconds(e.target.value)}}
                    error={Boolean(versionMillisecondsError)}
                    helperText={versionMillisecondsError}
                    inputProps={{ maxLength: 3 }}
                  />
                  <Tooltip
                    enterDelay={300}
                    title="Clear Version Date/Time"
                  > 
                    <Times style={{cursor:'pointer',position:'relative',top:'22px'}} onClick={() => {setVersionDate(null);setVersionTime(null);setVersionMilliseconds('');setFirstVersion(false);setLastVersion(false);setAllVersion(false)}}/>
                  </Tooltip>
                  <br/>
                  <FormControlLabel
                    control={<Checkbox checked={firstVersion} onChange={() => setFirstVersion(!firstVersion)}/>}
                    label=<Typography>First</Typography>
                    disabled={isDisabled||allVersion}
                  />
                  <FormControlLabel
                    control={<Checkbox checked={lastVersion} onChange={() => setLastVersion(!lastVersion)}/>}
                    label=<Typography>Last</Typography>
                    disabled={isDisabled||allVersion}
                  />
                  <FormControlLabel
                    control={<Checkbox checked={allVersion} onChange={() => setAllVersion(!allVersion)}/>}
                    label=<Typography>All</Typography>
                    disabled={isDisabled}
                  />
                </Grid>
                <Grid item xs={12} md={6} style={{textAlign: "center"}}>
                  <InputLabel>STIX Object Types</InputLabel>
                  <Box mt={1}>
                    <Select
                      multiple
                      native
                      fullWidth
                      value={objectTypes}
                      onChange={handleChangeMultiple}
                      inputProps={{ size: 5 }}
                      disabled={isDisabled}
                    > 
                      {objectTypesList.map(type => <option key={type}>{type}</option>)}
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
                        helperText="Number of hours between repeats"
                        defaultValue={waitTime}
                        onChange={(e) => setWaitTime(e.target.value)}
                        disabled={isDisabled || isSubmitting}
                      />
                    </Box>
                  </Container>}
                </Grid>
                {currentServer.title.toUpperCase().includes("AIS 2")?<Grid container spacing={3} style={{border: "1px solid gray"}}>
                  <Grid item xs={12} md={3} style={{textAlign: "center"}}>
                    <Button
                      id="addFilter"
                      color="secondary"
                      variant="contained"
                      disabled={isDisabled}
                      onClick={() => addFilter()}
                    >
                      Add Filter
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={9} style={{textAlign: "center"}}>
                    <InputLabel>Added Filters</InputLabel>
                    {filters.map((filter, index) => (
                      <Grid container key={index} spacing={1}>
                        <Grid item xs={4} md={4} lg={4}>
                          {getFilterDropDown(filter.id)}
                        </Grid>
                        <Grid item xs={6} md={6} lg={6}>
                          {renderFilter(filter)}
                        </Grid>
                        <Grid item xs={2} md={2} lg={2}>
                          {filter.valid ?
                            <Check style={{position: "relative",top: "4px",left: "-10px"}} color="lime"/> :
                            <Times style={{position: "relative",top: "4px",left: "-10px"}} color="#FF4636"/>
                          }
                          <Button variant="outlined" onClick={() => deleteFilter(filter.id)}>
                            <Times/>
                          </Button>
                        </Grid>
                      </Grid>
                    ))}
                  </Grid>
                  &nbsp;
                </Grid>: null}
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
                  This will start a recurring poll with a window of {waitTime} hour{(waitTime==='1')?'':'s'}.
                </Alert>)
              }
            </Box>
          </Grid>
        </Container>}
      </Grid>
    </form>
  )
}

Download2x.propTypes = {
  className: PropTypes.string,
  server: PropTypes.string,
  collection: PropTypes.object
};

export default Download2x
