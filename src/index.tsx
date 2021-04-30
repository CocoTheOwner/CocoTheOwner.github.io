import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css';
import './custom.scss';
import SearchBar from './components/SearchBar'
import PageHeader from './components/PageHeader'
import ExampleComponent from './components/ExampleComponent';

/*
Uncomment for example.
Also uncomment corresponding lines in index.html
ReactDOM.render(
  <React.StrictMode>
    <ExampleComponent />
  </React.StrictMode>,
  document.getElementById('example')
)
*/


ReactDOM.render(
  <React.StrictMode>
    <SearchBar />
  </React.StrictMode>,
  document.getElementById('root')
);

ReactDOM.render(
  <React.StrictMode>
    <PageHeader />
  </React.StrictMode>,
  document.getElementById('header')
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
