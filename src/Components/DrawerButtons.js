import React from 'react';
import { makeStyles, List, ListItem, Divider } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    overflow: 'auto',
  },
  divider: {
    marginTop:theme.spacing(1),
    marginBottom:theme.spacing(1)
  }
}))

/**
 * 
 * @typedef {Object} Button 
 * @property {string} label
 * @property {*} onClick
 * @property {boolean} isDivider
 * @property {boolean} isSelected
 */

/**
 * 
 * @param {Object} props 
 * @param {Button[]} props.buttons
 */
export default function DrawerButtons(props) {
  const classes = useStyles();
  const { buttons } = props;
  
  return (
    <div className={classes.root}>
      <List>
      {buttons.map((button, index) => (
        button.isDivider ?
          <Divider 
            key={index} 
            className={classes.divider}
          /> :
          <ListItem
            key={index}
            button
            onClick={() => button.onClick()}
            selected={button.isSelected}
          >
            {button.label}
          </ListItem>
      ))}
      </List>
    </div>
  )
}