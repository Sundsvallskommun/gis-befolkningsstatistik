import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const url = new URL(window.location.href);
const nyko = url.searchParams.get('nyko');
const year = url.searchParams.get('year');
const interval = url.searchParams.get('interval');

ReactDOM.render(
  <React.StrictMode>
  <center>
    {nyko !== null ? (
      <div className="container">
        <div className="header">
        <header className="header">
            <h1>Demografisk statistik över Nyckelkodsområde: {nyko} (Nivå {nyko.length})</h1>
            <hr/>
            <h3><b>Statistik från Sundsvalls kommuns metadata-katalog</b></h3>
            <h3><b>Kontakt: geodata@sundsvall.se</b></h3>
        </header>
        </div>
          <App nyko={nyko} year={year} interval={interval} />
        <div className="footer"></div>
      </div>
    ) : (
      <div className="container">
        <div className="header">
        <header className="header">
            <h1>Inget NYKO!</h1>
        </header>
        </div>
        <div className="footer"></div>
      </div>
    )}
  </center>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
