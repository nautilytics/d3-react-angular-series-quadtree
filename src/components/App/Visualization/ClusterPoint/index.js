import React, {useEffect, useRef} from 'react';
import {makeStyles} from '@material-ui/core';
import "d3-transition";
import {select} from "d3-selection";
import Points from "../Points";
import {DURATION} from "../../../../constant";

const useStyles = makeStyles(theme => ({
    cluster: {
        stroke: 'none',
        fill: 'red',
        fillOpacity: 0
    },
    clusterPointMarker: {
        fillOpacity: 0
    },
    label: {
        textAnchor: 'middle'
    }
}));

const ClusterPoint = ({clusterPoint, isClustered}) => {
    const classes = useStyles();
    const clusterPointRef = useRef();

    // Retrieve the radius of the point by getting the first point
    const r = clusterPoint[2][0][2].r;

    useEffect(() => {
        if (isClustered) {
            select(clusterPointRef.current)
                .select('circle')
                .transition()
                .duration(DURATION)
                .style('fill-opacity', .5);

            select(clusterPointRef.current)
                .select('text')
                .transition()
                .duration(DURATION)
                .style('fill-opacity', 1)
        }

    }, [isClustered]);

    return <g className='group-of-clusters-and-points'>
        <g className={classes.clusterPointMarker}
           ref={clusterPointRef}
           transform={`translate(${clusterPoint[0]},${clusterPoint[1]})`}>
            <circle className={classes.cluster}
                    r={r}/>
            {
                clusterPoint[2].length > 1 &&
                <text className={classes.label} dy={r / 2}>
                    {clusterPoint[2].length}
                </text>
            }
        </g>
        <Points points={clusterPoint} isClustered={isClustered}/>
    </g>
};
export default ClusterPoint;
