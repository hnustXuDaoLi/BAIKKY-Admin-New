import React, { useState, useEffect } from 'react';
import partnerApi from '../APIs/partnerApi';
import { makeStyles, Typography, TextField, Button, Card, CardContent, CardHeader, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import utilApi from '../APIs/utilApi';

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
  }
}))

const NONE = 0;
const LOADING = 2;
const ERROR = -1;

export default function AdminManagePartner() {
  const classes = useStyles();
  const [partners, setPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState({});
  const [countryCodes, setCountryCodes] = useState([]);
  const [formState, setFormState] = useState({
    state:LOADING,
    errorMsg:''
  });

  const loginDetails = JSON.parse(sessionStorage.getItem("loginDetails"));
  const {ApiKey} = loginDetails;
  const reload = (ApiKey) => {
    setSelectedPartner({});
    setPartners([]);
    setFormState({
      state:LOADING, 
      errorMsg:''
    });

    const apiCall = (api, setCallback) => {
      api().then(response => {
        if(response.error_code === 0) {
          setCallback(response.results || response.result);
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

    apiCall(() => utilApi.getCountryCode(), setCountryCodes);
    apiCall(() => partnerApi.get(ApiKey), setPartners);
  }

  useEffect(() => {
    reload(ApiKey);
  }, [ApiKey])

  const modifyActions = {
    "Add":() => partnerApi.add(ApiKey, selectedPartner),
    "Update":() => partnerApi.update(ApiKey, selectedPartner),
    "Suspend":() => partnerApi.suspend(ApiKey, selectedPartner.idPartner, true),
    "Confirm":() => partnerApi.confirm(ApiKey, selectedPartner.idPartner, true),
    "Remove Suspend":() => partnerApi.suspend(ApiKey, selectedPartner.idPartner, false),
    "Reject":() => partnerApi.confirm(ApiKey, selectedPartner.idPartner, false),
    "Delete":() => partnerApi.delete(ApiKey, selectedPartner.idPartner),
  }
  const modifyPartner = (action) => {
    setFormState({errorMsg:'', state:LOADING});
    const modifyAction = modifyActions[action];
    modifyAction().then(response => {
      if(response.error_code === '0') {
        window.alert(action + ' partner successful!');
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

  const partnerFormProps = {
    countryCodes,
    formState, partners,
    modifyPartner,
    partner:selectedPartner, 
    setPartner:setSelectedPartner
  }

  return (
    <div className={classes.root}>
      <PartnerForm {...partnerFormProps}/>
    </div>
  )
}

function PartnerForm(props) {
  const classes = useStyles();
  const {countryCodes} = props;
  const {formState, partners} = props;
  const {partner, setPartner, modifyPartner} = props;

  const readOnlyVars = [
    ["idPartner","Partner ID"],
    ["PartnerStatusDex","Partner Status"],
  ]

  const varNames = [
    ["PartnerName","Partner Name", true],
    ["PartnerUserEmail", "Partner Email", true],
    ["PartnerUserFirstName", "Partner First Name", true],
    ["PartnerUserLastName", "Partner Last Name", true],
    ["PartnerUserCountryCode", "Partner Country Code", true],
    ["PartnerUserMobileNumber", "Partner Mobile Number", true],
    ["PartnerUserPhoneNumber", "Partner Phone Number"],
  ]

  const buttonProps = [
    {label:"Add", isD:partner.idPartner > -1, type:"submit"},
    {label:"Update", isD:!(partner.idPartner > -1)},
    {label:"Delete", isD:!(partner.idPartner > -1)},
    {label:"Confirm", isD:!(partner.idPartner > -1) || !['N','R'].includes(partner.PartnerStatus)},
    {label:"Reject", isD:!(partner.idPartner > -1) || !['A','R'].includes(partner.PartnerStatus)},
    {label:"Suspend", isD:!(partner.idPartner > -1) || !['A'].includes(partner.PartnerStatus)},
    {label:"Remove Suspend", isD:!(partner.idPartner > -1) || !['S'].includes(partner.PartnerStatus)},
  ];

  const CountryCodeDropDown = () => (
    <FormControl fullWidth>
      <InputLabel>Select Country Code</InputLabel>
      <Select
        value={partner.PartnerUserCountryCode || "127"}
        onChange={event => setPartner({...partner, PartnerUserCountryCode: event.target.value})}
      >
        {countryCodes.map(countryCode => (
          <MenuItem key={countryCode.idCountryCode} value={countryCode.idCountryCode}>
            {countryCode.CountryCodeDex + " (+" + countryCode.CountryCodeVal + ")"}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
  
  const cardContent = (
    <CardContent className={classes.cardContent}>
      <FormControl
        fullWidth
        margin='normal'
      >
        <InputLabel>Select Partner</InputLabel>
        <Select
          value={partner.idPartner || -1}
          onChange={event => setPartner(partners.find(partner => partner.idPartner === event.target.value) || {})}
        >
          <MenuItem value={-1}>
            <em>Add New Partner</em>
          </MenuItem>
          {partners.map(partner => (
            <MenuItem key={partner.idPartner} value={partner.idPartner}>
              {partner.PartnerName}
            </MenuItem>
          ))}
        </Select>
      </FormControl><br/>
      {readOnlyVars.map((varName, index) => (
        <TextField
          key={index}
          margin='normal'
          fullWidth
          label={varName[1]}
          value={partner[varName[0]] ||'NA'}
          InputProps={{
            style:{background:'#EBEBE4'},
            readOnly: true,
          }}
        />
      ))}
      {varNames.map((varName, index) => (
        <div key={index}>
          {varName[0] === "PartnerUserCountryCode" ?
            <CountryCodeDropDown/> :
            <TextField
              margin='normal'
              fullWidth
              autoFocus={index === 0}
              label={varName[1]}
              value={partner[varName[0]] ||''}
              onChange={event => setPartner({
                ...partner,
                [varName[0]]: event.target.value
              })}
              required={varName[2]}
            />
          }
        </div>
      ))}
      <TextField
        margin='normal'
        fullWidth
        multiline
        label='Partner Description'
        value={partner["PartnerDex"] ||''}
        onChange={event => setPartner({
          ...partner,
          'PartnerDex': event.target.value
        })}
      />
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
              () => modifyPartner(buttonProp.label)
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
        modifyPartner("Add");
      }}
    >
      <Card className={classes.card}>
        <CardHeader
          className={classes.header}
          title='Modify Partner'
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