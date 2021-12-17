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

function SummaryCard({ className, title, value, avatar, ...rest }) {
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
                    {title}
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
                        {value}
                    </Typography>
                </Box>
            </Box>
            <Avatar className={classes.avatar}>
                <avatar.icon/>
            </Avatar>
        </Card>
    );
}

SummaryCard.propTypes = {
    className: PropTypes.string,
    avatar: PropTypes.object
};

export default SummaryCard;
