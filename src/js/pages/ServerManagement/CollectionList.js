import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import DeleteIcon from "@material-ui/icons/Delete";
import { deleteCollection } from '../../redux/actions/collections';
import { useDispatch } from 'react-redux';
import { deleteServer, refreshServer } from '../../redux/actions/servers';
import { getServerCollections } from '../../redux/actions/collections';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Table,
  Slide,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip
} from '@material-ui/core';

import {
  Database as CollectionContentIcon,
  DownloadCloud as DownloadIcon,
  Info as ActivitiesIcon,
  List as ManifestIcon,
  Trash as TrashIcon,
  UploadCloud as UploadIcon
} from 'react-feather';

function CollectionList({apiRoot, collections, server, ...rest}) {

  const [selectedServer, setSelectedServer] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [open, setOpen] = useState(false);
  const [refreshActive, setRefreshActive] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const canDownload = (collection) => {
    if (collection.taxiiVersion.match('TAXII1')) {
      return collection.collectionObject.available;
    } else {
      return collection.collectionObject.canRead;
    }
  }
  const handleClose = () => {
    setOpen(false);
    setSelectedCollection(null);
    window.location.reload(false);
  }

  const performDeleteAndClose = () => {
    dispatch(deleteCollection(selectedServer, selectedCollection.id));
    handleRefresh(server.label);
    setOpen(false);
    setSelectedCollection(null);
  }

  const handleRefresh = async (label) => {
    setRefreshActive(true);
    setSelectedServer(label);
    enqueueSnackbar('Refresh of '+label+' requested.');
    await dispatch(refreshServer(label));
    await dispatch(getServerCollections(label));
    setRefreshActive(false);
    setSelectedServer(null);
    window.location.reload(false);
  }


  const canUpload = (collection) => {
    if (collection.taxiiVersion.match('TAXII1')) {
      return collection.collectionObject.available;
    } else {
      return collection.collectionObject.canWrite;
    }
  }
  const handleClickOpen = (server, collection) => {
    setSelectedServer(server);
    setSelectedCollection(collection);
    setOpen(true);
  };
  
  
  const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
  
  const dispatch = useDispatch();

  return (
    <Table id="collectionlist" size="small">
      <TableHead>
        <TableRow>
          <TableCell>
            Content Volume
          </TableCell>
          <TableCell>
            Collection Name
          </TableCell>
          <TableCell>
            Collection Description
          </TableCell>
          <TableCell>
            Actions
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {collections.map((collection) => {
          if (collection.apiRootRef===apiRoot) {
            return (
              <TableRow
                hover
                key={collection.id}>
                <TableCell>
                  {collection.contentVolume}
                </TableCell>
                <TableCell>
                  {collection.displayName}
                </TableCell>
                <TableCell>
                  {collection.collectionObject.description?collection.collectionObject.description:'--No description provided--'}
                </TableCell>
                <TableCell>
                  <Tooltip
                    enterDelay={300}
                    title="Content">
                    <IconButton
                      id="contentbutton"
                      component={RouterLink}
                      to={`/app/servers/${server.label}/collections/${collection.id}/content`}>
                      <CollectionContentIcon/>
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    enterDelay={300}
                    title={canUpload(collection)?"Upload":"Upload Disabled"}>
                    <span>
                      <IconButton
                        id="uploadbutton"
                        component={RouterLink}
                        disabled={!canUpload(collection)}
                        to={`/app/servers/${server.label}/collections/${collection.id}/upload`}>
                        <UploadIcon/>
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip
                    enterDelay={300}
                    title={canDownload(collection)?"Download":"Download Disabled"}>
                    <span>
                      <IconButton
                        id="downloadbutton"
                        component={RouterLink}
                        disabled={!canDownload(collection)}
                        to={`/app/servers/${server.label}/collections/${collection.id}/download`}>
                        <DownloadIcon/>
                      </IconButton>
                    </span>
                  </Tooltip>
                  {(server.version!=="TAXII11")?<Tooltip
                    enterDelay={300}
                    title={canDownload(collection)?"Manifest":"Manifest Disabled"}>
                    <span>
                      <IconButton
                        id="manifestbutton"
                        component={RouterLink}
                        disabled={!canDownload(collection)}
                        to={`/app/servers/${server.label}/collections/${collection.id}/manifest`}>
                        <ManifestIcon/>
                      </IconButton>
                    </span>
                  </Tooltip>:''}
                  <Tooltip
                    enterDelay={300}
                    title="Activities">
                    <IconButton
                      id="activitiesbutton"
                      component={RouterLink}
                      to={`/app/servers/${server.label}/collections/${collection.id}/activities`}>
                      <ActivitiesIcon/>
                    </IconButton>
                  </Tooltip>
                <IconButton
                  onClick={() => handleClickOpen(server.label, collection)}>
                  <Tooltip
                    enterDelay={300}
                    title="Purge"
                  >
                  <DeleteIcon/>
                  </Tooltip>
                </IconButton>
                </TableCell>
              </TableRow>
            )
        } else {
          return null;
        }
      })}
      </TableBody>

             <Dialog open={open}  TransitionComponent={Transition} keepMounted onClose={handleClose} aria-labelledby="alert-dialog-slide-title" aria-describedby="alert-dialog-slide-description" >
              <DialogTitle id="alert-dialog-slide-title">Purge this Collection</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  You are about to purge the following Collection...<br/><br/>
                  {selectedCollection ? selectedCollection.displayName : ''}<br/>
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
    </Table>
  );
}

/**
 * @property {object} user - The logged in user
 * @type {{user}}
 */
CollectionList.propTypes = {
  apiRoot: PropTypes.string,
  collections: PropTypes.array,
  server: PropTypes.object.isRequired
};

export default CollectionList;
