import React from 'react';
import {drawerWidth, appBarHeight} from './_globals';
import { makeStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';

import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme) => ({
  root: {
    height:appBarHeight,
    marginLeft: drawerWidth,
    width:'100%',
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  }
}));

/**
 * 
 * @param {object} props 
 * @param {string} props.backgroundColor
 */
function AppBarComp(props) {
  const classes = useStyles();
  const {backgroundColor, setDrawerOpen} = props;
  return (
    <AppBar 
      style={{background:backgroundColor}}
      className={classes.root}
      position='fixed'
    >
      <Toolbar>
        <Hidden mdUp>
          <IconButton
            onClick={setDrawerOpen}
            edge="start"
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
}

export default AppBarComp;
