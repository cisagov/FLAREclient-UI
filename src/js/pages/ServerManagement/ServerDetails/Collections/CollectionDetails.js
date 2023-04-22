import React, {useState} from 'react';

import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
  Box,
  IconButton,
  Tooltip,
  Typography
} from '@material-ui/core';

import {
  Database as CollectionContentIcon,
  DownloadCloud as DownloadIcon,
  Info as ActivitiesIcon,
  List as ManifestIcon,
  UploadCloud as UploadIcon
} from 'react-feather';

function CollectionDetails({apiRoot, collections, server, ...rest}) {
  const [currentRow, setCurrentRow] = useState('');

  const handleEnter = (value) => {
    setCurrentRow(value);
  }

  const handleExit = (value) => {
    setCurrentRow('');
  }

  return (
    <Box>
      {collections.map((collection) => {
        if (collection.apiRootRef===apiRoot) {
          return (
            <div
              key={collection.id}
              onMouseEnter={() => handleEnter(collection.id)}
              onMouseLeave={() => handleExit(collection.id)}>
              <Box
                alignItems="center"
                display="flex"
                mt={3}
                style={{backgroundColor: (currentRow===collection.id)?'#282C34':''}}>
                <Box ml={5} mr={3}>
                  <Typography style={{color: 'black', backgroundColor:"#777777"}} variant="h4">
                    &nbsp;{collection.contentVolume}&nbsp;
                  </Typography>
                </Box>
                <Box>
                  <Typography color="textPrimary" variant="h4">
                    {collection.displayName}
                  </Typography>
                  <Typography color="textPrimary">
                    {collection.collectionObject.description?collection.collectionObject.description:'--No description provided--'}
                  </Typography>
                </Box>
              </Box>
              <Box hidden={currentRow!==collection.id} style={{backgroundColor:'#282C34'}}>
                <center>
                  <IconButton
                    component={RouterLink}
                    to={`/app/servers/${server.label}/collections/${collection.id}/content`}>
                    <Tooltip
                      enterDelay={300}
                      title="Content">
                      <CollectionContentIcon/>
                    </Tooltip>
                  </IconButton>
                  <IconButton
                    component={RouterLink}
                    to={`/app/servers/${server.label}/collections/${collection.id}/upload`}>
                    <Tooltip
                      enterDelay={300}
                      title="Upload">
                      <UploadIcon/>
                    </Tooltip>
                  </IconButton>
                  <IconButton
                    component={RouterLink}
                    to={`/app/servers/${server.label}/collections/${collection.id}/download`}>
                    <Tooltip
                      enterDelay={300}
                      title="Download">
                      <DownloadIcon/>
                    </Tooltip>
                  </IconButton>
                  {(server.version!=="TAXII11")?<IconButton
                    component={RouterLink}
                    to={`/app/servers/${server.label}/collections/${collection.id}/manifest`}>
                    <Tooltip
                      enterDelay={300}
                      title="Manifest">
                      <ManifestIcon/>
                    </Tooltip>
                  </IconButton>:''}
                  <IconButton
                    component={RouterLink}
                    to={`/app/servers/${server.label}/collections/${collection.id}/activities`}>
                    <Tooltip
                      enterDelay={300}
                      title="Activities">
                      <ActivitiesIcon/>
                    </Tooltip>
                  </IconButton>
                </center>
              </Box>
            </div>
          )
        } else {
          return null;
        }
      })}
    </Box>
  );
}

/**
 * @property {object} user - The logged in user
 * @type {{user}}
 */
CollectionDetails.propTypes = {
  apiRoot: PropTypes.string,
  collections: PropTypes.array.isRequired,
  server: PropTypes.object.isRequired
};

export default CollectionDetails;
