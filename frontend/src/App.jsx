import React from 'react'
import './assets/index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Home from './pages/home'

function App() {
  return (
    <div className="container">
      <Router>
        <Routes>
          <Route exact element={<Home />} path="/"/>
        </Routes>
      </Router>
    </div>
  )
}

export default App
