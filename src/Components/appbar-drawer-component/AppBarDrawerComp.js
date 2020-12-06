import React, { useState } from 'react';
import Hidden from '@material-ui/core/Hidden';

import AppBarComp from './AppBarComp';
import DrawerComp from './DrawerComp';
import SlideDrawerComp from './SlideDrawerComp';

/**
 * 
 * @param {object} props 
 * @param {string} props.appBarProps.backgroundColor
 * @param {object[]} props.drawerProps.drawerTopComponents
 * @param {object[]} props.drawerChildren
 */
function AppBarDrawerComp(props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const {appBarProps, drawerProps} = props;
  const {drawerChildren} = props;
  return (
    <div>
      <AppBarComp 
        {...appBarProps} 
        setDrawerOpen={() => setDrawerOpen(true)}
      />
      <Hidden smDown>
        <DrawerComp 
          {...drawerProps}
          drawerOpen={drawerOpen}
          setDrawerClose={() => setDrawerOpen(false)}
        >
          {drawerChildren}
        </DrawerComp>
      </Hidden>
      <Hidden mdUp>
        <SlideDrawerComp 
          {...drawerProps}
          drawerOpen={drawerOpen}
          setDrawerClose={() => setDrawerOpen(false)}
        >
          {drawerChildren}
        </SlideDrawerComp>
      </Hidden>
    </div>
  );
}

export default AppBarDrawerComp;