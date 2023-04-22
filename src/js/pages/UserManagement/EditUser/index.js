import React from 'react';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import Page from '../../../components/Page';
import Header from './Header';
import EditUserForm from './EditUserForm';
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  container: {
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 64,
      paddingRight: 64
    }
  }
}));

function EditUser(props) {
  const classes = useStyles();

  const location = useLocation();
  let title="Add User";
  if (location.props && location.props.edituser) {
    title="Update User";
  }

  return (
    <Page
      className={classes.root}
      title={title}
    >
      <Container
        maxWidth={false}
        className={classes.container}
      >
        <Header />
        <Grid
          container
          spacing={3}
        >
          <Grid item>
            <EditUserForm/>
          </Grid>

        </Grid>
      </Container>
    </Page>
  );
}

export default EditUser
