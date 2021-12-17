import React, {useState} from 'react';

import CollectionsIcon from '@material-ui/icons/Collections';
import CollectionDetails from './CollectionDetails';
import ContentIcon from '@material-ui/icons/BlurOn';
import DateIcon from '@material-ui/icons/Today';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import SummaryCard from "../../../../components/SummaryCard";

import {
  Box,
  Divider,
  InputAdornment,
  SvgIcon,
  TextField,
  Typography
} from '@material-ui/core';

import {
  Filter as FilterIcon,
} from 'react-feather';

import {convertIsoDate} from "../../../../utils/helpers";

function Collections({collections, server, ...rest}) {
  const [filter, setFilter] = useState('');

  const calcTotalObjects = () => {
    if (collections[server.label]) {
      let total=0;
      collections[server.label].map((collection) => total+=collection.contentVolume);
      return total;
    } else {
      return 0;
    }
  }

  const filterCollections = (collections) => {
    if (filter==='' || filter===undefined) {
      return collections[server.label];
    } else {
      return collections[server.label].filter((c) => {
        return c.displayName.toUpperCase().match(filter.toUpperCase())
      });
    }
  }

  const filteredCollections = filterCollections(collections);

  const filterApiRoots = () => {
    let roots={};
    if (server.version==='TAXII11') {
      return [undefined];
    } else if (filteredCollections) {
      filteredCollections.map((collection) => roots[collection.apiRootRef]=1);
      return(Object.keys(roots));
    } else {
      return [''];
    }
  }

  const filteredApiRoots = filterApiRoots(collections);

  const handleQueryChange = (event) => {
    setFilter(event.target.value);
  }

  const totalObjects = calcTotalObjects();

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item lg={4} sm={6} xs={6}>
          <SummaryCard
            avatar={{icon: ContentIcon}}
            title={"Total Objects"}
            value={totalObjects}/>
        </Grid>
        <Grid item lg={4} sm={6} xs={6}>
          <SummaryCard
            avatar={{icon: CollectionsIcon}}
            title={"Collections"}
            value={collections[server.label]?collections[server.label].length:'N/A'}/>
        </Grid>
        <Grid item lg={4} sm={12} xs={12}>
          <SummaryCard
            avatar={{icon: DateIcon}}
            title={"Last Poll"}
            value={convertIsoDate(server.lastUpdated.toString())}/>
        </Grid>
      </Grid>
      <Box mt={2}>
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SvgIcon
                  color="action"
                  fontSize="small"> 
                  <FilterIcon/>
                </SvgIcon>
              </InputAdornment>
            )
          }}
          onChange={handleQueryChange}
          placeholder="Filter Collections"
          value={filter}
          variant="outlined"
        />
      </Box>
      {filteredApiRoots.map((apiRoot) => {
        return (
          <Box mt={3} key={apiRoot?apiRoot:'undefined'}>
            <Typography color="textPrimary" variant="h4">
              {apiRoot}
            </Typography>
            <Divider/>
            <CollectionDetails apiRoot={apiRoot} collections={filteredCollections} server={server}/>
          </Box>
        )
      })}
    </div>
  );
}

/**
 * @property {object} user - The logged in user
 * @type {{user}}
 */
Collections.propTypes = {
  collections: PropTypes.object.isRequired,
  server: PropTypes.object.isRequired
};

export default Collections;
