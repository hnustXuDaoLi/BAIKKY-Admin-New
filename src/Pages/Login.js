import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom'
import { makeStyles, Card, CardHeader, CardContent, Divider } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CircularProgress  from '@material-ui/core/CircularProgress';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

import FacebookLogin from 'react-facebook-login';

import loginApi from '../APIs/loginApi';

const useStyles = makeStyles(theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(400 + theme.spacing(3 * 2))]: {
        width: 400,
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
    // padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  header: {
    width:'100%',
    textAlign:'center',
    font:'bold 24px arial'
  },
  avatar: {
    margin: theme.spacing(1),
    width: theme.spacing(7),
    height: theme.spacing(7)
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    marginTop: theme.spacing(3),
  },
  loginProgress: {
    textAlign:'center',
    marginTop: theme.spacing(3),
  },
  registration: {
    textAlign:'center',
    marginTop: theme.spacing(3),
    font:'16px arial'
  },
  otherOptions: {
    textAlign:'center',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    font:'16px arial'
  },
}))

const LOGOUT = 0;
const LOGIN_SUCCESSFUL = 1;
const ATTEMPTING_LOGIN = 2;
const INVALID_USERPASS_ERROR = -1;
const SERVER_ERROR = -2

export default function Login() {
  const classes = useStyles();
  const loginType = useParams().type;
  const [loginState, setLoginState] = useState(LOGOUT);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const attemptLogin = (loginType, loginBody) => {
    setLoginState(ATTEMPTING_LOGIN);
    const loginMethods = {
      'partner':() => loginApi.partnerLogin(username, password),
      'user':() => loginApi.userLogin(username, password),
      'facebook':() => loginApi.userLoginFacebook(loginBody)
    };
    const loginMethod = loginMethods[loginType];
    loginMethod(username, password).then(body => {
      if(body.ApiKey){
        setUsername('');
        setPassword('');
        sessionStorage.setItem("loginDetails",JSON.stringify(body));
        setLoginState(LOGIN_SUCCESSFUL);
        // users go back to the wix page, partners go to dashboard
        // ['user','facebook'].includes(loginType) ?  history.push('/') : history.push('/main');
        history.push('/main') //for dev env, everyone goes to dashboard
      }
      else {
        setLoginState(INVALID_USERPASS_ERROR);
      }
    });
  }

  const loginFormProps = {
    loginState, loginType, username, password,
    setLoginState, setUsername, setPassword,
    attemptLogin
  };
  const otherLoginOptionsProps = {
    loginType, attemptLogin,
    onFacebookClick: () => setLoginState(ATTEMPTING_LOGIN)
  };

  const registrationLinkProps = {loginType};

  // render components
  return (
    <main className={classes.main}>
      <LoginForm {...loginFormProps}/>
      <div className={classes.otherOptions}><b>OR</b></div>
      <OtherLoginOptions {...otherLoginOptionsProps}/>
      <Divider/>
      <RegistrationLink {...registrationLinkProps}/>
    </main>
  )
}

function LoginForm(props) {
  const {loginState, loginType, username, password} = props;
  const {setUsername, setPassword, attemptLogin} = props;
  const classes = useStyles();
  
  return (
    <main className={classes.main}>
      <CssBaseline />
      <Card className={classes.card}>
        <CardHeader 
          className={classes.header}
          title={
            {
              'partner':'Partner Sign In',
              'user':'User Sign In',
              '_':'Sign In'
            }[loginType || '_']
          }
        />
        <CardContent>
          {/* Login Form */}
          <form className={classes.form} 
            onSubmit={async event => {
              event.preventDefault();
              attemptLogin(loginType);
            }}
          >
            {/* Username */}
            <FormControl margin="normal" required fullWidth error={loginState < 0}>
              <InputLabel htmlFor="username">Username</InputLabel>
              <Input id="username" name="username" autoComplete='off' autoFocus 
                value={username}
                onChange={event => setUsername(event.target.value)} />
              {loginState === INVALID_USERPASS_ERROR && <FormHelperText>Invalid username or password</FormHelperText>}
              {loginState === SERVER_ERROR && <FormHelperText>Server error</FormHelperText>}
            </FormControl>
            {/* Password */}
            <FormControl margin="normal" required fullWidth error={loginState < 0}>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input name="password" type="password" id="password" autoComplete="current-password"
                value={password}
                onChange={event => setPassword(event.target.value)} />
            </FormControl>
            {loginState !== ATTEMPTING_LOGIN && <Button
              type="submit"
              fullWidth
              variant="outlined"
              className={classes.submit}
            >
              LOGIN
                      </Button>}
            {loginState === ATTEMPTING_LOGIN && <div className={classes.loginProgress}><CircularProgress /></div>}
          </form>
        </CardContent>
      </Card>
    </main>
  )
}

function RegistrationLink(props) {
  const classes = useStyles();
  const {loginType} = props;
  
  return (
    <div>
      <div className={classes.registration}>
        No account yet?&nbsp;
        <Link to={'/register/' + loginType}>Register</Link>
      </div>
      <div className={classes.otherOptions}>
        <Link to={'/forgotPassword/' + loginType}>Forgot your password?</Link>
      </div>
    </div>
  )
}

function OtherLoginOptions(props) {
  const classes = useStyles();
  const {loginType, attemptLogin, onFacebookClick} = props;

  return (
    <div className={classes.otherOptions}>
      {loginType === 'user' &&
        <FacebookLogin
          buttonStyle={{
            paddingBottom: 16,
            paddingTop: 11,
            height: 40,
            fontSize: 16,
            marginBottom: 16,
          }}
          appId="2741491196065378"
          fields="name,email"
          onClick={() => onFacebookClick()}
          callback={(response)=>{
            const loginDetails = {
              UserFaceBookId:response.id,
              UserEmail:response.email,
              UserFacebookName:response.name,
            }
            attemptLogin('facebook', loginDetails);
          }}
          icon="fa-facebook"
        />
      }
      {loginType === 'user' ? 
        <div>
          Are you a partner?&nbsp;
          <Link to={'/login/partner'}>Login as partner</Link>
        </div> :
        <div>
          Are you a user?&nbsp;
          <Link to={'/login/user'}>Login as user</Link>
        </div>
      }
    </div>
  )
}