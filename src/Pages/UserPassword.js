import React, { useState, useEffect } from 'react';
import userApi from '../APIs/userApi';
import { makeStyles, Typography, TextField, Button, Card, CardContent, CardHeader, CircularProgress } from '@material-ui/core';

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

export default function UserPassword() {
  const classes = useStyles();
  const [user, setUser] = useState({});
  const [userState, setUserState] = useState({
    state:NONE,
    errorMsg:''
  });
  const loginDetails = JSON.parse(sessionStorage.getItem("loginDetails"));
  const {ApiKey} = loginDetails;
  const reload = (ApiKey) => {
    setUser({});
    setUserState({
      state:LOADING, 
      errorMsg:''
    });
    userApi.getSelf(ApiKey).then(response => {
      if(response.result) {
        setUser(response.result);
        setUserState({
          state:NONE, 
          errorMsg:''
        });
      }
      else {
        setUser({});
        setUserState({
          state:ERROR,
          errorMsg:response.message
        })
      }
    })
  }

  useEffect(() => {
    reload(ApiKey);
  }, [ApiKey])

  const attemptUpdate = () => {
    setUserState({errorMsg:'', state:LOADING});
    userApi.updateSelf(ApiKey, user).then(response => {
      if(response.error_code === '0') {
        window.alert('Update successful!');
        reload(ApiKey);
      }
      else {
        setUserState({
          errorMsg:response.message,
          state:ERROR
        });
      }
    });
  }
  const registrationFormProps = {
    user, userState,
    setUser, attemptUpdate
  }

  return (
    <div className={classes.root}>
      <UserProfileForm {...registrationFormProps}/>
    </div>
  )
}

function UserProfileForm(props) {
  const classes = useStyles();
  const {user, userState} = props;
  const {setUser, attemptUpdate} = props;
  const varNames = [
    ["UserPassword","Password",false],
  ]

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        attemptUpdate();
      }}
    >
      <Card className={classes.card}>
        <CardHeader
          className={classes.header}
          title='Change Password'
        />
        <CardContent className={classes.cardContent}>
          {varNames.map((varName, index) => (
            <div key={index}>
              <TextField
                type='password'
                margin='normal'
                fullWidth
                autoFocus={index === 0}
                label={varName[1]}
                value={user[varName[0]] ||''}
                placeholder='Enter new password'
                onChange={event => setUser({
                  ...user,
                  [varName[0]]: event.target.value
                })}
                InputProps={{
                  style:{background: varName[2] ? '#EBEBE4' : ''},
                  readOnly: varName[2],
                }}
              />
            </div>
          ))}
          {userState.state !== LOADING ?
            <Button
              fullWidth
              variant="outlined" 
              className={classes.button}
              type="submit"
            >
              update
            </Button> :
            <div className={classes.circleProgress}>
              <CircularProgress />
            </div>
          }
          <Typography 
            className={classes.errorMessage}
            align='center'
          >
            {userState.state === ERROR ?
              userState.errorMsg : ''
            }
          </Typography>
        </CardContent>
      </Card>
    </form>
  )
}