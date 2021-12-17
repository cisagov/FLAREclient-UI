import React,
{
  useCallback,
  useEffect,
  useState,
  useRef
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getManifest } from "../../redux/actions/collections";
import { convertIsoDate, convertIsoDateWithMilliseconds } from "../../utils/helpers";
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import availableFilters from './object-filters';
import objectTypesList from './object-types';
import uuidv4 from 'uuid/v4';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import moment from 'moment';
import {
  KeyboardDatePicker,
  KeyboardTimePicker
} from '@material-ui/pickers';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  FormControlLabel,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  makeStyles
} from '@material-ui/core';
import {
  AlertTriangle,
  Check,
  X as Times
} from 'react-feather';
import { useSnackbar } from 'notistack';

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

  invisible: {
    cursor: 'default',
    opacity: 0,
    pointerEvents: 'none'
  }
}));

function Manifest({className, server, collection, ...rest}) {
  const manifest = useSelector(state => state.collections.manifest);
  const [addedAfterDateError, setAddedAfterDateError] = useState(null);
  const [addedAfterTimeError, setAddedAfterTimeError] = useState(null);
  const [validOnAfterFromDateError, setValidOnAfterFromDateError] = useState(null);
  const [validOnAfterFromTimeError, setValidOnAfterFromTimeError] = useState(null);
  const [validOnAfterUntilDateError, setValidOnAfterUntilDateError] = useState(null);
  const [validOnAfterUntilTimeError, setValidOnAfterUntilTimeError] = useState(null);
  const [versionDateError, setVersionDateError] = useState(null);
  const [versionTimeError, setVersionTimeError] = useState(null);
  const [versionMillisecondsError, setVersionMillisecondsError] = useState(null);
  const [queryString, setQueryString] = useState('');
  const [addedAfterDate, setAddedAfterDate] = useState(null);
  const [addedAfterTime, setAddedAfterTime] = useState(null);
  const [validOnAfterFromDate, setValidOnAfterFromDate] = useState(null);
  const [validOnAfterFromTime, setValidOnAfterFromTime] = useState(null);
  const [validOnAfterUntilDate, setValidOnAfterUntilDate] = useState(null);
  const [validOnAfterUntilTime, setValidOnAfterUntilTime] = useState(null);
  const [objectId, setObjectId] = useState("");
  const [versionDate, setVersionDate] = useState(null);
  const [versionTime, setVersionTime] = useState(null);
  const [versionMilliseconds, setVersionMilliseconds] = useState('');
  const [firstVersion, setFirstVersion] = useState(false);
  const [lastVersion, setLastVersion] = useState(false);
  const [allVersion, setAllVersion] = useState(false);
  const [objectTypes, setObjectTypes] = useState([]);
  const [filters, setFilters] = useState([]);
  const [isDisabled, setDisabled] = useState(false);
  const autoFilter = createFilterOptions();
  const servers = useSelector(state => state.servers.servers);
  const currentServer = servers.find(s => s.label === server);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const [numPerPage, setNumPerPage] = useState(20);
  const [next, setNext] = useState(0);
  const numToGrab = 1000;
  const grabbingMore = useRef(false);
  const clear = useRef(true);
  const { enqueueSnackbar } = useSnackbar();

  const currentManifestFunc = () => {
    if (manifest && manifest[collection.id]) {
      return manifest[collection.id];
    } else {
      return [];
    }
  }

  const currentManifest = currentManifestFunc();

  const currentPageOfManifestFunc = () => {
    if (currentManifest) {
      return currentManifest.slice((page-1)*numPerPage,(page-1)*numPerPage+numPerPage);
    } else {
      return [];
    }
  }

  const currentPageOfManifest = currentPageOfManifestFunc();

  useEffect(() => {
    const grabData = async () => {
      let myQueryString=queryString;
      if (myQueryString==="") {
        myQueryString="limit="+numToGrab;
      }
      try {
        enqueueSnackbar('Fetching manifest data', {variant: 'success'});
        await dispatch(getManifest(server,collection.id,myQueryString,clear.current));
        enqueueSnackbar('Successfully fetched manifest data', {variant: 'success'});
      } catch (err) {
        enqueueSnackbar('Problem fetching manifest data', {variant: 'error'});
        console.log('[x] Problem fetching manifest data', err);
      }
      grabbingMore.current=false;
      clear.current=false
    }
    grabData();
  },[queryString,server,collection,dispatch]);

  useEffect(() => {
    setDisabled(!collection.collectionObject.canRead);
  },[collection]);

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
    if (addedAfterDate!==null && addedAfterDate.format('YYYY-MM-DD')==='Invalid date') {
      newAddedAfterDateError=<span>Invalid date</span>;
    }
    if (addedAfterTime!==null && addedAfterTime.format('HH:mm:ss')==='Invalid time') {
      newAddedAfterTimeError=<span>Invalid time</span>;
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
    if (addedAfterDate!==null && addedAfterTime!==null && newAddedAfterDateError===null && newAddedAfterTimeError===null) {
      const startMoment = moment(addedAfterDate.format('YYYY-MM-DD') + 'T' + addedAfterTime.format('HH:mm:ss'));
      const now = moment.utc();
      if (startMoment.diff(now, 'seconds') > 0) {
        newAddedAfterDateError=<span>Cannot set a date greater than now</span>;
        newAddedAfterTimeError=<span>Cannot set a time greater than now</span>;
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
    if (newAddedAfterDateError===null && newAddedAfterTimeError===null && ((addedAfterDate && !addedAfterTime) || (!addedAfterDate && addedAfterTime))) {
      newAddedAfterDateError=<span>Both added after date and time must be specified</span>;
      newAddedAfterTimeError=<span>Both added after date and time must be specified</span>;
    }
    if (((validOnAfterFromDate && !validOnAfterFromTime) || (!validOnAfterFromDate && validOnAfterFromTime))) {
      newValidOnAfterFromDateError=<span>Both added after date and time must be specified</span>;
      newValidOnAfterFromTimeError=<span>Both added after date and time must be specified</span>;
    }
    if (((validOnAfterUntilDate && !validOnAfterUntilTime) || (!validOnAfterUntilDate && validOnAfterUntilTime))) {
      newValidOnAfterUntilDateError=<span>Both added after date and time must be specified</span>;
      newValidOnAfterUntilTimeError=<span>Both added after date and time must be specified</span>;
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
  },[addedAfterDate,addedAfterTime, validOnAfterFromDate, validOnAfterFromTime, validOnAfterUntilDate, validOnAfterUntilTime, versionDate,versionTime,versionMilliseconds]);

  const addToQuery = (filter) => {
    let update='';
    switch (filter.filter.type) {
      case 'string':
        // There are two characters that need special handling --- comma and plus
        update=encodeURIComponent(filter.filter_value.replaceAll('+','---plus---').replaceAll(' ','+')).replaceAll('%','%25').replaceAll('---plus---','%252B');
console.log(update);
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

  const clearManifestAndFilter = () => {
    setNext(0);
    setPage(1);
    clear.current = true
    filterData(0);
  }

  const filterData = useCallback((myNext = next,
                                  myAddedAfterDate = null,
                                  myValidOnAfterFromDate = null,
                                  myValidOnAfterUntilDate = null) => {
    let newQuery='';

    newQuery += '&limit='+numToGrab;

    if (myNext > 0 && currentServer.title.toUpperCase().includes("FLARE")) {
      newQuery += '&next=' + myNext;
    }

    if (myAddedAfterDate!==null && !currentServer.title.toUpperCase().includes("FLARE")) {
      newQuery+="&added_after="+myAddedAfterDate;
    } else {
      if (addedAfterDate && addedAfterTime) {
        if (addedAfterDate.format("YYYY-MM-DD")!=='Invalid date' && addedAfterTime!=='Invalid date') {
          newQuery+='&added_after='+addedAfterDate.format("YYYY-MM-DD")+'T'+addedAfterTime.format("HH:mm:ss")+".000Z";
        }
      }
    }

    if (myValidOnAfterFromDate!==null && !currentServer.title.toUpperCase().includes("FLARE")) {
        newQuery+="&valid_on_after="+myValidOnAfterFromDate;
    }
    else if (validOnAfterFromDate && validOnAfterFromTime && !validOnAfterUntilDate && !validOnAfterUntilTime) {
        if (validOnAfterFromDate.format("YYYY-MM-DD")!=='Invalid date' && validOnAfterFromTime!=='Invalid date') {
          newQuery+='&match%5Bvalid_on_after%5D='+validOnAfterFromDate.format("YYYY-MM-DD")+'T'+validOnAfterFromTime.format("HH:mm:ss")+".000Z";
        }
      }
    else if (validOnAfterFromDate && validOnAfterFromTime && validOnAfterUntilDate && validOnAfterUntilTime) {
        newQuery+='&match%5Bvalid_on_after%5D='+validOnAfterFromDate.format("YYYY-MM-DD")+'T'+
                    validOnAfterFromTime.format("HH:mm:ss")+".000Z,"+
                    validOnAfterUntilDate.format("YYYY-MM-DD")+'T'+
                    validOnAfterUntilTime.format("YYYY-MM-DD")+".000Z";
    }

    if (objectId) {
      newQuery+='&match%5Bid%5D='+encodeURIComponent(objectId);
    }

    if (objectTypes.length>0) {
      newQuery+='&match%5Btype%5D='+objectTypes.join(',');
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
      newQuery+='&match%5Bversion%5D='+versionQuery;
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
      newQuery+='&match%5B'+query+'%5D='+queries[query];
    });

    setQueryString(newQuery.substr(1));
  },[addedAfterDate,addedAfterTime,validOnAfterFromDate,validOnAfterFromTime,validOnAfterUntilDate,validOnAfterUntilTime,allVersion,filters,firstVersion,lastVersion,objectId,objectTypes,versionDate,versionTime,versionMilliseconds,currentServer.title,next]);

  const isSubmitDisabled = () => {
    let filters_valid = true;
    filters.forEach(filter => {
      if (!filter.valid) {
        filters_valid = false;
      }
    });
    return isDisabled || Boolean(addedAfterDateError) || Boolean(addedAfterTimeError) || Boolean(versionDateError) || Boolean(versionTimeError) || Boolean(versionMillisecondsError) || !filters_valid;
  }

  const submitDisabled = isSubmitDisabled();

  useEffect(() => {
    const listener = event => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        if (!submitDisabled) {
          setNext(0);
          setPage(1);
          clear.current = true
          filterData(0);
        }
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [filterData,submitDisabled]);

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
            id="value"
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
              id="value"
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
                id="equality"
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
                id="value"
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

  const getStartItem = () => {
    if (currentManifest.length === 0) {
      return 0;
    }
    return (page-1)*numPerPage+1
  }

  const getEndItem = () => {
    const maxval = page*numPerPage;
    const maxitem = currentManifest.length;

    if (maxitem === 0) {
      return 0;
    }
    if (maxitem<maxval) {
      return maxitem;
    }
    return maxval;
  }

  const prevPageDisplay=((currentManifest.length === 0 && page===1) || page===1)?classes.invisible:classes.pointer;

  const nextPageDisplay=(currentManifest.length === 0 || currentManifest.length<=page*numPerPage)?classes.invisible:classes.pointer;

  const updateNumPerPage = (value) => {
    setNumPerPage(value);
    let myPage = 1;
    if (currentManifest.length === 0) {
      myPage = 0;
    }
    setPage(myPage);
  }

  const nextPage = () => {
    if (currentManifest.length%numToGrab===0) {
      // If we have a full pull of data then there may be more data to retrieve
      // If we are at 70% of the total, we should request the next pull of data
      if (page*numPerPage+numPerPage>=currentManifest.length*.7 && grabbingMore.current===false) {
        grabbingMore.current=true;
        let myNext = next + 1;
        setNext(next + 1);
        filterData(myNext,currentManifest[currentManifest.length-1].date_added);
      }
    }
    if (page<currentManifest.length) {
      setPage(page+1);
    }
  }

  const prevPage = () => {
    if (page>1) {
      setPage(page-1);
    }
  }

  return (
    <Card>
      {isDisabled ? <Grid item xs={12} md={12}>
        <Card style={{textAlign: "center"}}>
          <br/>
          <AlertTriangle style={{position: "relative",top: "7px"}} color="yellow"/> The server has indicated that this collection cannot be read from.<br/>
          <br/>
        </Card>
      </Grid> : null}
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
              helperText={addedAfterDateError}
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
              helperText={addedAfterTimeError}
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
          {currentServer.title.toUpperCase().includes("FLARE")?<Grid container spacing={3} style={{border: "1px solid gray"}}>
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
              <span id="filterlist">
                {filters.map((filter, index) => (
                  <Grid container key={index} spacing={1}>
                    <Grid item id="filtermenu" xs={4} md={4} lg={4}>
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
              </span>
            </Grid>
          </Grid>:null}
          <Grid item xs={12} md={12} style={{textAlign: "center"}}>
            <Button disabled={submitDisabled} color="secondary" variant="contained" onClick={() => clearManifestAndFilter()}>Filter</Button>
          </Grid>
        </Grid>
      </CardContent>
      <PerfectScrollbar>
        <Box>
          <Table id="filtered_table">
            <TableHead>
              {/* Beginning of Pagination section */}
              <TableRow>
                <TableCell colSpan={4} style={{textAlign: 'center'}}>
                  <div className={classes.unselectable}>
                    Displaying {getStartItem()} to {getEndItem()}<br/>
                    <span style={{position: "relative", top: "-7px"}}>
                      Number per page:
                      &nbsp;&nbsp;
                    </span>
                    <Select disableUnderline={true} id="perPage" onChange={(e) => {updateNumPerPage(e.target.value)}} value={numPerPage}>
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={20}>20</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                      <MenuItem value={100}>100</MenuItem>
                    </Select>
                  </div>
                  <div>
                    <span className={prevPageDisplay} onClick={() => prevPage()}>Prev</span>
                    <span className={classes.invisible}>&nbsp;&nbsp;&nbsp;</span>
                    <span className={classes.unselectable}>Page {page}</span>
                    <span className={classes.invisible}>&nbsp;&nbsp;&nbsp;</span>
                    <span className={nextPageDisplay} onClick={() => nextPage()}>Next</span>
                  </div>
                </TableCell>
              </TableRow>
              {/* End of Pagination section */}
              <TableRow>
                <TableCell>
                  Object ID
                </TableCell>
                <TableCell>
                  Date Added
                </TableCell>
                <TableCell>
                  Version
                </TableCell>
                <TableCell>
                  Media Type
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody id="filtered_table_body">
              {currentPageOfManifest.map((man) => (
                <TableRow
                  hover
                  key={man.id}
                > 
                  <TableCell id={"objectId"}>
                    {man.id}
                  </TableCell>
                  <TableCell id={"dateAdded"}>
                    {convertIsoDate(man.date_added)}
                  </TableCell>
                  <TableCell id={"version"}>
                    {convertIsoDateWithMilliseconds(man.version)}
                  </TableCell>
                  <TableCell id={"mediaType"}>
                    {man.media_type}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
    </Card>
  )
}

Manifest.propTypes = {
  className: PropTypes.string,
  server: PropTypes.string,
  collection: PropTypes.object
};

Manifest.defaultProps = {
  server: "",
  collection: {}
};

export default Manifest
