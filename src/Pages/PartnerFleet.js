import React, { useState, useEffect } from 'react';
import partnerFleetApi from '../APIs/partnerFleetApi';
import { makeStyles, Typography, TextField, Button, Card, CardContent, CardHeader, CircularProgress, List, ListItem, ListItemText, FormControl, InputLabel, Select, MenuItem, ListItemAvatar, Avatar } from '@material-ui/core';
import ImageIcon from '@material-ui/icons/Image';
import ImageTwoToneIcon from '@material-ui/icons/ImageTwoTone';

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
  imageDiv: {
    textAlign:'center'
  },
  image: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    width:250,
    height:250
  },
}))

const NONE = 0;
const LOADING = 2;
const ERROR = -1;

export default function PartnerFleet() {
  const classes = useStyles();
  const [fleets, setFleets] = useState([]);
  const [fleet, setFleet] = useState({});
  const [formState, setFormState] = useState({
    state:LOADING,
    errorMsg:''
  });
  const loginDetails = JSON.parse(sessionStorage.getItem("loginDetails"));
  const {ApiKey} = loginDetails;
  const reload = (ApiKey) => {
    setFleet({});
    setFleets([]);
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

    apiCall(() => partnerFleetApi.get({FleetPartner: loginDetails.idPartner}), setFleets);
  }

  useEffect(() => {
    reload(ApiKey);
  }, [ApiKey])

  const modifyActions = {
    "Add":() => partnerFleetApi.add(ApiKey, fleet),
    "Update":() => partnerFleetApi.update(ApiKey, fleet),
    "Delete":() => partnerFleetApi.delete(ApiKey, fleet.idFleet),
  }

  const modifyFleet = (action) => {
    setFormState({errorMsg:'', state:LOADING});
    const modifyAction = modifyActions[action];
    modifyAction().then(response => {
      if(response.error_code === '0') {
        window.alert(action + ' partner fleet successful!');
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

  const fleetListProps = {
    formState, fleets
  }
  const fleetFormProps = {
    formState, modifyDestination: modifyFleet,
    fleets, fleet, setFleet
  }

  return (
    <div className={classes.root}>
      <FleetForm {...fleetFormProps}/>
      <FleetList {...fleetListProps}/>
    </div>
  )
}

function FleetList(props) {
  const classes = useStyles();
  const {fleets, formState} = props;
  return (
    <Card className={classes.card}>
      <CardHeader
        className={classes.header}
        title='Fleet List'
      />
      <CardContent>
        {formState.state === LOADING ? 
          <div className={classes.circleProgress}>
            <CircularProgress />
          </div> :
          <List>
            {fleets.length <= 0 &&
               <ListItem>
                <ListItemText secondary="No partner fleets found" />
              </ListItem>
            }
            {fleets.map((fleet) => (
              <ListItem key={fleet.idFleet}>
                <ListItemAvatar>
                  <Avatar
                    src={'data:image/jpeg;base64,' + fleet.FleetPictureBase64}
                  >
                    {!fleet.FleetPictureBase64 &&
                      <ImageIcon />
                    }
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  className={classes.listItemText}
                  primary={"Fleet ID: " + fleet.idFleet} 
                  secondary={fleet.FleetDex}
                />
              </ListItem>
            ))}
          </List>
        }
      </CardContent>
    </Card>
  )
}

function FleetForm(props) {
  const classes = useStyles();
  const {formState} = props;
  const {fleets, modifyDestination} = props;
  const {fleet, setFleet} = props;

  const varNames = [
    ["idFleet","Fleet ID", true],
    ["FleetDex","Fleet Description"],
  ]
  const buttonProps = [
    {label:"Add", isD:fleet.idFleet > -1},
    {label:"Update", isD:!(fleet.idFleet > -1)},
    {label:"Delete", isD:!(fleet.idFleet > -1)}
  ]

  const cardContent = (
    <CardContent className={classes.cardContent}>
      <FormControl
        fullWidth
      >
        <InputLabel>Select Fleet</InputLabel>
        <Select
          value={fleet.idFleet || -1}
          onChange={event => setFleet(fleets.find(fleet => fleet.idFleet === event.target.value) || {})}
        >
          <MenuItem value={-1}>
            <em>Add New Fleet</em>
          </MenuItem>
          {fleets.map(fleet => (
            <MenuItem key={fleet.idFleet} value={fleet.idFleet}>
              {"ID: " + fleet.idFleet}
            </MenuItem>
          ))}
        </Select>
      </FormControl><br/>
      {varNames.map((varName, index) => (
        <div key={index}>
          <TextField
            margin='normal'
            fullWidth
            label={varName[1]}
            value={
              fleet[varName[0]] || 
              (varName[2] ? 'NA' : '')
            }
            onChange={event => setFleet({
              ...fleet,
              [varName[0]]: event.target.value
            })}
            InputProps={{
              style:{background: varName[2] ? '#EBEBE4' : ''},
              readOnly: varName[2],
            }}
          />
        </div>
      ))}
      <div className={classes.imageDiv}>
        {fleet.FleetPictureBase64 ? 
          <img
            style={{marginBottom:32, maxWidth:250, maxHeight:250}}
            className={classes.image}
            alt='fleet'
            src={fleet.FleetPictureBase64 && "data:image/png;base64," + fleet.FleetPictureBase64}
          /> :
          <ImageTwoToneIcon
            className={classes.image}
          />
        }
        <br/>
        <input
          accept="image/*"
          className={classes.input}
          id="contained-button-file-update"
          type="file"
          style={{display:'none'}}
          onChange={event => {
            if(event.target.files.length > 0) {
              const fileReader = new FileReader();
              fileReader.onloadend = () => (
                setFleet({
                  ...fleet,
                  FleetPictureBase64:fileReader.result.substring(
                    fileReader.result.indexOf("base64,") + 7
                  )
                })
              );
              fileReader.readAsDataURL(event.target.files[0])
            }
          }}
        />
        <label htmlFor="contained-button-file-update">
          <Button 
            className={classes.halfWidthButton}
            variant="outlined" 
            component="span"
          >
            Select Image
          </Button>
        </label>
      </div>
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
          title='Update Fleet'
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