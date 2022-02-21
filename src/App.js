import React from "react";
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
let nyko = '';
let year = '';
let interval = '';

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
    nyko = props.nyko;
    year = props.year;
    interval = props.interval;
    this.state = {
        items: [],
        DataisLoaded: false
    };
  }

  // ComponentDidMount is used to
  // execute the code
  componentDidMount() {
    fetch(configOptions.base_url+configOptions.nyko_api+"?nyko="+nyko+"&year="+year+"&interval="+interval)
        .then((res) => res.json())
        .then((json) => {
            this.setState({
                items: json,
                DataisLoaded: true
            });
        })
  }
  render() {
  const labels = [];
  const values = [];
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
      const dataInterval = {
        labels: labels,
        datasets: [{
          label: 'Åldersgrupp',
          data: values
        }]
      };
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
        <div className="diagrams">
          <h1>Befolkning efter ålder</h1>
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
