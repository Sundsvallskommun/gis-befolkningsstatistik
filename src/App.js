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
      fetch(configOptions.base_url+configOptions.nyko_api+"nyko?nyko="+this.state.nyko+"&uttagsdatum="+this.state.uttagsdatum+"&intervall="+this.state.intervall)
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
      fetch(configOptions.base_url+configOptions.nyko_api+"nyko?nyko="+this.state.nyko+"&uttagsdatum="+this.state.uttagsdatum+"&intervall="+this.state.intervall)
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
  const labelsAssistans = [];
  const valuesAssistans = [];
  const bgcolorAssistans = [];
  const labelsYoung = [];
  const valuesYoung = [];
  const bgcolorYoung = [];
  const labelsOld = [];
  const valuesOld = [];
  const bgcolorOld = [];
  const labelsNonEU = [];
  const valuesNonEU = [];
  const bgcolorNonEU = [];
  const labelsWorking = [];
  const valuesWorking = [];
  const bgcolorWorking = [];
  const labelsEducated = [];
  const valuesEducated = [];
  const bgcolorEducated = [];
  const labelsUnemployed = [];
  const valuesUnemployed = [];
  const bgcolorUnemployed = [];
  const labelsIncome = [];
  const valuesIncome = [];
  const bgcolorIncome = [];
  const labelsUnhealth = [];
  const valuesUnhealth = [];
  const bgcolorUnhealth = [];
  const dates = [];
  const { DataisLoaded, items } = this.state;
  const intervals = [{id:0, text:'5år', value:'5ar'},{id:1, text:'Skola', value:'Skola'}]
  jsonUttagsdatum.forEach((date, i) => {
    dates.push({ id: i, text: date.Uttagsdatum });
  });
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
              <hr/>
              <h3><b>Statistik från Sundsvalls kommun</b></h3>
              <h3><b>Kontakt: geodata@sundsvall.se</b></h3>
            </div>
          </div>
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
        </center>
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
      // Bar chart data for assistans
      items.variables.assistans.forEach((item) => {
        if (item.men) {
          labelsAssistans.push('Män ' + item.year);
          labelsAssistans.push('Kvinnor ' + item.year);
          labelsAssistans.push('Totalt ' + item.year);
          valuesAssistans.push(item.men);
          valuesAssistans.push(item.women);
          valuesAssistans.push(item.total);
          bgcolorAssistans.push('rgb(255, 99, 132)');
          bgcolorAssistans.push('rgb(54, 162, 235)');
          bgcolorAssistans.push('rgb(0, 0, 0)');
        }
      });
      const dataAssistans = {
        labels: labelsAssistans,
        datasets: [{
          label: 'Andel av befolkningen med ekonomiskt bistånd 20+ år i %',
          data: valuesAssistans,
          backgroundColor: bgcolorAssistans
        }]
      };
      // Bar chart data for population young
      items.variables.young.forEach((item) => {
        if (item.men) {
          labelsYoung.push('Män ' + item.year);
          labelsYoung.push('Kvinnor ' + item.year);
          labelsYoung.push('Totalt ' + item.year);
          valuesYoung.push(item.men);
          valuesYoung.push(item.women);
          valuesYoung.push(item.total);
          bgcolorYoung.push('rgb(255, 99, 132)');
          bgcolorYoung.push('rgb(54, 162, 235)');
          bgcolorYoung.push('rgb(0, 0, 0)');
        }
      });
      const dataYoung = {
        labels: labelsYoung,
        datasets: [{
          label: 'Andel i % av befolkningen 0-19 år',
          data: valuesYoung,
          backgroundColor: bgcolorYoung
        }]
      };
      // Bar chart data for population old
      items.variables.old.forEach((item) => {
        if (item.men) {
          labelsOld.push('Män ' + item.year);
          labelsOld.push('Kvinnor ' + item.year);
          labelsOld.push('Totalt ' + item.year);
          valuesOld.push(item.men);
          valuesOld.push(item.women);
          valuesOld.push(item.total);
          bgcolorOld.push('rgb(255, 99, 132)');
          bgcolorOld.push('rgb(54, 162, 235)');
          bgcolorOld.push('rgb(0, 0, 0)');
        }
      });
      const dataOld = {
        labels: labelsOld,
        datasets: [{
          label: 'Andel i % av befolkningen 65 år +',
          data: valuesOld,
          backgroundColor: bgcolorOld
        }]
      };
      // Bar chart data for population born outside EU
      items.variables.nonEU.forEach((item) => {
        if (item.men) {
          labelsNonEU.push('Män ' + item.year);
          labelsNonEU.push('Kvinnor ' + item.year);
          labelsNonEU.push('Totalt ' + item.year);
          valuesNonEU.push(item.men);
          valuesNonEU.push(item.women);
          valuesNonEU.push(item.total);
          bgcolorNonEU.push('rgb(255, 99, 132)');
          bgcolorNonEU.push('rgb(54, 162, 235)');
          bgcolorNonEU.push('rgb(0, 0, 0)');
        }
      });
      const dataNonEU = {
        labels: labelsNonEU,
        datasets: [{
          label: 'Andel i % födda utanför EU28',
          data: valuesNonEU,
          backgroundColor: bgcolorNonEU
        }]
      };
      // Bar chart data for working
      items.variables.working.forEach((item) => {
        if (item.men) {
          labelsWorking.push('Män ' + item.year);
          labelsWorking.push('Kvinnor ' + item.year);
          labelsWorking.push('Totalt ' + item.year);
          valuesWorking.push(item.men);
          valuesWorking.push(item.women);
          valuesWorking.push(item.total);
          bgcolorWorking.push('rgb(255, 99, 132)');
          bgcolorWorking.push('rgb(54, 162, 235)');
          bgcolorWorking.push('rgb(0, 0, 0)');
        }
      });
      const dataWorking = {
        labels: labelsWorking,
        datasets: [{
          label: 'Andel i % förvärvsarbetande 20-64 år',
          data: valuesWorking,
          backgroundColor: bgcolorWorking
        }]
      };
      // Bar chart data for educated
      items.variables.educated.forEach((item) => {
        if (item.men) {
          labelsEducated.push('Män ' + item.year);
          labelsEducated.push('Kvinnor ' + item.year);
          labelsEducated.push('Totalt ' + item.year);
          valuesEducated.push(item.men);
          valuesEducated.push(item.women);
          valuesEducated.push(item.total);
          bgcolorEducated.push('rgb(255, 99, 132)');
          bgcolorEducated.push('rgb(54, 162, 235)');
          bgcolorEducated.push('rgb(0, 0, 0)');
        }
      });
      const dataEducated = {
        labels: labelsEducated,
        datasets: [{
          label: 'Andel i % med eftergymnasial utbildning 20-64 år',
          data: valuesEducated,
          backgroundColor: bgcolorEducated
        }]
      };
      // Bar chart data for unemployed
      items.variables.unemployed.forEach((item) => {
        if (item.men) {
          labelsUnemployed.push('Män ' + item.year);
          labelsUnemployed.push('Kvinnor ' + item.year);
          labelsUnemployed.push('Totalt ' + item.year);
          valuesUnemployed.push(item.men);
          valuesUnemployed.push(item.women);
          valuesUnemployed.push(item.total);
          bgcolorUnemployed.push('rgb(255, 99, 132)');
          bgcolorUnemployed.push('rgb(54, 162, 235)');
          bgcolorUnemployed.push('rgb(0, 0, 0)');
        }
      });
      const dataUnemployed = {
        labels: labelsUnemployed,
        datasets: [{
          label: 'Andel i % öppet arbetslösa 16-64 år',
          data: valuesUnemployed,
          backgroundColor: bgcolorUnemployed
        }]
      };
      // Bar chart data for income
      items.variables.income.forEach((item) => {
        if (item.men) {
          labelsIncome.push('Män ' + item.year);
          labelsIncome.push('Kvinnor ' + item.year);
          labelsIncome.push('Totalt ' + item.year);
          valuesIncome.push(item.men);
          valuesIncome.push(item.women);
          valuesIncome.push(item.total);
          bgcolorIncome.push('rgb(255, 99, 132)');
          bgcolorIncome.push('rgb(54, 162, 235)');
          bgcolorIncome.push('rgb(0, 0, 0)');
        }
      });
      const dataIncome = {
        labels: labelsIncome,
        datasets: [{
          label: 'Inkomst (median) tusentals kronor 20+ år',
          data: valuesIncome,
          backgroundColor: bgcolorIncome
        }]
      };
      // Bar chart data for unhealth
      items.variables.unhealth.forEach((item) => {
        if (item.men) {
          labelsUnhealth.push('Män ' + item.year);
          labelsUnhealth.push('Kvinnor ' + item.year);
          labelsUnhealth.push('Totalt ' + item.year);
          valuesUnhealth.push(item.men);
          valuesUnhealth.push(item.women);
          valuesUnhealth.push(item.total);
          bgcolorUnhealth.push('rgb(255, 99, 132)');
          bgcolorUnhealth.push('rgb(54, 162, 235)');
          bgcolorUnhealth.push('rgb(0, 0, 0)');
        }
      });
      const dataUnhealth = {
        labels: labelsUnhealth,
        datasets: [{
          label: 'Ohälsotal (antal dagar) 16-64 år',
          data: valuesUnhealth,
          backgroundColor: bgcolorUnhealth
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
          <div className="diagrams">
          <h1>Bistånd</h1>
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
                data={dataAssistans}
              />
            }
            </div>
            </div>
            <div className="diagrams">
            <h1>Befolkning 0-19</h1>
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
                  data={dataYoung}
                />
              }
              </div>
              </div>
              <div className="diagrams">
              <h1>Befolkning 65+</h1>
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
                    data={dataOld}
                  />
                }
                </div>
                </div>
                <div className="diagrams">
                <h1>Befolkning födda utanför EU</h1>
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
                      data={dataNonEU}
                    />
                  }
                  </div>
                  </div>
                  <div className="diagrams">
                  <h1>Andel förvärvsarbetande</h1>
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
                        data={dataWorking}
                      />
                    }
                    </div>
                    </div>
                    <div className="diagrams">
                    <h1>Andel med eftergymnasial utbildning</h1>
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
                          data={dataEducated}
                        />
                      }
                    </div>
                    </div>
                    <div className="diagrams">
                    <h1>Andel öppet arbetslösa</h1>
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
                          data={dataUnemployed}
                        />
                      }
                    </div>
                    </div>
                    <div className="diagrams">
                    <h1>Inkomst</h1>
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
                          data={dataIncome}
                        />
                      }
                    </div>
                    </div>
                    <div className="diagrams">
                    <h1>Ohälsotal</h1>
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
                          data={dataUnhealth}
                        />
                      }
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
