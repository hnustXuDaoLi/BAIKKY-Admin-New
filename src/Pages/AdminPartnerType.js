import React, { useState, useEffect } from 'react';
import partnerApi from '../APIs/partnerApi';
import { makeStyles, Typography, Button, Card, CardContent, CardHeader, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

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

export default function AdminPartnerType() {
  const classes = useStyles();
  const [partners, setPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState({});
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
    partnerApi.get(ApiKey).then(response => {
      if(response.error_code === 0) {
        setPartners(response.results);
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
    "Update":() => partnerApi.update(ApiKey, 
      {
        idPartner: selectedPartner.idPartner,
        PartnerUserRight: selectedPartner.PartnerUserRight
      }),
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
    formState, partners,
    modifyPartner,
    partner:selectedPartner, 
    setPartner:setSelectedPartner,
    loginDetails
  }

  return (
    <div className={classes.root}>
      <PartnerForm {...partnerFormProps}/>
    </div>
  )
}

function PartnerForm(props) {
  const classes = useStyles();
  const {formState, partners} = props;
  const {partner, setPartner, modifyPartner} = props;
  const {loginDetails} = props;

  const partnerRights = [
    {val:91, authAdminRight:["10","11"], label:'Partner'},
    {val:60, authAdminRight:["10","11"], label:'Bike Rental Administrator'},
    {val:11, authAdminRight:["10"], label:'Partner Administrator'},
  ]

  const partnerRightsFiltered = partnerRights.filter(right => (
    right.authAdminRight.includes(loginDetails["PartnerUserRight"])
  ))

  const buttonProps = [
    {label:"Update", isD:!(partner.idPartner > -1), type:"submit"},
  ];

  const cardContent = (
    <CardContent className={classes.cardContent}>
      <FormControl
        fullWidth
        margin='normal'
      >
        <InputLabel>Select Partner</InputLabel>
        <Select
          value={partner.idPartner || ''}
          onChange={event => setPartner(partners.find(partner => partner.idPartner === event.target.value) || {})}
        >
          {partners.map(partner => (
            <MenuItem key={partner.idPartner} value={partner.idPartner}>
              {partner.PartnerName}
            </MenuItem>
          ))}
        </Select>
      </FormControl><br/>
      <FormControl
        fullWidth
        margin='normal'
      >
        <InputLabel>Partner Type</InputLabel>
        <Select
          value={partner.PartnerUserRight || ''}
          onChange={event => setPartner({
            ...partner,
            PartnerUserRight:event.target.value
          })}
        >
          {partnerRightsFiltered.map(right => (
            <MenuItem key={right.val} value={right.val}>
              {right.val}: {right.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl><br/>
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
          title='Set Partner Type'
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