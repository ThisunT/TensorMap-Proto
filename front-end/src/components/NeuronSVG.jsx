import React from 'react';
import * as d3 from "d3-scale";

let colours = ['#2176ae'];

class Circles extends React.Component {

    render() {
        let maxRadius = 40;
        let xScale = d3.scaleLinear().domain([0, 1]).range([0, this.props.width]);
        let yScale = d3.scaleLinear().domain([0, 1]).range([0, this.props.height]);
        let rScale = d3.scaleLinear().domain([0, 1]).range([0, maxRadius]);

        return <div>
            <svg width={this.props.width} height={this.props.height}>{<circle cx={xScale(0.5)} cy={yScale(0.5)} r={rScale(0.7)} fill={colours[0]} />}</svg>
        </div>
    }
}

export default Circles;
