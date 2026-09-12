import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: { fontFamily: 'Inter, sans-serif', fontSize: '14px', borderRadius: '10px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' },
        success: { iconTheme: { primary: '#FF4500', secondary: '#fff' } },
      }}
    />
  </BrowserRouter>
)
