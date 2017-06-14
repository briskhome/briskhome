import React from 'react';
import { connect } from 'react-redux';
import { createStyleSheet } from 'jss-theme-reactor';
import {
  Avatar,
  Divider,
  IconButton,
  Paper,
} from 'material-ui';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  ListSubheader,
} from 'material-ui/List';
import { CircularProgress } from 'material-ui/Progress';
import Add from 'material-ui-icons/Add';
import MoreVert from 'material-ui-icons/MoreVert';
import { fetchUsersAndGuests } from './actions';

const styles = createStyleSheet('UserListLayout', theme => ({
  addIcon: {
    height: 24,
    width: 24,
  },
  moreVertIcon: {
    margin: theme.spacing.unit,
  },
  paper: {
    color: theme.palette.text.secondary,
    margin: 16,
    padding: 0,
  },
  progress: {
    color: '#f3d34d',
    margin: 'auto',
  },
}));

export class UserList extends React.Component {


  componentDidMount() {
    this.props.handleFetchUsersAndGuests();
  };

  render() {
    const {
      isLoading = false,
      user,
      styleManager,
      handleFetchUsersAndGuests
    } = this.props;
    const classes = styleManager.render(styles);

    return (
      <Paper className={classes.paper}>
        <List dense subheader={<ListSubheader>Users & Guests</ListSubheader>}>
          { isLoading && <ListItem>
            <CircularProgress className={classes.progress} />
          </ListItem>}
          { !isLoading && <ListItem>
            <Avatar>JD</Avatar>
            <ListItemText primary="John Doe" secondary="Online" />
            <ListItemSecondaryAction>
              <IconButton>
                <MoreVert className={classes.moreVertIcon} />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>}
          <Divider />
          <ListItem button>
            {/*<ListItemIcon>*/}
            {/*<IconButton className={classes.addIcon}>*/}
            {/*<Add />*/}
            {/*</IconButton>*/}
            {/*</ListItemIcon>*/}
            <ListItemText primary='Create new account' onClick={() => this.setState({ open: true })} />
          </ListItem>
        </List>
      </Paper>
    );
  }
};

const mapStateToProps = state => ({
  isLoading: state.context.isLoading,
  user: state.context.user,
  styleManager: state.styleManager,
});

const mapDispatchToProps = dispatch => ({
  handleCreateNewAccount: (e) => {
    e.preventDefault();
    dispatch(/*toggleCreateAccountDialog()*/);
  },
  handleFetchUsersAndGuests: () => {
    dispatch(fetchUsersAndGuests());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserList);

