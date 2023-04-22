import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
    Breadcrumbs,
    //Button,
    Grid,
    Link,
    //SvgIcon,
    Typography,
    makeStyles
} from '@material-ui/core';
//import DownloadIcon from '@material-ui/icons/CloudDownload';
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
const useStyles = makeStyles((theme) => ({
    root: {},
    action: {
        marginBottom: theme.spacing(1),
        '& + &': {
            marginLeft: theme.spacing(1)
        }
    },
    actionIcon: {
        marginRight: theme.spacing(1)
    }
}));

function Header({ className, ...rest }) {
    const classes = useStyles();

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
                        to="/app/reports/dashboard"
                        component={RouterLink}
                    >
                        Reports
                    </Link>
                    <Typography
                        variant="body1"
                        color="textPrimary"
                    >
                        Events
                    </Typography>
                </Breadcrumbs>
                <Typography
                    variant="h3"
                    color="textPrimary"
                >   
                    Events
                </Typography>
            </Grid>
{/*            <Grid item>
                <Button
                    color="secondary"
                    variant="contained"
                    className={classes.action}
                    component={RouterLink}
                    to=""
                >
                    <SvgIcon
                        fontSize="small"
                        className={classes.actionIcon}
                    >
                        <DownloadIcon />
                    </SvgIcon>
                    Export
                </Button>
            </Grid> */}
        </Grid>
    );
}

Header.propTypes = {
    className: PropTypes.string
};

export default Header;
