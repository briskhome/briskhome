import React from 'react';
import customPropTypes from 'material-ui/utils/customPropTypes';
import {Layout, Paper} from 'material-ui';
import Button from 'material-ui/Button';
import { LabelRadio } from 'material-ui/Radio';
import TextField from 'material-ui/TextField';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

import { createStyleSheet } from 'jss-theme-reactor';
import UserList from '../../components/UserList';

const styleSheet = createStyleSheet('GuttersLayout', (theme) => {
  return {
    root: {
      flexGrow: 1,
      marginTop: 24,
    },
    paper: {
      padding: 0,
      // textAlign: 'center',
      color: theme.palette.text.secondary,
      margin: '16px',
    },
    icon: {
      margin: theme.spacing.unit,
    },
    addIcon: {
      height: '24px',
      width: '24px',
    },
    group: {
      // margin: '8px 0',
    },
    input: {
      margin: 10,
      fontWeight: 400,
    },
    flex: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    normal: {
      fontWeight: 400,
    },
  };
});

export default class Home extends React.Component {
  state = {
    open: false,
    selectedValue: undefined,
  };

  handleRequestClose = () => this.setState({ open: false });
  handleChange = (event, value) => {
    this.setState({ selectedValue: value });
  };


  render() {
    const classes = this.context.styleManager.render(styleSheet);
    return (
      <div className={classes.root}>
        <Layout container gutter={16}>
          <Layout item md={9}>

          </Layout>
          <Layout item md={3}>
            <UserList/>
          </Layout>
          <Layout item xs={6}>
            <Paper className={classes.paper}>

            </Paper>
          </Layout>
        </Layout>

        <Dialog
          open={this.state.open}
          onRequestClose={this.handleRequestClose}
        >
          <DialogTitle>Create new account</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please fill in the registration data for the new account.<br /><br />
              Guest accounts have access only to the internet,
              user accounts have access to Briskhome and superusers can perform administrative tasks.
            </DialogContentText>
            <DialogContent>
                {/*<RadioGroup*/}
                  {/*aria-label="Gender"*/}
                  {/*name="gender"*/}
                  {/*className={classes.group}*/}
                  {/*selectedValue={this.state.selectedValue}*/}
                  {/*onChange={this.handleChange}*/}
                {/*>*/}
                  <LabelRadio label="Guest" value="guest" />
                  <LabelRadio label="User" value="user" />
                  <LabelRadio label="Superuser" value="superuser" disabled />
                {/*</RadioGroup>*/}
                <div className={classes.flex}>
                  <TextField
                    id="firstName"
                    error
                    label="First Name"
                    className={classes.input}
                    value={this.state.name}
                    onChange={(event) => this.setState({ name: event.target.value })}
                  />
                  <TextField
                    id="lastName"
                    label="Last Name"
                    defaultValue="foo"
                    className={classes.input}
                  />
                  <TextField
                    id="userName"
                    label="Username"
                    defaultValue="Hello World"
                    className={classes.input}
                  />
                </div>
            </DialogContent>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleRequestClose} primary>Cancel</Button>
            <Button onClick={this.handleRequestClose} primary>Create Account</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };
}

Home.contextTypes = {
  styleManager: customPropTypes.muiRequired,
};


  // const dots = (<div>Sample Panel<a href='#'><svg className='dots' width="24px" height="6px" viewBox="0 0 24 6" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
  //   <desc>Created with Sketch.</desc>
  //   <defs></defs>
  //   <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
  //     <g id="cards/default" transform="translate(-206.000000, -29.000000)" fill="#E5E5E5">
  //       <g id="icon/three-dots" transform="translate(206.000000, 29.000000)">
  //         <path d="M0,3 C0,2.57894526 0.0767037784,2.18713632 0.230113636,1.8245614 C0.383523494,1.46198649 0.593748665,1.14620018 0.860795455,0.877192982 C1.12784224,0.608185789 1.44318,0.394737632 1.80681818,0.236842105 C2.17045636,0.0789465789 2.56817966,0 3,0 C3.42045665,0 3.81249818,0.0789465789 4.17613636,0.236842105 C4.53977455,0.394737632 4.85795318,0.608185789 5.13068182,0.877192982 C5.40341045,1.14620018 5.61647651,1.46198649 5.76988636,1.8245614 C5.92329622,2.18713632 6,2.57894526 6,3 C6,3.42105474 5.92329622,3.81578763 5.76988636,4.18421053 C5.61647651,4.55263342 5.40341045,4.87134368 5.13068182,5.14035088 C4.85795318,5.40935807 4.53977455,5.61988228 4.17613636,5.77192982 C3.81249818,5.92397737 3.42045665,6 3,6 C2.56817966,6 2.17045636,5.92397737 1.80681818,5.77192982 C1.44318,5.61988228 1.12784224,5.40935807 0.860795455,5.14035088 C0.593748665,4.87134368 0.383523494,4.55263342 0.230113636,4.18421053 C0.0767037784,3.81578763 0,3.42105474 0,3 L0,3 Z M9,3 C9,2.57894526 9.07670378,2.18713632 9.23011364,1.8245614 C9.38352349,1.46198649 9.59374866,1.14620018 9.86079545,0.877192982 C10.1278422,0.608185789 10.44318,0.394737632 10.8068182,0.236842105 C11.1704564,0.0789465789 11.5681797,0 12,0 C12.4204566,0 12.8124982,0.0789465789 13.1761364,0.236842105 C13.5397745,0.394737632 13.8579532,0.608185789 14.1306818,0.877192982 C14.4034105,1.14620018 14.6164765,1.46198649 14.7698864,1.8245614 C14.9232962,2.18713632 15,2.57894526 15,3 C15,3.42105474 14.9232962,3.81578763 14.7698864,4.18421053 C14.6164765,4.55263342 14.4034105,4.87134368 14.1306818,5.14035088 C13.8579532,5.40935807 13.5397745,5.61988228 13.1761364,5.77192982 C12.8124982,5.92397737 12.4204566,6 12,6 C11.5681797,6 11.1704564,5.92397737 10.8068182,5.77192982 C10.44318,5.61988228 10.1278422,5.40935807 9.86079545,5.14035088 C9.59374866,4.87134368 9.38352349,4.55263342 9.23011364,4.18421053 C9.07670378,3.81578763 9,3.42105474 9,3 L9,3 Z M18,3 C18,2.57894526 18.0767038,2.18713632 18.2301136,1.8245614 C18.3835235,1.46198649 18.5937487,1.14620018 18.8607955,0.877192982 C19.1278422,0.608185789 19.44318,0.394737632 19.8068182,0.236842105 C20.1704564,0.0789465789 20.5681797,0 21,0 C21.4204566,0 21.8124982,0.0789465789 22.1761364,0.236842105 C22.5397745,0.394737632 22.8579532,0.608185789 23.1306818,0.877192982 C23.4034105,1.14620018 23.6164765,1.46198649 23.7698864,1.8245614 C23.9232962,2.18713632 24,2.57894526 24,3 C24,3.42105474 23.9232962,3.81578763 23.7698864,4.18421053 C23.6164765,4.55263342 23.4034105,4.87134368 23.1306818,5.14035088 C22.8579532,5.40935807 22.5397745,5.61988228 22.1761364,5.77192982 C21.8124982,5.92397737 21.4204566,6 21,6 C20.5681797,6 20.1704564,5.92397737 19.8068182,5.77192982 C19.44318,5.61988228 19.1278422,5.40935807 18.8607955,5.14035088 C18.5937487,4.87134368 18.3835235,4.55263342 18.2301136,4.18421053 C18.0767038,3.81578763 18,3.42105474 18,3 L18,3 Z" id="Icon"></path>
  //       </g>
  //     </g>
  //   </g>
  // </svg></a></div>);
  // return (
  //   <div className='row'>
  //     <div className='col-md-8'>
  //       <Panel className='map-placeholder'>
  //         Test panel content
  //       </Panel>
  //     </div>
  //
  //     <div className='col-md-4'>
  //       <Panel header={dots}>
  //         Test panel content
  //       </Panel>
  //     </div>
  //   </div>
  // );
// };
