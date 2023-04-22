import React from 'react';
import { useHistory } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
    Breadcrumbs,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Link,
    Slide,
//    SvgIcon,
    Typography,
    makeStyles
} from '@material-ui/core';

import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';

import EditIcon from '@material-ui/icons/Edit';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
//import DownloadIcon from "@material-ui/icons/CloudDownload";
//import ShareIcon from '@material-ui/icons/Share';
import DeleteIcon from '@material-ui/icons/Delete';

import { deleteServer } from '../../../redux/actions/servers';
import { useDispatch } from 'react-redux';


const useStyles = makeStyles((theme) => ({
    root: {},
    action: {
        marginBottom: theme.spacing(1),
        '& + &': {
            marginLeft: theme.spacing(1)
        }
    },
    speedDialButton:{
        backgroundColor: theme.palette.secondary.main,
    },
    speedDialIcon:{
        color: theme.palette.secondary.contrastText,
    },
    actionIcon: {
        marginRight: theme.spacing(1)
    }
}));

const actions = [
    //{ icon: <DownloadIcon />, name: 'Export Server Data' },
    { icon: <EditIcon />, name: 'Edit Server' },
    { icon: <DeleteIcon />, name: 'Delete Server' },
    //{ icon: <ShareIcon />, name: 'Share Server Data' },
];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Header({ className, serverLabel, ...rest }) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const history = useHistory();
    const dispatch = useDispatch();

    const handleDialogOpen = (server) => {
      setDialogOpen(true);
    };

    const handleDialogClose = () => {
      setDialogOpen(false);
    };

    const performDelete = () => {
      dispatch(deleteServer(serverLabel));
      history.push("/app/management/servers")
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const performAction = (action) => {
      switch (action) {
        case 'Export Server Data': {
          console.log(action);
          break;
        }
        case 'Edit Server': {
          history.push("/app/management/servers/"+serverLabel+"/edit")
          break;
        }
        case 'Delete Server': {
          handleDialogOpen();
          break;
        }
        case 'Share Server Data': {
          console.log(action);
          break;
        }
        default: {
          console.log("Should never get here");
        }
      }
    }

    return (
        <Grid
            container
            spacing={3}
            justify="space-between"
            className={clsx(classes.root, className)}
            {...rest}
        >
            <Grid item>
                <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small" />}
                    aria-label="breadcrumb"
                >
                    <Link
                        variant="body1"
                        color="inherit"
                        to="/app"
                        component={RouterLink}
                    >
                        App
                    </Link>
                    <Link
                        variant="body1"
                        color="inherit"
                        to="/app/management"
                        component={RouterLink}
                    >
                        Management
                    </Link>
                    <Link
                        variant="body1"
                        color="inherit"
                        to="/app/management/servers"
                        component={RouterLink}
                    >
                        Servers
                    </Link>
                    <Typography
                        variant="body1"
                        color="textPrimary"
                    >
                        {serverLabel}
                    </Typography>
                </Breadcrumbs>
                <Typography
                    variant="h3"
                    color="textPrimary"
                >
                    {serverLabel} Details
                </Typography>
            </Grid>
            <Grid item>
                <SpeedDial
                    ariaLabel="Server Actions"
                    FabProps={{className:classes.speedDialButton}}
                    className={classes.action}
                    icon={<SpeedDialIcon className={classes.speedDialIcon} />}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    open={open}
                    direction={"left"}
                >
                    {actions.map((action) => (
                        <SpeedDialAction
                            key={action.name}
                            icon={action.icon}
                            tooltipTitle={action.name}
                            tooltipPlacement={"bottom"}
                            onClick={() => performAction(action.name)}
                        />
                    ))}
                </SpeedDial>
            </Grid>
            <Dialog
              open={dialogOpen}
              TransitionComponent={Transition}
              keepMounted
              onClose={handleDialogClose}
              aria-labelledby="alert-dialog-slide-title"
              aria-describedby="alert-dialog-slide-description"
            > 
              <DialogTitle id="alert-dialog-slide-title">Delete this server</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  You are about to delete the following server...<br/><br/>
                  {serverLabel}<br/>
                  <br/>
                  Do you wish to continue?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button id="performDelete" onClick={performDelete} color="primary">
                  Delete
                </Button>
                <Button id="cancelDelete" onClick={handleDialogClose} color="primary">
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>
        </Grid>
    );
}

Header.propTypes = {
    className: PropTypes.string,
    serverLabel: PropTypes.string.isRequired
};

export default Header;
