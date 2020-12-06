import React, { useState, useEffect } from 'react';
import addressApi from '../APIs/addressApi';
import { makeStyles, Typography, TextField, Button, Card, CardContent, CardHeader, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

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
  },
  halfWidthButton: {
    marginLeft:theme.spacing(2),
    marginRight:theme.spacing(2),
    marginTop:theme.spacing(2),
  },
}))

const NONE = 0;
const LOADING = 2;
const ERROR = -1;

export default function PartnerAddress() {
  const classes = useStyles();
  const [curAddrIndex, setCurAddrIndex] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [formState, setFormState] = useState({
    state:NONE,
    errorMsg:''
  });
  const loginDetails = JSON.parse(sessionStorage.getItem("loginDetails"));
  const {ApiKey} = loginDetails;
  const reload = (ApiKey) => {
    setAddresses([])
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

    apiCall(() => addressApi.getSelf(ApiKey), setAddresses);
  }

  useEffect(() => {
    reload(ApiKey);
  }, [ApiKey])

  const formSubmitActions = {
    "Update":(address) => addressApi.updateSelf(ApiKey, address),
    "Set Default":(address) => addressApi.setDefaultSelf(ApiKey, address.idAddress),
  };

  const submitForm = (action, address) => {
    setFormState({errorMsg:'', state:LOADING});
    const formSubmitAction = formSubmitActions[action];
    formSubmitAction(address).then(response => {
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

  const getFormProps = (addressType) => ({
    address: addresses.find(address => address.AddressType === addressType) || {},
    setAddress: (address) => {
      const index = addresses.findIndex(address => address.AddressType === addressType);
      const newAddresses = [...addresses];
      newAddresses[index] = address;
      setAddresses(newAddresses)
    },
    formState, submitForm
  })

  const formProps = {
    addresses,
    setAddress: (address) => {
      const newAddresses = [...addresses];
      newAddresses[curAddrIndex] = address;
      setAddresses(newAddresses);
    },
    formState, submitForm,
    curAddrIndex, setCurAddrIndex
  }

  return (
    <div className={classes.root}>
      <PartnerAddressForm {...formProps}/>
      {/* <PartnerAddressForm {...getFormProps("01")}/>
      <PartnerAddressForm {...getFormProps("03")}/>
      <PartnerAddressForm {...getFormProps("04")}/> */}
    </div>
  )
}

function PartnerAddressForm(props) {
  const classes = useStyles();
  const {formState, submitForm} = props;
  const {addresses, setAddress} = props;
  const {curAddrIndex, setCurAddrIndex} = props;
  const address = addresses[curAddrIndex] || {};
  
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
    ["AddressSpatialX", "Address Lat"],
    ["AddressSpatialY", "Address Lon"],
    ["AddressVAT", "Address VAT"],
  ]

  const buttonProps = [
    {label:"Update", isD:false, type:"submit"},
    {label:"Set Default", isD:false},
  ]

  const AddressDropDown = () => (
    <FormControl fullWidth>
      <InputLabel>Select Address</InputLabel>
      <Select
        value={curAddrIndex}
        onChange={event => setCurAddrIndex(event.target.value)}
      >
        {addresses.map((address, index) => (
          <MenuItem key={index} value={index}>
            {address.AddressTypeDex}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )

  const cardContent = (
    <CardContent className={classes.cardContent}>
      <AddressDropDown/>
      {varNames.map((varName, index) => (
        <div key={index}>
          <TextField
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
      <div style={{textAlign:'center'}}>
        {buttonProps.map(buttonProp => (
          <Button
            key={buttonProp.label}
            variant="outlined" 
            className={classes.halfWidthButton}
            type={buttonProp.type || ""}
            disabled={buttonProp.isD}
            onClick={
              buttonProp.type === "submit" ?
                "" :
                () => submitForm(buttonProp.label, address)
            }
          >
            {buttonProp.label}
          </Button>
        ))}
      </div>
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
        submitForm("Update", address);
      }}
    >
      <Card className={classes.card}>
        <CardHeader
          className={classes.header}
          title={
            'Partner ' + (address.AddressTypeDex || '') + ' Address ' + 
            (address.AddressDefault === "1" ? "(Default)" : "")
          }
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