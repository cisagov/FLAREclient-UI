import React, {
    useState,
    useEffect,
    useCallback
} from 'react';
import {
    Box,
    Container,
    Divider,
    Tabs,
    Tab,
    makeStyles
} from '@material-ui/core';
import Page from '../../../components/Page';
import Header from './Header';
import { useDispatch, useSelector } from 'react-redux';
import {getServers} from '../../../redux/actions/servers';
import {getServerCollections} from '../../../redux/actions/collections';
import Overview from './Overview';
import Events from './Events';
import Collections from "./Collections";
import moment from "moment";
//import * as _ from "lodash";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

export const activities = [
    {
        id: '5e8dd0828d628e6f40abdfe8',
        user: 'Ziyad Mutawy',
        type: 'server_management',
        description: 'has uploaded STIX Content',
        createdAt: moment()
            .subtract(23, 'minutes')
            .toDate()
            .getTime()
    },
    {
        id: '5e8dd0893a6725f2bb603617',
        user: 'NCICC Admin',
        type: 'server_management',
        description: 'Polled Server',
        createdAt: moment()
            .subtract(2, 'hours')
            .toDate()
            .getTime()
    },
    {
        id: '5e8dd0960f3f0fe04e64d8f4',
        user: 'Ziyad Mutawy',
        type: 'server_management',
        description: 'Add new server: FLAREcloud',
        createdAt: moment()
            .subtract(2, 'days')
            .toDate()
            .getTime()
    },
    {
        id: '5e8dd09db94421c502c53d13',
        user: 'admin',
        type: 'server_management',
        description: 'Event log downloaded',
        createdAt: moment()
            .subtract(4, 'days')
            .toDate()
            .getTime()
    }
];

/**
 * TODO:// Need to re-evaluate how the performance of the app handles the realistic data when fetching server data. Right now we pull all server info
 * thats mocked, however, we might need to fetch summaries from /servers and details from /server/:id
 *
 * Im short on time so im throwing things the best i can.
 * @param props
 * @returns {null|*}
 * @constructor
 */
function ServerDetailsView(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const servers = useSelector(state => state.servers.servers);
    const collections = useSelector(state => state.collections.collections);
    const serverLabel = props.match.params.serverLabel;


    const [currentTab, setCurrentTab] = useState('overview');
    const tabs = [
        { value: 'overview', label: 'Overview' },
        { value: 'collections', label: 'Collections' },
        //{ value: 'events', label: 'Events' },
    ];

    const handleTabsChange = (event, value) => {
        setCurrentTab(value);
    };

    const fetchServers = useCallback(() => {
        dispatch(getServers());
    }, [dispatch]);

    const fetchCollections = useCallback(() => {
        dispatch(getServerCollections(serverLabel));
    }, [dispatch,serverLabel]);

    useEffect(() => {
        if(!servers){
            fetchServers();
        }
        if (Object.keys(collections).length===0) {
            fetchCollections();
        }
    });

    if(!servers){
        return  null
    }

    /**
     * THIS FUNCTION MUST STAY BELOW THE UPPER "IF" STATEMENT
     */
    const server = servers.find(e => e.label === serverLabel);

    return (
        <Page
            className={classes.root}
        >
            <Container maxWidth="lg">
                <Header serverLabel={serverLabel}/>
                <Box mt={3}>
                    <Tabs
                        onChange={handleTabsChange}
                        scrollButtons="auto"
                        textColor="secondary"
                        value={currentTab}
                        variant="scrollable"
                    >
                        {tabs.map((tab) => (
                            <Tab
                                key={tab.value}
                                label={tab.label}
                                value={tab.value}
                            />
                        ))}
                    </Tabs>
                </Box>
                <Divider />
                <Box mt={3}>
                    {currentTab === 'overview' && <div><Overview collections={collections} server={server}/></div>}
                    {currentTab === 'collections' && <div><Collections collections={collections} server={server}/></div>}
                    {currentTab === 'events' && <div><Events activities={activities}/></div>}
                </Box>
            </Container>
        </Page>
    );
}

export default ServerDetailsView;
