import React, {
  useState
} from 'react';
import * as _ from 'lodash';
import {Link as RouterLink} from 'react-router-dom';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardActions,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  makeStyles
} from '@material-ui/core';
import { deleteUser } from '../../redux/actions/users'
import { useDispatch } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  root: {}
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function UserList({className, users, currentUser, ...rest}) {
  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [open, setOpen] = React.useState(false);

  const dispatch = useDispatch();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const performDeleteAndClose = () => {
    dispatch(deleteUser(selectedUser));
    setOpen(false);
    setSelectedUser(null);
  }

  const sortedUsers = sortData(users);

  function sortData() {
    if (orderBy !== '') {
      // Must make a deep copy of users and operate on that in order for sorting to
      // work properly
      let usersCopy=JSON.parse(JSON.stringify(users));
      if (orderBy === 'roles') {
        (order === 'desc')
          ? usersCopy.sort((a,b) => (displayRoles(b['authorities']) < displayRoles(a['authorities']) ? -1 : 1))
          : usersCopy.sort((a,b) => (displayRoles(a['authorities']) < displayRoles(b['authorities']) ? -1 : 1))
      } else {
        (order === 'desc')
          ? usersCopy.sort((a, b) => (b[orderBy].toUpperCase() < a[orderBy].toUpperCase() ? -1 : 1))
          : usersCopy.sort((a, b) => (a[orderBy].toUpperCase() < b[orderBy].toUpperCase() ? -1 : 1))
      }
      return usersCopy
    } else {
      return users;
    }
  }

  function updateSort(column) {
    if (column === orderBy)
    {
      setOrder(order==='desc'?'asc':'desc')
    } else {
      setOrder('asc')
      setOrderBy(column)
    }
  }

  function selectUser(login) {
    if (selectedUser===login) {
      setSelectedUser(null)
    } else {
      setSelectedUser(login)
    }
  }

  function displayRoles(roles) {
    let value='';
    if (roles.includes('ROLE_ADMIN')) {
      value+='Admin';
    }
    if (roles.includes('ROLE_USER')) {
      if (value!=='') {
        value+=', ';
      }
      value+='User';
    }
    return value;
  }

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <PerfectScrollbar>
        <Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell/>
                <TableCell>
                  <Tooltip
                    enterDelay={300}
                    title="Sort Login"
                  >
                    <TableSortLabel
                      active={orderBy==='login'}
                      direction={order}
                      onClick={() => updateSort('login')}
                    >
                      Login
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip
                    enterDelay={300}
                    title="Sort First Name"
                  >
                    <TableSortLabel
                      active={orderBy==='firstName'}
                      direction={order}
                      onClick={() => updateSort('firstName')}
                    >
                      First Name
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip
                    enterDelay={300}
                    title="Sort Last Name"
                  >
                    <TableSortLabel
                      active={orderBy==='lastName'}
                      direction={order}
                      onClick={() => updateSort('lastName')}
                    >
                      Last Name
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip
                    enterDelay={300}
                    title="Sort Email Address"
                  >
                    <TableSortLabel
                      active={orderBy==='email'}
                      direction={order}
                      onClick={() => updateSort('email')}
                    >
                      Email Address
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip
                    enterDelay={300}
                    title="Sort Role(s)"
                  >
                    <TableSortLabel
                      active={orderBy==='roles'}
                      direction={order}
                      onClick={() => updateSort('roles')}
                    >
                      Role(s)
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedUsers.map((user) => (
                <TableRow
                  hover
                  key={user.login}
                >
                  <TableCell id={"Checkbox"} padding="checkbox">
                    <Checkbox
                      id="selectUser"
                      onClick={() => {selectUser(user.login)}}
                      checked={selectedUser===user.login}
                    />
                  </TableCell>
                  <TableCell id={"login"}>
                    {user.login}
                  </TableCell>
                  <TableCell id={"firstName"}>
                    {user.firstName}
                  </TableCell>
                  <TableCell id={"lastName"}>
                    {user.lastName}
                  </TableCell>
                  <TableCell id={"email"}>
                    {user.email}
                  </TableCell>
                  <TableCell id={"email"}>
                    {displayRoles(user.authorities)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <Divider/>
      <CardActions>
        <Button
          id="AddUserButton"
          color="primary"
          className="followbutton"
          variant="contained"
          disabled={selectedUser !== null}
          component={RouterLink}
          to="/app/management/users/add"
        >
          Add
        </Button>
        <Button
          id="EditUserButton"
          color="primary"
          className="followbutton"
          variant="contained"
          disabled={selectedUser === null}
          component={RouterLink}
          to={{
            pathname: "/app/management/users/edit",
            props: {edituser: _.find(users,{login: selectedUser})}
          }}
        >
          Edit
        </Button>
        <Button
          id="DeleteUserButton"
          color="primary"
          className="followbutton"
          variant="contained"
          disabled={selectedUser === null || selectedUser === currentUser.login}
          onClick={handleClickOpen}
        >
          Delete
        </Button>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">Delete this user</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              You are about to delete the following user...<br/><br/>
              {selectedUser}<br/>
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
      </CardActions>
    </Card>
  );
}

UserList.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array,
  currentUser: PropTypes.object
};

UserList.defaultProps = {
  users: [],
  currentUser: {}
};

export default UserList;
