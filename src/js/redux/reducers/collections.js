import produce from 'immer';
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
} from '../actions/collections';

export const initialState = {
  collections: {},
  contents: {},
  activities: {},
  activitiesCount: 0,
  manifest: {},
  content: null,
  validations: null
};

const collectionsReducer = (state = initialState, action) => {
  switch (action.type) {    
    case FETCH_SERVER_COLLECTIONS: {
      const { serverLabel, collections } = action.payload;
      const collectionsById = collections.byId ? collections.byId : {};

      return produce(state, (draft) => {
        draft.collections[serverLabel] = Object.values(collectionsById);
      });
    }
        
    case FETCH_CONTENTS: {
      const { collectionId, contents } = action.payload;

      return produce(state, (draft) => {
        draft.contents[collectionId] = contents;
      });
    }

    case FETCH_ACTIVITIES: {
      const { collectionId, activities } = action.payload;

      return produce(state, (draft) => {
        draft.activities[collectionId] = activities.data;
        draft.activitiesCount = parseInt(activities.headers['x-total-count']);
      });
    }

    case FETCH_CONTENT_DETAIL: {
      const { content } = action.payload;

      return produce(state, (draft) => {
        draft.content = content;
      });
    }

    case FETCH_MANIFEST: {
      const { collectionId, manifest, clear } = action.payload;

      let objects = [];
      const parsed = JSON.parse(manifest[collectionId]);
      if (parsed.objects) {
        objects = parsed.objects;
      }

      return produce(state, (draft) => {
        if (clear || !draft.manifest[collectionId]) {
          draft.manifest[collectionId] = [];
        }
        draft.manifest[collectionId] = draft.manifest[collectionId].concat(objects);
      });
    }

    case CLEAR_SERVER_COLLECTIONS: {
      const { serverLabel } = action.payload;

      return produce(state, (draft) => {
        delete draft.collections[serverLabel];
      });
    }

    case CLEAR_COLLECTIONS: {
      state = initialState;
      return state;
    }

    case GET_RECURRING: {
      const { serverLabel, collectionId, contents } = action.payload;

      return produce(state, (draft) => {
        // Find the index of the collection in the current state
        const index = state.collections[serverLabel].findIndex(col => col.id === collectionId);
        draft.collections[serverLabel][index].currentlyRecurring = Object.keys(contents).length>0 ? true : false;
      });
    }

    case STOP_RECURRING: {
      const { serverLabel, collectionId } = action.payload;

      return produce(state, (draft) => {
        // Find the index of the collection in the current state
        const index = state.collections[serverLabel].findIndex(col => col.id === collectionId);
        draft.collections[serverLabel][index].currentlyRecurring = false;
      });
    }

    case VALIDATE_FILE: {
      const { validations } = action.payload;

      return produce(state, (draft) => {
        draft.validations = validations;
      });
    }

    // Upload and Request download doesn't change state at all...
    case UPLOAD_FILE:
    case REQUEST_DOWNLOAD: {
      return state;
    }

    default: {
      return state;
    }
  }
};

export default collectionsReducer;
