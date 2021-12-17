//IMPORTANT: Import all required SHIM Files first
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

//IMPORTANT: Import all required CSS, remember since theyre CASCADING, one may overwrite the other.
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'react-quill/dist/quill.snow.css';
import 'nprogress/nprogress.css';

// Normal Imports start here:
import { enableES5 } from 'immer';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import {configureStore} from './redux/store';

//Enable ECMA Script 5 Support incase user is running this on a older environment
enableES5();

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#root'),
);
