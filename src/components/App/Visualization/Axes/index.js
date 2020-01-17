import React, {useEffect, useRef} from 'react';
import {select} from 'd3-selection';
import {axisBottom, axisLeft} from "d3-axis";
import {timeFormat} from 'd3-time-format';

const Axes = ({xScale, yScale, height}) => {
    const xAxisRef = useRef();
    const yAxisRef = useRef();

    useEffect(() => {
        renderAxes();
    });

    const renderAxes = () => {
        renderXAxis();
        renderYAxis();
    };

    const renderXAxis = () => {
        const xAxis = select(xAxisRef.current);
        xAxis.call(axisBottom(xScale));
    };

    const renderYAxis = () => {
        const yAxis = select(yAxisRef.current);
        yAxis.call(axisLeft(yScale)
            .tickFormat(timeFormat('%-I %p')));
    };

    return (
        <g className="axes">
            <g className="x axis" ref={xAxisRef} transform={`translate(0,${height})`}/>
            <g className="y axis" ref={yAxisRef} transform={`translate(-10, 0)`}/>
        </g>
    );
};
export default Axes;
