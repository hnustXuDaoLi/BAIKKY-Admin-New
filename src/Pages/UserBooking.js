import React, { useState, useEffect, Fragment } from 'react';
import userBookingApi from '../APIs/userBookingApi';
import userBookingFleetApi from '../APIs/userBookingFleetApi';
import searchApi from '../APIs/searchApi';
import utilApi from '../APIs/utilApi';
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

export default function UserBooking() {
  const classes = useStyles();
  const [bookings, setBookings] = useState([]);
  const [fleets, setFleets] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState({});
  const [selectedFleet, setSelectedFleet] = useState({});
  const [fleetTypes, setFleetTypes] = useState([]);
  const [partners, setPartners] = useState([]);
  const [formState, setFormState] = useState({
    state:LOADING,
    errorMsg:''
  });
  const loginDetails = JSON.parse(sessionStorage.getItem("loginDetails"));
  const {ApiKey} = loginDetails;
  const reload = (ApiKey) => {
    setSelectedBooking({});
    setBookings([]);
    setSelectedFleet({});
    setFleets([]);
    setFleetTypes([]);
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

    apiCall(() => userBookingApi.userBookingGet(ApiKey, {BookingStatus:'A,C,N,Q,P,U,R'}), setBookings);
    apiCall(() => userBookingFleetApi.get(ApiKey), setFleets);
    apiCall(searchApi.getPartner, setPartners);
    apiCall(utilApi.getFleetType, setFleetTypes);
  }

  useEffect(() => {
    reload(ApiKey);
  }, [ApiKey])

  const modifyBookingActions = {
    "Add":() => userBookingApi.userBookingAdd(ApiKey, selectedBooking),
    "Update":() => userBookingApi.userBookingUpdate(ApiKey, selectedBooking),
    "Delete":() => userBookingApi.userBookingDelete(ApiKey, selectedBooking.idBooking),
    "Confirm":() => userBookingApi.userBookingConfirm(ApiKey, selectedBooking.idBooking),
    "Accept":() => userBookingApi.userBookingAccept(ApiKey, selectedBooking.idBooking, 'A'),
    "Decline":() => userBookingApi.userBookingAccept(ApiKey, selectedBooking.idBooking, 'N'),
    "Start Edit":() => userBookingApi.userBookingAccept(ApiKey, selectedBooking.idBooking, 'R'),
  };

  const modifyBookingFleetActions = {
    "Add":() => userBookingFleetApi.add(ApiKey, {...selectedFleet, BookingId:selectedBooking.idBooking}),
    "Update":() => userBookingFleetApi.update(ApiKey, selectedFleet),
    "Delete":() => userBookingFleetApi.delete(ApiKey, selectedFleet.idBookingFleet),
  };

  const modifyBooking = (action, type) => {
    setFormState({errorMsg:'', state:LOADING});
    const modifyAction = type === 'booking' ?
      modifyBookingActions[action] : modifyBookingFleetActions[action];
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
    booking:selectedBooking, 
    setBooking:setSelectedBooking,
    partners
  }
  const bookingFleetFormProps = {
    formState,
    modifyFleet: (action) => modifyBooking(action, 'fleet'),
    fleets:fleets.filter(fleet => fleet.BookingId === selectedBooking.idBooking),
    booking:selectedBooking, 
    fleet:selectedFleet,
    setFleet:setSelectedFleet,
    fleetTypes
  }

  return (
    <div className={classes.root}>
      <UserBookingForm {...bookingFormProps}/>
      <UserBookingFleetForm {...bookingFleetFormProps}/>
      <UserBookingList {...bookingListProps}/>
    </div>
  )
}

function UserBookingList(props) {
  const classes = useStyles();
  const {bookings, formState, fleets} = props;
  const [openIndex, setOpenIndex] = useState(-1);
  const filterFleet = (idBooking) => fleets.filter(fleet => fleet.BookingId === idBooking);

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
            {bookings.map((booking, index) => (
              <Fragment key={index}>
                <ListItem  button
                  onClick={() => 
                    openIndex === booking.idBooking ? setOpenIndex(-1) : setOpenIndex(booking.idBooking)
                  }
                >
                  <ListItemText 
                    className={classes.listItemText}
                    primary={booking.PartnerName} 
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

function UserBookingForm(props) {
  const classes = useStyles();
  const {formState, bookings} = props;
  const {booking, modifyBooking} = props;
  const {partners} = props;

  const setBooking = newBooking => (
    props.setBooking({
      ...newBooking,
      BookingDateTimeFrom :
        (newBooking.BookingDateFrom ? (
          newBooking.BookingDateFrom.substring(8,10) +
          newBooking.BookingDateFrom.substring(5,7) +
          newBooking.BookingDateFrom.substring(0,4)) : "") +
        (newBooking.BookingTimeFrom ? (
          newBooking.BookingTimeFrom.substring(0,2) +
          newBooking.BookingTimeFrom.substring(3,5)) : ""),
      BookingDateTimeTo :
        (newBooking.BookingDateTo ? (
          newBooking.BookingDateTo.substring(8,10) +
          newBooking.BookingDateTo.substring(5,7) +
          newBooking.BookingDateTo.substring(0,4)) : "") + 
        (newBooking.BookingTimeTo ? (
          newBooking.BookingTimeTo.substring(0,2) +
          newBooking.BookingTimeTo.substring(3,5)) : "")
    })
  )

  const readOnlyVars = [
    ["idBooking","Booking ID"],
    ["PartnerName","Booking Partner"],
    ["BookingQuotation","Booking Quotation"],
    ["BookingStatusDex","Booking Status"],
  ]

  const dateTimeVars = [
    ["BookingDateFrom", "Booking Date From", "date"],
    ["BookingTimeFrom", "Booking Time From", "time"],
    ["BookingDateTo", "Booking Date To", "date"],
    ["BookingTimeTo", "Booking Time To", "time"],
  ]

  const buttonProps = [
    {label:"Add", isD:booking.idBooking > -1, type:"submit"},
    {label:"Confirm", isD:booking.BookingStatus !== 'R'},
    {label:"Update", isD:booking.BookingStatus !== 'R'},
    {label:"Delete", isD:!(['A','C','R'].includes(booking.BookingStatus))},
    {label:"Accept", isD:!(['P','U'].includes(booking.BookingStatus))},
    {label:"Decline", isD:!(['P','U'].includes(booking.BookingStatus))},
    {label:"Start Edit", isD:!(['P','U'].includes(booking.BookingStatus))},
  ]

  const cardContent = (
    <CardContent className={classes.cardContent}>
      <FormControl
        fullWidth
      >
        <InputLabel>Select Booking</InputLabel>
        <Select
          value={booking.idBooking || -1}
          onChange={event => setBooking(bookings.find(booking => booking.idBooking === event.target.value) || {})}
        >
          <MenuItem value={-1}>
            <em>Add New Booking</em>
          </MenuItem>
          {bookings.map(booking => (
            <MenuItem key={booking.idBooking} value={booking.idBooking}>
              {"Booking ID: " + booking.idBooking}
            </MenuItem>
          ))}
        </Select>
      </FormControl><br/>
      {readOnlyVars.map((varName, index) => (
        <div key={index}>
          <TextField
            type='readonly'
            margin='normal'
            fullWidth
            autoFocus={index === 0}
            label={varName[1]}
            value={booking[varName[0]] ||'NA'}
            onChange={event => setBooking({
              ...booking,
              [varName[0]]: event.target.value
            })}
            InputProps={{
              style:{background: '#EBEBE4'},
              readOnly: true,
            }}
          />
        </div>
      ))}
      {!booking.idBooking &&
        <FormControl
          fullWidth
          required
          margin='normal'
        >
          <InputLabel>Select Partner</InputLabel>
          <Select
            value={booking.BookingPartner || ''}
            onChange={event => {
              const partner = partners.find(partner => partner.idPartner === event.target.value) || {}
              setBooking({
                ...booking,
                BookingPartner:partner.idPartner,
                PartnerName: partner.PartnerName
              })
            }}
          >
            {partners.map(partner => (
              <MenuItem key={partner.idPartner} value={partner.idPartner}>
                {partner.PartnerName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      }<br/>
      {dateTimeVars.map((dateTimeVar, index) => (
        <div key={index}>
          <TextField
            required
            type={dateTimeVar[2]}
            margin='normal'
            fullWidth
            autoFocus={index === 0}
            label={dateTimeVar[1]}
            value={booking[dateTimeVar[0]] || ''}
            onChange={event => setBooking({
              ...booking,
              [dateTimeVar[0]]: event.target.value
            })}
            InputLabelProps={{
              shrink: true,
              style:{background: (booking.BookingStatus && booking.BookingStatus !== 'R') ? '#EBEBE4' : ''},
              readOnly: booking.BookingStatus && booking.BookingStatus !== 'R',
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
        modifyBooking("Add");
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

function UserBookingFleetForm(props) {
  const classes = useStyles();
  const {formState} = props;
  const {fleet, fleets, fleetTypes} = props;
  const {booking, setFleet, modifyFleet} = props;

  const fleetVars = [
    ["BookingFleetQty","Booking Fleet Quantity", "number"],
    ["BookingFleetMemo","Booking Fleet Memo"],
  ]

  const buttonProps = [
    {label:"Add", isD:(fleet.idBookingFleet || booking.BookingStatus !== 'R')},
    {label:"Update", isD:(!fleet.idBookingFleet || booking.BookingStatus !== 'R')},
    {label:"Delete", isD:(!fleet.idBookingFleet || booking.BookingStatus !== 'R')},
  ]

  const cardContent = (
    <CardContent className={classes.cardContent}>
      <FormControl
        fullWidth
        margin='normal'
      >
        <InputLabel>Select Fleet</InputLabel>
        <Select
          value={fleet.idBookingFleet || -1}
          onChange={event => setFleet(fleets.find(fleet => fleet.idBookingFleet === event.target.value) || {})}
        >
          <MenuItem value={-1}>
            <em>Add New Fleet</em>
          </MenuItem>
          {fleets.map(fleet => (
            <MenuItem key={fleet.idBookingFleet} value={fleet.idBookingFleet}>
              {"Fleet ID: " + fleet.idBookingFleet}
            </MenuItem>
          ))}
        </Select>
      </FormControl><br/>
      <FormControl
        fullWidth
        margin='normal'
        required
      >
        <InputLabel>Select Fleet Type</InputLabel>
        <Select
          value={fleet.BookingFleetType || ''}
          onChange={event => setFleet({
            ...fleet,
            BookingFleetType: event.target.value
          })}
        >
          {fleetTypes.map(fleetType => (
            <MenuItem key={fleetType.idFleetType} value={fleetType.idFleetType}>
              {fleetType.FleetTypeDex}
            </MenuItem>
          ))}
        </Select>
      </FormControl><br/>
      {fleetVars.map((varName, index) => (
        <div key={index}>
          <TextField
            required={varName[0] !== 'BookingFleetMemo'}
            margin='normal'
            type={varName[2] || ''}
            fullWidth
            autoFocus={index === 0}
            label={varName[1]}
            value={fleet[varName[0]] ||''}
            onChange={event => setFleet({
              ...fleet,
              [varName[0]]: event.target.value
            })}
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
          onClick={() => modifyFleet(buttonProp.label)}
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
          title='Modify Booking Fleets'
        />
        {formState.state === LOADING ?
          <div className={classes.circleProgress}>
            <CircularProgress />
          </div> :
          (booking.BookingStatus === 'R' ?
            cardContent : 
            <CardContent className={classes.cardContent}>
              The booking you have selected cannot be edited, select another booking or click "Start Edit"
            </CardContent>
          )
        }
      </Card>
    </form>
  )
}