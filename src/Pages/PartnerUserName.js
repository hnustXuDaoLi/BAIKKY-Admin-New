import React, { useState, useEffect } from 'react';
import partnerApi from '../APIs/partnerApi';
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

export default function PartnerUserName() {
  const classes = useStyles();
  const [partner, setPartner] = useState({});
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
    partnerApi.getSelf(ApiKey).then(response => {
      if(response.error_code === 0) {
        setPartner(response.result);
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
    partner, setPartner
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
  const {partner, setPartner, modifyPartner} = props;

  const varNames = [
    ["PartnerName","Partner Name"],
  ]

  const buttonProps = [
    {label:"Update", isD:!(partner.idPartner > -1), type:"submit"}
  ];

  const cardContent = (
    <CardContent className={classes.cardContent}>
      {varNames.map((varName, index) => (
        <div key={index}>
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
          title='Change User Name'
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