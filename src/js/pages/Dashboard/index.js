import React, {
  useState,
  useEffect,
  useCallback
} from 'react';
import {
    Container,
    Grid,
    makeStyles
} from '@material-ui/core';
import Page from '../../components/Page';
import Header from './Header';
//import TotalConnectedServers from "./summaries/TotalConnectedServers";
//import TotalUsers from "./summaries/TotalUsers";
import ConnectedServers from "./ConnectedServers";
import Events from './Events';
import {getServers} from '../../redux/actions/servers';
import {getEvents} from '../../redux/actions/events';
import {getUsers} from '../../redux/actions/users';
import {getServerCollections} from '../../redux/actions/collections';
import { useDispatch, useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
    container: {
        [theme.breakpoints.up('lg')]: {
            paddingLeft: 64,
            paddingRight: 64
        }
    }
}));

function DashboardView() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [retrievedServers,setRetrievedServers]=useState(false);
    const [retrievedCollections,setRetrievedCollections]=useState(false);
    const [retrievedEvents,setRetrievedEvents]=useState(false);
    const [retrievedUsers,setRetrievedUsers]=useState(false);
    const servers = useSelector(state => state.servers.servers);
    const collections = useSelector(state => state.collections.collections);
    const events = useSelector(state => state.events.events);
//    const users = useSelector(state => state.users.users);

    const fetchServers = useCallback(() => {
        dispatch(getServers());
    }, [dispatch]);

    const fetchCollections = useCallback((label) => {
        dispatch(getServerCollections(label));
    }, [dispatch]);

    const fetchEvents = useCallback(() => {
        dispatch(getEvents());
    }, [dispatch]);

    const fetchUsers = useCallback(() => {
        dispatch(getUsers());
    }, [dispatch]);

    useEffect(() => {
        if(!retrievedServers){
            fetchServers();
            setRetrievedServers(true);
        }
        if(!retrievedCollections){
          if (servers) {
            servers.forEach((server) => fetchCollections(server.label));
            setRetrievedCollections(true);
          }
        }
        if(!retrievedEvents){
            fetchEvents();
            setRetrievedEvents(true);
        }
        if(!retrievedUsers){
            fetchUsers();
            setRetrievedUsers(true);
        }
    }, [
      retrievedServers,
      fetchServers,
      retrievedEvents,
      fetchEvents,
      retrievedUsers,
      fetchUsers,
      retrievedCollections,
      fetchCollections,
      servers
    ]);

    if(!servers){
        return  null
    }

    return (
        <Page
            className={classes.root}
        >
            <Container
                maxWidth={false}
                className={classes.container}
            >
                <Header />
                <Grid
                    container
                    spacing={3}
                >
                    {/*<Grid
                        item
                        lg={6}
                        sm={6}
                        xs={12}
                    >
                        <TotalConnectedServers servers={servers} />
                    </Grid>
                    <Grid
                        item
                        lg={6}
                        sm={6}
                        xs={12}
                    >
                        <TotalUsers users={users} />
                    </Grid>*/}
                    <Grid
                        item
                        xs={12}
                    >
                        <ConnectedServers servers={servers} collections={collections}/>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                    >
                        <Events events={events} />
                    </Grid>

                </Grid>
            </Container>
        </Page>
    );
}

export default DashboardView;
