// Global CSS
import './styles/global.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Main App component
import App from './App.jsx'

const htmlRoot = document.getElementById('root');
const root = createRoot(htmlRoot);

root.render(
  // <StrictMode>
    <App />
  // </StrictMode>,
);