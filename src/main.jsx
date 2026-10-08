import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';


const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("No se encontró el elemento contenedor con id 'root'");
}
