import React, { useState, useEffect, Fragment } from 'react';
import partnerBookingApi from '../APIs/partnerBookingApi';
import partnerBookingFleetApi from '../APIs/partnerBookingFleetApi';
import { makeStyles, Typography, TextField, Button, Card, CardContent, CardHeader, CircularProgress, List, ListItem, ListItemText, FormControl, InputLabel, Select, MenuItem, Collapse, Divider } from '@material-ui/core';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

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
  },
  listItemText: {
    whiteSpace:'pre'
  },
  nested: {
    paddingLeft: theme.spacing(4),
    whiteSpace:'pre'
  },
}))

const NONE = 0;
const LOADING = 2;
const ERROR = -1;

export default function PartnerBooking() {
  const classes = useStyles();
  const [bookings, setBookings] = useState([]);
  const [fleets, setFleets] = useState([]);
  const [booking, setBooking] = useState({});
  const [formState, setFormState] = useState({
    state:LOADING,
    errorMsg:''
  });
  const loginDetails = JSON.parse(sessionStorage.getItem("loginDetails"));
  const {ApiKey} = loginDetails;
  const reload = (ApiKey) => {
    setBooking({});
    setBookings([]);
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

    apiCall(() => partnerBookingApi.get(ApiKey), setBookings);
    apiCall(() => partnerBookingFleetApi.get(ApiKey), setFleets);
  }

  useEffect(() => {
    reload(ApiKey);
  }, [ApiKey])

  const modifyBookingActions = {
    "Quote":() => partnerBookingApi.quote(ApiKey, {...booking, QuoteApprove:true}),
    "Accept":() => partnerBookingApi.accept(ApiKey, {...booking, BookingAccept:true}),
    "Decline":() => partnerBookingApi.accept(ApiKey, {...booking, BookingAccept:false}),
  };

  const modifyBooking = (action, type) => {
    setFormState({errorMsg:'', state:LOADING});
    const modifyAction = modifyBookingActions[action];
    modifyAction().then(response => {
      if(response.error_code === '0') {
        window.alert(action + ' ' + type + ' successful!');
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

  const bookingListProps = {
    formState, bookings, fleets
  }
  const bookingFormProps = {
    formState, bookings,
    modifyBooking: (action) => modifyBooking(action, 'booking'),
    booking, setBooking,
  }

  return (
    <div className={classes.root}>
      <BookingForm {...bookingFormProps}/>
      <BookingList {...bookingListProps}/>
    </div>
  )
}

function BookingList(props) {
  const classes = useStyles();
  const {bookings, formState, fleets} = props;
  const [openIndex, setOpenIndex] = useState(-1);
  const filterFleet = (idBooking) => fleets.filter(fleet => fleet.BookingId === idBooking);
  console.log(bookings)

  return (
    <Card className={classes.card}>
      <CardHeader
        className={classes.header}
        title='Booking List'
      />
      <CardContent>
        {formState.state === LOADING ? 
          <div className={classes.circleProgress}>
            <CircularProgress />
          </div> :
          <List>
            {bookings.length <= 0 &&
              <ListItem button className={classes.nested} key={-1}>
                <ListItemText secondary="No bookings found" />
              </ListItem>
            }
            {bookings.map((booking, index) => (
              <Fragment key={index}>
                <ListItem  button
                  onClick={() => 
                    openIndex === booking.idBooking ? setOpenIndex(-1) : setOpenIndex(booking.idBooking)
                  }
                >
                  <ListItemText 
                    className={classes.listItemText}
                    primary={booking.UserName} 
                    secondary={
                      "Booking ID: \t" + booking.idBooking + "\n" +
                      "Status: \t\t" + booking.BookingStatusDex + "\n" +
                      "Quote: \t\t" + (booking.BookingQuotation || 'NA') + "\n" +
                      "Date/Time: \t" + booking.BookingDateFrom + " " + booking.BookingTimeFrom.substring(0,5) + "  -  " +
                      booking.BookingDateTo + " " + booking.BookingTimeTo.substring(0,5) + "\n" + 
                      "Comments: \t" + (booking.BookingComment || "NA")
                    }
                  />
                  {openIndex === booking.idBooking ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openIndex === booking.idBooking} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {filterFleet(booking.idBooking).length > 0 ? 
                      (filterFleet(booking.idBooking).map((fleet, index) => (
                        <ListItem button className={classes.nested} key={index}>
                          <ListItemText 
                            primary={"Fleet ID: " + fleet.idBookingFleet}
                            secondary={
                              "Fleet Type: \t" + fleet.FleetTypeDex + "\n" +
                              "Qty: \t\t" + fleet.BookingFleetQty + "\n" +
                              "Memo: \t\t" + (fleet.BookingFleetMemo || 'NA')
                            }
                          />
                        </ListItem>
                      ))) :
                      <ListItem button className={classes.nested} key={-1}>
                        <ListItemText secondary="No fleet found for this booking" />
                      </ListItem>
                    }
                  </List>
                  <Divider/>
                </Collapse>
              </Fragment>
            ))}
          </List>
        }
      </CardContent>
    </Card>
  )
}

function BookingForm(props) {
  const classes = useStyles();
  const {formState, bookings} = props;
  const {booking, setBooking, modifyBooking} = props;

  const varNames = [
    ["idBooking","Booking ID", true],
    ["UserName","Booking User", true],
    ["BookingStatusDex","Booking Status", true],
    ["BookingDateFrom", "Booking Date From", true],
    ["BookingTimeFrom", "Booking Time From", true],
    ["BookingDateTo", "Booking Date To", true],
    ["BookingTimeTo", "Booking Time To", true],
    ["BookingQuotation", "Booking Quotation", false, 'number'],
    ["BookingComment", "Booking Comment", false],
  ]

  const buttonProps = [
    {label:"Quote", isD:booking.BookingStatus !== 'Q', type:"submit"},
    {label:"Accept", isD:booking.BookingStatus !== 'A'},
    {label:"Decline", isD:!(['Q','A'].includes(booking.BookingStatus))},
  ]

  const cardContent = (
    <CardContent className={classes.cardContent}>
      <FormControl
        fullWidth
      >
        <InputLabel>Select Booking</InputLabel>
        <Select
          autoFocus
          value={booking.idBooking || ''}
          onChange={event => setBooking(bookings.find(booking => booking.idBooking === event.target.value) || {})}
        >
          {bookings.map(booking => (
            <MenuItem key={booking.idBooking} value={booking.idBooking}>
              {"Booking ID: " + booking.idBooking}
            </MenuItem>
          ))}
        </Select>
      </FormControl><br/>
      {varNames.map((varName, index) => (
        <div key={index}>
          <TextField
            type={varName[3]}
            margin='normal'
            fullWidth
            label={varName[1]}
            value={booking[varName[0]] || (varName[2] ? 'NA' : '')}
            onChange={event => setBooking({
              ...booking,
              [varName[0]]: event.target.value
            })}
            InputProps={{
              style:{background: varName[2] ? '#EBEBE4' : ''},
              readOnly: varName[2],
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
          type={buttonProp.type || ""}
          disabled={buttonProp.isD}
          onClick={
            buttonProp.type === "submit" ?
              "" :
              () => modifyBooking(buttonProp.label)
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
        modifyBooking("Quote");
      }}
    >
      <Card className={classes.card}>
        <CardHeader
          className={classes.header}
          title='Modify Booking'
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
