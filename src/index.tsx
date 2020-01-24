import { AppContainer } from 'react-hot-loader'
import * as React from 'react'
import ReactDOM from 'react-dom'
import { unregister } from './serviceWorker'
import './index.css'

const render = () => {
  ReactDOM.render(
    <AppContainer>
      <p>It's something</p>
    </AppContainer>,
    document.getElementById('main')
  )
}

render()

// Hot reloading
if ((module as any).hot) {
  // Reload components
  (module as any).hot.accept('./app', () => {
    render()
  })
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
unregister()
