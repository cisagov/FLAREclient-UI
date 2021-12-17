import React from 'react';
import { useHistory } from 'react-router';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  makeStyles
} from '@material-ui/core';
import Page from '../../components/Page';
import LoginForm from './LoginForm';
import FLARElogo from '../../../images/favicon.png';
import Cookies from 'js-cookie';
import AppConfig from '../../config/appConfig';

const useStyles = makeStyles((theme) => ({
  root: {
    justifyContent: 'center',
    backgroundColor: theme.palette.background.dark,
    display: 'flex',
    height: '100%',
    minHeight: '100%',
    flexDirection: 'column',
    paddingBottom: 80,
    paddingTop: 80
  },
  backButton: {
    marginLeft: theme.spacing(2)
  },
  card: {
    overflow: 'visible',
    display: 'flex',
    position: 'relative',
    '& > *': {
      flexGrow: 1,
      flexBasis: '50%',
      width: '50%'
    }
  },
  content: {
    padding: theme.spacing(3, 4, 3, 4)
  },
  icon: {
    backgroundColor: 'transparent',
    color: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1),
    position: 'absolute',
    top: -32,
    left: theme.spacing(3),
    height: 66,
    width: 66
  },
}));

function LoginView() {
  const classes = useStyles();
  const history = useHistory();

  const handleSubmitSuccess = () => {
    history.push('/app/');
  };

  const jwt_token = Cookies.get('jwt_token');

  if (jwt_token) {
    return null;
  }

  return (
    <Page
      className={classes.root}
      title="Login"
    >
      <Container maxWidth="sm">
        <Card className={classes.card}>
          <CardContent className={classes.content}>
            <Typography
              variant="h2"
              color="textPrimary"
            >
              Sign in
            </Typography>
            <Typography
              variant="subtitle1"
              color="textSecondary"
            >
              <img src={FLARElogo} alt="FLARE Logo"></img>lare Client Version {AppConfig.version} (Build: {AppConfig.build})
            </Typography>
            <Box mt={3}>
              <LoginForm onSubmitSuccess={handleSubmitSuccess} />
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
}

export default LoginView;
