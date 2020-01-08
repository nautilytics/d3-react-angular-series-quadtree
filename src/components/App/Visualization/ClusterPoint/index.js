import React from 'react';
import {makeStyles} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    cluster: {
        stroke: 'none',
        fill: 'red',
        fillOpacity: .5
    },
    label: {
        textAnchor: 'middle'
    }
}));

const ClusterPoint = ({clusterPoint}) => {
    const classes = useStyles();

    const r = clusterPoint[2][0][2].r;

    return (
        <g className={`cluster-point-marker`}
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
    )
};
export default ClusterPoint;
