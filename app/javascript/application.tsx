// app/javascript/application.tsx
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Map from './components/map'

const App = (): JSX.Element => {
  return (
  <div className="App">
    <Map/>
  </div>)
}

document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('app')
  ReactDOM.render(<App />, rootElement)
})