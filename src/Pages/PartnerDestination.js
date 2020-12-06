import React, { useState, useEffect } from 'react';
import destinationApi from '../APIs/destinationApi';
import { makeStyles, Typography, TextField, Button, Card, CardContent, CardHeader, CircularProgress, List, ListItem, ListItemText, FormControl, InputLabel, Select, MenuItem, Tooltip, InputAdornment } from '@material-ui/core';
import partnerDestinationApi from '../APIs/partnerDestinationApi';

import HelpIcon from '@material-ui/icons/Help';

const selectLocationHelpText = "Seleziona dalla lista l’itinerario per cui vuoi offrire un servizio, e descrivilo nella casella Destination Service";
const destLongitudeHelpText = "Inserisci in questa sezione tutti i servizi che intendi associare all’Itinerario selezionato"

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
  listItemText: {
    whiteSpace:'pre'
  },
  tooltipText: {
    '& .MuiTooltip-tooltip': { font:'16px arial' },
  },
}))

const NONE = 0;
const LOADING = 2;
const ERROR = -1;

export default function PartnerDestination() {
  const classes = useStyles();
  const [destinations, setDestinations] = useState([]);
  const [partnerDests, setPartnerDests] = useState([]);
  const [selectedPartnerDest, setSelectedPartnerDest] = useState({});
  const [formState, setFormState] = useState({
    state:LOADING,
    errorMsg:''
  });
  const loginDetails = JSON.parse(sessionStorage.getItem("loginDetails"));
  const {ApiKey} = loginDetails;
  const reload = (ApiKey) => {
    setSelectedPartnerDest({});
    setPartnerDests([]);
    setDestinations([]);
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

    apiCall(() => partnerDestinationApi.get(ApiKey), setPartnerDests);
    apiCall(() => destinationApi.destinationGet(), setDestinations);
  }

  useEffect(() => {
    reload(ApiKey);
  }, [ApiKey])

  const modifyActions = {
    "Add":() => partnerDestinationApi.add(ApiKey, selectedPartnerDest),
    "Update":() => partnerDestinationApi.update(ApiKey, selectedPartnerDest),
    "Delete":() => partnerDestinationApi.delete(ApiKey, selectedPartnerDest.idPartnerDestination),
  }

  const modifyDestination = (action) => {
    setFormState({errorMsg:'', state:LOADING});
    const modifyAction = modifyActions[action];
    modifyAction().then(response => {
      if(response.error_code === '0') {
        window.alert(action + ' partner destination successful!');
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

  const destinationListProps = {
    formState, partnerDests
  }
  const destinationFormProps = {
    formState, destinations,
    modifyDestination,
    partnerDests,
    partnerDest:selectedPartnerDest, 
    setPartnerDest:setSelectedPartnerDest
  }

  return (
    <div className={classes.root}>
      <DestinationForm {...destinationFormProps}/>
      <DestinationList {...destinationListProps}/>
    </div>
  )
}

function DestinationList(props) {
  const classes = useStyles();
  const {partnerDests, formState} = props;
  return (
    <Card className={classes.card}>
      <CardHeader
        className={classes.header}
        title='Destination List'
      />
      <CardContent>
        {formState.state === LOADING ? 
          <div className={classes.circleProgress}>
            <CircularProgress />
          </div> :
          <List>
            {partnerDests.length <= 0 &&
               <ListItem>
                <ListItemText secondary="No partner destinations found" />
              </ListItem>
            }
            {partnerDests.map((destination) => (
              <ListItem key={destination.idPartnerDestination}>
                <ListItemText 
                  className={classes.listItemText}
                  primary={destination.DestinationName} 
                  secondary={
                    "ID: " + destination.idPartnerDestination + "\n" +
                    "Service: " + destination.PartnerDestinationService
                  }
                />
              </ListItem>
            ))}
          </List>
        }
      </CardContent>
    </Card>
  )
}

function DestinationForm(props) {
  const classes = useStyles();
  const {formState, destinations} = props;
  const {partnerDests, modifyDestination} = props;
  const {partnerDest, setPartnerDest} = props;

  const varNames = [
    ["DestinationName","Destination Name", true],
    ["DestinationUrl","Destination Url", true],
    ["DestinationSpatialX","Destination Latitude", true],
    ["DestinationSpatialY","Destination Longitude", true],
    ["PartnerDestinationService","Destination Service"],
  ]
  const buttonProps = [
    {label:"Add", isD:partnerDest.idPartnerDestination > -1},
    {label:"Update", isD:!(partnerDest.idPartnerDestination > -1)},
    {label:"Delete", isD:!(partnerDest.idPartnerDestination > -1)}
  ]

  const cardContent = (
    <CardContent className={classes.cardContent}>
      <FormControl
        fullWidth
      >
        <InputLabel>Select Destination</InputLabel>
        <Select
          value={partnerDest.idPartnerDestination || -1}
          onChange={event => setPartnerDest(partnerDests.find(destination => destination.idPartnerDestination === event.target.value) || {})}
        >
          <MenuItem value={-1}>
            <em>Add New Destination</em>
          </MenuItem>
          {partnerDests.map(destination => (
            <MenuItem key={destination.idPartnerDestination} value={destination.idPartnerDestination}>
              {"ID: " + destination.idPartnerDestination + ", " + destination.DestinationName}
            </MenuItem>
          ))}
        </Select>
      </FormControl><br/>
      <FormControl
        fullWidth
        margin='normal'
        disabled={partnerDest.idPartnerDestination > -1}
      >
        <InputLabel>Select Location</InputLabel>
        <Tooltip
          title={selectLocationHelpText}
          PopperProps={{className:classes.tooltipText}}
        >
          <Select
            value={partnerDest.idDestination || ''}
            onChange={event => setPartnerDest({
              ...partnerDest,
              ...destinations.find(destination => destination.idDestination === event.target.value)
            })}
          >
            {destinations.map(destination => (
              <MenuItem key={destination.idDestination} value={destination.idDestination}
                disabled={partnerDests.findIndex(partnerDest => partnerDest.idDestination === destination.idDestination) > -1}
              >
                {destination.DestinationName}
              </MenuItem>
            ))}
          </Select>
        </Tooltip>
      </FormControl><br/>
      {varNames.map((varName, index) => (
        <div key={index}>
          <TextField
            margin='normal'
            fullWidth
            label={varName[1]}
            value={
              partnerDest[varName[0]] || 
              (varName[2] ? 'NA' : '')
            }
            onChange={event => setPartnerDest({
              ...partnerDest,
              [varName[0]]: event.target.value
            })}
            InputProps={{
              style:{background: varName[2] ? '#EBEBE4' : ''},
              readOnly: varName[2],
              endAdornment: varName[0] === "PartnerDestinationService" &&
                <InputAdornment position="end">
                  <Tooltip
                    title={destLongitudeHelpText}
                    PopperProps={{className:classes.tooltipText}}
                  >
                    <HelpIcon/>
                  </Tooltip>
                </InputAdornment>
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
          type="submit"
          disabled={buttonProp.isD}
          onClick={() => modifyDestination(buttonProp.label)}
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
      }}
    >
      <Card className={classes.card}>
        <CardHeader
          className={classes.header}
          title='Modify Destination'
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