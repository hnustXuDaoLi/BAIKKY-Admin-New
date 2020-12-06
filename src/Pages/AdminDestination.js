import React, { useState, useEffect } from 'react';
import destinationApi from '../APIs/destinationApi';
import { makeStyles, Typography, TextField, Button, Card, CardContent, CardHeader, CircularProgress, List, ListItem, ListItemAvatar, Avatar, ListItemText, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
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
  imageDiv: {
    textAlign:'center'
  },
  image: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    width:250,
    height:250
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

export default function AdminDestination() {
  const classes = useStyles();
  const [destinations, setDestinations] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState({});
  const [formState, setFormState] = useState({
    state:LOADING,
    errorMsg:''
  });
  const loginDetails = JSON.parse(sessionStorage.getItem("loginDetails"));
  const {ApiKey} = loginDetails;
  const reload = (ApiKey) => {
    setSelectedDestination({});
    setDestinations([]);
    setFormState({
      state:LOADING, 
      errorMsg:''
    });
    destinationApi.destinationGet(ApiKey).then(response => {
      if(response.error_code === 0) {
        setDestinations(response.results);
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
    "Add":() => destinationApi.destinationAdd(ApiKey, selectedDestination),
    "Update":() => destinationApi.destinationUpdate(ApiKey, selectedDestination),
    "Delete":() => destinationApi.destinationDelete(ApiKey, selectedDestination),
  }
  const modifyDestination = (action) => {
    setFormState({errorMsg:'', state:LOADING});
    const modifyAction = modifyActions[action];
    modifyAction().then(response => {
      if(response.error_code === '0') {
        window.alert(action + ' destination successful!');
        reload();
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
    formState, destinations
  }
  const destinationFormProps = {
    formState, destinations,
    modifyDestination,
    destination:selectedDestination, 
    setDestination:setSelectedDestination
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
  const {destinations, formState} = props;
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
            {destinations.map((destination) => (
              <ListItem key={destination.idDestination} button>
                <ListItemAvatar>
                  <Avatar
                    src={'data:image/jpeg;base64,' + destination.DestinationPictureBase64}
                  >
                    {!destination.DestinationPictureBase64 &&
                      <ImageIcon />
                    }
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  className={classes.listItemText}
                  primary={destination.DestinationName} 
                  secondary={destination.DestinationDex}
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
  const {destination, setDestination, modifyDestination} = props;
  const varNames = [
    ["DestinationName","Destination Name"],
    ["DestinationUrl","Destination Url"],
    ["DestinationSpatialX","Destination Latitude","number"],
    ["DestinationSpatialY","Destination Longitude","number"],
  ]

  const buttonProps = [
    {label:"Add", isD:destination.idDestination > -1},
    {label:"Update", isD:!(destination.idDestination > -1)},
    {label:"Delete", isD:!(destination.idDestination > -1)}
  ]

  const cardContent = (
    <CardContent className={classes.cardContent}>
      <FormControl
        fullWidth
      >
        <InputLabel>Select Destination</InputLabel>
        <Select
          value={destination.idDestination || -1}
          onChange={event => setDestination(destinations.find(destination => destination.idDestination === event.target.value) || {})}
        >
          <MenuItem value={-1}>
            <em>Add New Destination</em>
          </MenuItem>
          {destinations.map(destination => (
            <MenuItem key={destination.idDestination} value={destination.idDestination}>
              {destination.DestinationName}
            </MenuItem>
          ))}
        </Select>
      </FormControl><br/>
      {varNames.map((varName, index) => (
        <div key={index}>
          <TextField
            margin='normal'
            fullWidth
            autoFocus={index === 0}
            label={varName[1]}
            value={destination[varName[0]] ||''}
            onChange={event => setDestination({
              ...destination,
              [varName[0]]: event.target.value
            })}
            type={varName[2] || ""}
          />
        </div>
      ))}
      <TextField
        margin='normal'
        fullWidth
        multiline
        label='Destination Description'
        value={destination["DestinationDex"] ||''}
        onChange={event => setDestination({
          ...destination,
          'DestinationDex': event.target.value
        })}
      />
      <div className={classes.imageDiv}>
        {destination.DestinationPictureBase64 ? 
          <img
            style={{marginBottom:32, maxWidth:250, maxHeight:250}}
            className={classes.image}
            alt='destination'
            src={destination.DestinationPictureBase64 && "data:image/png;base64," + destination.DestinationPictureBase64}
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
              console.log("length", event.target.files.length)
              const fileReader = new FileReader();
              fileReader.onloadend = () => (
                setDestination({
                  ...destination,
                  DestinationPictureBase64:fileReader.result.substring(
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