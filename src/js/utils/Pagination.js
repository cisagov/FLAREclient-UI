import React from 'react';
import PropTypes from 'prop-types';
import {
  MenuItem,
  Select,
  TextField,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {},

  unselectable: {
    MozUserSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none'
  },

  pointer: {
    MozUserSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
    cursor: 'pointer'
  },

  invisible: { cursor: 'default', opacity: 0 }
}));

function Pagination({className, page, setPage, choosePage, setChoosePage, numPerPage, setNumPerPage, numItems, count, ...rest}) {
  const classes = useStyles();

  const getMaxItem = () => {
    return count;
  }

  const getStartItem = () => {
    if (getMaxItem()===0) {
      return 0;
    }
    return (page-1)*numPerPage+1
  };

  const getEndItem = () => {
    const maxval = page*numPerPage;

    if (getMaxItem() === 0) {
      return 0;
    }
    if (maxval>getMaxItem()) {
      return getMaxItem();
    }
    if (numItems<numPerPage) {
      return getStartItem()-1+numItems;
    }
    return maxval;
  };

  const getMaxPage = () => {
    return Math.ceil(getMaxItem()/numPerPage)
  };

  const firstPage = () => {
    setChoosePage(1);
    setPage(1);
  };

  const lastPage = () => {
    setChoosePage(getMaxPage());
    setPage(getMaxPage())
  };

  const nextPage = () => {
    if (page<getMaxPage()) {
      setChoosePage(choosePage+1);
      setPage(page+1);
    }
  };

  const prevPage = () => {
    if (page>1) {
      setChoosePage(choosePage-1);
      setPage(page-1);
    }
  };

  const keyPress = (e) =>{
    if (e.keyCode === 13 && choosePage.length) {
      setPage(parseInt(choosePage));
    }
  };

  const updateChoosePage = (value) => {
    if (value.match(/^[0-9]*$/)) {
      if (value==='' || (parseInt(value)>0 && parseInt(value)<=getMaxPage())) {
        setChoosePage(value);
      }
    }
  }

  const updateNumPerPage = (value) => {
    setNumPerPage(value);
    if (getMaxItem()===0) {
      setPage(0);
      setChoosePage(0);
    } else {
      setPage(1);
      setChoosePage(1);
    }
  }

  const firstAndPrevPageDisplay=(getMaxItem()===0 || page===1)?classes.invisible:classes.pointer;

  const lastAndNextPageDisplay=(getMaxItem()===0 || page===getMaxPage())?classes.invisible:classes.pointer;

  return (
    <span>
      <div className={classes.unselectable}>
        Displaying {getStartItem()} to {getEndItem()} of {getMaxItem()}<br/>
        <span style={{position: "relative", top: "-7px"}}>
          Number per page:
          &nbsp;&nbsp;
        </span>
        <Select disableUnderline={true} id="perPage" onChange={(e) => {updateNumPerPage(e.target.value)}} value={numPerPage}>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>
        </Select>
      </div>
      <div>
        <span className={firstAndPrevPageDisplay} onClick={() => firstPage()}>First</span>
        <span className={classes.invisible}>&nbsp;&nbsp;&nbsp;</span>
        <span className={firstAndPrevPageDisplay} onClick={() => prevPage()}>Prev</span>
        <span className={classes.invisible}>&nbsp;&nbsp;&nbsp;</span>
        <span className={classes.unselectable}>Page&nbsp;&nbsp;<TextField style={{width:(getMaxPage().toString().length)*10+5, position: "relative", top: "-5px"}} value={choosePage} onKeyDown={keyPress} onChange={(e) => updateChoosePage(e.target.value)}/> of {getMaxPage()}</span>
        <span className={classes.invisible}>&nbsp;&nbsp;&nbsp;</span>
        <span className={lastAndNextPageDisplay} onClick={() => nextPage()}>Next</span>
        <span className={classes.invisible}>&nbsp;&nbsp;&nbsp;</span>
        <span className={lastAndNextPageDisplay} onClick={() => lastPage()}>Last</span>
      </div>
    </span>
  );
}

Pagination.propTypes = {
  className: PropTypes.string,
  page: PropTypes.number,
  setPage: PropTypes.func,
  choosePage: PropTypes.number,
  setChoosePage: PropTypes.func,
  numPerPage: PropTypes.number,
  setNumPerPage: PropTypes.func,
  numItems: PropTypes.number,
  count: PropTypes.number
};

Pagination.defaultProps = {
  page: 1,
  choosePage: 1,
  numPerPage: 20,
  numItems: 0,
  count: 0
};

export default Pagination;
