import React, { useState, useEffect } from 'react';
import partnerApi from '../APIs/partnerApi';
import { makeStyles, Typography, TextField, Button, Card, CardContent, CardHeader, CircularProgress, FormControl, InputLabel, Select, MenuItem, InputAdornment, Tooltip } from '@material-ui/core';
import utilApi from '../APIs/utilApi';

import HelpIcon from '@material-ui/icons/Help';

const partnerDexHelpText = "Inserisci qui una breve descrizione del tuo bike-shop e dei tuoi servizi per farti trovare dagli utenti di Baikky";
const partnerPhoneNumberHelpText = "Inserisci qui il contatto telefonico con cui gestisci il tuo business. Sara’ visibile solo agli utenti registrati interessati alle tue quotazion"

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
  tooltipText: {
    '& .MuiTooltip-tooltip': { font:'16px arial' },
  }
}))

const NONE = 0;
const LOADING = 2;
const ERROR = -1;

export default function PartnerProfile() {
  const classes = useStyles();
  const [partner, setPartner] = useState({});
  const [countryCodes, setCountryCodes] = useState([]);
  const [formState, setFormState] = useState({
    state:LOADING,
    errorMsg:''
  });

  const loginDetails = JSON.parse(sessionStorage.getItem("loginDetails"));
  const {ApiKey} = loginDetails;
  const reload = (ApiKey) => {
    setPartner({});
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
    apiCall(() => partnerApi.getSelf(ApiKey), setPartner);
  }

  useEffect(() => {
    reload(ApiKey);
  }, [ApiKey])

  const modifyActions = {
    "Update":() => partnerApi.updateSelf(ApiKey, partner)
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
    formState, modifyPartner,
    partner, setPartner,
    countryCodes
  }

  return (
    <div className={classes.root}>
      <PartnerForm {...partnerFormProps}/>
    </div>
  )
}

function PartnerForm(props) {
  const classes = useStyles();
  const {formState} = props;
  const {countryCodes} = props;
  const {partner, setPartner, modifyPartner} = props;

  const readOnlyVars = [
    ["idPartner","ID"],
    ["PartnerStatusDex","Status"],
    ["PartnerName","Name"],
    ["PartnerUserEmail", "Email"],
  ]

  const varNames = [
    ["PartnerUserFirstName", "First Name", true],
    ["PartnerUserLastName", "Last Name", true],
    ["PartnerUserCountryCode", "Country Code", true],
    ["PartnerUserMobileNumber", "Mobile Number", true],
  ]

  const buttonProps = [
    {label:"Update", isD:!(partner.idPartner > -1), type:"submit"}
  ];

  const CardContentTextField = ({index, params}) => (
    <TextField
      margin='normal'
      fullWidth
      autoFocus={index === 0}
      label={params[1]}
      value={partner[params[0]] ||''}
      onChange={event => setPartner({
        ...partner,
        [params[0]]: event.target.value
      })}
      required={params[2]}
    />
  )

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
          <CardContentTextField 
            index={index}
            params={varName}
          />
        }
        </div>
      ))}
      <TextField
        margin='normal'
        fullWidth
        label="Phone Number"
        value={partner["PartnerUserPhoneNumber"]}
        InputProps={{
          style:{background:'#EBEBE4'},
          readOnly: true,
        }}
        InputProps={{
          endAdornment:
            <InputAdornment position="end">
              <Tooltip 
                title={partnerPhoneNumberHelpText}
                PopperProps={{className:classes.tooltipText}}
              >
                <HelpIcon/>
              </Tooltip>
            </InputAdornment>
        }}
      />
      <TextField
        margin='normal'
        fullWidth
        multiline
        label='Description'
        value={partner["PartnerDex"] ||''}
        onChange={event => setPartner({
          ...partner,
          'PartnerDex': event.target.value
        })}
        InputProps={{
          endAdornment:
            <InputAdornment position="end">
              <Tooltip 
                title={partnerDexHelpText}
                PopperProps={{className:classes.tooltipText}}
              >
                <HelpIcon/>
              </Tooltip>
            </InputAdornment>,
        }}
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
        modifyPartner("Update");
      }}
    >
      <Card className={classes.card}>
        <CardHeader
          className={classes.header}
          title='Partner Profile'
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