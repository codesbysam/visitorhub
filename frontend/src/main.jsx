import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'
import './index.css'

const GOOGLE_CLIENT_ID = '334158007046-aiv3q774p5o04g1m2uqdepucck6lmtpj.apps.googleusercontent.com'; // User's real Google Client ID

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
)
