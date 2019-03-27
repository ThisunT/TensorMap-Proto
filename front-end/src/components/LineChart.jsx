import React from 'react';
var Chart = require('chart.js');

function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets[0].data.push(data);
    chart.update();
}

class LineChart extends React.Component{

    constructor(props){
        super(props);

        this.state={
            graphData: null
        };
    }

    componentDidMount(){
        var ctx = document.getElementById('lineChart');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Accuracy',
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: 'rgba(75,192,192,0.4)',
                        borderColor: 'rgba(75,192,192,1)',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: 'rgba(75,192,192,1)',
                        pointBackgroundColor: '#fff',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                        pointHoverBorderColor: 'rgba(220,220,220,1)',
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: []
                    }
                ],
                options: {
                    scales: {
                        xAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'Number of epochs'
                            }
                        }]
                    }
                }
            }
        });

        this.setState({
            graphData: myChart
        })
    }

    componentDidUpdate(prevProps){
        addData(this.state.graphData, this.props.graphData.label, this.props.graphData.data)
    }

    render(){
        return(
            <canvas id="lineChart"></canvas>
        )
    }
}

export default LineChart;