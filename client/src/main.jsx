import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./main.css"
import { Provider } from 'react-redux'
import { store } from './app/store.js'

import {GoogleOAuthProvider} from "@react-oauth/google"
import { OAUTH_CLIENT_ID } from './constants/env.js'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <GoogleOAuthProvider clientId={OAUTH_CLIENT_ID}>
    <App />
    </GoogleOAuthProvider>
    </Provider>
  </StrictMode>,
)
