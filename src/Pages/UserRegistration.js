import React, { useEffect, useState } from 'react';
import userApi from '../APIs/userApi';
import { makeStyles, Typography, TextField, Button, Card, CssBaseline, CardContent, CardHeader, CircularProgress, Checkbox, FormControlLabel, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { Link } from 'react-router-dom';
import errorCodes from '../ErrorCodes/errorCodes';
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
  }
}))

const NONE = 0;
const ATTEMPTING_REGISTER = 2;
const ERROR = -1;
const SUCCESS = 1;

export default function PartnerRegistration() {
  const classes = useStyles();
  const [countryCodes, setCountryCodes] = useState([]);
  const [user, setUser] = useState({
    UserTnCFlag:0,
    UserEmailSubscribeFlag:0,
    UserPhoneNumberCountryCode:"127"
  });
  const [registerState, setRegisterState] = useState({
    state:NONE,
    errorMsg:''
  });
  const attemptRegister = () => {
    setRegisterState({...registerState, state:ATTEMPTING_REGISTER});
    userApi.register(user).then(response => {
      if(response.idUser) {
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
    user, registerState,
    setUser, attemptRegister,
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
        <UserRegistrationForm {...registrationFormProps}/>
      }
    </main>
  )
}

function UserRegistrationForm(props) {
  const classes = useStyles();
  const {countryCodes} = props;
  const {user, registerState} = props;
  const {setUser, attemptRegister} = props;
  const varNames = [
    ['UserFirstName','User First Name', true],
    ['UserLastName','User Last Name', true],
    ['UserEmail','User Email', true],
    ['UserPhoneNumberCountryCode','User Phone Country Code', true],
    ['UserPhoneNumber','User Phone Number', true],
  ]

  const checkboxProps = [
    {
      "varname":"UserTnCFlag",
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
      "varname":"UserEmailSubscribeFlag",
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
        value={user.UserPhoneNumberCountryCode}
        onChange={event => setUser({...user, UserPhoneNumberCountryCode: event.target.value})}
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
          title='Create a User Account'
        />
        <CardContent className={classes.cardContent}>
          {varNames.map((varName, index) => (
            <div key={index}>
            {varName[0] === 'UserPhoneNumberCountryCode' ?
              <CountryCodeDropDown/> :
              <TextField
                required={varName[2]}
                margin='normal'
                fullWidth
                autoFocus={index === 0}
                label={varName[1]}
                value={user[varName[0]] ||''}
                onChange={event => setUser({
                  ...user,
                  [varName[0]]: event.target.value
                })}
              />
            }
            </div>
          ))}
          <TextField
            required
            margin='normal'
            fullWidth
            type='password'
            label={'User Password'}
            value={user['UserPassword'] ||''}
            onChange={event => setUser({
              ...user,
              'UserPassword': event.target.value
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
                    value={user[props.varname] === 1}
                    onChange={event => setUser({
                      ...user,
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
            align='center'
            className={classes.link}
          >
            Are you a partner? Go to&nbsp;
            <Link to='/register/partner'>diventa partner</Link>
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
        title='Registration Successful!'
      />
      <CardContent className={classes.cardContent}>
        <Typography 
          align='center'
        >
          Your registration was successful!&nbsp;
          A verification link has been sent to your email.
        </Typography>
        <div className={classes.link} >
          <Link to='/login/user'>
            Return to login
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}