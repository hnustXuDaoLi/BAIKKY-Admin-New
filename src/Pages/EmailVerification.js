import React, { useState, useEffect, Fragment } from 'react';
import partnerApi from '../APIs/partnerApi';
import userApi from '../APIs/userApi';
import { makeStyles, Typography, Card, CssBaseline, CardContent, CardHeader, CircularProgress } from '@material-ui/core';
import { useParams, Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up("sm")]: {
        width: 600,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
  },
  card: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(6),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  header: {
    width:'100%',
    textAlign:'center',
    font:'bold 24px arial'
  },
  cardContent: {
    width:'100%',
  },
  button: {
    marginTop: theme.spacing(3)
  },
  circleProgress: {
    textAlign:'center',
    marginTop: theme.spacing(3),
  },
  errorMessage: {
    marginTop: theme.spacing(1),
    color:'red'
  },
  link: {
    marginTop: theme.spacing(3),
    textAlign:'center'
  }
}))

const NONE = 0;
const LOADING = 2;
const ERROR = -1;
const SUCCESS = 1;

export default function EmailVerification() {
  const classes = useStyles();
  const {id, type: userType } = useParams();
  const [formState, setFormState] = useState({
    state:NONE,
    errorMsg:''
  });

  const verifyEmailApi = userType === 'user' ?
    () => userApi.verifyEmail(id) :
    () => partnerApi.verifyEmail(id);

  const attemptVerifyEmail = () => {
    setFormState({...formState, state:LOADING});
    verifyEmailApi().then(response => {
      if(response.error_code === '0') {
        setFormState({errorMsg:'', state:SUCCESS});
      }
      else {
        setFormState({
          errorMsg:response.message,
          state:ERROR
        });
      }
    });
  }

  useEffect(() => attemptVerifyEmail(), []);

  const verifyEmailResultProps = {
    userType, formState
  }

  return (
    <main className={classes.root}>
      <CssBaseline />
      {[SUCCESS, ERROR].includes(formState.state) ?
        <VerifyEmailResult {...verifyEmailResultProps}/> :
        <VerifyingEmail/>
      }
    </main>
  )
}

function VerifyingEmail() {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardHeader
        className={classes.header}
        title='Verifying Email'
      />
      <CardContent className={classes.cardContent}>
        <div className={classes.circleProgress}>
          <CircularProgress />
        </div>
      </CardContent>
    </Card>
  )
}

function VerifyEmailResult(props) {
  const classes = useStyles();
  const {userType, formState} = props;

  return (
    <Card className={classes.card}>
      <CardHeader
        className={classes.header}
        title={formState.state === SUCCESS ?
          'Email Verification Successful!' : 'Email Verification Failed.'
        }
      />
      <CardContent className={classes.cardContent}>
      {formState.state === SUCCESS ?
        <Fragment>
          <Typography align='center'>
            Your email was successfully verified, you may login at the following link:
          </Typography>
          <div className={classes.link} >
            <Link to={'/login/' + userType}>Back to login</Link>
          </div>
        </Fragment> :
        <Typography align='center'>
          This email verification link is invalid or has expired, send an email to&nbsp;
          <a href={"mailto:info@baikup.com"}>info@baikup.com</a> for assistance.
        </Typography>
      }
      </CardContent>
    </Card>
  )
}