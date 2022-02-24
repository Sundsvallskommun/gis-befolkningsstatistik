import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie  } from "react-chartjs-2";
import './App.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const conf = require('./conf/config');
const configOptions = Object.assign({}, conf['befolkningsStatistik']);

const url = new URL(window.location.href);
const nyko = url.searchParams.get('nyko');
const uttagsdatum = url.searchParams.get('uttagsdatum');
const intervall = url.searchParams.get('intervall');
let startMsg = 'Hämtar data, var god vänta....';
let jsonUttagsdatum = [];

class App extends React.Component {
  // Constructor
  constructor(props) {
    super(props);
    this.state = {
        items: [],
        DataisLoaded: false,
        nyko: nyko,
        uttagsdatum: uttagsdatum ? uttagsdatum : '',
        intervall: intervall ? intervall : ''
    };
  }

  // ComponentDidMount is used to
  // execute the code
  componentDidMount() {
    if (!isNaN(parseInt(nyko))) {
      fetch(configOptions.base_url+configOptions.nyko_api+"nyko-uttagsdatum")
      .then((res) => res.json())
      .then((json) => {
        jsonUttagsdatum = json;
        const uttag = this.state.uttagsdatum ? this.state.uttagsdatum : json[0].Uttagsdatum;
        fetch(configOptions.base_url+configOptions.nyko_api+"nyko?nyko="+this.state.nyko+"&uttagsdatum="+uttag+"&intervall="+this.state.intervall)
          .then((res) => res.json())
          .then((json) => {
              this.setState({
                  items: json,
                  DataisLoaded: true,
                  nyko: this.state.nyko,
                  uttagsdatum: this.state.uttagsdatum ? this.state.uttagsdatum : '',
                  intervall: this.state.intervall ? this.state.intervall : ''
              });
          })
      })
    } else {
      startMsg = 'Inget NYKO angivet....';
      this.setState({
          items: [],
          DataisLoaded: false,
          nyko: this.state.nyko,
          uttagsdatum: this.state.uttagsdatum ? this.state.uttagsdatum : '',
          intervall: this.state.intervall ? this.state.intervall : ''
      });
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.uttagsdatum !== prevState.uttagsdatum) {
      fetch(configOptions.base_url+configOptions.nyko_api+"?nyko="+this.state.nyko+"&uttagsdatum="+this.state.uttagsdatum+"&intervall="+this.state.intervall)
          .then((res) => res.json())
          .then((json) => {
            this.setState({
                items: json,
                DataisLoaded: true,
                nyko: this.state.nyko,
                uttagsdatum: this.state.uttagsdatum ? this.state.uttagsdatum : '',
                intervall: this.state.intervall ? this.state.intervall : ''
            });
          })
    }
    if (this.state.intervall !== prevState.intervall) {
      fetch(configOptions.base_url+configOptions.nyko_api+"?nyko="+this.state.nyko+"&uttagsdatum="+this.state.uttagsdatum+"&intervall="+this.state.intervall)
          .then((res) => res.json())
          .then((json) => {
            this.setState({
                items: json,
                DataisLoaded: true,
                nyko: this.state.nyko,
                uttagsdatum: this.state.uttagsdatum ? this.state.uttagsdatum : '',
                intervall: this.state.intervall ? this.state.intervall : ''
            });
          })
    }
  }
  render() {
  const labels = [];
  const values = [];
  const dates = [];
  const { DataisLoaded, items } = this.state;
  if (!DataisLoaded) return (
    <center>
      <div>
        <h1> {startMsg} </h1>
      </div>
    </center>);
    if (typeof items.error !== 'undefined') {
      return (
        <center>
          <div className = "App">
            <div className="diagrams">
              <h1>{items.error}</h1>
            </div>
          </div>
        </center>
      );
    } else {
      items.ageByInterval.forEach((item) => {
        labels.push(item.Label);
        values.push(item.Antal);
      });
      jsonUttagsdatum.forEach((date, i) => {
        dates.push({ id: i, text: date.Uttagsdatum });
      });
      const intervals = [{id:0, text:'5år', value:'5ar'},{id:1, text:'Skola', value:'Skola'}]
      const dataInterval = {
        labels: labels,
        datasets: [{
          label: 'Åldersgrupp',
          data: values
        }]
      };
      let intervalToSmall = '';
      if (dataInterval.labels.length === 0) {
        intervalToSmall = 'OBS! Åldersgrupper för små för att visas!';
      }
      const dataPie = {
        labels: [
          'Män',
          'Kvinnor'
        ],
        datasets: [{
          label: 'Könsfördelning',
          data: [items.men, items.women],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)'
          ],
          hoverOffset: 4
        }]
      };
      return (
        <center>
          {nyko !== null ? (
            <div className="container">
              <div className="header">
              <header className="header">
                  <h1>Demografisk statistik över Nyckelkodsområde: {nyko} (Nivå {nyko.length})</h1>
                  <hr/>
                  <h3><b>Statistik från Sundsvalls kommun</b></h3>
                  <h3><b>Kontakt: geodata@sundsvall.se</b></h3>
              </header>
              </div>
              <div className = "App">
        <div className="selects">
          <h3>Ändra uttagsdatum och åldersgruppsintervall</h3>
          <label>Välj uttagsdatum</label>&nbsp;
          <select className="form-control" value={this.state.uttagsdatum} onChange={event => { this.setState({items: [], DataisLoaded: false, nyko: this.state.nyko, uttagsdatum: event.target.value, intervall: this.state.intervall}); }}>
        {
            dates.map(outtakeDate => {
                return (
                    <option key={outtakeDate.id} value={outtakeDate.text}>
                        {outtakeDate.text}
                    </option>
                )
            })
        }
          </select>
          <br/>
          <label>Välj åldersgruppsintervall</label>&nbsp;
          <select className="form-control" value={this.state.intervall} onChange={event => { this.setState({items: [], DataisLoaded: false, nyko: this.state.nyko, uttagsdatum: this.state.uttagsdatum, intervall: event.target.value}); }}>
          {
              intervals.map(interval => {
                  return (
                      <option key={interval.id} value={interval.value}>
                          {interval.text}
                      </option>
                  )
              })
          }
          </select>
        </div>
        <div className="diagrams">
          <h1>Befolkning totalt antal: {(parseInt(items.women) + parseInt(items.men))}</h1>
          <h1>Befolkning efter ålder</h1>
          <p className="warning">{intervalToSmall}</p>
          <div style={{ position: "relative", width: 900, height: 450 }}>
              {
              <Bar
                options={{
                  tooltips: {
                    mode: "index",
                    intersect: false
                  },
                  responsive: true,
                  maintainAspectRatio: true,
                  legend: { display: false }
                }}
                data={dataInterval}
              />
            }
          </div>
          </div>
          <div className="diagrams">
          <h1>Befolkning efter kön</h1>
          <div style={{ display: "flex", justifyContent: "center",
            alignItems: "center", width: 450, height: 450 }}>
              {
              <Pie
                options={{
                  tooltips: {
                    mode: "index",
                    intersect: false
                  },
                  responsive: true,
                  maintainAspectRatio: true,
                  legend: { display: false }
                }}
                data={dataPie}
              />
            }
          </div>
          <div className="lblWomen">Kvinnor {((parseInt(items.women)/(parseInt(items.women) + parseInt(items.men)))*100).toFixed(1)} %</div>
          <div className="lblMen">Män {((parseInt(items.men)/(parseInt(items.women) + parseInt(items.men)))*100).toFixed(1)} %</div>
          </div>
          </div>
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
      );
    }
  }
}

export default App;
