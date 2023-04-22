import React, {
  useCallback,
  useEffect,
  useState
} from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { Spinner } from '../../utils/Spinner';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  makeStyles
} from '@material-ui/core';
import {
  Check,
  AlertTriangle
} from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { getContents, getServerCollections } from "../../redux/actions/collections";
import {convertIsoDate} from "../../utils/helpers";
import { Link } from 'react-router-dom';
import Pagination from "../../utils/Pagination";

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

function Content({className, server, collection, ...rest}) {
  const classes = useStyles();
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('lastRetrieved');
  const [numPerPage, setNumPerPage] = useState(20);
  const [page, setPage] = useState(1);
  const [retrievedData,setRetrievedData]=useState(false);
  const [retrievedCollections, setRetrievedCollections]=useState(false);
  const contents = useSelector(state => state.collections.contents);
  const [choosePage, setChoosePage] = useState(1);

  const dispatch = useDispatch();

  const camelToSnakeCase = str => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

  useEffect(() => {
    if (collection.contentVolume===0) {
      setChoosePage(0);
    } else {
      setChoosePage(1);
    }
  }, [collection]);

  const fetchContents = useCallback(() => {
    dispatch(getContents(server,collection.id,page-1,numPerPage,camelToSnakeCase(orderBy),order));
  }, [dispatch,server,collection,page,numPerPage,orderBy,order]);

  const fetchCollections = useCallback(() => {
    dispatch(getServerCollections(server));
  }, [dispatch,server]);

  useEffect(() => {
    if (!retrievedData) {
      if (sessionStorage.getItem('returnFromDetail')) {
        try {
          const oldPage = parseInt(sessionStorage.getItem('currentPage'));
          if (oldPage) {
            setPage(oldPage);
            setChoosePage(oldPage);
            setNumPerPage(sessionStorage.getItem('currentNumPerPage'));
            setOrderBy(sessionStorage.getItem('currentOrderBy'));
            setOrder(sessionStorage.getItem('currentOrder'));
          }
        } catch (error) {
          setPage(1);
          setChoosePage(1);
          setNumPerPage(20);
          setOrderBy('lastRetrieved');
          setOrder('desc');
        }
      }
      sessionStorage.removeItem('returnFromDetail');
      sessionStorage.removeItem('currentPage');
      sessionStorage.removeItem('currentNumPerPage');
      sessionStorage.removeItem('currentOrderBy');
      sessionStorage.removeItem('currentOrder');
      fetchContents();
      setRetrievedData(true);
      
    }
  }, [retrievedData,fetchContents,contents]);

  useEffect(() => {
    fetchContents();
  }, [fetchContents,page,numPerPage,orderBy,order]);

  useEffect(() => {
    fetchCollections();
    setRetrievedCollections(true);
  }, [retrievedCollections,fetchCollections]);

  const displayContents = contents[collection.id] ? contents[collection.id] : [];

  const updateSort = (column) => {
    if (column === orderBy)
    {
      setOrder(order==='desc'?'asc':'desc')
    } else {
      setOrder('asc')
      setOrderBy(column)
    }
  }

  const showStatus = (value) => {
    switch (value) {
      case 'PENDING':
        return <Spinner/>;
      case 'VALID':
        return <Check/>;
      case 'INVALID':
        return <AlertTriangle/>;
      default:
        return <div>Unknown</div>;
    }
  }

  const saveCurrentState = () => {
    sessionStorage.setItem('currentPage',page);
    sessionStorage.setItem('currentNumPerPage',numPerPage);
    sessionStorage.setItem('currentOrderBy',orderBy);
    sessionStorage.setItem('currentOrder',order);
  }

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <PerfectScrollbar>
        <Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell colSpan={4} style={{textAlign: 'center'}}>
                  <Pagination
                    page={page}
                    setPage={setPage}
                    choosePage={choosePage}
                    setChoosePage={setChoosePage}
                    numPerPage={numPerPage}
                    setNumPerPage={setNumPerPage}
                    numItems={displayContents.length}
                    count={collection.contentVolume}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Tooltip
                    enterDelay={300}
                    title="Sort Content ID"
                  >
                    <TableSortLabel
                      active={orderBy==='contentId'}
                      direction={order}
                      onClick={() => updateSort('contentId')}
                    >
                      Content ID
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip
                    enterDelay={300}
                    title="Sort Timestamp"
                  >
                    <TableSortLabel
                      active={orderBy==='contentTimestamp'}
                      direction={order}
                      onClick={() => updateSort('contentTimestamp')}
                    >
                      Timestamp
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip
                    enterDelay={300}
                    title="Sort Retrieved"
                  >
                    <TableSortLabel
                      active={orderBy==='lastRetrieved'}
                      direction={order}
                      onClick={() => updateSort('lastRetrieved')}
                    >
                      Retrieved
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip
                    enterDelay={300}
                    title="Sort Validation Status"
                  >
                    <TableSortLabel
                      active={orderBy==='validationResult'}
                      direction={order}
                      onClick={() => updateSort('validationResult')}
                    >
                      Validation Status
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayContents.map((content) => (
                <TableRow
                  hover
                  key={content.contentId}
                >
                  <TableCell id={"contentId"}>
                    <Link style={{color: '#FFF'}} onClick={() => saveCurrentState()} to={`/app/servers/${server}/collections/${collection.id}/content/${content.id}`}>
                      {content.contentId}
                    </Link>
                  </TableCell>
                  <TableCell id={"contentTimestamp"}>
                    {convertIsoDate(content.contentTimestamp)}
                  </TableCell>
                  <TableCell id={"lastRetrieved"}>
                    {convertIsoDate(content.lastRetrieved)}
                  </TableCell>
                  <TableCell id={"validationResult"}>
                    {content.stixVersion === 'STIX1'?showStatus(content.validationResult.status):''}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
    </Card>
  );
}

Content.propTypes = {
  className: PropTypes.string,
  server: PropTypes.string,
  collection: PropTypes.object
};

Content.defaultProps = {
  server: "",
  collection: {}
};

export default Content;
