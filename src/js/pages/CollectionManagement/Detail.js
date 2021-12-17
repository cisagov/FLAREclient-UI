import React, {
  useCallback,
  useEffect,
  useState
} from 'react';
import {
  Box,
  Button,
  Card,
  Typography
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { getContentDetail } from "../../redux/actions/collections";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import {
  AlertTriangle,
  ArrowLeft,
  Check
} from 'react-feather';
import { Link } from 'react-router-dom';

function Detail(props) {
  const serverLabel = props.match.params.serverLabel;
  const collectionId = props.match.params.collectionId;
  const contentId = props.match.params.contentId;

  const dispatch = useDispatch();
  const [retrievedData,setRetrievedData]=useState(false);

  const content = useSelector(state => state.collections.content);

  const fetchContent = useCallback(() => {
    dispatch(getContentDetail(serverLabel,collectionId,contentId));
  }, [dispatch,serverLabel,collectionId,contentId]);

  useEffect(() => {
    if(!retrievedData){
      fetchContent();
      setRetrievedData(true);
    }
  }, [retrievedData,fetchContent]);

  if(!content){
    return null
  }

  return (
    <Box p={4} component="div" whiteSpace="normal">
      <Button variant="outlined" component={Link} onClick={() => sessionStorage.setItem('returnFromDetail',1)} to={`/app/servers/${serverLabel}/collections/${collectionId}/content`} color="primary">
        <ArrowLeft/> Back
      </Button><br/><br/>
      <Typography color='textPrimary' variant='h2'>Details for {content.contentId}</Typography>
      {content.validationResult ? (
        content.validationResult.status === 'VALID' ? (
          <Typography style={{color:'green'}} variant='h4'>
            <Check/> Valid
          </Typography>
        ) : content.validationResult.errors ? (
          <div>
            <Typography style={{color:'yellow'}} variant='h4'>
              <AlertTriangle /> Validation results
            </Typography>
            <Typography color='textPrimary' variant='h5'>
              {content.validationResult.errors}
            </Typography>
          </div>
        ) : null
      ) : null}
      <Typography color='textPrimary' variant='h2'>Content:</Typography>
      <Box p={4}>
        <Card>
          {(typeof content.contentObject === 'object' && content.contentObject !== null)?<SyntaxHighlighter
            language="json"
            wrapLines
            wrapLongLines
            style={docco}>
            {JSON.stringify(
              content.contentObject,
              (k, v) => {
                if (v !== null) return v;
              },
              2
            )}
          </SyntaxHighlighter>:<SyntaxHighlighter
            language="xml"
            wrapLines
            wrapLongLines
            style={docco}>
            {content.contentObject+"\n"}
          </SyntaxHighlighter>}
        </Card>
      </Box>
    </Box>
  )
}

export default Detail
