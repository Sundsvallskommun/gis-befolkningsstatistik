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

class App extends React.Component {
  // Constructor
  constructor(props) {
    super(props);
    this.state = {
        items: [],
        DataisLoaded: false,
        nyko: this.props.nyko,
        uttagsdatum: this.props.uttagsdatum ? this.props.uttagsdatum : '',
        intervall: this.props.intervall ? this.props.intervall : ''
    };
  }

  // ComponentDidMount is used to
  // execute the code
  componentDidMount() {
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
  if (!DataisLoaded) return <div>
    <h1> Hämtar data, var god vänta.... </h1> </div> ;
    if (typeof items.error !== 'undefined') {
      return (
        <div className = "App">
          <div className="diagrams">
            <h1>{items.error}</h1>
          </div>
        </div>
      );
    } else {
      items.ageByInterval.forEach((item) => {
        labels.push(item.Label);
        values.push(item.Antal);
      });
      items.outtakeDate.forEach((date, i) => {
        dates.push({ id: i, text: date.Uttagsdatum });
      });
      const intervals = [{id:0, text:'Skola'},{id:1, text:'5ar'}]
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
                      <option key={interval.id} value={interval.text}>
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
      );
    }
  }
}

export default App;
