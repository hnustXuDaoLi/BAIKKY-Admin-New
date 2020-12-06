import React from 'react';
import {drawerWidth, appBarHeight} from './_globals';
import { makeStyles } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

const useStyles = makeStyles((theme) => ({
  root: {
    width:drawerWidth
  },
  drawerPaper: {
    width:drawerWidth
  },
  drawerTopComponent: {
    flex:1
  },
  drawerTopSpace: {
    display:'flex',
    height:appBarHeight,
    paddingLeft:theme.spacing(2),
    paddingRight:theme.spacing(2),
    paddingTop:theme.spacing(1)
  }
}));

/**
 * 
 * @param {object} props 
 * @param {string} props.drawerTopComponents
 */
function SlideDrawerComp(props) {
  const classes = useStyles();
  const {drawerOpen, setDrawerClose} = props;

  const {children} = props;
  return (
    <Drawer 
      className={classes.root}
      classes={{
        paper:classes.drawerPaper
      }}
      open={drawerOpen}
      onClose={setDrawerClose}
      anchor='left'
    >
      <DrawerTopSpace {...props}/>
      <Divider/>
      {children}
    </Drawer>
  );
}

function DrawerTopSpace(props) {
  const classes = useStyles();
  const {setDrawerClose, drawerTopComponents} = props;
  
  return (
    <div className={classes.drawerTopSpace}>
      <div className={classes.drawerTopComponent}>
        {drawerTopComponents}
      </div>
      <IconButton onClick={setDrawerClose}>
        <ChevronLeftIcon />
      </IconButton>
    </div>
  );
}

export default SlideDrawerComp;
