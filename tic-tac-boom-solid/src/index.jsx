// src/index.jsx
import { render } from 'solid-js/web';
import App from './App.jsx'; // Ensure correct import path with .jsx
import './index.css'; // Your existing CSS

// Wait for the DOM to be fully loaded before rendering the app.
// This ensures that `document.getElementById('app')` will find the element.
document.addEventListener('DOMContentLoaded', () => {
  const appRoot = document.getElementById('app');
  if (appRoot) {
    render(() => <App />, appRoot);
  } else {
    console.error('Error: Root element with ID "app" not found in the document.');
  }
});