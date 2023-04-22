import React, {
  useState
} from 'react';
import {
    Box,
    Container,
    Divider,
    Tabs,
    Tab,
    makeStyles
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import Page from '../../components/Page';
import Content from './Content';
import Upload from './Upload';
import Download1x from './Download1x';
import Download2x from './Download2x';
import Manifest from './Manifest';
import Activities from './Activities';
import { createBrowserHistory } from 'history'
import Header from './Header';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

function CollectionManagement(props) {
  const classes = useStyles();
  const server = props.match.params.serverLabel;
  const collection = props.match.params.collectionId;
  const tabName = props.match.params.tabName;
  const servers = useSelector(state => state.servers.servers);
  const collections = useSelector(state => state.collections.collections);
  const history = createBrowserHistory();
  const [currentTab, setCurrentTab] = useState(tabName);
  const currentServer = servers.find(s => s.label === server);
  const currentCollection = collections[server].find(c => c.id === collection);

  const tabsForTAXII1 = [
    { value: 'content', label: 'Content', id: 'content-tab' },
    { value: 'upload', label: 'Upload', id: 'upload-tab' },
    { value: 'download', label: 'Download', id: 'download-tab' },
    { value: 'activities', label: 'Activities', id: 'activities-tab' },
  ];
  const tabsForTAXII2 = [
    { value: 'content', label: 'Content', id: 'content-tab' },
    { value: 'upload', label: 'Upload', id: 'upload-tab' },
    { value: 'download', label: 'Download', id: 'download-tab' },
    { value: 'manifest', label: 'Manifest', id: 'manifest-tab' },
    { value: 'activities', label: 'Activities', id: 'activities-tab' },
  ];

  const selectTabs = () => {
    if (currentServer.version==='TAXII11') {
      return tabsForTAXII1;
    } else {
      return tabsForTAXII2;
    }
  }

  const tabs = selectTabs();

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
    history.push(`/api/servers/${server}/collections/${collection}/${value}`);
  };

  return (
    <Page className={classes.root}>
      <Container maxWidth="lg">
        <Header collectionName={currentCollection.collectionObject.title}/>
        <Box mt={3}>
          <Tabs
            onChange={handleTabsChange}
            scrollButtons="auto"
            textColor="secondary"
            value={currentTab}
            variant="fullWidth"
            centered
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.value}
                label={tab.label}
                value={tab.value}
                id={tab.id}
              />
            ))}
          </Tabs>
        </Box>
        <Divider />
        <Box mt={3}>
          {currentTab === 'content' && <div><Content server={server} collection={currentCollection}/></div>}
          {currentTab === 'upload' && <div><Upload server={server} collection={currentCollection}/></div>}
          {currentTab === 'download' && currentCollection.taxiiVersion.match('TAXII1') && <div><Download1x server={server} collection={currentCollection}/></div>}
          {currentTab === 'download' && currentCollection.taxiiVersion.match('TAXII2') && <div><Download2x server={server} collection={currentCollection}/></div>}
          {currentTab === 'manifest' && <div><Manifest server={server} collection={currentCollection}/></div>}
          {currentTab === 'activities' && <div><Activities server={server} collection={currentCollection}/></div>}
        </Box>
      </Container>
    </Page>
  );
}

export default CollectionManagement
