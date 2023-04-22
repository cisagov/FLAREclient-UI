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
import AccountIcon from '@material-ui/icons/AccountCircle';

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

function TotalUsers({ className, users, ...rest }) {
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
                    Users
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
                        {users?users.length:'N/A'}
                    </Typography>
                </Box>
            </Box>
            <Avatar className={classes.avatar}>
                <AccountIcon />
            </Avatar>
        </Card>
    );
}

TotalUsers.propTypes = {
    className: PropTypes.string,
    users: PropTypes.array
};

export default TotalUsers;
