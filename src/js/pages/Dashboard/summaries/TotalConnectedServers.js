import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
    Avatar,
    Box,
    Card,
    Typography,
    makeStyles
} from '@material-ui/core';
import ComputerIcon from '@material-ui/icons/Computer';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(3),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    label: {
        marginLeft: theme.spacing(1)
    },
    avatar: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
        height: 48,
        width: 48
    }
}));

function TotalConnectedServers({ className, servers, ...rest }) {
    const classes = useStyles();

    return (
        <Card
            className={clsx(classes.root, className)}
            {...rest}
        >
            <Box flexGrow={1}>
                <Typography
                    component="h3"
                    gutterBottom
                    variant="overline"
                    color="textSecondary"
                >
                    Connected Servers
                </Typography>
                <Box
                    display="flex"
                    alignItems="center"
                    flexWrap="wrap"
                >
                    <Typography
                        variant="h3"
                        color="textPrimary"
                    >
                        {servers?servers.length:'N/A'}
                    </Typography>
                </Box>
            </Box>
            <Avatar className={classes.avatar}>
                <ComputerIcon />
            </Avatar>
        </Card>
    );
}

TotalConnectedServers.propTypes = {
    className: PropTypes.string,
    servers: PropTypes.array
};

export default TotalConnectedServers;
