import React, { useState, useRef } from 'react';
import { capitalCase } from 'change-case';
import {
  Box,
  Button,
  IconButton,
  Popover,
  SvgIcon,
  TextField,
  Tooltip,
  Typography,
  makeStyles
} from '@material-ui/core';
import { Settings as SettingsIcon } from 'react-feather';

const useStyles = makeStyles((theme) => ({
  badge: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginTop: 10,
    marginRight: 5
  },
  popover: {
    width: 320,
    padding: theme.spacing(2)
  }
}));

function Settings() {
  const classes = useStyles();
  const ref = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState('Dark');

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (value) => {
    console.log(activeTheme)
    setActiveTheme(value);
  };

  const handleSave = () => {
    //saveSettings(values);
    setOpen(false);
  };

  console.log(activeTheme)


  return (
    <>
      <Tooltip title="Settings">
          <IconButton
            color="inherit"
            onClick={handleOpen}
            ref={ref}
          >
            <SvgIcon fontSize="small">
              <SettingsIcon />
            </SvgIcon>
          </IconButton>
      </Tooltip>
      <Popover
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        classes={{ paper: classes.popover }}
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
      >
        <Typography
          variant="h4"
          color="textPrimary"
        >
          Settings
        </Typography>

        <Box mt={2}>
          <TextField
            fullWidth
            label="Theme"
            name="theme"
            onChange={(event) => handleChange(event.target.value)}
            select
            SelectProps={{ native: true }}
            value={activeTheme}
            variant="outlined"
          >
            {['dark', 'light'].map((theme) => (
              <option
                key={theme}
                value={theme}
              >
                {capitalCase(theme)}
              </option>
            ))}
          </TextField>
        </Box>
        <Box mt={2}>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={handleSave}
          >
            Save Settings
          </Button>
        </Box>
      </Popover>
    </>
  );
}

export default Settings;
