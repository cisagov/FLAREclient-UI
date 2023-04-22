import React from 'react';
import {
  Container,
  makeStyles
} from '@material-ui/core';
import Page from '../../../components/Page';
import Header from './Header';
import EditServerForm from './EditServerForm';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: 100
  }
}));

function EditServer(props) {
  const classes = useStyles();
  const serverLabel = props.match.params.serverLabel;
  const servers = useSelector(state => state.servers.servers);
  const server = servers.find(e => e.label === serverLabel);

  return (
    <Page
      className={classes.root}
    >
      <Container maxWidth="lg">
        <Header server={server}/>
        <EditServerForm server={server}/>
      </Container>
    </Page>
  );
}

export default EditServer;
