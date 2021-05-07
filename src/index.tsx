import React from 'react';
import ReactDOM from 'react-dom';
import ProtoVisual from './components/ProtoVisual';
import './index.css';
import reportWebVitals from './reportWebVitals';
/*import 'bootstrap/dist/css/bootstrap.css';
import './custom.scss';*/


/*
Uncomment for example.

import ExampleComponent from './components/ExampleComponent';
ReactDOM.render(
  <React.StrictMode>
    <ExampleComponent />
  </React.StrictMode>,
  document.getElementById('example')
)
*/



ReactDOM.render(
  <React.StrictMode>
   
  </React.StrictMode>,
  document.getElementById('header')
);

ReactDOM.render(
  <React.StrictMode>
    <ProtoVisual />
  </React.StrictMode>,
  document.getElementById('vis')
);
// Solution for vis page: https://stackoverflow.com/questions/41956465/how-to-create-multiple-page-app-using-react
// Takes time to implement. Will spend that on vis for now


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
