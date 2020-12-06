import React from 'react';
import SiteRouting from './Site/SiteRouting';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    height:'100vh'
  },
  devWarning: {
    textAlign:'center',
    padding:theme.spacing(2),
    borderBottom:'1px solid',
    font:'bold 16px arial',
    backgroundColor:'bisque'
  }
}))


function App() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.devWarning}>
        WARNING! This is a development environment!
      </div>
      <SiteRouting/>
    </div>
  );
}

export default App;
