import { render } from 'solid-js/web';
import App from './App.jsx';
import './index.css';

document.addEventListener('DOMContentLoaded', () => {
  const appRoot = document.getElementById('app');
  if (appRoot) {
    render(() => <App />, appRoot);
  } else {
    console.error('Error: Root element with ID "app" not found in the document.');
  }
});