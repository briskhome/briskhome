// @flow weak

import React from 'react';
import { connect } from 'react-redux';
import { createStyleSheet } from 'jss-theme-reactor';

import { AppBar, Avatar, Button, IconButton, Toolbar } from 'material-ui';
import MenuIcon from 'material-ui-icons/Menu';

const styleSheet = createStyleSheet('Header', () => ({
  appBar: {
    backgroundColor: 'white',
    textColor: '#f9d21c',
    position: 'relative',
  },
  avatar: {
    marginLeft: 24,
  },
  flex: {
    flex: 1,
  },
  iconButton: {
    color: 'black',
  },
  brandImage: {
    paddingLeft: 24,
    height: 36,
  },
}));

export const Header: Function = (props: Object): React.Element<*> => {
  const classes = props.styleManager.render(styleSheet);
  return (
    <AppBar className={classes.appBar}>
      <Toolbar>
        <IconButton accent className={classes.iconButton}>
          <MenuIcon />
        </IconButton>
        <img src='static/img/logo@256w.png' className={classes.brandImage} alt='' />
        <div className={classes.flex}>
          {/* Yes, this is an empty flex div */}
        </div>
        <Button>Cameras</Button>
        <Button>Garden</Button>
        <Button>House</Button>
        <IconButton className={classes.avatar}>
          <Avatar>EZ</Avatar>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

const mapStateToProps = state => ({
  user: state.user,
  styleManager: state.styleManager,
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);
