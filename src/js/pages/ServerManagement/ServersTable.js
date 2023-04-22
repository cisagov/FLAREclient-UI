/* eslint-disable max-len */
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Button,
  Card,
//  Checkbox,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  InputAdornment,
//  FormControlLabel,
  IconButton,
//  Link,
  Slide,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  makeStyles
} from '@material-ui/core';
import {
//  ArrowRight as ArrowRightIcon,
//  Image as ImageIcon,
  Edit as EditIcon,
  MinusSquare as HideCollections,
  PlusSquare as ShowCollections,
  RefreshCw as Refresh,
  Search as SearchIcon,
  X as RefreshWait
} from 'react-feather';
import Label from '../../components/Label';
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import DeleteIcon from "@material-ui/icons/Delete";
import { deleteServer, refreshServer } from '../../redux/actions/servers';
import { getServerCollections } from '../../redux/actions/collections';
import { useDispatch } from 'react-redux';
import {convertIsoDate} from "../../utils/helpers";
import { useSnackbar } from 'notistack';
import CollectionList from './CollectionList';

const requiresAuthOptions = [
  {
    id: 'all',
    name: 'All'
  },
  {
    id: "true",
    name: 'True'
  },
  {
    id: "false",
    name: 'False'
  }
];

const applyFilters = (servers, query, filters) => {
  return servers.filter((server) => {
    let matches = true;

    if (query && !server.label.toLowerCase().includes(query.toLowerCase())) {
      matches = false;
    }

    if (filters.version && server.version !== filters.version) {
      matches = false;
    }
    if (filters.requiresBasicAuth && server.requiresBasicAuth.toString() !== filters.requiresBasicAuth ) {
      matches = false;
    }

    return matches;
  });
}

const applyPagination = (customers, page, limit) => {
  return customers.slice(page * limit, page * limit + limit);
}

const useStyles = makeStyles((theme) => ({
  root: {},
  bulkOperations: {
    position: 'relative'
  },
  bulkActions: {
    paddingLeft: 4,
    paddingRight: 4,
    marginTop: 6,
    position: 'absolute',
    width: '100%',
    zIndex: 2,
    backgroundColor: theme.palette.background.default
  },
  bulkAction: {
    marginLeft: theme.spacing(2)
  },
  queryField: {
    width: 500
  },
  categoryField: {
    flexBasis: 200
  },
  availabilityField: {
    marginLeft: theme.spacing(2),
    flexBasis: 200
  },
  stockField: {
    marginLeft: theme.spacing(2)
  },
  shippableField: {
    marginLeft: theme.spacing(2)
  },
  imageCell: {
    fontSize: 0,
    width: 68,
    flexBasis: 68,
    flexGrow: 0,
    flexShrink: 0
  },
  image: {
    height: 68,
    width: 68
  }
}));

const labelColors = {
  normal: 'success',
  warning: 'warning',
  critical: 'error'
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ServersTable({ className, servers, collections, ...rest }) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    version: null,
    requiresBasicAuth: null,
  });
  const [selectedServer, setSelectedServer] = useState(null);
  const [order, setOrder] = useState('asc');                                                       
  const [orderBy, setOrderBy] = useState('');    
  const [open, setOpen] = useState(false);
  const [refreshActive, setRefreshActive] = useState(false);
  const [showTheseCollections, setShowTheseCollections] = useState([]);

  const dispatch = useDispatch();

  const handleClickOpen = (server) => {
    setSelectedServer(server);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedServer(null);
  };

  const performDeleteAndClose = () => {
    dispatch(deleteServer(selectedServer));
    handleClose();
  }

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleServerVersionChange = (event) => {
    event.persist();

    let value = null;

    if (event.target.value !== 'all') {
      value = event.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      version: value
    }));
  };

  const handleRefresh = async (label) => {
    setRefreshActive(true);
    setSelectedServer(label);
    enqueueSnackbar('Refresh of '+label+' requested.');
    await dispatch(refreshServer(label));
    await dispatch(getServerCollections(label));
    setRefreshActive(false);
    setSelectedServer(null);
  }

  const handleAuthChange = (event) => {
    event.persist();

    let value = null;

    if (event.target.value !== 'all') {
      value = event.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      requiresBasicAuth: value
    }));
  };

  const serverVersionOptions = () => {
    let options = [ { id: 'all', name: 'All' } ];
    let versions = {};
    if (servers) {
      servers.map((server) => versions[server.version]=1);
      Object.keys(versions).sort().map((version) => {
        let displayVersion="TAXII "+version.substring(5,6)+'.'+version.substring(6,7);
        return options.push({ id: version, name: displayVersion });
      });
    }
    return options;
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const showOrHideCollection = (label) => {
    if (showTheseCollections.includes(label)) {
      setShowTheseCollections(showTheseCollections.filter((value) => { return value !== label;}));
    } else {
      setShowTheseCollections([...showTheseCollections, label]);
    }
  };

  const sortData = () => {
    if (orderBy !== '') {
      // Must make a deep copy of servers and operate on that in order for sorting to
      // work properly
      let serversCopy=JSON.parse(JSON.stringify(servers));
      if (orderBy === 'requiresBasicAuth' || orderBy === 'available') {
        (order === 'desc')
          ? serversCopy.sort((a,b) => (b[orderBy] < a[orderBy]) ? -1 : 1)
          : serversCopy.sort((a,b) => (a[orderBy] < b[orderBy]) ? -1 : 1)
      } else if (orderBy === 'apiRoots') {
        (order === 'desc')
          ? serversCopy.sort((a, b) => ((b[orderBy]?b[orderBy].length:0) < (a[orderBy]?a[orderBy].length:0) ? -1 : 1))
          : serversCopy.sort((a, b) => ((a[orderBy]?a[orderBy].length:0) < (b[orderBy]?b[orderBy].length:0) ? -1 : 1))
      } else if (orderBy === 'collections') {
        (order === 'desc')
          ? serversCopy.sort((a, b) => (collections[b['label']].length < collections[a['label']].length ? -1 : 1))
          : serversCopy.sort((a, b) => (collections[a['label']].length < collections[b['label']].length ? -1 : 1))
      } else {
        (order === 'desc')
          ? serversCopy.sort((a, b) => ((b[orderBy]?b[orderBy].toUpperCase():'') < (a[orderBy]?a[orderBy].toUpperCase():'') ? -1 : 1))
          : serversCopy.sort((a, b) => ((a[orderBy]?a[orderBy].toUpperCase():'') < (b[orderBy]?b[orderBy].toUpperCase():'') ? -1 : 1))
      }
      return serversCopy
    } else {
      return servers;
    }
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

  const filteredApiRoots = (server,collections) => {
    let roots={};
    if (server.version==='TAXII11') {
      return [undefined];
    } else if (collections) {
      collections.map((collection) => roots[collection.apiRootRef]=1);
      return(Object.keys(roots).sort());
    } else {
      return [''];
    }
  }

  // Usually query is done on backend with indexing solutions, TODO:// UPDATE LATER
  const sortedServers = sortData(servers);
  const filteredServers = applyFilters(sortedServers, query, filters);
  const paginatedServers = applyPagination(filteredServers, page, limit);

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box p={2}>
        <Box
          display="flex"
          alignItems="center"
        >
          <TextField
            className={classes.queryField}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SvgIcon
                    fontSize="small"
                    color="action"
                  >
                    <SearchIcon />
                  </SvgIcon>
                </InputAdornment>
              )
            }}
            onChange={handleQueryChange}
            placeholder="Search Servers"
            value={query}
            variant="outlined"
          />
        </Box>
        <Box
          mt={3}
          display="flex"
          alignItems="center"
        >
          <TextField
            className={classes.categoryField}
            label="Server Version"
            name="serverVersion"
            onChange={handleServerVersionChange}
            select
            SelectProps={{ native: true }}
            value={filters.version || 'all'}
            variant="outlined"
          >
            {serverVersionOptions().map((versionOption) => (
              <option
                key={versionOption.id}
                value={versionOption.id}
              >
                {versionOption.name}
              </option>
            ))}
          </TextField>
          <TextField
            className={classes.availabilityField}
            label="Requires Auth"
            name="requiresAuth"
            onChange={handleAuthChange}
            select
            SelectProps={{ native: true }}
            value={filters.requiresBasicAuth || 'all'}
            variant="outlined"
          >
            {requiresAuthOptions.map((authOption) => (
              <option
                key={authOption.id}
                value={authOption.id}
              >
                {authOption.name}
              </option>
            ))}
          </TextField>
        </Box>
        <PerfectScrollbar>
          <Box>
            <Table id="api-root-table">
              <TableHead>
                <TableRow>
                  <TableCell/>
                  <TableCell>
                    <Tooltip
                      enterDelay={300}
                      title="Sort Label"
                    >
                      <TableSortLabel
                        active={orderBy==='label'}
                        direction={order}
                        onClick={() => updateSort('label')}
                      >
                        Label
                      </TableSortLabel>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip
                      enterDelay={300}
                      title="Sort Version"
                    >
                      <TableSortLabel
                        active={orderBy==='version'}
                        direction={order}
                        onClick={() => updateSort('version')}
                      >
                        Version
                      </TableSortLabel>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip
                      enterDelay={300}
                      title="Sort Available"
                    >
                      <TableSortLabel
                        active={orderBy==='available'}
                        direction={order}
                        onClick={() => updateSort('available')}
                      >
                        Available
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
                  <TableCell>
                    <Tooltip
                      enterDelay={300}
                      title="Sort API Roots"
                    >
                      <TableSortLabel
                        active={orderBy==='apiRoots'}
                        direction={order}
                        onClick={() => updateSort('apiRoots')}
                      >
                        API Roots
                      </TableSortLabel>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip
                      enterDelay={300}
                      title="Sort Collections"
                    >
                      <TableSortLabel
                        active={orderBy==='collections'}
                        direction={order}
                        onClick={() => updateSort('collections')}
                      >
                        Collections
                      </TableSortLabel>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip
                      enterDelay={300}
                      title="Sort Requires Auth"
                    >
                      <TableSortLabel
                        active={orderBy==='requiresBasicAuth'}
                        direction={order}
                        onClick={() => updateSort('requiresBasicAuth')}
                      >
                        Requires Auth
                      </TableSortLabel>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip
                      enterDelay={300}
                      title="Sort Last Updated"
                    >
                      <TableSortLabel
                        active={orderBy==='lastUpdated'}
                        direction={order}
                        onClick={() => updateSort('lastUpdated')}
                      >
                        Last Updated
                      </TableSortLabel>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              {paginatedServers.map((server) => {
                return (
                  <TableBody key={server.label}>
                    <TableRow
                      hover
                    >
                      <TableCell>
                        <span id="showhidecollections" onClick={() => showOrHideCollection(server.label)}>
                          {showTheseCollections.includes(server.label)?<HideCollections size={20}/>:
                          <ShowCollections size={20}/>}
                        </span>
                      </TableCell>
                      <TableCell>
                        {server.label}
                      </TableCell>
                      <TableCell>
                        {server.version}
                      </TableCell>
                      <TableCell>
                        {server.available ? "True" : "False"}
                      </TableCell>
                      <TableCell>
                        <Label color={labelColors[server.status]}>
                          {server.status ? server.status : "N/A"}
                        </Label>
                      </TableCell>
                      <TableCell>
                        {server.apiRoots ? server.apiRoots.length : "N/A"}
                      </TableCell>
                      <TableCell>
                        {collections[server.label] ? collections[server.label].length : "N/A"}
                      </TableCell>
                      <TableCell>
                        {server.requiresBasicAuth ? "True" : "False"}
                      </TableCell>
                      <TableCell>
                        {convertIsoDate(server.lastUpdated)}
                      </TableCell>
                      <TableCell align={'right'}>

                        <IconButton
                          component={RouterLink}
                          to={`/app/management/servers/${server.label}/edit`}
                        >
                          <Tooltip
                            enterDelay={300}
                            title="Edit"
                          >
                            <EditIcon />
                          </Tooltip>
                        </IconButton>

                        <IconButton
                          onClick={() => handleRefresh(server.label)}
                        >
                          { 
                            (refreshActive && selectedServer===server.label)?<Tooltip
                              enterDelay={300}
                              title="Updating"
                            > 
                              <RefreshWait/>
                            </Tooltip>:<Tooltip
                              enterDelay={300}
                              title="Refresh"
                            > 
                              <Refresh/>
                            </Tooltip>
                          }
                        </IconButton>

                        <IconButton
                          component={RouterLink}
                          to={`/app/management/servers/${server.label}`}
                        >
                          <Tooltip
                            enterDelay={300}
                            title="Show Detail"
                          >
                            <OpenInNewIcon/>
                          </Tooltip>
                        </IconButton>

                        <IconButton
                          onClick={() => handleClickOpen(server.label)}
                        >
                          <Tooltip
                            enterDelay={300}
                            title="Delete"
                          >
                            <DeleteIcon/>
                          </Tooltip>
                        </IconButton>

                      </TableCell>
                    </TableRow>
                    <TableRow key={server.label+'-detail'}>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
                        <Collapse in={showTheseCollections.includes(server.label)} timeout="auto" unmountOnExit>
                          <Box margin={1}>
                            {filteredApiRoots(server,collections[server.label]).map((apiRoot) => {
                              return (
                                <Box mt={3} key={apiRoot?apiRoot:'undefined'}>
                                  <h3><b>{apiRoot}</b></h3>
                                  <Divider/>
                                  <CollectionList apiRoot={apiRoot} collections={collections[server.label]} server={server}/>
                                </Box>
                              )
                            })}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                );
              })}
            </Table>
            <TablePagination
              component="div"
              count={filteredServers.length}
              onChangePage={handlePageChange}
              onChangeRowsPerPage={handleLimitChange}
              page={page}
              rowsPerPage={limit}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </Box>
        </PerfectScrollbar>
      </Box>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      > 
        <DialogTitle id="alert-dialog-slide-title">Delete this server</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            You are about to delete the following server...<br/><br/>
            {selectedServer}<br/>
            <br/>
            Do you wish to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button id="performDelete" onClick={performDeleteAndClose} color="primary">
            Delete
          </Button>
          <Button id="cancelDelete" onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

ServersTable.propTypes = {
  className: PropTypes.string,
  servers: PropTypes.array,
  collections: PropTypes.object
};

ServersTable.defaultProps = {
  servers: [],
  collections: {}
};

export default ServersTable;
