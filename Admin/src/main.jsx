// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./main.css"
import axios from 'axios';
axios.defaults.withCredentials = true;
import {Provider} from "react-redux"
import { store } from './app/store.js';



createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <Provider store={store}>

    <App />
  </Provider>
  // </StrictMode>,
)
