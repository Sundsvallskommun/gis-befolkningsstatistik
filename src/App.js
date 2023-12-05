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
import { Bar, Pie, Line  } from "react-chartjs-2";
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
let uttag = '';

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
        uttag = this.state.uttagsdatum ? this.state.uttagsdatum : json[0].Uttagsdatum;
        fetch(configOptions.base_url+configOptions.nyko_api+"nyko?nyko="+this.state.nyko+"&uttagsdatum="+uttag+"&intervall="+this.state.intervall)
          .then((res) => res.json())
          .then((json) => {
              this.setState({
                  items: json,
                  DataisLoaded: true,
                  nyko: this.state.nyko,
                  uttagsdatum: this.state.uttagsdatum ? this.state.uttagsdatum : uttag,
                  intervall: this.state.intervall ? this.state.intervall : uttag
              });
          })
      })
    } else {
      startMsg = 'Inget NYKO angivet....';
      this.setState({
          items: [],
          DataisLoaded: false,
          nyko: this.state.nyko,
          uttagsdatum: this.state.uttagsdatum ? this.state.uttagsdatum : uttag,
          intervall: this.state.intervall ? this.state.intervall : uttag
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
                uttagsdatum: this.state.uttagsdatum ? this.state.uttagsdatum : uttag,
                intervall: this.state.intervall ? this.state.intervall : uttag
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
                uttagsdatum: this.state.uttagsdatum ? this.state.uttagsdatum : uttag,
                intervall: this.state.intervall ? this.state.intervall : uttag
            });
          })
    }
  }
  render() {
  const labels = [];
  const values = [];
  const labelsAssistans = [];
  const dataAssistansMen = [];
  const dataAssistansWomen = [];
  const dataAssistansTotal = [];
  const labelsYoung = [];
  const dataYoungMen = [];
  const dataYoungWomen = [];
  const dataYoungTotal = [];
  const labelsOld = [];
  const dataOldMen = [];
  const dataOldWomen = [];
  const dataOldTotal = [];
  const labelsNonEU = [];
  const dataNonEUMen = [];
  const dataNonEUWomen = [];
  const dataNonEUTotal = [];
  const labelsWorking = [];
  const dataWorkingMen = [];
  const dataWorkingWomen = [];
  const dataWorkingTotal = [];
  const labelsEducated = [];
  const dataEducatedMen = [];
  const dataEducatedWomen = [];
  const dataEducatedTotal = [];
  const labelsUnemployed = [];
  const dataUnemployedMen = [];
  const dataUnemployedWomen = [];
  const dataUnemployedTotal = [];
  const labelsIncome = [];
  const dataIncomeMen = [];
  const dataIncomeWomen = [];
  const dataIncomeTotal = [];
  const labelsUnhealth = [];
  const dataUnhealthMen = [];
  const dataUnhealthWomen = [];
  const dataUnhealthTotal = [];
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
          labelsAssistans.push(item.year);
          dataAssistansMen.push({x: item.year, y: item.men});
          dataAssistansWomen.push({x: item.year, y: item.women});
          dataAssistansTotal.push({x: item.year, y: item.total});
        }
      });
      const dataAssistans = {
        labels: labelsAssistans,
        datasets: [{
          label: 'Män',
          data: dataAssistansMen,
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          pointBackgroundColor: 'rgb(255, 99, 132)',
          pointRadius: 5,
          pointHoverRadius: 10
        },
        {
          label: 'Kvinnor',
          data: dataAssistansWomen,
          backgroundColor: 'rgb(54, 162, 235)',
          borderColor: 'rgb(54, 162, 235)',
          pointBackgroundColor: 'rgb(54, 162, 235)',
          pointRadius: 5,
          pointHoverRadius: 10
        },
        {
          label: 'Totalt',
          data: dataAssistansTotal,
          backgroundColor: 'rgb(0, 0, 0)',
          borderColor: 'rgb(0, 0, 0)',
          pointBackgroundColor: 'rgb(0, 0, 0)',
          pointRadius: 5,
          pointHoverRadius: 10
        }]
      };
      // Bar chart data for population young
      items.variables.young.forEach((item) => {
        if (item.men) {
          labelsYoung.push(item.year);
          dataYoungMen.push({x: item.year, y: item.men});
          dataYoungWomen.push({x: item.year, y: item.women});
          dataYoungTotal.push({x: item.year, y: item.total});
        }
      });
      const dataYoung = {
        labels: labelsYoung,
        datasets: [{
          label: 'Män',
          data: dataYoungMen,
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          pointBackgroundColor: 'rgb(255, 99, 132)',
          pointRadius: 5,
          pointHoverRadius: 10
        },
        {
          label: 'Kvinnor',
          data: dataYoungWomen,
          backgroundColor: 'rgb(54, 162, 235)',
          borderColor: 'rgb(54, 162, 235)',
          pointBackgroundColor: 'rgb(54, 162, 235)',
          pointRadius: 5,
          pointHoverRadius: 10
        },
        {
          label: 'Totalt',
          data: dataYoungTotal,
          backgroundColor: 'rgb(0, 0, 0)',
          borderColor: 'rgb(0, 0, 0)',
          pointBackgroundColor: 'rgb(0, 0, 0)',
          pointRadius: 5,
          pointHoverRadius: 10
        }]
      };
      // Bar chart data for population old
      items.variables.old.forEach((item) => {
        if (item.men) {
          labelsOld.push(item.year);
          dataOldMen.push({x: item.year, y: item.men});
          dataOldWomen.push({x: item.year, y: item.women});
          dataOldTotal.push({x: item.year, y: item.total});
        }
      });
      const dataOld = {
        labels: labelsOld,
        datasets: [{
          label: 'Män',
          data: dataOldMen,
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          pointBackgroundColor: 'rgb(255, 99, 132)',
          pointRadius: 5,
          pointHoverRadius: 10
        },
        {
          label: 'Kvinnor',
          data: dataOldWomen,
          backgroundColor: 'rgb(54, 162, 235)',
          borderColor: 'rgb(54, 162, 235)',
          pointBackgroundColor: 'rgb(54, 162, 235)',
          pointRadius: 5,
          pointHoverRadius: 10
        },
        {
          label: 'Totalt',
          data: dataOldTotal,
          backgroundColor: 'rgb(0, 0, 0)',
          borderColor: 'rgb(0, 0, 0)',
          pointBackgroundColor: 'rgb(0, 0, 0)',
          pointRadius: 5,
          pointHoverRadius: 10
        }]
      };
      // Bar chart data for population born outside EU
      items.variables.nonEU.forEach((item) => {
        if (item.men) {
          labelsNonEU.push(item.year);
          dataNonEUMen.push({x: item.year, y: item.men});
          dataNonEUWomen.push({x: item.year, y: item.women});
          dataNonEUTotal.push({x: item.year, y: item.total});
        }
      });
      const dataNonEU = {
        labels: labelsNonEU,
        datasets: [{
          label: 'Män',
          data: dataNonEUMen,
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          pointBackgroundColor: 'rgb(255, 99, 132)',
          pointRadius: 5,
          pointHoverRadius: 10
        },
        {
          label: 'Kvinnor',
          data: dataNonEUWomen,
          backgroundColor: 'rgb(54, 162, 235)',
          borderColor: 'rgb(54, 162, 235)',
          pointBackgroundColor: 'rgb(54, 162, 235)',
          pointRadius: 5,
          pointHoverRadius: 10
        },
        {
          label: 'Totalt',
          data: dataNonEUTotal,
          backgroundColor: 'rgb(0, 0, 0)',
          borderColor: 'rgb(0, 0, 0)',
          pointBackgroundColor: 'rgb(0, 0, 0)',
          pointRadius: 5,
          pointHoverRadius: 10
        }]
      };
      // Bar chart data for working
      items.variables.working.forEach((item) => {
        if (item.men) {
          labelsWorking.push(item.year);
          dataWorkingMen.push({x: item.year, y: item.men});
          dataWorkingWomen.push({x: item.year, y: item.women});
          dataWorkingTotal.push({x: item.year, y: item.total});
        }
      });
      const dataWorking = {
        labels: labelsWorking,
        datasets: [{
          label: 'Män',
          data: dataWorkingMen,
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          pointBackgroundColor: 'rgb(255, 99, 132)',
          pointRadius: 5,
          pointHoverRadius: 10
        },
        {
          label: 'Kvinnor',
          data: dataWorkingWomen,
          backgroundColor: 'rgb(54, 162, 235)',
          borderColor: 'rgb(54, 162, 235)',
          pointBackgroundColor: 'rgb(54, 162, 235)',
          pointRadius: 5,
          pointHoverRadius: 10
        },
        {
          label: 'Totalt',
          data: dataWorkingTotal,
          backgroundColor: 'rgb(0, 0, 0)',
          borderColor: 'rgb(0, 0, 0)',
          pointBackgroundColor: 'rgb(0, 0, 0)',
          pointRadius: 5,
          pointHoverRadius: 10
        }]
      };
      // Bar chart data for educated
      items.variables.educated.forEach((item) => {
        if (item.men) {
          labelsEducated.push(item.year);
          dataEducatedMen.push({x: item.year, y: item.men});
          dataEducatedWomen.push({x: item.year, y: item.women});
          dataEducatedTotal.push({x: item.year, y: item.total});
        }
      });
      const dataEducated = {
        labels: labelsEducated,
        datasets: [{
          label: 'Män',
          data: dataEducatedMen,
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          pointBackgroundColor: 'rgb(255, 99, 132)',
          pointRadius: 5,
          pointHoverRadius: 10
        },
        {
          label: 'Kvinnor',
          data: dataEducatedWomen,
          backgroundColor: 'rgb(54, 162, 235)',
          borderColor: 'rgb(54, 162, 235)',
          pointBackgroundColor: 'rgb(54, 162, 235)',
          pointRadius: 5,
          pointHoverRadius: 10
        },
        {
          label: 'Totalt',
          data: dataEducatedTotal,
          backgroundColor: 'rgb(0, 0, 0)',
          borderColor: 'rgb(0, 0, 0)',
          pointBackgroundColor: 'rgb(0, 0, 0)',
          pointRadius: 5,
          pointHoverRadius: 10
        }]
      };
      // Bar chart data for unemployed
      items.variables.unemployed.forEach((item) => {
        if (item.men) {
          labelsUnemployed.push(item.year);
          dataUnemployedMen.push({x: item.year, y: item.men});
          dataUnemployedWomen.push({x: item.year, y: item.women});
          dataUnemployedTotal.push({x: item.year, y: item.total});
        }
      });
      const dataUnemployed = {
        labels: labelsUnemployed,
        datasets: [{
          label: 'Män',
          data: dataUnemployedMen,
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          pointBackgroundColor: 'rgb(255, 99, 132)',
          pointRadius: 5,
          pointHoverRadius: 10
        },
        {
          label: 'Kvinnor',
          data: dataUnemployedWomen,
          backgroundColor: 'rgb(54, 162, 235)',
          borderColor: 'rgb(54, 162, 235)',
          pointBackgroundColor: 'rgb(54, 162, 235)',
          pointRadius: 5,
          pointHoverRadius: 10
        },
        {
          label: 'Totalt',
          data: dataUnemployedTotal,
          backgroundColor: 'rgb(0, 0, 0)',
          borderColor: 'rgb(0, 0, 0)',
          pointBackgroundColor: 'rgb(0, 0, 0)',
          pointRadius: 5,
          pointHoverRadius: 10
        }]
      };
      // Bar chart data for income
      items.variables.income.forEach((item) => {
        if (item.men) {
          labelsIncome.push(item.year);
          dataIncomeMen.push(item.men);
          dataIncomeWomen.push(item.women);
          dataIncomeTotal.push(item.total);
        }
      });
      const dataIncome = {
        labels: labelsIncome,
        datasets: [
          {
            label: 'Män',
            data: dataIncomeMen,
            backgroundColor: 'rgb(255, 99, 132)',
            stack: 'Stack 0',
          },
          {
            label: 'Kvinnor',
            data: dataIncomeWomen,
            backgroundColor: 'rgb(54, 162, 235)',
            stack: 'Stack 1',
          },
          {
            label: 'Total',
            data: dataIncomeTotal,
            backgroundColor: 'rgb(0, 0, 0)',
            stack: 'Stack 2',
          },
        ]
      };
      // Bar chart data for unhealth
      items.variables.unhealth.forEach((item) => {
        if (item.men) {
          labelsUnhealth.push(item.year);
          dataUnhealthMen.push(item.men);
          dataUnhealthWomen.push(item.women);
          dataUnhealthTotal.push(item.total);
        }
      });
      const dataUnhealth = {
        labels: labelsUnhealth,
        datasets: [
          {
            label: 'Män',
            data: dataUnhealthMen,
            backgroundColor: 'rgb(255, 99, 132)',
            stack: 'Stack 0',
          },
          {
            label: 'Kvinnor',
            data: dataUnhealthWomen,
            backgroundColor: 'rgb(54, 162, 235)',
            stack: 'Stack 1',
          },
          {
            label: 'Total',
            data: dataUnhealthTotal,
            backgroundColor: 'rgb(0, 0, 0)',
            stack: 'Stack 2',
          },
        ]
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
                  legend: { display: false },
                  scales: {
                    x: {
                      display: true,
                      title: {
                        display: true,
                        text: 'Åldersintervall'
                      }
                    },
                    y: {
                      display: true,
                      title: {
                        display: true,
                        text: 'Antal personer'
                      }
                    }
                  }
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
              <Line
                options={{
                  tooltips: {
                    mode: "index",
                    intersect: false
                  },
                  responsive: true,
                  maintainAspectRatio: true,
                  legend: { display: false },
                  scales: {
                    x: {
                      display: true,
                      title: {
                        display: true,
                        text: 'År'
                      }
                    },
                    y: {
                      display: true,
                      title: {
                        display: true,
                        text: 'Procent'
                      }
                    }
                  }
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
                <Line
                  options={{
                    tooltips: {
                      mode: "index",
                      intersect: false
                    },
                    responsive: true,
                    maintainAspectRatio: true,
                    legend: { display: false },
                    scales: {
                      x: {
                        display: true,
                        title: {
                          display: true,
                          text: 'År'
                        }
                      },
                      y: {
                        display: true,
                        title: {
                          display: true,
                          text: 'Procent'
                        }
                      }
                    }
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
                  <Line
                    options={{
                      tooltips: {
                        mode: "index",
                        intersect: false
                      },
                      responsive: true,
                      maintainAspectRatio: true,
                      legend: { display: false },
                      scales: {
                        x: {
                          display: true,
                          title: {
                            display: true,
                            text: 'År'
                          }
                        },
                        y: {
                          display: true,
                          title: {
                            display: true,
                            text: 'Procent'
                          }
                        }
                      }
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
                    <Line
                      options={{
                        tooltips: {
                          mode: "index",
                          intersect: false
                        },
                        responsive: true,
                        maintainAspectRatio: true,
                        legend: { display: false },
                        scales: {
                          x: {
                            display: true,
                            title: {
                              display: true,
                              text: 'År'
                            }
                          },
                          y: {
                            display: true,
                            title: {
                              display: true,
                              text: 'Procent'
                            }
                          }
                        }
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
                      <Line
                        options={{
                          tooltips: {
                            mode: "index",
                            intersect: false
                          },
                          responsive: true,
                          maintainAspectRatio: true,
                          legend: { display: false },
                          scales: {
                            x: {
                              display: true,
                              title: {
                                display: true,
                                text: 'År'
                              }
                            },
                            y: {
                              display: true,
                              title: {
                                display: true,
                                text: 'Procent'
                              }
                            }
                          }
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
                        <Line
                          options={{
                            tooltips: {
                              mode: "index",
                              intersect: false
                            },
                            responsive: true,
                            maintainAspectRatio: true,
                            legend: { display: false },
                            scales: {
                              x: {
                                display: true,
                                title: {
                                  display: true,
                                  text: 'År'
                                }
                              },
                              y: {
                                display: true,
                                title: {
                                  display: true,
                                  text: 'Procent'
                                }
                              }
                            }
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
                        <Line
                          options={{
                            tooltips: {
                              mode: "index",
                              intersect: false
                            },
                            responsive: true,
                            maintainAspectRatio: true,
                            legend: { display: false },
                            scales: {
                              x: {
                                display: true,
                                title: {
                                  display: true,
                                  text: 'År'
                                }
                              },
                              y: {
                                display: true,
                                title: {
                                  display: true,
                                  text: 'Procent'
                                }
                              }
                            }
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
                            legend: { display: false },
                            scales: {
                              x: {
                                display: true,
                                title: {
                                  display: true,
                                  text: 'År'
                                }
                              },
                              y: {
                                display: true,
                                title: {
                                  display: true,
                                  text: 'Kr i tusental'
                                }
                              }
                            }
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
                            legend: { display: false },
                            scales: {
                              x: {
                                display: true,
                                title: {
                                  display: true,
                                  text: 'År'
                                }
                              },
                              y: {
                                display: true,
                                title: {
                                  display: true,
                                  text: 'Dagar'
                                }
                              }
                            }
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
