import React, { useState } from 'react';
import partnerApi from '../APIs/partnerApi';
import userApi from '../APIs/userApi';
import { makeStyles, Typography, TextField, Button, Card, CssBaseline, CardContent, CardHeader, CircularProgress } from '@material-ui/core';
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

export default function ForgotPassword() {
  const classes = useStyles();
  const userType = useParams().type;
  const [email, setEmail] = useState('');
  const [formState, setFormState] = useState({
    state:NONE,
    errorMsg:''
  });
  const forgotPasswordApi = userType === 'user' ?
    () => userApi.forgotPassword(email) :
    () => partnerApi.forgotPassword(email);

  const attemptResetPassword = () => {
    setFormState({...formState, state:LOADING});
    forgotPasswordApi().then(response => {
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
  const registrationFormProps = {
    email, formState,
    setEmail, attemptResetPassword
  }

  return (
    <main className={classes.root}>
      <CssBaseline />
      {formState.state === SUCCESS ?
        <ResetPasswordSuccess userType={userType}/> :
        <ForgotPasswordForm {...registrationFormProps}/>
      }
    </main>
  )
}

function ForgotPasswordForm(props) {
  const classes = useStyles();
  const {email, formState} = props;
  const {setEmail, attemptResetPassword} = props;

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        attemptResetPassword();
      }}
    >
      <Card className={classes.card}>
        <CardHeader
          className={classes.header}
          title='Reset Password'
        />
        <CardContent className={classes.cardContent}>
          <TextField
            margin='normal'
            fullWidth
            autoFocus
            label={'Enter Email'}
            value={email ||''}
            onChange={event => setEmail(event.target.value)}
          /><br/>
          {formState.state !== LOADING ?
            <Button
              fullWidth
              variant="outlined" 
              className={classes.button}
              type="submit"
            >
              Submit
            </Button> :
            <div className={classes.circleProgress}>
              <CircularProgress />
            </div>
          }
          <Typography 
            className={classes.errorMessage}
            align='center'
          >
            {formState.state === ERROR ?
              formState.errorMsg : ''
            }
          </Typography>
        </CardContent>
      </Card>
    </form>
  )
}

function ResetPasswordSuccess(props) {
  const classes = useStyles();
  const {userType} = props;

  return (
    <Card className={classes.card}>
      <CardHeader
        className={classes.header}
        title='Password Reset!'
      />
      <CardContent className={classes.cardContent}>
        <Typography 
          align='center'
        >
          Your password has been reset and your new password has been sent to your registered email.
        </Typography>
        <div className={classes.link} >
          <Link to={'/login/' + userType}>Back to login</Link>
        </div>
      </CardContent>
    </Card>
  )
}