import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// GLOBAL STANDARTLARDA HATA YAKALAYICI
class ErrorBoundary extends React.Component {
  constructor(props) { 
    super(props); 
    this.state = { hasError: false, error: null }; 
  }
  
  static getDerivedStateFromError(error) { 
    return { hasError: true, error: error }; 
  }
  
  componentDidCatch(error, errorInfo) {
    console.error("Critical Render Error:", error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ backgroundColor: '#171a21', height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', padding: '40px', boxSizing: 'border-box', fontFamily: 'sans-serif' }}>
           <h1 style={{ color: '#ff4747', fontSize: '40px', marginBottom: '10px', textTransform: 'uppercase', fontWeight: '900' }}>CRITICAL SYSTEM ERROR</h1>
           <p style={{ color: '#8f98a0', marginBottom: '20px', fontSize: '18px' }}>An unexpected error occurred during rendering. Details below:</p>
           
           <div style={{ backgroundColor: 'black', padding: '20px', borderRadius: '8px', border: '1px solid #ff4747', maxWidth: '80%', width: '100%', overflow: 'auto' }}>
              <code style={{ color: '#ff7b7b', fontSize: '14px', lineHeight: '1.5' }}>
                  {this.state.error && this.state.error.toString()}
              </code>
           </div>
           
           <button onClick={() => window.location.reload()} style={{ marginTop: '30px', padding: '15px 30px', backgroundColor: '#1a9fff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', textTransform: 'uppercase' }}>
              RESTART SYSTEM
           </button>
        </div>
      );
    }
    return this.props.children; 
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)