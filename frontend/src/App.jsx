import React from 'react'
import './assets/bootstrap.min.css'
import './assets/index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Home from './pages/home'
import Login from './pages/login'

function App() {
  return (
    <div className="container">
      <Router>
        <Routes>
          <Route exact component={Home} path="/"/>
          <Route component={Login} path="/login"/>
        </Routes>
      </Router>
    </div>
  )
}

export default App
