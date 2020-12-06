import React from 'react';
import {drawerWidth, appBarHeight, devWarningHeight} from './_globals';
import { makeStyles } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
  root: {
    width:drawerWidth
  },
  drawerPaper: {
    width:drawerWidth
  },
  drawerTopSpace: {
    height:appBarHeight - devWarningHeight,
    textAlign:'center'
  },
  devWarningSpace: {
    height: devWarningHeight,
    borderBottom:'1px solid',
    background:'bisque'
  }
}));

/**
 * 
 * @param {object} props 
 * @param {string} props.drawerTopComponents
 */
function DrawerComp(props) {
  const classes = useStyles();
  const {children} = props;
  return (
    <Drawer 
      className={classes.root}
      classes={{
        paper:classes.drawerPaper
      }}
      variant="permanent"
      open
    >
      <div className={classes.devWarningSpace}/>
      <DrawerTopSpace {...props}/>
      <Divider/>
      {children}
    </Drawer>
  );
}

function DrawerTopSpace(props) {
  const classes = useStyles();
  const {drawerTopComponents} = props;
  return (
    <div className={classes.drawerTopSpace}>
      {drawerTopComponents}
    </div>
  );
}

export default DrawerComp;
