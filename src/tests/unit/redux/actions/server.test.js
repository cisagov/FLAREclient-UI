import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
// import fetchMock from 'fetch-mock'

import * as mock_collection from '../../../../js/api/mock/mock_collection.js';
import * as mock_server from '../../../../js/api/mock/mock_server.js'
import * as serverSampleData from '../../../../js/api/mock/server/sampleData.js'

// Actions to be tested
import {FETCH_SERVERS, FETCH_SERVER, CREATE_SERVER, UPDATE_SERVER, DELETE_SERVER, REFRESH_SERVER,
        getServers,    getServer,    addServer,     updateServer,  deleteServer,  refreshServer}
        from '../../../../js/redux/actions/servers';

// Importing getServerCollections for use when a new server is created
import {CLEAR_SERVER_COLLECTIONS, getServerCollections} from '../../../../js/redux/actions/collections';

describe('server actions', () => {
  it('Fetches server list', () => {
    const store = configureMockStore([thunk])(
      {
        account:{
          id_token: null
        }
      }
    );

    let servers = Object.values(serverSampleData.fetchServersResponse.byLabel);
    const expectedActions = [
      {
        type: FETCH_SERVERS,
        payload: {
          servers
        }
      }
    ];

    /**
     * The following test asserts that the right actions AND payload are returned from the redux ASYNC action creator.
     **/
    return store.dispatch(getServers()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    })
  });

  it('Fetches a specific server', () => {
    const store = configureMockStore([thunk])(
      {
        account:{
          id_token: null
        }
      }
    );

    let server = serverSampleData.fetchServersResponse.byLabel['Hail A TAXII']
    const expectedActions = [
      {
        type: FETCH_SERVER,
        payload: {
          server
        }
      }
    ];

    /**
     * The following test asserts that the right actions AND payload are returned from the redux ASYNC action creator.
     **/
    return store.dispatch(getServer('Hail A TAXII')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    })
  });

  it('Creates a new server', () => {
    let servers = Object.values(serverSampleData.fetchServersResponse.byLabel);
    const store = configureMockStore([thunk])(
      {
        account:{
          id_token: null
        },
        servers:{
          servers
        }
      }
    );

    const newServer = {
      label: 'New Server',
      url: 'http://testme.com/taxii2',
      serverDescription: 'This is a description',
      requiresBasicAuth: false,
      username: '',
      password: ''
    }
    /**
     * The following test asserts that the right actions AND payload are returned from the redux ASYNC action creator.
     **/
    return store.dispatch(addServer(newServer)).then(() => {
      const actions=store.getActions();
      const server = actions[0] && actions[0].payload && actions[0].payload.servers && 
                     actions[0].payload.servers.find(element => element['label']==='New Server');
      const serverHailATAXII = servers.filter((server) => server.label==='Hail A TAXII');
      const serverCTI = servers.filter((server) => server.label==='CTI');
      expect(actions[0].type).toEqual(CREATE_SERVER);
      expect(server).toBeDefined();
      expect(server.label).toEqual(newServer.label);
      expect(server.url).toEqual(newServer.url);
      expect(server.serverDescription).toEqual(newServer.serverDescription);
      expect(server.requireBasicAuth).toEqual(newServer.requireBasicAuth);
      expect(serverHailATAXII).toBeDefined();
      expect(serverCTI).toBeDefined();
    })
  })
  
  it('Updates an existing server', () => {
    const servers = Object.values(serverSampleData.fetchServersResponse.byLabel);
    const store = configureMockStore([thunk])(
      {
        account:{
          id_token: null
        },
        servers:{
          servers
        }
      }
    );

    const updatedServer = {
      apiRoots: null,
      available: true,
      defaultApiRoot: null,
      hasCredentials: true,
      hasReceivedCollectionInformation: true,
      hasReceivedServerInformation: true,
      id: "5f7f6b9df891316988fa9a49",
      label: "Hail A TAXII",
      lastReceivedCollectionInformation: "2020-10-08T20:41:03.448Z",
      lastReceivedServerInformation: "2020-10-08T20:41:02.830Z",
      lastUpdated: "2020-10-08T20:41:03.448Z",
      password: null,
      requiresBasicAuth: true,
      serverDescription: "Changed Description",
      url: "http://hailataxii.com/taxii-discovery-service",
      username: null,
      version: "TAXII11"
    }
    /**
     * The following test asserts that the right actions AND payload are returned from the redux ASYNC action creator.
     **/
    return store.dispatch(updateServer('Hail A TAXII',updatedServer)).then(() => {
      const actions=store.getActions();
      const server = actions[0] && actions[0].payload && actions[0].payload.servers && 
                   actions[0].payload.servers.find(element => element['label']==='Hail A TAXII');
      const serverCTI = servers.filter((server) => server.label==='CTI');
      expect(actions[0].type).toEqual(UPDATE_SERVER);
      expect(server).toBeDefined();
      expect(server.label).toEqual(updatedServer.label);
      expect(server.url).toEqual(updatedServer.url);
      expect(server.serverDescription).toEqual(updatedServer.serverDescription);
      expect(server.requireBasicAuth).toEqual(updatedServer.requireBasicAuth);
      expect(serverCTI).toBeDefined();
    })
  })
  
  it('Deletes a server', () => {
    const servers = Object.values(serverSampleData.fetchServersResponse.byLabel);
    const store = configureMockStore([thunk])(
      {
        account:{
          id_token: null
        },
        servers:{
          servers
        }
      }
    );

    const returnedServers = servers.filter((server) => server.label !=='Hail A TAXII');
    const expectedActions = [
      {
        type: DELETE_SERVER,
        payload: {
          servers: returnedServers
        }
      },
      {
        type: CLEAR_SERVER_COLLECTIONS,
        payload: {
          serverLabel: "Hail A TAXII",
        }
      },
    ];

    /**
     * The following test asserts that the right actions AND payload are returned from the redux ASYNC action creator.
     **/
    const serverToDelete='Hail A TAXII';
    return store.dispatch(deleteServer(serverToDelete)).then(() => {
      const actions=store.getActions();
      expect(actions).toEqual(expectedActions);
    })
  })

  it('Refreshes a server', () => {
    const servers = Object.values(serverSampleData.fetchServersResponse.byLabel);
    const store = configureMockStore([thunk])(
      {
        account:{
          id_token: null
        },
        servers:{
          servers
        }
      }
    );

    let refreshed_servers = JSON.parse(JSON.stringify(servers));
    refreshed_servers[1].lastReceivedServerInformation = '2020-12-31T23:59:59.000Z';
    const expectedActions = [
      {
        type: REFRESH_SERVER,
        payload: {
          servers: refreshed_servers
        }
      },
    ];

    /**
     * The following test asserts that the right actions AND payload are returned from the redux ASYNC action creator.
     **/
    const serverToRefresh='Hail A TAXII';
    return store.dispatch(refreshServer(serverToRefresh)).then(() => {
      const actions=store.getActions();
      expect(actions).toEqual(expectedActions);
    })
  })

})
