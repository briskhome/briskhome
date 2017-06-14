import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import createPalette from 'material-ui/styles/palette';
import createMuiTheme from 'material-ui/styles/theme';
import { blue, amber } from 'material-ui/styles/colors';
import { lightTheme, setPrismTheme } from './utils';
import { createBriskhomeStore } from './store';

const palette = createPalette({
  primary: amber, // '#000000',
  accent: amber, // '#f9d21c',
  type: 'light',
});
const theme = createMuiTheme({ palette });
const styleManager = MuiThemeProvider.createDefaultContext({ theme }).styleManager;
setPrismTheme(lightTheme);
// styleManager.setSheetOrder(MUI_SHEET_ORDER.concat([
//   'Link',
//   'AppContent',
//   'AppDrawer',
//   'AppDrawerNavItem',
//   'AppFrame',
//   'MarkdownDocs',
//   'MarkdownElement',
//   'Demo',
// ]));

const variables = {
  styleManager,
};

const store = createBriskhomeStore(variables);
console.log('store', store.getState());

ReactDOM.render(
  <Provider store={createBriskhomeStore(variables)}>
    <MuiThemeProvider>
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root'),
);
