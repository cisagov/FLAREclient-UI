import React from 'react';
import ApiRootIcon from '@material-ui/icons/AccountTree';
import CollectionsIcon from '@material-ui/icons/Collections'
import DateIcon from '@material-ui/icons/Today';
import PropTypes from 'prop-types';
import SummaryCard from "../../../components/SummaryCard";
import VersionIcon from '@material-ui/icons/Album';
import {convertIsoDate} from "../../../utils/helpers";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
  makeStyles
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  avatar: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    height: 48,
    marginRight: '15px',
    marginTop: '5px',
    width: 48
  }
}));

function Overview({className, collections, server, ...rest}) {
  const classes = useStyles();

  const getApiRootFromURL = (serverURL) => {
    const temp = serverURL.split('/');
    return temp.pop() || temp.pop();
  }

  return (
    <Grid container spacing={3}>
      <Grid item lg={4} sm={6} xs={6}>
        <SummaryCard avatar={{icon: VersionIcon}}
          title={"TAXII Version"}
          value={server.version}/>
      </Grid>
      <Grid item lg={4} sm={6} xs={6}>
        <SummaryCard avatar={{icon: CollectionsIcon}}
          title={"Collections"}
          value={collections[server.label]?collections[server.label].length.toString():'N/A'}/>
      </Grid>
      <Grid item lg={4} sm={12} xs={12}>
        <SummaryCard avatar={{icon: DateIcon}}
          title={"Last Modified"}
          value={convertIsoDate(server.lastUpdated.toString())}/>
      </Grid>
      <Grid item xs={12} md={(server.version!=="TAXII11")?8:12}>
        <Card>
          <CardHeader title={
            <Typography gutterBottom variant="h5" component="h2">
              Server Configuration
            </Typography>
          }/>
          <Divider/>
          <CardContent>
            <Grid container spacing={5}>
              <Grid item xs={12} md={6}>
                <TextField fullWidth
                  id="server-title"
                  inputProps={{disabled: true}}
                  label="Title"
                  value={server.title}
                  variant="outlined"/>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth
                  id="server-label"
                  inputProps={{disabled: true}}
                  label="Label"
                  value={server.label}
                  variant="outlined"/>
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField fullWidth
                  id="discover-url"
                  inputProps={{disabled: true}}
                  label="URL"
                  value={server.url}
                  variant="outlined"/>
              </Grid>
              {(server.version!=='TAXII11')?<Grid item xs={12} md={12}>
                <TextField fullWidth
                  id="server-default-url"
                  inputProps={{disabled: true}}
                  label="Default API Root"
                  value={server.defaultApiRoot}
                  variant="outlined"/>
              </Grid>:''}
              <Grid item xs={12} md={6}>
                <TextField fullWidth
                  id="server-contact"
                  inputProps={{disabled: true}}
                  label="Contact"
                  value={server.contact}
                  variant="outlined"/>
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField fullWidth
                  id="server-description"
                  inputProps={{disabled: true}}
                  multiline
                  label="Description"
                  value={server.serverDescription}
                  variant="outlined"/>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      {(server.version!=="TAXII11")?<Grid item xs={12} md={4}>
        <Card>
          <CardHeader action={<Avatar className={classes.avatar}><ApiRootIcon/></Avatar>}
            title={
              <Typography gutterBottom variant="h5" component="h2">
                API Roots ({server.apiRoots.length})
              </Typography>
            }/>
          <Divider/>
          <List title={"API Roots"}>
            {(server.apiRoots.length>0)?(server.apiRoots.map((apiRoot, index) => {
              return <ListItem divider={index < server.apiRoots.length - 1} key={apiRoot}>
                <ListItemText
                  primary={getApiRootFromURL(apiRoot)}
                  primaryTypographyProps={{ variant: 'h6', noWrap: true }}/>
              </ListItem>
            })):null}
          </List>
        </Card>
      </Grid>:''}
    </Grid>
  );
}

/**
 * @property {object} user - The logged in user
 * @type {{user}}
 */
Overview.propTypes = {
  className: PropTypes.string,
  collections: PropTypes.object.isRequired,
  server: PropTypes.object.isRequired
};

export default Overview
