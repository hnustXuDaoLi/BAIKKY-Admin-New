import React, { useState, useEffect } from 'react';
import userApi from '../APIs/userApi';
import { makeStyles, Card, CardContent, CardHeader, CircularProgress, List, ListItem, ListItemText } from '@material-ui/core';


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

export default function AdminUserList() {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [formState, setFormState] = useState({
    state:LOADING,
    errorMsg:''
  });
  const loginDetails = JSON.parse(sessionStorage.getItem("loginDetails"));
  const {ApiKey} = loginDetails;
  const reload = (ApiKey) => {
    setUsers([]);
    setFormState({
      state:LOADING, 
      errorMsg:''
    });

    const apiCall = (api, setCallback) => {
      api().then(response => {
        if(response.error_code === "0") {
          setCallback(response.results || []);
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

    apiCall(() => userApi.get(ApiKey), setUsers);
  }

  useEffect(() => {
    reload(ApiKey);
  }, [ApiKey])

  const userListProps = {
    formState, users
  }

  return (
    <div className={classes.root}>
      <UserList {...userListProps}/>
    </div>
  )
}

function UserList(props) {
  const classes = useStyles();
  const {users, formState} = props;


  return (
    <Card className={classes.card}>
      <CardHeader
        className={classes.header}
        title='User List'
      />
      <CardContent>
        {formState.state === LOADING ? 
          <div className={classes.circleProgress}>
            <CircularProgress />
          </div> :
          <List>
            {users.map((user, index) => (
              <ListItem 
                key={index}
              >
                <ListItemText 
                  className={classes.listItemText}
                  primary={user.UserName} 
                  secondary={
                    Object.keys(user).map(key => (
                      <div style={{display:'flex'}} key={key}>
                        <div style={{width:230}}>
                          {key}:
                        </div>
                        <div>
                          {user[key] || "NA"}
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