import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import { ScenarioProvider } from './context/ScenarioContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <ScenarioProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ScenarioProvider>
    </ThemeProvider>
  </React.StrictMode>
);
