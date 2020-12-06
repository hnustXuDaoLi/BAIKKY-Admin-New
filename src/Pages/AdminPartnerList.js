import React, { useState, useEffect } from 'react';
import partnerApi from '../APIs/partnerApi';
import { makeStyles, Card, CardContent, CardHeader, CircularProgress, List, ListItem, ListItemText } from '@material-ui/core';
import utilApi from '../APIs/utilApi';


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
}))

const NONE = 0;
const LOADING = 2;
const ERROR = -1;

export default function AdminPartnerList() {
  const classes = useStyles();
  const [partners, setPartners] = useState([]);
  const [countryCodes, setCountryCodes] = useState([]);
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

    apiCall(() => utilApi.getCountryCode(), setCountryCodes);
    apiCall(() => partnerApi.get(ApiKey), setPartners);
  }

  useEffect(() => {
    reload(ApiKey);
  }, [ApiKey])

  const partnerListProps = {
    formState, partners, countryCodes
  }

  return (
    <div className={classes.root}>
      <PartnerList {...partnerListProps}/>
    </div>
  )
}

function PartnerList(props) {
  const classes = useStyles();
  const {formState} = props;
  const {countryCodes} = props;

  const partners = props.partners.map(partner => {
    const countryCode = countryCodes.find(code => code.idCountryCode === partner.PartnerUserCountryCode)
    return ({
      ...partner,
      PartnerUserCountryCode: countryCode ? "+" + countryCode.CountryCodeVal : ""
    })
  })

  return (
    <Card className={classes.card}>
      <CardHeader
        className={classes.header}
        title='Partner List'
      />
      <CardContent>
        {formState.state === LOADING ? 
          <div className={classes.circleProgress}>
            <CircularProgress />
          </div> :
          <List>
            {partners.map((partner, index) => (
              <ListItem 
                key={index}
              >
                <ListItemText 
                  className={classes.listItemText}
                  primary={partner.PartnerName} 
                  secondary={
                    Object.keys(partner).map(key => (
                      <div style={{display:'flex'}} key={key}>
                        <div style={{width:230}}>
                          {key}:
                        </div>
                        <div>
                          {partner[key] || "NA"}
                        </div>
                      </div>
                    ))
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