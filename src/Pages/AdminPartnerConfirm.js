import React, { useState, useEffect } from 'react';
import partnerApi from '../APIs/partnerApi';
import { makeStyles, Card, CardContent, CardHeader, CircularProgress, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Tooltip, Typography } from '@material-ui/core';
import ConfirmIcon from '@material-ui/icons/Check';
import RejectIcon from '@material-ui/icons/Clear';

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
  listItemText: {
    whiteSpace:'pre'
  },
  nested: {
    paddingLeft: theme.spacing(4),
    whiteSpace:'pre'
  },
  secondaryActionButton: {
    marginLeft:theme.spacing(2)
  }
}))

const NONE = 0;
const LOADING = 2;
const ERROR = -1;

export default function AdminPartnerConfirm() {
  const classes = useStyles();
  const [partners, setPartners] = useState([]);
  const [formState, setFormState] = useState({
    state:LOADING,
    errorMsg:''
  });
  const loginDetails = JSON.parse(sessionStorage.getItem("loginDetails"));
  const {ApiKey} = loginDetails;
  const reload = (ApiKey) => {
    setPartners([]);
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

    apiCall(() => partnerApi.get(ApiKey), setPartners);
  }

  const modifyPartner = (idPartner, confirm) => {
    setFormState({errorMsg:'', state:LOADING});
    partnerApi.confirm(ApiKey, idPartner, confirm).then(response => {
      if(response.error_code === '0') {
        window.alert("Partner Updated!");
        reload(ApiKey);
      }
      else {
        setFormState({
          errorMsg:response.message,
          state:ERROR
        })
      }
    })
  }

  useEffect(() => {
    reload(ApiKey);
  }, [ApiKey])

  const partnerListProps = {
    formState, partners, modifyPartner
  }

  return (
    <div className={classes.root}>
      <PartnerList {...partnerListProps}/>
    </div>
  )
}

function PartnerList(props) {
  const classes = useStyles();
  const {partners, formState, modifyPartner} = props;

  const unconfirmedPartners = partners.filter(partner => partner.PartnerStatus === 'R')
  const otherPartners = partners.filter(partner => partner.PartnerStatus !== 'R')

  const partnerListItem = (partner) => (
    <ListItem 
      key={partner.idPartner}
    >
      <ListItemText 
        className={classes.listItemText}
        primary={partner.PartnerName} 
        secondary={
          "Status: " + partner.PartnerStatus + "\n" + 
          "Status Dex: " + partner.PartnerStatusDex
        }
      />
      <ListItemSecondaryAction>
        <div>
          <IconButton 
            className={classes.secondaryActionButton}
            edge="end" aria-label="confirm"
            disabled={!['R','N'].includes(partner.PartnerStatus)}
            onClick={() => modifyPartner(partner.idPartner, true)}
          >
            <Tooltip title="Confirm">
              <ConfirmIcon />
            </Tooltip>
          </IconButton>
          <IconButton 
            className={classes.secondaryActionButton}
            edge="end" aria-label="confirm"
            disabled={!['R'].includes(partner.PartnerStatus)}
            onClick={() => modifyPartner(partner.idPartner, false)}
          >
            <Tooltip title="reject">
              <RejectIcon />
            </Tooltip>
          </IconButton>
        </div>
      </ListItemSecondaryAction>
    </ListItem>
  )

  return (
    <Card className={classes.card}>
      <CardHeader
        className={classes.header}
        title='Confirm a Partner'
      />
      <CardContent>
        {formState.state === LOADING ? 
          <div className={classes.circleProgress}>
            <CircularProgress />
          </div> :
          <List>
            {unconfirmedPartners.map((partner) => (
              partnerListItem(partner)
            ))}
            {otherPartners.map((partner) => (
              partnerListItem(partner)
            ))}
          </List>
        }
        <Typography 
          className={classes.errorMessage}
          align='center'
        >
          {formState.state === ERROR ?
            formState.errorMsg : ''
          }
        </Typography>
      </CardContent>
    </Card>
  )
}