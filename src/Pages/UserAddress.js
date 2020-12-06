import React, { useState, useEffect } from 'react';
import addressApi from '../APIs/addressApi';
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

export default function UserAddress() {
  const classes = useStyles();
  const [address, setAddress] = useState([]);
  const [formState, setFormState] = useState({
    state:NONE,
    errorMsg:''
  });
  const loginDetails = JSON.parse(sessionStorage.getItem("loginDetails"));
  const {ApiKey} = loginDetails;
  const reload = (ApiKey) => {
    setAddress([])
    setFormState({
      state:LOADING, 
      errorMsg:''
    });

    const apiCall = (api, setCallback) => {
      api().then(response => {
        if(response.error_code === 0) {
          setCallback(response.results);
          setFormState({
            state:NONE, 
            errorMsg:''
          });
        }
        else {
          setFormState({
            state:ERROR,
            errorMsg:response.message
          })
        }
      })
    }

    apiCall(() => addressApi.getSelf(ApiKey), setAddress);
  }

  useEffect(() => {
    reload(ApiKey);
  }, [ApiKey])

  const formSubmitActions = {
    "Update":() => addressApi.updateSelf(ApiKey, address[0])
  };

  const submitForm = (action) => {
    setFormState({errorMsg:'', state:LOADING});
    const formSubmitAction = formSubmitActions[action];
    formSubmitAction().then(response => {
      if(response.error_code === '0') {
        window.alert(action + ' address successful!');
        reload(ApiKey);
      }
      else {
        setFormState({
          errorMsg:response.message,
          state:ERROR
        });
      }
    });
  }

  const formProps = {
    address, formState,
    setAddress, submitForm
  }

  return (
    <div className={classes.root}>
      <UserAddressForm {...formProps}/>
    </div>
  )
}

function UserAddressForm(props) {
  const classes = useStyles();
  const {formState} = props;
  const {submitForm} = props;
  const address = props.address[0] || {};
  const setAddress = (address) => props.setAddress([address])
  
  const varNames = [
    ["AddressDex", "Address Dex"],
    ["AddressStreet1", "Address Street 1"],
    ["AddressStreet2", "Address Street 2"],
    ["AddressNumber", "Address Number"],
    ["AddressCity", "Address City"],
    ["AddressProvince", "Address Province"],
    ["AddressZIP", "Address ZIP"],
    ["AddressCountry", "Address Country"],
    ["AddressNotel", "Address Notel"],
    ["AddressSpatialX", "Address Lat", false, "number"],
    ["AddressSpatialY", "Address Lon", false, "number"],
    ["AddressVAT", "Address VAT"],
  ]

  const cardContent = (
    <CardContent className={classes.cardContent}>
      {varNames.map((varName, index) => (
        <div key={index}>
          <TextField
            type={varName[3]}
            margin='normal'
            fullWidth
            autoFocus={index === 0}
            label={varName[1]}
            value={address[varName[0]] ||''}
            onChange={event => setAddress({
              ...address,
              [varName[0]]: event.target.value
            })}
            InputProps={{
              style:{background: varName[2] ? '#EBEBE4' : ''},
              readOnly: varName[2],
            }}
          />
        </div>
      ))}
      {formState.state !== LOADING ?
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
        {formState.state === ERROR ?
          formState.errorMsg : ''
        }
      </Typography>
    </CardContent>
  )

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        submitForm("Update");
      }}
    >
      <Card className={classes.card}>
        <CardHeader
          className={classes.header}
          title='User Address'
        />
        {formState.state === LOADING ?
          <div className={classes.circleProgress}>
            <CircularProgress />
          </div> :
          cardContent
        }
      </Card>
    </form>
  )
}