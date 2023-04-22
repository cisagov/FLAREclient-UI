import React, {useState} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import {
    Box,
    Button,
    Card,
    CardHeader,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Slide,
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
  MinusSquare as HideCollections,
  PlusSquare as ShowCollections,
  RefreshCw as Refresh,
  X as RefreshWait
} from 'react-feather';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
//import axios from '../../config/axios';
import Label from '../../components/Label';
//import AppConfig from '../../config/appConfig';
import EditIcon from '@material-ui/icons/Edit'
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from "@material-ui/core/IconButton";
import { deleteServer, refreshServer } from '../../redux/actions/servers';
import { getServerCollections } from '../../redux/actions/collections';
import { useDispatch, useSelector } from 'react-redux';
import {convertIsoDate} from "../../utils/helpers";
import { useSnackbar } from 'notistack';
import CollectionList from '../ServerManagement/CollectionList';

/**
 * Label colors will give users a glimpse into whats the status of their TAXII server.
 *
 * Normal indicates the server is connected and fully functional
 * Warning means thats a configuration needs to be updated or the server hasnt been polled in a while (check to see if its still there)
 * Error means that something went wrong while doing the intial connection or poll
 *
 * @type {{normal: string, critical: string, warning: string}}
 */
const labelColors = {
    normal: 'success',
    warning: 'warning',
    critical: 'error'
};

const useStyles = makeStyles((theme) => ({
    root: {},
    technology: {
        height: 30,
        '& + &': {
            marginLeft: theme.spacing(1)
        }
    },
    navigateNextIcon: {
        marginLeft: theme.spacing(1)
    }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ConnectedServers({className, servers, collections, ...rest}) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('');
    const [selectedServer, setSelectedServer] = useState(null);
    const [open, setOpen] = React.useState(false);
    const [refreshActive, setRefreshActive] = React.useState(false);
    const [showTheseCollections, setShowTheseCollections] = useState([]);
    const currentUser = useSelector(state => state.account.user);

    if (!servers) {
      return null;
    }

    const sortedServers = sortData(servers);

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

    const handleRefresh = async (label) => {
      setRefreshActive(true);
      setSelectedServer(label);
      enqueueSnackbar('Refresh of '+label+' requested.');
      await dispatch(refreshServer(label));
      await dispatch(getServerCollections(label));
      setRefreshActive(false);
      setSelectedServer(null);
    }

    const filteredApiRoots = (server,collections) => {
      let roots={};
      if (server.version==='TAXII11') {
        return [undefined];
      } else if (collections) {
        collections.map((collection) => roots[collection.apiRootRef]=1);
        return(Object.keys(roots));
      } else {
        return [''];
      }
    }

    const showOrHideCollection = (label) => {
      if (showTheseCollections.includes(label)) {
        setShowTheseCollections(showTheseCollections.filter((value) => { return value !== label;}));
      } else {
        setShowTheseCollections([...showTheseCollections, label]);
      }
    };

    function sortData() {
      if (orderBy !== '') {
        // Must make a deep copy of servers and operate on that in order for sorting to
        // work properly
        let serversCopy=JSON.parse(JSON.stringify(servers));
        if (orderBy === 'requiresBasicAuth' || orderBy === 'available') {
          (order === 'desc')
            ? serversCopy.sort((a,b) => (b[orderBy] < a[orderBy]) ? -1 : 1)
            : serversCopy.sort((a,b) => (a[orderBy] < b[orderBy]) ? -1 : 1)
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

    function updateSort(column) {
      if (column === orderBy)
      {
        setOrder(order==='desc'?'asc':'desc')
      } else {
        setOrder('asc')
        setOrderBy(column)
      }
    }

    return (
      <Card
        className={clsx(classes.root, className)}
        {...rest}
      >
        <CardHeader
          title="Connected TAXII Servers"
        />
        <Box p={2}>
          <Divider/>
          <PerfectScrollbar>
            <Box minWidth={900}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                    </TableCell>
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
                    {currentUser.authorities.includes('ROLE_ADMIN')?<TableCell align={'right'}>
                      Actions
                    </TableCell>:null}
                  </TableRow>
                </TableHead>
                {sortedServers.map((server) => (
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
                        {server.available ? 'True' : 'False'}
                      </TableCell>
                      <TableCell>
                        <Label color={labelColors[server.status]}>
                          {server.status?server.status:'N/A'}
                        </Label>
                      </TableCell>
                      <TableCell>
                        {server.requiresBasicAuth ? 'True' : 'False'}
                      </TableCell>
                      <TableCell>
                        {convertIsoDate(server.lastUpdated)}
                      </TableCell>
                      {currentUser.authorities.includes('ROLE_ADMIN')?<TableCell align={'right'}>
                        <IconButton
                          component={RouterLink}
                          to={`/app/management/servers/${server.label}/edit`}
                        >
                          <Tooltip
                            enterDelay={300}
                            title="Edit"
                          > 
                            <EditIcon/>
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
                      </TableCell>:null}
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
                ))}
              </Table>
            </Box>
          </PerfectScrollbar>
        </Box>
        <Box
          p={2}
          display="flex"
          justifyContent="flex-end"
        >
          <Button
            component={RouterLink}
            size="small"
            to="/app/management/servers"
          >
            See all
            <NavigateNextIcon className={classes.navigateNextIcon}/>
          </Button>
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

ConnectedServers.propTypes = {
    className: PropTypes.string,
    servers: PropTypes.array,
    collections: PropTypes.object
};

export default ConnectedServers;
