import React, {
  useEffect,
  useState
} from 'react';
import './Upload.css';
import { useSnackbar } from 'notistack';
import AppConfig from '../../config/appConfig';
import { uploadFiles, validateFiles } from "../../redux/actions/collections";
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  Collapse,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  Table,
  TableBody,
  TableCell,
  TableRow
} from '@material-ui/core';
import {
  AlertTriangle as Alert,
  Check,
  Eye,
  Trash2 as Trash
} from 'react-feather';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'

function Upload({className, server, collection, ...rest}) {
  console.log('[ ] Upload render ...');
  const [fileList, setFileList] = useState({});
  const [showCollapse, setShowCollapse] = useState("");
  const [showModal, setShowModal] = useState(0);
  const validations = useSelector(state => state.collections.validations);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  useEffect(() => {
    if (collection.taxiiVersion.match('TAXII1')) {
      if (Object.keys(fileList).length>0) {
        dispatch(validateFiles(server, collection.id, fileList));
      }
    }
  },[fileList,server,collection,dispatch]);

  const canUpload = () => {
    if (collection.taxiiVersion.match('TAXII1')) {
      return collection.collectionObject.available;
    } else {
      return collection.collectionObject.canWrite;
    }
  }

  const checkMimeType = (event) => {
    const file = event.target.files[0];
    const allowedMimeTypes = AppConfig.allowedMimeTypes;
    if (allowedMimeTypes.every(type => file.type !== type)) {
      event.target.value = null; // discard selected file
      enqueueSnackbar('Selected file is not a supported MIME type.', {variant: 'error'});
      return false;
    }
    return true;
  };

  const checkFileSize = (event) => {
    const file = event.target.files[0];
    const maxSize = AppConfig.maxFileUploadSize;
    // If maxSize is not defined or is set to 0, don't restrict file size
    if (!(maxSize===undefined || maxSize===0)) {
      if (file.size > maxSize) {
        event.target.value = null; // discard selected file
        enqueueSnackbar(file.name + 'is too large for upload.', {variant: 'error'});
        return false;
      }
    }
    return true;
  };

  const onChangeHandler = async (event) => {
    if (checkMimeType(event) && checkFileSize(event)) {
      const filename = event.target.files[0].name;
      const size = event.target.files[0].size;
      const uploadedFile = await readFileAsync(event.target.files[0]);
      const itemNum = Object.keys(fileList).length>0 ? (Math.max(...Object.keys(fileList))+1).toString() : 1;
      setFileList({...fileList,
        [itemNum]:{
          "content":uploadedFile,
          "filename":filename,
          "number":itemNum,
          "size":size
        }
      });
    }
  };

  const onUploadHandler = () => {
    if (Object.keys(fileList).length === 0) {
      console.log('No files chosen');
      enqueueSnackbar('You must choose a file to upload.', {variant: 'error'});
    } else {
      sendFile();
    }
  };

  const readFileAsync = (file) => {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = reject;

      reader.readAsText(file);
    })
  }

  const sendFile = async () => {
    try {
      await dispatch(uploadFiles(server, collection.id, fileList));
      enqueueSnackbar('Successfully published '+Object.keys(fileList).length+' bundle(s)',{variant: 'success'});
      setFileList({});
    } catch (error) {
      console.log('[x] Error uploading: ', error);
      if (error.response.status === 400) {
        enqueueSnackbar(<span>The server rejected your file.  Server error message was:<br/>{error.response.data.error}</span>, {variant: 'error'});
      } else if (error.response.status === 500) {
        // Try to get taxii error message titles to show up in
        // the error message
        let errorMessage = ""
        if ('message' in error.response.data) {
          try {
            let errorMessageJson = JSON.parse(error.response.data.message);
            if ('title' in errorMessageJson) {
                // The error message is json and has the title field,
                // lets use this to add more detail to the displayed error message
                errorMessage = errorMessageJson['title'];
            }
          } catch (err) {
            // If it isn't json, lets display the whole set
            // of data as our error message detail
            errorMessage = error.response.data.message;
          }
        }
        enqueueSnackbar('There was a problem submitting files to the server (' + errorMessage + '). Please contact the Help Desk.', {variant: 'error'});
      } else {
        enqueueSnackbar('There was a problem submitting files to the server. Please contact the Help Desk.', {variant: 'error'});
      }
    }
  }

  const handleClose = () => {
    setShowModal(0);
  }

  const safeParse = (json) => {
    try {
      return JSON.stringify(
        JSON.parse(json||'{}'),
        (k, v) => {
          if (v !== null) return v;
        },
        2
      )
    } catch (err) {
      return err.toString()
    }
  }

  const viewContentModal = () => {
    const content = typeof fileList[showModal]!=='undefined' ? fileList[showModal].content : '';
    const filename = typeof fileList[showModal]!=='undefined' ? fileList[showModal].filename : '';
    return (
      <Dialog
        fullWidth={true}
        maxWidth={'xl'}
        open={showModal!==0}
        onClose={handleClose}
      > 
        <DialogTitle>
          {filename}
        </DialogTitle>
        <DialogContent>
          {collection.taxiiVersion === 'TAXII21' ? (
            <SyntaxHighlighter wrapLines wrapLongLines language="json" style={docco}>
              {safeParse(content)}
            </SyntaxHighlighter>
          ) : (
            <SyntaxHighlighter wrapLines wrapLongLines language="xml" style={docco}>
              {content}
            </SyntaxHighlighter>
          )}
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  const isValid = (number) => {
    if (collection.taxiiVersion.match('TAXII1')) {
      if (validations && validations[number] && validations[number].length>0) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  const renderValidationIcon = (number) => {
    if (collection.taxiiVersion.match('TAXII1')) {
      return isValid(number)?<Check color="green"/>:<Alert color="red"/>;
    } else {
      return null;
    }
  }

  const toggleCollapse = (number) => {
    if (showCollapse === number) {
      setShowCollapse('');
    } else {
      setShowCollapse(number);
    }
  }

  const handleOpen = (number) => {
    setShowModal(number);
  }

  const deleteFile = (number) => {
    let newList = JSON.parse(JSON.stringify(fileList));
    delete newList[number];
    setFileList(newList);
  }

  const allFilesValid = () => {
    if (collection.taxiiVersion.match('TAXII1')) {
      let count=0;
      if (validations) {
        Object.values(validations).forEach(result => {
          if (result.length>0) {
            count++;
          }
        })
        return count===0;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  return (
    <>
      {canUpload() ? null : <Box p={4}>
        <Card style={{textAlign: "center"}}>
          <br/>
          <Alert style={{position: "relative",top: "7px"}} color="yellow"/> The server has indicated that this collection cannot be written to.<br/>
          <br/>
        </Card>
      </Box>}
      <Box p={4}>
        <Card>
          <Box p={4}>
            <div style={{border: "1px solid #282c34"}}>
              <div align={"left"}>
                <div className="files">
                  <input
                    id="upload"
                    disabled={!canUpload()}
                    type="file"
                    accept={AppConfig.allowedMimeTypes}
                    onChange={onChangeHandler}
                    className="MuiInputBase-root MuiInput-root MuiInput-underline"
                  />
                </div>
                <div style={{textAlign: "center"}}>
                  <Box mt={2}>
                    <Button
                      color="secondary"
                      variant="contained"
                      disabled={!canUpload() || !allFilesValid()} onClick={() => onUploadHandler()}
                    >
                      Publish
                    </Button>
                  </Box>
                </div>
              </div>
            </div>
          </Box>
        </Card>

        {Object.keys(fileList).length > 0 ? (
          <Card>
            <Container className="list-of-files">
              <Table>
                <TableBody>
              {Object.values(fileList).map((file) => (
                <Fade key={file.number} in={file !== undefined}>
                  <TableRow>
                    <TableCell style={{cursor:isValid(file.number)?'default':'pointer'}} onClick={() => toggleCollapse(file.number)} xl="9">
                      <h3 style={{color:isValid(file.number)?'#62bd6b':'red'}}>{file.filename} {file.size / 1000} KB</h3>
                      {!isValid(file.number) ? (
                        <Collapse in={showCollapse === file.number}>
                          {!isValid(file.number) ? (
                            <div className="validation-failures">
                              <h2>Validation feedback:</h2>
                              <ul>
                                {Object.values(validations[file.number]).map(value => <li key={`${file.number}-result`}>{value}</li>)}
                              </ul>
                            </div>
                          ) : null}
                        </Collapse>
                      ) : null}
                    </TableCell>
                    <TableCell onClick={() => toggleCollapse(file.number)} style={{cursor:isValid(file.number)?'default':'pointer'}}>
                      {renderValidationIcon(file.number)}
                    </TableCell>
                    <TableCell className="text-right list-button" xl="1">
                      <Eye style={{cursor: 'pointer'}} onClick={() => handleOpen(file.number)}/>
                    </TableCell>
                    <TableCell className="text-right list-button" xl="1">
                      <Trash style={{cursor: 'pointer'}} onClick={() => deleteFile(file.number)}/>
                    </TableCell>
                  </TableRow>
                </Fade>
              ))}
                </TableBody>
              </Table>
            </Container>
          </Card>
        ) : null}
        {viewContentModal()}
      </Box>
    </>
  );
}

Upload.propTypes = {
  className: PropTypes.string,
  server: PropTypes.string,
  collection: PropTypes.object
};

export default Upload
