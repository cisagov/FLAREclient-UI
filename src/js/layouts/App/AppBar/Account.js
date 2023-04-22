import React, {
  useRef,
  useState
} from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import {
  Box,
  ButtonBase,
  Menu,
  MenuItem,
  makeStyles
} from '@material-ui/core';
import {AccountCircle} from '@material-ui/icons';
import {logout} from '../../../redux/actions/account';

const useStyles = makeStyles((theme) => ({
  avatar: {
    height: 32,
    width: 32,
    marginRight: theme.spacing(1)
  },
  popover: {
    width: 200
  }
}));

function Account() {
  const classes = useStyles();
  const history = useHistory();
  const ref = useRef(null);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [isOpen, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      handleClose();
      await dispatch(logout());
      history.push('/');
    } catch (error) {
      enqueueSnackbar('Unable to logout', {
        variant: 'error'
      });
    }
  };

  return (
    <>
      <Box
        id='accountmenu'
        display="flex"
        alignItems="center"
        component={ButtonBase}
        onClick={handleOpen}
        ref={ref}
      >
        <AccountCircle/>
      </Box>
      <Menu
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        keepMounted
        PaperProps={{ className: classes.popover }}
        getContentAnchorEl={null}
        anchorEl={ref.current}
        open={isOpen}
      >
        {/*<MenuItem
          id='accountbutton'
          component={RouterLink}
          to="/app/account"
        >
          Account
        </MenuItem>*/}
        <MenuItem id="logoutbutton" onClick={handleLogout}>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}

export default Account;
