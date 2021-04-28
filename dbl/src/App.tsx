import React from 'react';
import logo from './logo.svg';
import './App.css';

function triggerClick() {
  console.log("Clicky clicky!");
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={triggerClick}>
          Test Button :)
        </button>
      </header>
    </div>
  );
}

export default App;
