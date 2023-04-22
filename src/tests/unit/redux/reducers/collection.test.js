import collectionsReducer from "../../../../js/redux/reducers/collections";
import {initialState} from "../../../../js/redux/reducers/collections";
import * as collectionSampleData from '../../../../js/api/mock/collection/sampleData';
import {
  FETCH_SERVER_COLLECTIONS,
  FETCH_CONTENTS,
  FETCH_ACTIVITIES,
  FETCH_CONTENT_DETAIL,
  FETCH_MANIFEST,
  CLEAR_COLLECTIONS,
  CLEAR_SERVER_COLLECTIONS,
  UPLOAD_FILE,
  VALIDATE_FILE,
  REQUEST_DOWNLOAD,
  GET_RECURRING,
  STOP_RECURRING
} from '../../../../js/redux/actions/collections';

describe('collections reducer', () => {
  const hailATaxiiCollections = collectionSampleData.HailATAXIICollections;
  const hailATaxiiContents = collectionSampleData.HailATAXIIContents;
  const hailATaxiiActivities = collectionSampleData.HailATAXIIActivities;
  const hailATaxiiContent = collectionSampleData.HailATAXIIContent;
  const hailATaxiiValidate = collectionSampleData.HailATAXIIValidate;
  const hailATaxiiGetRecurring = collectionSampleData.HailATAXIIGetRecurring;
  const flareManifest = collectionSampleData.flareManifest;

  it('should return initial state of reducer', ()=>{
    expect(collectionsReducer(initialState, {})).toEqual(
      {
        activities: {},
        activitiesCount: 0,
        collections: {},
        content: null,
        contents: {},
        manifest: {},
        validations: null
      }
    )
  })

  it('Collections - FETCH_SERVER_COLLECTIONS', () => {
    const serverLabel = "Hail a TAXII";
    const collections = hailATaxiiCollections;
    const collectionsById = Object.values(collections.byId);
    expect(
      collectionsReducer(initialState, {type: FETCH_SERVER_COLLECTIONS, payload: {serverLabel, collections}})
    ).toEqual(
      {
        activities: {},
        activitiesCount: 0,
        collections: {"Hail a TAXII": collectionsById},
        content: null,
        contents: {},
        manifest: {},
        validations: null
      }
    )
  });

  it('Collections - FETCH_CONTENTS', () => {
    const collectionId = "12345";
    const contents = hailATaxiiContents;
    expect(
      collectionsReducer(initialState, {type: FETCH_CONTENTS, payload: {collectionId, contents}})
    ).toEqual(
      {
        activities: {},
        activitiesCount: 0,
        collections: {},
        content: null,
        contents: {"12345":contents},
        manifest: {},
        validations: null
      }
    )
  });

  it('Collections - FETCH_ACTIVITIES', () => {
    const collectionId = "12345";
    const activities = {headers:{'x-total-count': hailATaxiiActivities.length.toString()},data:hailATaxiiActivities};
    expect(
      collectionsReducer(initialState, {type: FETCH_ACTIVITIES, payload: {collectionId, activities}})
    ).toEqual(
      {
        activities: {'12345':hailATaxiiActivities},
        activitiesCount: 20,
        collections: {},
        content: null,
        contents: {},
        manifest: {},
        validations: null
      }
    )
  });

  it('Collections - FETCH_CONTENT_DETAIL', () => {
    const content = hailATaxiiContent;
    expect(
      collectionsReducer(initialState, {type: FETCH_CONTENT_DETAIL, payload: {content}})
    ).toEqual(
      {
        activities: {},
        activitiesCount: 0,
        collections: {},
        content: content,
        contents: {},
        manifest: {},
        validations: null
      }
    )
  });

  it('Collections - FETCH_MANIFEST', () => {
    const collectionId = "12345";
    const manifest = flareManifest;
    const parsed = JSON.parse(flareManifest[collectionId]);
    let objects = []
    if (parsed.objects) {
      objects = parsed.objects;
    }

    let matchManifest = {};
    matchManifest[collectionId] = objects;
    expect(
      collectionsReducer(initialState, {type: FETCH_MANIFEST, payload: {collectionId, manifest}})
    ).toEqual(
      {
        activities: {},
        activitiesCount: 0,
        collections: {},
        content: null,
        contents: {},
        manifest: matchManifest,
        validations: null
      }
    )
  });

  it('Collections - CLEAR_SERVER_COLLECTIONS', () => {
    const serverLabel = "Hail a TAXII";
    const collectionsById = Object.values(hailATaxiiCollections.byId);
    let state = JSON.parse(JSON.stringify(initialState));
    state['collections']['Hail a TAXII']=collectionsById;
    expect(
      collectionsReducer(state, {type: CLEAR_SERVER_COLLECTIONS, payload: {serverLabel}})
    ).toEqual(
      {
        activities: {},
        activitiesCount: 0,
        collections: {},
        content: null,
        contents: {},
        manifest: {},
        validations: null
      }
    )
  });

  it('Collections - CLEAR_COLLECTIONS', () => {
    const collections = hailATaxiiCollections;
    const collectionsById = Object.values(hailATaxiiCollections.byId);
    let state = JSON.parse(JSON.stringify(initialState));
    state['collections']['Hail a TAXII']=collectionsById;
    expect(
      collectionsReducer(state, {type: CLEAR_COLLECTIONS})
    ).toEqual(
      {
        activities: {},
        activitiesCount: 0,
        collections: {},
        content: null,
        contents: {},
        manifest: {},
        validations: null
      }
    )
  });

  it('Collections - UPLOAD_FILE', () => {
    expect(
      collectionsReducer(initialState, {type: UPLOAD_FILE})
    ).toEqual(
      {
        activities: {},
        activitiesCount: 0,
        collections: {},
        content: null,
        contents: {},
        manifest: {},
        validations: null
      }
    )
  });

  it('Collections - VALIDATE_FILE', () => {
    const validations = hailATaxiiValidate;
    expect(
      collectionsReducer(initialState, {type: VALIDATE_FILE, payload: {validations}})
    ).toEqual(
      {
        activities: {},
        activitiesCount: 0,
        collections: {},
        content: null,
        contents: {},
        manifest: {},
        validations: validations
      }
    )
  });

  it('Collections - REQUEST_DOWNLOAD', () => {
    expect(
      collectionsReducer(initialState, {type: REQUEST_DOWNLOAD})
    ).toEqual(
      {
        activities: {},
        activitiesCount: 0,
        collections: {},
        content: null,
        contents: {},
        manifest: {},
        validations: null
      }
    )
  });

  it('Collections - GET_RECURRING', () => {
    const serverLabel = "Hail a TAXII";
    const collectionId = '5f7f6b9ef891316988fa9a4d';
    const contents = collectionSampleData.HailATAXIIGetRecurring;
    let state = JSON.parse(JSON.stringify(initialState));
    state.collections[serverLabel]=Object.values(hailATaxiiCollections.byId);
    let expected = JSON.parse(JSON.stringify(state));
    const index = expected.collections[serverLabel].findIndex(col => col.id === collectionId);
    expected.collections[serverLabel][index].currentlyRecurring = true;

    expect(
      collectionsReducer(state, {type: GET_RECURRING, payload: {serverLabel, collectionId, contents}})
    ).toEqual(expected)
  });

  it('Collections - STOP_RECURRING', () => {
    const serverLabel = "Hail a TAXII";
    const collectionId = '5f7f6b9ef891316988fa9a4d';
    const contents = collectionSampleData.HailATAXIIGetRecurring;
    let state = JSON.parse(JSON.stringify(initialState));
    state.collections[serverLabel]=Object.values(hailATaxiiCollections.byId);
    const index = state.collections[serverLabel].findIndex(col => col.id === collectionId);
    let state2 = JSON.parse(JSON.stringify(state));
    state2.collections[serverLabel][index].currentlyRecurring = true;
    let expected = JSON.parse(JSON.stringify(state2));
    expected.collections[serverLabel][index].currentlyRecurring = false;

    expect(
      collectionsReducer(state2, {type: STOP_RECURRING, payload: {serverLabel, collectionId}})
    ).toEqual(expected)
  });
})
