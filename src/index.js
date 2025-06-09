// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import App from './App';
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = "827686908786-s227iu9m8am4mafr2hns6e2dhpa39luk.apps.googleusercontent.com";
ReactDOM.render(
 
  <Provider store={store}>
      <GoogleOAuthProvider clientId={clientId}>
    <App />
    </GoogleOAuthProvider>
  </Provider>,
  document.getElementById('root')
);
