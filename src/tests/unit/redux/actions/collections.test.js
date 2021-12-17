import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
// import fetchMock from 'fetch-mock'

import * as mock_collection from '../../../../js/api/mock/mock_collection.js';
import * as collectionSampleData from '../../../../js/api/mock/collection/sampleData.js'

// Actions to be tested
import {FETCH_SERVER_COLLECTIONS, FETCH_CONTENTS, FETCH_ACTIVITIES, FETCH_CONTENT_DETAIL,
        getServerCollections,     getContents,    getActivities,    getContentDetail,
        FETCH_MANIFEST, CLEAR_COLLECTIONS, CLEAR_SERVER_COLLECTIONS, UPLOAD_FILE, VALIDATE_FILE,
        getManifest,    clearCollections,  clearServerCollections,   uploadFiles, validateFiles,
        REQUEST_DOWNLOAD, GET_RECURRING, STOP_RECURRING,
        requestDownload,  getRecurring,  stopRecurring}
        from '../../../../js/redux/actions/collections';

describe('collection actions', () => {
  it('Fetches server collections', () => {
    const store = configureMockStore([thunk])(
      {
        account:{
          id_token: null
        },
        collections: {}
      }
    );

    const collections = Object.values(collectionSampleData.CTICollections.byId);
    const expectedActions = [
      {
        type: FETCH_SERVER_COLLECTIONS,
        payload: {
          serverLabel: 'CTI',
          collections
        }
      }
    ];

    /**
     * The following test asserts that the right actions AND payload are returned from the redux ASYNC action creator.
     **/
    return store.dispatch(getServerCollections('CTI')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    })
  });

  it('Fetches Contents', () => {
    const store = configureMockStore([thunk])(
      {
        account:{
          id_token: null
        },
        collections: {}
      }
    );

    const contents = collectionSampleData.HailATAXIIContents;
    const expectedActions = [
      {
        type: FETCH_CONTENTS,
        payload: {
          collectionId: '12345',
          contents
        }
      }
    ];

    /**
     * The following test asserts that the right actions AND payload are returned from the redux ASYNC action creator.
     **/
    return store.dispatch(getContents('Hail a TAXII','12345',1,20,'id','asc')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    })
  });

  it('Fetches Activities', () => {
    const store = configureMockStore([thunk])(
      {
        account:{
          id_token: null
        },
        collections: {}
      }
    );

    const activities = collectionSampleData.HailATAXIIActivities;

    /**
     * The following test asserts that the right actions AND payload are returned from the redux ASYNC action creator.
     **/
    return store.dispatch(getActivities('Hail a TAXII','12345',1,20,'id','asc')).then(() => {
      const actions=store.getActions();
      expect(actions[0].type).toEqual(FETCH_ACTIVITIES);
      expect(actions[0].payload.collectionId).toEqual('12345');
      expect(actions[0].payload.activities.data).toEqual(activities);
    })
  });

  it('Fetches Content Detail', () => {
    const store = configureMockStore([thunk])(
      {
        account:{
          id_token: null
        },
        collections: {}
      }
    );

    const content = collectionSampleData.HailATAXIIContent;
    const expectedActions = [
      {
        type: FETCH_CONTENT_DETAIL,
        payload: {
          content
        }
      }
    ];

    /**
     * The following test asserts that the right actions AND payload are returned from the redux ASYNC action creator.
     **/
    return store.dispatch(getContentDetail('Hail a TAXII','12345','67890')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    })
  });

  it('Fetches Manifest', () => {
    const store = configureMockStore([thunk])(
      {
        account:{
          id_token: null
        },
        collections: {}
      }
    );

    const collectionId = '12345';
    const manifest = collectionSampleData.flareManifest;
    const expectedActions = [
      {
        type: FETCH_MANIFEST,
        payload: {
          collectionId,
          manifest
        }
      }
    ];

    /**
     * The following test asserts that the right actions AND payload are returned from the redux ASYNC action creator.
     **/
    return store.dispatch(getManifest('CTI','12345','')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    })
  });

  it('Clears all collections', () => {
    const hail_a_taxii_collections = Object.values(collectionSampleData.HailATAXIICollections.byId);
    const cti_collections = Object.values(collectionSampleData.CTICollections.byId);
    const store = configureMockStore([thunk])(
      {
        account:{
          id_token: null
        },
        collections: {
          'Hail A TAXII': hail_a_taxii_collections,
          CTI: cti_collections
        }
      }
    );

    const expectedActions = [
      {
        type: CLEAR_COLLECTIONS
      }
    ];

    /**
     * The following test asserts that the right actions AND payload are returned from the redux ASYNC action creator.
     **/
    return store.dispatch(clearCollections()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    })
  });

  it('Clears a specific server\'s collections', () => {
    const hail_a_taxii_collections = Object.values(collectionSampleData.HailATAXIICollections.byId);
    const cti_collections = Object.values(collectionSampleData.CTICollections.byId);
    const store = configureMockStore([thunk])(
      {
        account:{
          id_token: null
        },
        collections: {
          'Hail A TAXII': hail_a_taxii_collections,
          CTI: cti_collections
        }
      }
    );

    const expectedActions = [
      {
        type: CLEAR_SERVER_COLLECTIONS,
        payload: {
          serverLabel: 'CTI'
        }
      }
    ];

    /**
     * The following test asserts that the right actions AND payload are returned from the redux ASYNC action creator.
     **/
    return store.dispatch(clearServerCollections('CTI')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    })
  })

  it('Uploads a file', () => {
    const store = configureMockStore([thunk])(
      {
        account:{
          id_token: null
        },
        collections: {}
      }
    );

    const response = "Successfully published 1 bundle(s)";
    const expectedActions = [
      {
        type: UPLOAD_FILE,
        payload: {
          response
        }
      }
    ];

    const fileUpload = collectionSampleData.fileToUploadOrValidate;

    /**
     * The following test asserts that the right actions AND payload are returned from the redux ASYNC action creator.
     **/
    return store.dispatch(uploadFiles('Hail a TAXII','12345',fileUpload)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    })
  });

  it('Validates a file', () => {
    const store = configureMockStore([thunk])(
      {
        account:{
          id_token: null
        },
        collections: {}
      }
    );

    const validations = collectionSampleData.HailATAXIIValidate;
    const expectedActions = [
      {
        type: VALIDATE_FILE,
        payload: {
          validations
        }
      }
    ];

    const fileValidate = collectionSampleData.fileToUploadOrValidate;

    /**
     * The following test asserts that the right actions AND payload are returned from the redux ASYNC action creator.
     **/
    return store.dispatch(validateFiles('Hail a TAXII','12345',fileValidate)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    })
  });

  it('Requests Download', () => {
    const store = configureMockStore([thunk])(
      {
        account:{
          id_token: null
        },
        collections: {}
      }
    );

    const response = "Started async fetch";
    const expectedActions = [
      {
        type: REQUEST_DOWNLOAD,
        payload: {
          response
        }
      }
    ];

    /**
     * The following test asserts that the right actions AND payload are returned from the redux ASYNC action creator.
     **/
    return store.dispatch(requestDownload('Hail a TAXII','12345','')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    })
  });

  it('Finds whether a collection has a recurring download', () => {
    const store = configureMockStore([thunk])(
      {
        account:{
          id_token: null
        },
        collections: {}
      }
    );

    const serverLabel = 'Hail a TAXII';
    const collectionId = '12345';
    const contents = collectionSampleData.HailATAXIIGetRecurring;
    const expectedActions = [
      {
        type: GET_RECURRING,
        payload: {
          serverLabel,
          collectionId,
          contents
        }
      }
    ];

    /**
     * The following test asserts that the right actions AND payload are returned from the redux ASYNC action creator.
     **/
    return store.dispatch(getRecurring(serverLabel,collectionId)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    })
  });

  it('Stops a recurring download', () => {
    const store = configureMockStore([thunk])(
      {
        account:{
          id_token: null
        },
        collections: {}
      }
    );

    const serverLabel = 'Hail a TAXII';
    const collectionId = '12345';
    const expectedActions = [
      {
        type: STOP_RECURRING,
        payload: {
          serverLabel,
          collectionId
        }
      }
    ];

    /**
     * The following test asserts that the right actions AND payload are returned from the redux ASYNC action creator.
     **/
    return store.dispatch(stopRecurring('Hail a TAXII','12345')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    })
  });
})
