import React, { useState } from 'react';
import userApi from '../APIs/userApi';
import { makeStyles, Typography, Button, Card, CardContent, CardHeader, CircularProgress } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

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

export default function UserDelete() {
  const classes = useStyles();
  const history = useHistory();
  const [formState, setFormState] = useState({
    state:NONE,
    errorMsg:''
  });
  const loginDetails = JSON.parse(sessionStorage.getItem("loginDetails"));
  const {ApiKey} = loginDetails;

  const attemptDelete = () => {
    setFormState({errorMsg:'', state:LOADING});
    userApi.deleteSelf(ApiKey).then(response => {
      if(response.error_code === '0') {
        window.alert('Delete successful!');
        sessionStorage.setItem("loginDetails", null);
        history.push("/");
      }
      else {
        setFormState({
          errorMsg:response.message,
          state:ERROR
        });
      }
    });
  }
  const deleteFormProps = {
    attemptDelete, formState
  }

  return (
    <div className={classes.root}>
      <UserDeleteForm {...deleteFormProps}/>
    </div>
  )
}

function UserDeleteForm(props) {
  const classes = useStyles();
  const {attemptDelete, formState} = props;

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        attemptDelete();
      }}
    >
      <Card className={classes.card}>
        <CardHeader
          className={classes.header}
          title='Confirm Delete'
        />
        <CardContent className={classes.cardContent}>
          <Typography align='center'>
            Are you sure you want to delete your account?
          </Typography>
          {formState.state !== LOADING ?
            <Button
              fullWidth
              variant="outlined" 
              className={classes.button}
              type="submit"
            >
              Confirm
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