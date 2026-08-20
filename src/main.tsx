import React from 'react'
import ReactDOM from 'react-dom/client'
import Index from './pages/Index'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>
)

// Safe service worker registration that waits for the page to fully load
window.addEventListener('load', () => {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .catch(error => {
        // Ignore InvalidStateError which occurs when trying to register in invalid state
        if (error.name !== 'InvalidStateError') {
          console.error('Service worker registration failed:', error)
        }
      })
  }
})