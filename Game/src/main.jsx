import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom' 
import App from './App.jsx'
import  How  from './pages/How.jsx' 
import Game from './pages/game.jsx'
import './index.css'
import "@fontsource/fredoka"

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/howto" element={<How />} />
        <Route path="/play" element={<Game/>}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
