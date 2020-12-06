import React, { useState, useEffect } from 'react';
import userDestinationRatingApi from '../APIs/userDestinationRatingApi';
import destinationApi from '../APIs/destinationApi';
import { makeStyles, Typography, TextField, Button, Card, CardContent, CardHeader, CircularProgress, List, ListItem, ListItemText, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

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
}))

const NONE = 0;
const LOADING = 2;
const ERROR = -1;

export default function PartnerDestination() {
  const classes = useStyles();
  const [destinations, setDestinations] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [rating, setRating] = useState({});
  const [formState, setFormState] = useState({
    state:LOADING,
    errorMsg:''
  });
  const loginDetails = JSON.parse(sessionStorage.getItem("loginDetails"));
  const {ApiKey} = loginDetails;
  const reload = (ApiKey) => {
    setRating({});
    setRatings([]);
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

    apiCall(() => userDestinationRatingApi.getSelf(ApiKey), setRatings);
    apiCall(() => destinationApi.destinationGet(), setDestinations);
  }

  useEffect(() => {
    reload(ApiKey);
  }, [ApiKey])

  const submitActions = {
    "Add":() => userDestinationRatingApi.add(ApiKey, rating),
    "Update":() => userDestinationRatingApi.update(ApiKey, rating),
    "Delete":() => userDestinationRatingApi.delete(ApiKey, rating.idUserDestinationRating),
  }

  const onSubmit = (action) => {
    setFormState({errorMsg:'', state:LOADING});
    const submitAction = submitActions[action];
    submitAction().then(response => {
      if(response.error_code === '0') {
        window.alert(action + ' user rating successful!');
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

  const listCardProps = {
    formState, ratings
  }
  const formProps = {
    formState, destinations,
    modifyDestination: onSubmit,
    ratings, rating, setRating
  }

  return (
    <div className={classes.root}>
      <FormCard {...formProps}/>
      <ListCard {...listCardProps}/>
    </div>
  )
}

function ListCard(props) {
  const classes = useStyles();
  const {ratings, formState} = props;
  return (
    <Card className={classes.card}>
      <CardHeader
        className={classes.header}
        title='Ratings List'
      />
      <CardContent>
        {formState.state === LOADING ? 
          <div className={classes.circleProgress}>
            <CircularProgress />
          </div> :
          <List>
            {ratings.length <= 0 &&
               <ListItem>
                <ListItemText secondary="No user ratings found" />
              </ListItem>
            }
            {ratings.map((rating) => (
              <ListItem key={rating.idUserDestinationRating}>
                <ListItemText 
                  className={classes.listItemText}
                  primary={"ID: " + rating.idUserDestinationRating + ",  " + rating.DestinationName} 
                  secondary={
                    "Rating: " + rating.Rating + "\n" +
                    "Comment: " + rating.RatingComment
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

function FormCard(props) {
  const classes = useStyles();
  const {formState, destinations} = props;
  const {ratings, modifyDestination} = props;
  const {rating, setRating} = props;

  const varNames = [
    ["DestinationName","Destination Name", true],
    ["RatingComment","RatingComment"],
  ]

  const buttonProps = [
    {label:"Add", isD:rating.idUserDestinationRating > -1},
    {label:"Update", isD:!(rating.idUserDestinationRating > -1)},
    {label:"Delete", isD:!(rating.idUserDestinationRating > -1)}
  ]

  const cardContent = (
    <CardContent className={classes.cardContent}>
      <FormControl
        fullWidth
      >
        <InputLabel>Select Rating</InputLabel>
        <Select
          value={rating.idUserDestinationRating || -1}
          onChange={event => setRating(ratings.find(rating => rating.idUserDestinationRating === event.target.value) || {})}
        >
          <MenuItem value={-1}>
            <em>Add New Rating</em>
          </MenuItem>
          {ratings.map(rating => (
            <MenuItem key={rating.idUserDestinationRating} value={rating.idUserDestinationRating}>
              {"ID: " + rating.idUserDestinationRating + ", " + rating.DestinationName}
            </MenuItem>
          ))}
        </Select>
      </FormControl><br/>
      <FormControl
        fullWidth
        margin='normal'
        disabled={rating.idUserDestinationRating > -1}
      >
        <InputLabel>Select Location</InputLabel>
        <Select
          value={parseInt(rating.RatingDestination) || ''}
          onChange={event => {
            const destination = destinations.find(destination => parseInt(destination.idDestination) === event.target.value);
            setRating({
              ...rating,
              ...destination,
              RatingDestination:destination.idDestination  
            })
          }}
        >
          {destinations.map(destination => (
            <MenuItem key={destination.idDestination} value={parseInt(destination.idDestination)}>
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
            label={varName[1]}
            value={
              rating[varName[0]] || 
              (varName[2] ? 'NA' : '')
            }
            onChange={event => setRating({
              ...rating,
              [varName[0]]: event.target.value
            })}
            InputProps={{
              style:{background: varName[2] ? '#EBEBE4' : ''},
              readOnly: varName[2],
            }}
          />
        </div>
      ))}
      <FormControl
        fullWidth
        margin='normal'
      >
        <InputLabel>Rating</InputLabel>
        <Select
          value={rating.Rating || ''}
          onChange={event => setRating({
            ...rating,
            'Rating':event.target.value
          })}
        >
          <MenuItem value={1}>1 Stars</MenuItem>
          <MenuItem value={2}>2 Stars</MenuItem>
          <MenuItem value={3}>3 Stars</MenuItem>
          <MenuItem value={4}>4 Stars</MenuItem>
          <MenuItem value={5}>5 Stars</MenuItem>
        </Select>
      </FormControl><br/>
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
          title='Rate Destination'
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