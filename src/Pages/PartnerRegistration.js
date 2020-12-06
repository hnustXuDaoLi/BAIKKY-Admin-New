import React, { useEffect, useState } from 'react';
import partnerApi from '../APIs/partnerApi';
import { makeStyles, Typography, TextField, Button, Card, CssBaseline, CardContent, CardHeader, CircularProgress, FormControl, Checkbox, FormControlLabel, InputLabel, Select, MenuItem, InputAdornment, Tooltip } from '@material-ui/core';
import { Link } from 'react-router-dom';
import errorCodes from '../ErrorCodes/errorCodes';
import utilApi from '../APIs/utilApi';

import HelpIcon from '@material-ui/icons/Help';

const partnerDexHelpText = "Inserisci qui una breve descrizione del tuo bike-shop e dei tuoi servizi per farti trovare dagli utenti di Baikky";

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
  tooltipText: {
    '& .MuiTooltip-tooltip': { font:'16px arial' },
  }
}))

const NONE = 0;
const ATTEMPTING_REGISTER = 2;
const ERROR = -1;
const SUCCESS = 1;

export default function PartnerRegistration() {
  const classes = useStyles();
  const [countryCodes, setCountryCodes] = useState([]);
  const [partner, setPartner] = useState({
    PartnerTnCFlag:0,
    PartnerEmailSubscribeFlag:0,
    PartnerUserCountryCode: 127
  });
  const [registerState, setRegisterState] = useState({
    state:NONE,
    errorMsg:''
  });
  const attemptRegister = () => {
    setRegisterState({...registerState, state:ATTEMPTING_REGISTER});
    partnerApi.signIn(partner).then(response => {
      if(response.idPartner) {
        setRegisterState({errorMsg:'', state:SUCCESS});
      }
      else {
        setRegisterState({
          errorMsg:response.message,
          state:ERROR
        });
      }
    });
  }
  const registrationFormProps = {
    partner, registerState,
    setPartner, attemptRegister,
    countryCodes
  }

  useEffect(() => {
    utilApi.getCountryCode().then(response => {
      setCountryCodes(response.results || []);
    })
  }, [])

  return (
    <main className={classes.root}>
      <CssBaseline />
      {registerState.state === SUCCESS ?
        <RegistrationSuccess/> :
        <PartnerRegistrationForm {...registrationFormProps}/>
      }
    </main>
  )
}

function PartnerRegistrationForm(props) {
  const classes = useStyles();
  const {countryCodes} = props;
  const {partner, registerState} = props;
  const {setPartner, attemptRegister} = props;
  const varNames = [
    ['PartnerName','Partner Company Name', true],
    ['PartnerUserEmail','Partner Email', true],
    ['PartnerUserFirstName','Partner First Name', true],
    ['PartnerUserLastName','Partner Last Name', true],
    ['PartnerUserCountryCode','Partner Country Code', true],
    ['PartnerUserMobileNumber','Partner Mobile Number', true],
  ]

  const checkboxProps = [
    {
      "varname":"PartnerTnCFlag",
      "label":
        <div>
          I accept the&nbsp;
          <Link 
            onClick={() => {
              window.open("/dashboard/terms-of-use", "_blank");
            }}
          >
            Terms of Use
          </Link> and&nbsp;
          <Link
            onClick={() => {
              window.open("https://www.baikky.com/privacy-sito-baikky", "_blank");
            }}
          >
            Privacy Policy
          </Link>
        </div>
    },
    {
      "varname":"PartnerEmailSubscribeFlag",
      "label":
        <div>
          I accept to receive occasional emails from the
          Baikky team and understand that I can change my
          mind at any time
        </div>
    },
  ]
  
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

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        attemptRegister();
      }}
    >
      <Card className={classes.card}>
        <CardHeader
          className={classes.header}
          title='Create a Partner Account'
        />
        <CardContent className={classes.cardContent}>
          {varNames.map((varName, index) => (
            <div key={index}>
            {varName[0] === "PartnerUserCountryCode" ?
              <CountryCodeDropDown/> :
              <TextField
                required={varName[2]}
                margin='normal'
                fullWidth
                autoFocus={index === 0}
                label={varName[1]}
                value={partner[varName[0]] ||''}
                onChange={event => setPartner({
                  ...partner,
                  [varName[0]]: event.target.value
                })}
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
          <TextField
            required
            margin='normal'
            fullWidth
            type='password'
            label={'Partner User Password'}
            value={partner['PartnerUserPassword'] ||''}
            onChange={event => setPartner({
              ...partner,
              'PartnerUserPassword': event.target.value
            })}
          /><br/>
          {checkboxProps.map((props, index) => (
            <FormControl
              key={index}
              fullWidth
              margin="normal"
            >
              <FormControlLabel
                control={
                  <Checkbox
                    value={partner[props.varname] === 1}
                    onChange={event => setPartner({
                      ...partner,
                      [props.varname]: event.target.checked ? 1 : 0
                    })}
                  />
                }
                label={props.label}
              />
            </FormControl>
          ))}
          {registerState.state !== ATTEMPTING_REGISTER ?
            <Button
              fullWidth
              variant="outlined" 
              className={classes.button}
              type="submit"
            >
              Sign In
            </Button> :
            <div className={classes.circleProgress}>
              <CircularProgress />
            </div>
          }
          <Typography 
            className={classes.errorMessage}
            align='center'
          >
            {registerState.state === ERROR ?
              errorCodes.translate(registerState.errorMsg)
              : ''
            }
          </Typography>
          <Typography
            className={classes.link}
            align='center'
          >
            Are you a user? Go to&nbsp;
            <Link to='/register/user'>registrati</Link>
          </Typography>
        </CardContent>
      </Card>
    </form>
  )
}

function RegistrationSuccess(props) {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardHeader
        className={classes.header}
        title='Registration Sent for Approval!'
      />
      <CardContent className={classes.cardContent}>
        <Typography 
          align='center'
        >
          Your registration has been sent for approval, we will get back to you by email within 24hrs, thank you!
        </Typography>
        <div className={classes.link} >
          <Link to='/'>
            Return to home
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}