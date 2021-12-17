import React, {
  useEffect,
  useCallback
} from 'react';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from '../../components/Page';
import Header from './Header';
import UserList from './UserList';
import { getUsers } from '../../redux/actions/users'
import { useDispatch, useSelector } from 'react-redux';

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

function UserManagementListView() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const users = useSelector(state => state.users.users);
  const currentUser = useSelector(state => state.account.user);

  const fetchUsers = useCallback(() => {
    dispatch(getUsers());
  }, [dispatch]);

  useEffect(() => {
    if(!users){
      fetchUsers();
    }
  });

  if(!users){
    return  null
  }

  return (
    <Page
      className={classes.root}
      title="User Management"
    >
      <Container
        maxWidth={false}
        className={classes.container}
      >
        <Header />
        {users && (
          <Grid
            container
            spacing={3}
          >
            <Grid item>
              <UserList users={users} currentUser={currentUser}/>
            </Grid>
          </Grid>
        )}
      </Container>
    </Page>
  );
}

export default UserManagementListView;
