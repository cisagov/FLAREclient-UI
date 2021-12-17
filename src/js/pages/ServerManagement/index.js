import React, {
    useState,
    useEffect,
    useCallback
} from 'react';
import {
    Box,
    Container,
    makeStyles
} from '@material-ui/core';
//import axios from '../../config/axios';
import Page from '../../components/Page';
import Header from './Header';
import ServersTable from './ServersTable';
//import AppConfig from '../../config/appConfig';
import {getServers} from '../../redux/actions/servers';
import {getServerCollections} from '../../redux/actions/collections';
import { useDispatch, useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: 100
    }
}));

function ServerManagementListView() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [retrievedData,setRetrievedData]=useState(false);
    const servers = useSelector(state => state.servers.servers);
    const collections = useSelector(state => state.collections.collections);

    const fetchServers = useCallback(() => {
        dispatch(getServers());
    }, [dispatch]);

    const fetchCollections = useCallback((label) => {
        dispatch(getServerCollections(label));
    }, [dispatch]);

    useEffect(() => {
        if(!retrievedData){
            fetchServers();
            setRetrievedData(true);
            servers.forEach((server) => fetchCollections(server.label));
        }
    }, [retrievedData,fetchServers,fetchCollections,servers,collections]);

    if(!servers){
        return null
    }

    return (
        <Page
            className={classes.root}
        >
            <Container maxWidth={false}>
                <Header />
                {servers && (
                    <Box mt={3}>
                        <ServersTable servers={servers} collections={collections}/>
                    </Box>
                )}
            </Container>
        </Page>
    );
}

export default ServerManagementListView;
