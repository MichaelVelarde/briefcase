import React from "react";
import { createRoot } from 'react-dom/client';
import './index.css';
import App from "./App.js";
import { HashRouter } from "react-router-dom";


const root = document.getElementById('root');
const rootInstance = createRoot(root);


rootInstance.render(
  <React.StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
  </React.StrictMode>,
  );
